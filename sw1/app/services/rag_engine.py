"""
Clinical RAG Engine — powered by Google Gemini REST API.
Uses pure HTTP (httpx) to ensure cross-platform compatibility and zero DLL dependencies.
Falls back to a deterministic local clinical synthesizer when Gemini is unavailable.
"""
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
5. Be concise, precise, and use clinical terminology appropriate for pharmaceutical researchers.
"""

GEMINI_CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
    "gemini-flash-latest",
]


class RAGEngine:
    """Clinical RAG Engine orchestrating evidence retrieval and citation-grounded synthesis."""

    def __init__(self, vector_store: Optional[VectorStoreService] = None):
        self.vector_store = vector_store or vector_store_service
        self.api_key = settings.google_api_key.strip() if settings.google_api_key else ""
        if self.api_key:
            print(f"[OK] Google Gemini configured (API Key present, preferred model: {settings.gemini_model})")
        else:
            print("[WARN] GOOGLE_API_KEY not set - using local clinical synthesizer.")

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
                answer="Based on the provided documents, there is insufficient evidence to answer this question. No relevant clinical reports, drug labels, or safety bulletins match your inquiry. Please upload relevant documents first.",
                confidence_score=0.0,
                citations=[],
                evidence_chunks_consulted=0,
                model_used="none"
            )

        # Step 2: Try Google Gemini via direct REST API
        if self.api_key:
            try:
                answer, model_used = await self._generate_gemini_answer(
                    req.question, citations, req.temperature or 0.0
                )
                confidence = self._compute_confidence(citations)
                return QueryResponse(
                    question=req.question,
                    answer=answer,
                    confidence_score=confidence,
                    citations=citations,
                    evidence_chunks_consulted=len(citations),
                    model_used=f"google/{model_used}"
                )
            except Exception as e:
                print(f"Gemini API call failed, falling back to local synthesizer: {e}")

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

    async def _generate_gemini_answer(
        self,
        question: str,
        citations: List[Citation],
        temperature: float
    ) -> Tuple[str, str]:
        """Call Google Gemini REST API to synthesize a grounded clinical answer."""
        evidence_text = "\n\n".join([
            f"--- {c.citation_tag} ---\n{c.snippet}"
            for c in citations
        ])

        prompt = f"""{SYSTEM_CLINICAL_PROMPT}

RETRIEVED CLINICAL EVIDENCE:
{evidence_text}

RESEARCH QUESTION:
{question}

Synthesize a precise, evidence-grounded answer citing exact sources using the reference tags above:"""

        # Models to try in order
        preferred = settings.gemini_model if settings.gemini_model in GEMINI_CANDIDATE_MODELS else "gemini-3.5-flash-lite"
        models_to_try = [preferred] + [m for m in GEMINI_CANDIDATE_MODELS if m != preferred]

        last_error = None
        async with httpx.AsyncClient(timeout=30.0) as client:
            for model_name in models_to_try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }],
                    "generationConfig": {
                        "temperature": temperature,
                        "maxOutputTokens": 1024,
                    }
                }
                try:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts and "text" in parts[0]:
                                return parts[0]["text"].strip(), model_name
                    elif resp.status_code == 503:
                        # High demand spike, try next model
                        print(f"Gemini model {model_name} 503 (high demand), trying next candidate...")
                        continue
                    else:
                        print(f"Gemini {model_name} returned HTTP {resp.status_code}: {resp.text[:120]}")
                        last_error = resp.text
                except Exception as ex:
                    print(f"Error querying Gemini {model_name}: {ex}")
                    last_error = str(ex)

        raise RuntimeError(f"All Gemini model candidates failed. Last error: {last_error}")

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

        answer_lines = [
            f"Based on the retrieved clinical evidence from {len(citations)} source document(s):",
            ""
        ]
        for pt in supporting_points[:4]:
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
        confidence = min(0.98, max(0.40, (top_score * 0.7 + avg_score * 0.3) * 1.5))
        return round(float(confidence), 2)


# Global RAG engine singleton
rag_engine_service = RAGEngine()
