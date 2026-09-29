from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.config import settings
from app.routes import documents_router, query_router, system_router
from app.services.vector_store import vector_store_service
from app.services.mongodb_service import mongodb_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ────────────────────────────────────────────────────────────
    print("[INFO] TrialLens starting up...")

    # Connect to MongoDB
    await mongodb_service.connect()

    # Load local vector index from disk (JSON cache)
    vector_store_service.load_index()

    print("[OK] TrialLens ready.")
    yield

    # ── Shutdown ───────────────────────────────────────────────────────────
    print("[INFO] TrialLens shutting down...")
    vector_store_service.save_index()
    await mongodb_service.disconnect()
    print("[INFO] TrialLens shutdown complete.")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
# TrialLens API 🔬

TrialLens is an AI-powered clinical research assistant for pharmaceutical companies.
It enables researchers to ask natural-language questions across **clinical trial reports**,
**drug labels**, and **safety bulletins**, receiving **evidence-grounded answers with exact source citations**
(Document name, Study ID, Section heading, and Page number).

### Core Capabilities:
- **Document Ingestion**: Upload PDF/text files or ingest raw Markdown with automatic section header detection and page extraction.
- **Evidence-Preserving Chunking**: Chunks text with sliding windows while attaching granular study metadata.
- **Dense Clinical Vector Search**: High-precision semantic retrieval with multi-faceted metadata filtering (by study, document type).
- **Grounded Clinical Synthesis**: RAG answering pipeline powered by **Google Gemini** strictly grounded on retrieved evidence with structured citations.
- **MongoDB Persistence**: Document metadata and query history stored in MongoDB Atlas for real-time data access.
- **Metadata Management**: Health checks and study aggregation tracking.
    """,
    lifespan=lifespan
)

# CORS support for web clients (React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(documents_router)
app.include_router(query_router)
app.include_router(system_router)


@app.get("/", include_in_schema=False)
async def root():
    """Redirects base path to the interactive Swagger OpenAPI documentation."""
    return RedirectResponse(url="/docs")
