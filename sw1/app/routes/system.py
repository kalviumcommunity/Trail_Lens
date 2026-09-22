from datetime import datetime
from fastapi import APIRouter
from app.config import settings
from app.models.schemas import (
    HealthResponse,
    StudiesResponse,
)
from app.services.vector_store import vector_store_service

router = APIRouter(prefix="/api", tags=["System & Metadata"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="System health check and index metrics"
)
async def health_check():
    """Returns the operational status of the TrialLens engine, storage metrics, and active LLM configuration."""
    stats = vector_store_service.get_stats()
    active_provider = "openai" if settings.openai_api_key else "triallens-clinical-synthesizer-local"
    
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
