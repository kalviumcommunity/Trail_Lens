import os
import uuid
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from pydantic import ValidationError

from app.config import settings
from app.models.schemas import (
    DocumentType,
    DocumentMetadata,
    TextIngestRequest,
    DocumentUploadResponse,
    DocumentListResponse,
    DocumentDetailResponse,
    ChunkResponse,
)
from app.services.parser import DocumentParser
from app.services.chunker import ClinicalChunker
from app.services.vector_store import vector_store_service

router = APIRouter(prefix="/api/documents", tags=["Documents"])
chunker = ClinicalChunker(
    target_chunk_size=settings.chunk_size,
    chunk_overlap=settings.chunk_overlap
)


@router.post(
    "/upload",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload and index a clinical document (PDF, TXT, MD)"
)
async def upload_document(
    file: UploadFile = File(..., description="Document file (.pdf, .txt, .md)"),
    study_id: Optional[str] = Form("STUDY-001", description="Clinical Study Identifier"),
    document_type: Optional[DocumentType] = Form(DocumentType.CLINICAL_TRIAL_REPORT, description="Type of document"),
    title: Optional[str] = Form(None, description="Document display title (defaults to filename)")
):
    """
    Accepts clinical trial reports, drug labels, or safety bulletins in PDF, TXT, or MD format.
    Extracts text, preserves section & page structure, computes embeddings, and stores in the vector index.
    """
    filename = file.filename or "untitled_doc"
    ext = os.path.splitext(filename)[1].lower()
    
    if ext not in [".pdf", ".txt", ".md"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Supported formats: .pdf, .txt, .md"
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    doc_id = f"doc_{uuid.uuid4().hex[:10]}"
    doc_title = title or filename
    saved_filename = f"{doc_id}_{filename}"
    saved_path = settings.upload_dir / saved_filename

    # Save file to disk
    with open(saved_path, "wb") as f:
        f.write(file_bytes)

    # Parse document
    try:
        if ext == ".pdf":
            parsed = DocumentParser.parse_pdf(file_bytes, filename=doc_title)
        else:
            text_str = file_bytes.decode("utf-8", errors="replace")
            parsed = DocumentParser.parse_text(text_str, filename=doc_title)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse document: {str(e)}"
        )

    # Chunk with metadata
    chunks = chunker.chunk_document(
        parsed_doc=parsed,
        document_id=doc_id,
        study_id=study_id or "STUDY-001",
        document_type=document_type.value
    )

    doc_meta = DocumentMetadata(
        document_id=doc_id,
        document_name=doc_title,
        study_id=study_id or "STUDY-001",
        document_type=document_type,
        total_pages=parsed.total_pages,
        total_chunks=len(chunks),
        file_size_bytes=len(file_bytes),
        created_at=datetime.utcnow().isoformat(),
        extra_metadata={"saved_filename": saved_filename}
    )

    # Index into vector store
    vector_store_service.add_document(doc_meta, chunks)

    return DocumentUploadResponse(
        document_id=doc_id,
        document_name=doc_title,
        study_id=study_id or "STUDY-001",
        document_type=document_type,
        total_pages=parsed.total_pages,
        total_chunks=len(chunks),
        message=f"Document successfully parsed, chunked into {len(chunks)} chunks, and indexed.",
        created_at=doc_meta.created_at
    )


@router.post(
    "/text",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest raw text/markdown directly"
)
async def ingest_raw_text(payload: TextIngestRequest):
    """Ingests raw text or markdown directly into the vector store without uploading a file."""
    if not payload.content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document content cannot be empty."
        )

    doc_id = f"doc_{uuid.uuid4().hex[:10]}"
    parsed = DocumentParser.parse_text(payload.content, filename=payload.title)

    chunks = chunker.chunk_document(
        parsed_doc=parsed,
        document_id=doc_id,
        study_id=payload.study_id or "STUDY-001",
        document_type=payload.document_type.value
    )

    doc_meta = DocumentMetadata(
        document_id=doc_id,
        document_name=payload.title,
        study_id=payload.study_id or "STUDY-001",
        document_type=payload.document_type,
        total_pages=parsed.total_pages,
        total_chunks=len(chunks),
        file_size_bytes=len(payload.content.encode("utf-8")),
        created_at=datetime.utcnow().isoformat(),
        extra_metadata=payload.extra_metadata or {}
    )

    vector_store_service.add_document(doc_meta, chunks)

    return DocumentUploadResponse(
        document_id=doc_id,
        document_name=payload.title,
        study_id=payload.study_id or "STUDY-001",
        document_type=payload.document_type,
        total_pages=parsed.total_pages,
        total_chunks=len(chunks),
        message=f"Direct text document chunked into {len(chunks)} chunks and indexed.",
        created_at=doc_meta.created_at
    )


@router.get(
    "",
    response_model=DocumentListResponse,
    summary="List all indexed pharmaceutical documents"
)
async def list_documents():
    """Returns a list of all clinical trial reports, drug labels, and bulletins currently indexed."""
    docs = vector_store_service.list_documents()
    return DocumentListResponse(
        total_documents=len(docs),
        documents=docs
    )


@router.get(
    "/{document_id}",
    response_model=DocumentDetailResponse,
    summary="Get details and sample chunks of a document"
)
async def get_document_detail(document_id: str):
    """Retrieves document metadata and its constituent evidence chunks."""
    doc_meta = vector_store_service.get_document(document_id)
    if not doc_meta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' not found."
        )

    raw_chunks = vector_store_service.get_document_chunks(document_id, limit=20)
    chunk_objs = [
        ChunkResponse(
            chunk_id=c["chunk_id"],
            document_id=c["metadata"]["document_id"],
            document_name=c["metadata"]["document_name"],
            study_id=c["metadata"]["study_id"],
            document_type=c["metadata"]["document_type"],
            section=c["metadata"]["section"],
            page_number=c["metadata"]["page_number"],
            chunk_index=c["metadata"]["chunk_index"],
            text=c["text"]
        )
        for c in raw_chunks
    ]

    return DocumentDetailResponse(
        metadata=doc_meta,
        sample_chunks=chunk_objs
    )


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a document and its embeddings"
)
async def delete_document(document_id: str):
    """Deletes a document, removing all associated embeddings from the vector store."""
    success = vector_store_service.delete_document(document_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' not found."
        )
    return {"message": f"Document '{document_id}' and all associated vector embeddings have been deleted."}
