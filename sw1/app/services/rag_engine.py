import json
import re
from typing import List, Optional, Tuple
import httpx

from app.config import settings
from app.models.schemas import (
    Citation,
    QueryRequest,
    QueryResponse,
    SearchFilter,
)
from app.services.vector_store import VectorStoreService, vector_store_service


SYSTEM_CLINICAL_PROMPT = """You are TrialLens, an AI-powered clinical research assistant for pharmaceutical documents (clinical trial reports, drug labels, and safety bulletins).

Instructions:
1. Answer the user's question based ONLY and EXCLUSIVELY on the retrieved evidence snippets below.
2. Every clinical assertion, number, dosage, efficacy outcome, or adverse event MUST cite its exact source using the citation tag [Ref X: Document, Study, Section, Page].
3. If the retrieved evidence does not contain sufficient clinical information to answer the question, state:
   "Based on the provided documents, there is insufficient evidence to answer this question."
4. Do NOT hallucinate, extrapolate, or bring in unverified external clinical assumptions.
"""


class RAGEngine:
    """Clinical RAG Engine orchestrating evidence retrieval and citation-grounded synthesis."""

    def __init__(self, vector_store: Optional[VectorStoreService] = None):
        self.vector_store = vector_store or vector_store_service

    async def answer_question(self, req: QueryRequest) -> QueryResponse:
        # Step 1: Retrieve top evidence chunks
        top_k = req.top_k or settings.default_top_k
        citations = self.vector_store.search(
            query=req.question,
            top_k=top_k,
            filters=req.filters
        )

        if not citations or citations[0].relevance_score < settings.similarity_threshold:
            return QueryResponse(
                question=req.question,
                answer="Based on the provided documents, there is insufficient evidence to answer this question. No relevant clinical reports, drug labels, or safety bulletins match your inquiry.",
                confidence_score=0.0,
                citations=[],
                evidence_chunks_consulted=0,
                model_used="none"
            )

        # Step 2: Try OpenAI if key is present
        if settings.openai_api_key:
            try:
                answer = await self._generate_openai_answer(req.question, citations, req.temperature or 0.0)
                confidence = self._compute_confidence(citations)
                return QueryResponse(
                    question=req.question,
                    answer=answer,
                    confidence_score=confidence,
                    citations=citations,
                    evidence_chunks_consulted=len(citations),
                    model_used=f"openai/{settings.openai_model}"
                )
            except Exception as e:
                print(f"OpenAI API call failed, falling back to local synthesizer: {e}")

        # Step 3: Local clinical evidence synthesizer (deterministic & grounded)
        answer, confidence = self._synthesize_local_evidence(req.question, citations)
        return QueryResponse(
            question=req.question,
            answer=answer,
            confidence_score=confidence,
            citations=citations,
            evidence_chunks_consulted=len(citations),
            model_used="triallens-clinical-synthesizer-v1"
        )

    async def _generate_openai_answer(
        self,
        question: str,
        citations: List[Citation],
        temperature: float
    ) -> str:
        evidence_text = "\n\n".join([
            f"--- {c.citation_tag} ---\n{c.snippet}"
            for c in citations
        ])
        
        prompt = f"""EVIDENCE:
{evidence_text}

RESEARCH QUESTION:
{question}

Synthesize a precise, evidence-grounded answer citing exact sources using the reference tags above:"""

        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.openai_api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": settings.openai_model,
            "messages": [
                {"role": "system", "content": SYSTEM_CLINICAL_PROMPT},
                {"role": "user", "content": prompt}
            ],
            "temperature": temperature,
            "max_tokens": 800
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"].strip()

    def _synthesize_local_evidence(
        self,
        question: str,
        citations: List[Citation]
    ) -> Tuple[str, float]:
        """
        Deterministic, rule-grounded clinical evidence synthesizer.
        Extracts key clinical statements matching the question terms,
        attaches exact source citations, and assesses evidentiary strength.
        """
        q_words = set(re.sub(r"[^\w\s]", "", question.lower()).split())
        stops = {
            "what", "is", "the", "of", "and", "in", "to", "for", "with", "a", "an",
            "does", "how", "are", "were", "was", "under", "which", "can", "or", "by",
            "on", "as", "at", "from", "any", "all", "do", "it", "its", "their", "that", "this"
        }
        q_keywords = {w for w in q_words if w not in stops and len(w) > 2}
        structural_words = {"primary", "secondary", "study", "trial", "clinical", "report", "patient", "patients", "bulletin"}
        content_keywords = {w for w in q_keywords if w not in structural_words}
        eval_keywords = content_keywords if content_keywords else q_keywords

        supporting_points = []
        cited_refs = set()

        for c in citations:
            sentences = re.split(r"(?<=[.!?])\s+", c.snippet)
            matched_sentences = []
            
            for s in sentences:
                s_lower = s.lower()
                overlap = sum(1 for kw in eval_keywords if kw in s_lower)
                if overlap > 0:
                    matched_sentences.append((overlap, s.strip()))
            
            # Sort sentences by keyword relevance
            matched_sentences.sort(key=lambda x: x[0], reverse=True)
            
            if matched_sentences and matched_sentences[0][0] >= 1:
                top_sent = matched_sentences[0][1]
                supporting_points.append(f"{top_sent} {c.citation_tag}")
                cited_refs.add(c.citation_tag)

        if not supporting_points:
            return (
                "Based on the provided documents, there is insufficient evidence to answer this question. The indexed trial reports and bulletins do not contain data on this topic.",
                0.0
            )

        # Construct synthesized response
        answer_lines = [
            f"Based on the retrieved clinical evidence from {len(citations)} source document(s):",
            ""
        ]
        for idx, pt in enumerate(supporting_points[:4], 1):
            answer_lines.append(f"• {pt}")

        answer_lines.append("")
        answer_lines.append(f"Summary: Evidence derived directly from study records across {len(cited_refs)} verified citation(s).")
        
        answer = "\n".join(answer_lines)
        confidence = self._compute_confidence(citations)
        return answer, confidence

    def _compute_confidence(self, citations: List[Citation]) -> float:
        if not citations:
            return 0.0
        top_score = citations[0].relevance_score
        avg_score = sum(c.relevance_score for c in citations) / len(citations)
        # Scaled confidence between 0.4 and 0.98 based on relevance
        confidence = min(0.98, max(0.40, (top_score * 0.7 + avg_score * 0.3) * 1.5))
        return round(float(confidence), 2)


# Global RAG engine singleton
rag_engine_service = RAGEngine()
