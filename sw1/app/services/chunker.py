import re
from typing import List
from app.models.schemas import ChunkMetadata
from app.services.parser import ParsedDocument


class TextChunk:
    def __init__(
        self,
        chunk_id: str,
        text: str,
        metadata: ChunkMetadata
    ):
        self.chunk_id = chunk_id
        self.text = text
        self.metadata = metadata

    def to_dict(self):
        return {
            "chunk_id": self.chunk_id,
            "text": self.text,
            "metadata": self.metadata.model_dump()
        }


class ClinicalChunker:
    """Chunks clinical documents while strictly maintaining section and page metadata."""

    def __init__(self, target_chunk_size: int = 650, chunk_overlap: int = 100):
        self.target_chunk_size = target_chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_document(
        self,
        parsed_doc: ParsedDocument,
        document_id: str,
        study_id: str,
        document_type: str
    ) -> List[TextChunk]:
        chunks: List[TextChunk] = []
        chunk_index = 0

        for sec in parsed_doc.sections:
            content = sec.content.strip()
            if not content:
                continue

            # If content fits in target size, keep it whole
            if len(content) <= self.target_chunk_size:
                chunk_id = f"{document_id}_c{chunk_index}"
                meta = ChunkMetadata(
                    chunk_id=chunk_id,
                    document_id=document_id,
                    document_name=parsed_doc.title,
                    study_id=study_id or "UNKNOWN",
                    document_type=document_type,
                    section=sec.section_name,
                    page_number=sec.page_number,
                    chunk_index=chunk_index
                )
                chunks.append(TextChunk(chunk_id=chunk_id, text=content, metadata=meta))
                chunk_index += 1
            else:
                # Split large section into overlapping windows respecting sentences
                sub_texts = self._split_with_overlap(content)
                for sub in sub_texts:
                    if not sub.strip():
                        continue
                    chunk_id = f"{document_id}_c{chunk_index}"
                    meta = ChunkMetadata(
                        chunk_id=chunk_id,
                        document_id=document_id,
                        document_name=parsed_doc.title,
                        study_id=study_id or "UNKNOWN",
                        document_type=document_type,
                        section=sec.section_name,
                        page_number=sec.page_number,
                        chunk_index=chunk_index
                    )
                    chunks.append(TextChunk(chunk_id=chunk_id, text=sub.strip(), metadata=meta))
                    chunk_index += 1

        return chunks

    def _split_with_overlap(self, text: str) -> List[str]:
        # Split by sentences or paragraphs
        sentences = re.split(r"(?<=[.!?\n])\s+", text)
        result = []
        current_chunk = []
        current_len = 0

        for s in sentences:
            s_len = len(s)
            if current_len + s_len > self.target_chunk_size and current_chunk:
                result.append(" ".join(current_chunk))
                # Retain overlap from end of current chunk
                overlap_tokens = []
                overlap_len = 0
                for item in reversed(current_chunk):
                    if overlap_len + len(item) <= self.chunk_overlap:
                        overlap_tokens.insert(0, item)
                        overlap_len += len(item)
                    else:
                        break
                current_chunk = list(overlap_tokens)
                current_len = overlap_len
            
            current_chunk.append(s)
            current_len += s_len

        if current_chunk:
            result.append(" ".join(current_chunk))

        return result
