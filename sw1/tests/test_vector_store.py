import pytest
from app.models.schemas import DocumentMetadata, DocumentType, SearchFilter
from app.services.chunker import TextChunk, ChunkMetadata
from app.services.vector_store import VectorStoreService


def test_vector_store_indexing_and_search(tmp_path):
    temp_index = tmp_path / "test_index.json"
    vs = VectorStoreService(index_path=temp_index)
    
    doc_id = "doc_onco_001"
    doc_meta = DocumentMetadata(
        document_id=doc_id,
        document_name="OncoTrial Phase 3 Report",
        study_id="ONCO-301",
        document_type=DocumentType.CLINICAL_TRIAL_REPORT,
        total_pages=2,
        total_chunks=2,
        file_size_bytes=500,
        created_at="2026-09-22T00:00:00"
    )
    
    chunks = [
        TextChunk(
            chunk_id=f"{doc_id}_c0",
            text="Primary Endpoint: Median progression-free survival was 16.4 months in the treatment arm versus 9.2 months in placebo.",
            metadata=ChunkMetadata(
                chunk_id=f"{doc_id}_c0",
                document_id=doc_id,
                document_name="OncoTrial Phase 3 Report",
                study_id="ONCO-301",
                document_type="clinical_trial_report",
                section="PRIMARY ENDPOINTS & RESULTS",
                page_number=1,
                chunk_index=0
            )
        ),
        TextChunk(
            chunk_id=f"{doc_id}_c1",
            text="Safety Profile: Grade 3 or 4 adverse events occurred in 18% of patients, primarily neutropenia and fatigue.",
            metadata=ChunkMetadata(
                chunk_id=f"{doc_id}_c1",
                document_id=doc_id,
                document_name="OncoTrial Phase 3 Report",
                study_id="ONCO-301",
                document_type="clinical_trial_report",
                section="SAFETY AND ADVERSE EVENTS",
                page_number=2,
                chunk_index=1
            )
        )
    ]
    
    # Test adding document
    count = vs.add_document(doc_meta, chunks)
    assert count == 2
    assert len(vs.list_documents()) == 1
    
    # Test semantic search for efficacy
    results = vs.search(query="What was the progression-free survival?", top_k=2)
    assert len(results) > 0
    top_result = results[0]
    assert "progression-free survival" in top_result.snippet.lower()
    assert top_result.study_id == "ONCO-301"
    assert top_result.page_number == 1
    assert "PRIMARY ENDPOINTS" in top_result.section
    
    # Test search with metadata filter
    filtered = vs.search(
        query="adverse events",
        filters=SearchFilter(study_id="NON_EXISTENT")
    )
    assert len(filtered) == 0
    
    matching_filter = vs.search(
        query="adverse events",
        filters=SearchFilter(study_id="ONCO-301")
    )
    assert len(matching_filter) > 0
    assert "adverse events" in matching_filter[0].snippet.lower()
    
    # Test document deletion
    deleted = vs.delete_document(doc_id)
    assert deleted is True
    assert len(vs.list_documents()) == 0
    assert len(vs.search("survival")) == 0
