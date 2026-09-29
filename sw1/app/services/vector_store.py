import json
import math
import os
import re
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import numpy as np

import hashlib
from app.config import settings
from app.models.schemas import (
    DocumentMetadata,
    ChunkMetadata,
    Citation,
    SearchFilter,
    StudySummary
)
from app.services.chunker import TextChunk


def _deterministic_hash(token: str, modulo: int) -> int:
    """Computes consistent hash for tokens across runs."""
    digest = hashlib.md5(token.encode("utf-8")).hexdigest()
    return int(digest, 16) % modulo


class DenseClinicalEmbedder:
    """
    Self-contained clinical text embedder with deterministic subword hashing,
    clinical entity weighting, and normalized dense vectors.
    """
    def __init__(self, dim: int = 512):
        self.dim = dim
        self.clinical_keywords = {
            "efficacy": 2.5, "safety": 2.5, "adverse": 2.5, "events": 2.0,
            "dosage": 2.5, "administration": 2.0, "contraindications": 3.0,
            "warnings": 2.5, "precautions": 2.0, "survival": 2.8, "mortality": 2.8,
            "endpoints": 2.5, "primary": 2.2, "secondary": 2.0, "phase": 2.0,
            "placebo": 2.2, "hazard": 2.5, "ratio": 2.0, "remission": 2.5,
            "toxicity": 2.8, "tolerance": 2.0, "pediatric": 2.2, "geriatric": 2.2,
            "renal": 2.2, "hepatic": 2.2, "cardiovascular": 2.8, "death": 2.8,
            "hypotension": 2.5, "hypertension": 2.5, "hyperkalemia": 2.5
        }

    def _tokenize(self, text: str) -> List[str]:
        cleaned = re.sub(r"[^\w\s\-\.]", " ", text.lower())
        tokens = [t.strip(".-") for t in cleaned.split() if len(t.strip(".-")) > 1]
        return tokens

    def embed_text(self, text: str) -> np.ndarray:
        vec = np.zeros(self.dim, dtype=np.float32)
        tokens = self._tokenize(text)
        if not tokens:
            return vec

        for idx, token in enumerate(tokens):
            weight = self.clinical_keywords.get(token, 1.0)
            
            # Deterministic word hash
            h1 = _deterministic_hash(token, self.dim)
            vec[h1] += (2.0 * weight)
            
            # Subwords
            if len(token) >= 3:
                for j in range(len(token) - 2):
                    trigram = token[j:j+3]
                    h_tri = _deterministic_hash(trigram, self.dim)
                    vec[h_tri] += (0.8 * weight)
                    
            # Bigram hashing for sequential context
            if idx > 0:
                bigram = f"{tokens[idx-1]}_{token}"
                h_bi = _deterministic_hash(bigram, self.dim)
                vec[h_bi] += (1.5 * weight)

        norm = np.linalg.norm(vec)
        if norm > 1e-6:
            vec = vec / norm
        return vec

    def embed_batch(self, texts: List[str]) -> List[np.ndarray]:
        return [self.embed_text(t) for t in texts]


class VectorStoreService:
    """
    Vector Store managing clinical document chunks, embeddings,
    hybrid retrieval, metadata filtering, and persistent storage.
    """
    def __init__(self, index_path: Optional[Path] = None):
        self.index_path = index_path or settings.index_file
        self.embedder = DenseClinicalEmbedder(dim=512)
        
        # In-memory storage
        self.documents: Dict[str, DocumentMetadata] = {}
        self.chunks: Dict[str, Dict[str, Any]] = {}  # chunk_id -> chunk dict
        self.embeddings: Dict[str, np.ndarray] = {}  # chunk_id -> vector
        
        self.load_index()

    def load_index(self):
        """Loads index from disk if available."""
        if self.index_path and os.path.exists(self.index_path):
            try:
                with open(self.index_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    
                self.documents = {
                    doc_id: DocumentMetadata(**meta)
                    for doc_id, meta in data.get("documents", {}).items()
                }
                
                raw_chunks = data.get("chunks", {})
                self.chunks = raw_chunks
                
                raw_embeds = data.get("embeddings", {})
                self.embeddings = {
                    cid: np.array(vec, dtype=np.float32)
                    for cid, vec in raw_embeds.items()
                }
            except Exception as e:
                print(f"Warning: Failed to load index from {self.index_path}: {e}")
                self.documents = {}
                self.chunks = {}
                self.embeddings = {}

    def save_index(self):
        """Persists index to disk."""
        if not self.index_path:
            return
        
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        data = {
            "documents": {
                doc_id: meta.model_dump()
                for doc_id, meta in self.documents.items()
            },
            "chunks": self.chunks,
            "embeddings": {
                cid: vec.tolist()
                for cid, vec in self.embeddings.items()
            }
        }
        with open(self.index_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def add_document(
        self,
        doc_meta: DocumentMetadata,
        chunks: List[TextChunk]
    ) -> int:
        """Indexes a document and its chunks."""
        self.documents[doc_meta.document_id] = doc_meta
        
        texts_to_embed = [c.text for c in chunks]
        vectors = self.embedder.embed_batch(texts_to_embed)

        for chunk, vec in zip(chunks, vectors):
            self.chunks[chunk.chunk_id] = {
                "chunk_id": chunk.chunk_id,
                "text": chunk.text,
                "metadata": chunk.metadata.model_dump()
            }
            self.embeddings[chunk.chunk_id] = vec

        self.save_index()
        return len(chunks)

    def delete_document(self, document_id: str) -> bool:
        """Deletes a document and its corresponding chunk embeddings."""
        if document_id not in self.documents:
            return False
            
        del self.documents[document_id]
        
        # Remove chunks belonging to this document
        chunks_to_remove = [
            cid for cid, c in self.chunks.items()
            if c["metadata"].get("document_id") == document_id
        ]
        for cid in chunks_to_remove:
            self.chunks.pop(cid, None)
            self.embeddings.pop(cid, None)
            
        self.save_index()
        return True

    def get_document(self, document_id: str) -> Optional[DocumentMetadata]:
        return self.documents.get(document_id)

    def list_documents(self) -> List[DocumentMetadata]:
        return list(self.documents.values())

    def get_document_chunks(self, document_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        results = [
            c for c in self.chunks.values()
            if c["metadata"].get("document_id") == document_id
        ]
        return results[:limit]

    def search(
        self,
        query: str,
        top_k: int = 4,
        filters: Optional[SearchFilter] = None
    ) -> List[Citation]:
        """Performs cosine similarity search with clinical metadata filtering."""
        if not self.embeddings:
            return []

        query_vec = self.embedder.embed_text(query)
        q_norm = np.linalg.norm(query_vec)
        if q_norm < 1e-6:
            return []

        query_tokens = [t.lower() for t in re.findall(r"\w+", query) if len(t) > 2]
        candidates = []
        for cid, vec in self.embeddings.items():
            chunk_data = self.chunks[cid]
            meta = chunk_data["metadata"]

            # Apply metadata filters
            if filters:
                if filters.study_id and meta.get("study_id") != filters.study_id:
                    continue
                if filters.document_type and meta.get("document_type") != filters.document_type:
                    continue
                if filters.document_ids and meta.get("document_id") not in filters.document_ids:
                    continue

            # Dense cosine similarity
            dense_score = float(np.dot(query_vec, vec))
            
            # Exact keyword / term overlap matching
            chunk_text = (chunk_data["text"] + " " + meta.get("section", "")).lower()
            keyword_matches = sum(1 for t in query_tokens if t in chunk_text)
            keyword_score = keyword_matches / max(1, len(query_tokens))
            
            # Hybrid combined score
            final_score = (0.45 * dense_score) + (0.55 * keyword_score)
            candidates.append((final_score, chunk_data))

        # Sort descending by similarity score
        candidates.sort(key=lambda x: x[0], reverse=True)
        top_matches = candidates[:top_k]

        citations: List[Citation] = []
        for rank, (score, chunk_data) in enumerate(top_matches, start=1):
            meta = chunk_data["metadata"]
            doc_name = meta.get("document_name", "Unknown Document")
            study = meta.get("study_id", "N/A")
            sec = meta.get("section", "General")
            page = meta.get("page_number", 1)
            
            tag = f"[Ref {rank}: {doc_name}, Study: {study}, Section: '{sec}', Page: {page}]"
            
            citations.append(Citation(
                document_id=meta.get("document_id", ""),
                document_name=doc_name,
                study_id=study,
                document_type=meta.get("document_type", "other"),
                section=sec,
                page_number=page,
                relevance_score=round(max(0.0, score), 4),
                snippet=chunk_data["text"],
                citation_tag=tag
            ))

        return citations

    def get_studies_summary(self) -> List[StudySummary]:
        """Aggregates all indexed studies."""
        studies_map: Dict[str, Dict[str, Any]] = {}
        
        for doc in self.documents.values():
            sid = doc.study_id or "UNKNOWN"
            if sid not in studies_map:
                studies_map[sid] = {
                    "document_count": 0,
                    "document_types": set(),
                    "documents": []
                }
            studies_map[sid]["document_count"] += 1
            studies_map[sid]["document_types"].add(doc.document_type.value)
            studies_map[sid]["documents"].append(doc.document_name)

        return [
            StudySummary(
                study_id=sid,
                document_count=data["document_count"],
                document_types=sorted(list(data["document_types"])),
                documents=data["documents"]
            )
            for sid, data in studies_map.items()
        ]

    def get_stats(self) -> Dict[str, Any]:
        return {
            "total_documents": len(self.documents),
            "total_chunks": len(self.chunks),
            "total_embeddings": len(self.embeddings),
            "storage_path": str(self.index_path)
        }


# Global vector store singleton
vector_store_service = VectorStoreService()
