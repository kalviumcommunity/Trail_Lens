from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class DocumentType(str, Enum):
    CLINICAL_TRIAL_REPORT = "clinical_trial_report"
    DRUG_LABEL = "drug_label"
    SAFETY_BULLETIN = "safety_bulletin"
    STUDY_PROTOCOL = "study_protocol"
    OTHER = "other"


class DocumentMetadata(BaseModel):
    document_id: str
    document_name: str
    study_id: Optional[str] = "UNKNOWN"
    document_type: DocumentType = DocumentType.OTHER
    total_pages: int = 1
    total_chunks: int = 0
    file_size_bytes: int = 0
    created_at: str
    extra_metadata: Dict[str, Any] = Field(default_factory=dict)


class TextIngestRequest(BaseModel):
    title: str = Field(..., description="Name or title of the document")
    content: str = Field(..., description="Full text or markdown content of the document")
    study_id: Optional[str] = Field("STUDY-001", description="Clinical study identifier (e.g. NCT04280705, ONCO-301)")
    document_type: DocumentType = Field(DocumentType.CLINICAL_TRIAL_REPORT, description="Type of clinical document")
    extra_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Arbitrary additional key-value metadata")


class DocumentUploadResponse(BaseModel):
    document_id: str
    document_name: str
    study_id: str
    document_type: DocumentType
    total_pages: int
    total_chunks: int
    message: str
    created_at: str


class ChunkMetadata(BaseModel):
    chunk_id: str
    document_id: str
    document_name: str
    study_id: str
    document_type: str
    section: str
    page_number: int
    chunk_index: int


class ChunkResponse(BaseModel):
    chunk_id: str
    document_id: str
    document_name: str
    study_id: str
    document_type: str
    section: str
    page_number: int
    chunk_index: int
    text: str


class DocumentDetailResponse(BaseModel):
    metadata: DocumentMetadata
    sample_chunks: List[ChunkResponse] = Field(default_factory=list)


class DocumentListResponse(BaseModel):
    total_documents: int
    documents: List[DocumentMetadata]


class SearchFilter(BaseModel):
    study_id: Optional[str] = Field(None, description="Filter by study identifier")
    document_type: Optional[str] = Field(None, description="Filter by document type")
    document_ids: Optional[List[str]] = Field(None, description="Filter by specific document IDs")


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Researcher search question or keyword query")
    filters: Optional[SearchFilter] = Field(default=None, description="Optional metadata filters")
    top_k: Optional[int] = Field(4, ge=1, le=20, description="Number of evidence chunks to retrieve")


class Citation(BaseModel):
    document_id: str
    document_name: str
    study_id: str
    document_type: str
    section: str
    page_number: int
    relevance_score: float
    snippet: str
    citation_tag: str = Field(..., description="e.g. [Ref 1: Keytruda Label, Study: ONCO-301, Section: 4.1, Page: 3]")


class SearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[Citation]


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=3, description="Natural-language clinical research question")
    filters: Optional[SearchFilter] = Field(default=None, description="Optional metadata filters")
    top_k: Optional[int] = Field(4, ge=1, le=15, description="Number of supporting evidence chunks to consult")
    temperature: Optional[float] = Field(0.0, ge=0.0, le=1.0, description="Generation temperature (0.0 for strict factual answers)")


class QueryResponse(BaseModel):
    question: str
    answer: str = Field(..., description="Synthesized clinical answer strictly grounded in retrieved evidence")
    confidence_score: float = Field(..., description="Estimated groundedness score between 0.0 and 1.0")
    citations: List[Citation] = Field(default_factory=list, description="Exact sources, study IDs, sections, and pages cited")
    evidence_chunks_consulted: int
    model_used: str


class StudySummary(BaseModel):
    study_id: str
    document_count: int
    document_types: List[str]
    documents: List[str]


class StudiesResponse(BaseModel):
    total_studies: int
    studies: List[StudySummary]


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    timestamp: str
    total_indexed_documents: int
    total_indexed_chunks: int
    active_llm_provider: str
    storage_path: str
