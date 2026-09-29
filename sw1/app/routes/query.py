from fastapi import APIRouter, HTTPException, status
from app.models.schemas import (
    SearchRequest,
    SearchResponse,
    QueryRequest,
    QueryResponse,
)
from app.services.vector_store import vector_store_service
from app.services.rag_engine import rag_engine_service
from app.services.mongodb_service import mongodb_service

router = APIRouter(prefix="/api", tags=["Retrieval & RAG"])


@router.post(
    "/search",
    response_model=SearchResponse,
    summary="Semantic search over clinical documents without synthesis"
)
async def semantic_search(req: SearchRequest):
    """
    Retrieves the most relevant evidence chunks across clinical trial reports,
    drug labels, and safety bulletins matching the query.
    Allows filtering by study_id and document_type.
    """
    citations = vector_store_service.search(
        query=req.query,
        top_k=req.top_k or 4,
        filters=req.filters
    )
    return SearchResponse(
        query=req.query,
        total_results=len(citations),
        results=citations
    )


@router.post(
    "/query",
    response_model=QueryResponse,
    summary="Natural language clinical question answering with exact evidence citations (RAG + Google Gemini)"
)
async def query_triallens(req: QueryRequest):
    """
    RAG endpoint powered by Google Gemini:
    1. Retrieves evidence chunks matching the researcher's natural-language inquiry.
    2. Sends the evidence to Google Gemini (gemini-1.5-flash) for grounded synthesis.
    3. Generates an answer strictly grounded in the retrieved content with exact source references.
    4. Saves the query + answer to MongoDB query history.
    5. If the retrieved documents lack sufficient evidence, admits insufficient evidence.
    """
    try:
        response = await rag_engine_service.answer_question(req)

        # ✅ Persist query + answer to MongoDB history
        await mongodb_service.save_query({
            "question": response.question,
            "answer": response.answer,
            "confidence_score": response.confidence_score,
            "model_used": response.model_used,
            "evidence_chunks_consulted": response.evidence_chunks_consulted,
            "citation_count": len(response.citations),
        })

        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Query execution failed: {str(e)}"
        )


@router.get(
    "/history",
    summary="Get recent query history from MongoDB"
)
async def get_query_history(limit: int = 20):
    """Returns the most recent questions asked, with answers, from MongoDB."""
    history = await mongodb_service.get_query_history(limit=limit)
    return {"total": len(history), "history": history}
