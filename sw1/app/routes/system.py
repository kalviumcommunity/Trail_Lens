from datetime import datetime
from fastapi import APIRouter
from app.config import settings
from app.models.schemas import (
    HealthResponse,
    StudiesResponse,
)
from app.services.vector_store import vector_store_service
from app.services.mongodb_service import mongodb_service

router = APIRouter(prefix="/api", tags=["System & Metadata"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="System health check and index metrics"
)
async def health_check():
    """Returns the operational status of TrialLens, MongoDB connection, Gemini config, and index metrics."""
    stats = vector_store_service.get_stats()

    # Determine active LLM provider
    if settings.google_api_key:
        active_provider = f"google/{settings.gemini_model}"
    elif settings.openai_api_key:
        active_provider = f"openai/{settings.openai_model}"
    else:
        active_provider = "triallens-clinical-synthesizer-local"

    return HealthResponse(
        status="healthy",
        app_name=settings.app_name,
        version=settings.app_version,
        timestamp=datetime.utcnow().isoformat(),
        total_indexed_documents=stats["total_documents"],
        total_indexed_chunks=stats["total_chunks"],
        active_llm_provider=active_provider,
        storage_path=stats["storage_path"]
    )


@router.get(
    "/status",
    summary="Extended status: MongoDB + Gemini connectivity"
)
async def extended_status():
    """Returns detailed connectivity status for MongoDB and Gemini AI."""
    stats = vector_store_service.get_stats()
    mongo_count = await mongodb_service.get_document_count()

    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "llm": {
            "provider": "Google Gemini" if settings.google_api_key else "Local Synthesizer",
            "model": settings.gemini_model if settings.google_api_key else "N/A",
            "configured": bool(settings.google_api_key),
        },
        "mongodb": {
            "connected": mongodb_service.is_connected,
            "database": settings.mongodb_db_name,
            "document_count": mongo_count,
        },
        "vector_store": {
            "total_documents": stats["total_documents"],
            "total_chunks": stats["total_chunks"],
            "total_embeddings": stats["total_embeddings"],
            "storage_path": stats["storage_path"],
        }
    }


@router.get(
    "/studies",
    response_model=StudiesResponse,
    summary="List all indexed clinical studies"
)
async def list_studies():
    """Aggregates all unique clinical studies represented in the database along with associated documents."""
    studies = vector_store_service.get_studies_summary()
    return StudiesResponse(
        total_studies=len(studies),
        studies=studies
    )


@router.get(
    "/stats",
    summary="Detailed index statistics"
)
async def get_stats():
    """Returns storage and chunk statistics."""
    return vector_store_service.get_stats()
