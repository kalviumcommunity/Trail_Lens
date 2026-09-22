import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.vector_store import vector_store_service


@pytest.fixture(autouse=True)
def clean_vector_store():
    # Clear documents before test
    docs = list(vector_store_service.list_documents())
    for d in docs:
        vector_store_service.delete_document(d.document_id)
    yield
    # Clean up after
    docs = list(vector_store_service.list_documents())
    for d in docs:
        vector_store_service.delete_document(d.document_id)


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "TrialLens" in data["app_name"]
    assert "total_indexed_documents" in data


def test_ingest_text_and_get_detail():
    payload = {
        "title": "ZeniTrial Phase 3 Safety Bulletin",
        "content": """
--- Page 1 ---
SAFETY BULLETIN: HEPATOTOXICITY MONITORING
Elevated liver transaminases (ALT/AST > 3x ULN) were observed in 4.2% of patients treated with Zenilimod 100 mg.

--- Page 2 ---
RECOMMENDED DOSAGE MODIFICATIONS
In patients with ALT/AST elevations exceeding 5x ULN, withhold Zenilimod until levels return to baseline. Permanently discontinue if severe jaundice or total bilirubin exceeds 2x ULN.
""",
        "study_id": "ZENI-303",
        "document_type": "safety_bulletin",
        "extra_metadata": {"sponsor": "Apex Pharma"}
    }
    
    # 1. Ingest
    res = client.post("/api/documents/text", json=payload)
    assert res.status_code == 201
    ingest_data = res.json()
    assert ingest_data["document_name"] == "ZeniTrial Phase 3 Safety Bulletin"
    assert ingest_data["study_id"] == "ZENI-303"
    assert ingest_data["total_chunks"] >= 2
    doc_id = ingest_data["document_id"]
    
    # 2. List documents
    list_res = client.get("/api/documents")
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert list_data["total_documents"] == 1
    assert list_data["documents"][0]["document_id"] == doc_id
    
    # 3. Get document detail
    detail_res = client.get(f"/api/documents/{doc_id}")
    assert detail_res.status_code == 200
    detail_data = detail_res.json()
    assert detail_data["metadata"]["document_id"] == doc_id
    assert len(detail_data["sample_chunks"]) >= 2
    assert detail_data["sample_chunks"][0]["study_id"] == "ZENI-303"


def test_file_upload_endpoint():
    file_content = b"""
1. INDICATIONS AND USAGE
Lumirex is indicated for the treatment of adult patients with refractory multiple myeloma.

2. DOSAGE AND ADMINISTRATION
The recommended dose is 400 mg administered as an intravenous infusion once weekly for 4 weeks.
"""
    files = {
        "file": ("Lumirex_Prescribing_Info.txt", io.BytesIO(file_content), "text/plain")
    }
    data = {
        "study_id": "LUMI-MM-201",
        "document_type": "drug_label",
        "title": "Lumirex FDA Prescribing Information"
    }
    
    response = client.post("/api/documents/upload", files=files, data=data)
    assert response.status_code == 201
    resp_data = response.json()
    assert resp_data["study_id"] == "LUMI-MM-201"
    assert resp_data["document_type"] == "drug_label"
    assert resp_data["total_chunks"] >= 1


def test_semantic_search_and_query_endpoints():
    # Ingest a clinical trial report
    payload = {
        "title": "CardioFix Heart Failure Study",
        "content": """
PRIMARY ENDPOINTS
In the CardioFix Phase 3 study (NCT04280705), the primary endpoint of cardiovascular death was reduced by 24% (HR 0.76, 95% CI 0.65-0.89, p=0.001) compared with standard of care.

ADVERSE REACTIONS
The most frequent adverse reaction was symptomatic hypotension occurring in 9.5% of subjects in the CardioFix group versus 5.2% in the control group.
""",
        "study_id": "NCT04280705",
        "document_type": "clinical_trial_report"
    }
    client.post("/api/documents/text", json=payload)

    # 1. Semantic Search
    search_req = {
        "query": "What was the reduction in cardiovascular death?",
        "top_k": 3
    }
    search_res = client.post("/api/search", json=search_req)
    assert search_res.status_code == 200
    search_data = search_res.json()
    assert search_data["total_results"] > 0
    top_citation = search_data["results"][0]
    assert "cardiovascular death" in top_citation["snippet"].lower()
    assert top_citation["study_id"] == "NCT04280705"
    assert "[Ref 1:" in top_citation["citation_tag"]

    # 2. Query / RAG endpoint
    query_req = {
        "question": "What was the primary endpoint result for cardiovascular death?",
        "top_k": 2
    }
    query_res = client.post("/api/query", json=query_req)
    assert query_res.status_code == 200
    query_data = query_res.json()
    assert "answer" in query_data
    assert len(query_data["citations"]) > 0
    assert query_data["confidence_score"] > 0.0
    # Check that citations are present
    assert any("NCT04280705" in c["study_id"] for c in query_data["citations"])


def test_studies_aggregation_and_deletion():
    # Ingest two studies
    client.post("/api/documents/text", json={
        "title": "Study A Doc",
        "content": "Protocol description for trial A",
        "study_id": "STUDY-A",
        "document_type": "clinical_trial_report"
    })
    client.post("/api/documents/text", json={
        "title": "Study B Doc",
        "content": "Safety report for trial B",
        "study_id": "STUDY-B",
        "document_type": "safety_bulletin"
    })

    # Verify studies list
    studies_res = client.get("/api/studies")
    assert studies_res.status_code == 200
    studies_data = studies_res.json()
    assert studies_data["total_studies"] == 2
    study_ids = [s["study_id"] for s in studies_data["studies"]]
    assert "STUDY-A" in study_ids
    assert "STUDY-B" in study_ids

    # Delete doc
    docs = client.get("/api/documents").json()["documents"]
    doc_to_delete = docs[0]["document_id"]
    
    del_res = client.delete(f"/api/documents/{doc_to_delete}")
    assert del_res.status_code == 200
    
    # Confirm deletion
    docs_after = client.get("/api/documents").json()["documents"]
    assert len(docs_after) == 1


def test_pdf_upload_and_chunking():
    # Generate a real test PDF using pypdf
    from pypdf import PdfWriter
    writer = PdfWriter()
    writer.add_blank_page(width=200, height=200)
    pdf_buffer = io.BytesIO()
    writer.write(pdf_buffer)
    pdf_buffer.seek(0)
    
    files = {
        "file": ("TrialProtocol.pdf", pdf_buffer, "application/pdf")
    }
    data = {
        "study_id": "PROTOCOL-909",
        "document_type": "study_protocol",
        "title": "Oncology Phase 3 Protocol"
    }
    
    res = client.post("/api/documents/upload", files=files, data=data)
    assert res.status_code == 201
    resp_data = res.json()
    assert resp_data["document_name"] == "Oncology Phase 3 Protocol"
    assert resp_data["study_id"] == "PROTOCOL-909"
    assert resp_data["total_pages"] >= 1


def test_query_filtering_and_insufficient_evidence():
    # Ingest document
    client.post("/api/documents/text", json={
        "title": "Pediatric Safety Study",
        "content": "In pediatric patients aged 6-12 years, the maximum tolerated dose was 15 mg/m2.",
        "study_id": "PED-001",
        "document_type": "safety_bulletin"
    })

    # Test filtering by study_id
    res_filtered = client.post("/api/query", json={
        "question": "What is the pediatric dose?",
        "filters": {"study_id": "PED-001"},
        "top_k": 2
    })
    assert res_filtered.status_code == 200
    assert len(res_filtered.json()["citations"]) > 0
    assert res_filtered.json()["citations"][0]["study_id"] == "PED-001"

    # Test filtering with non-matching study_id yields insufficient evidence
    res_no_match = client.post("/api/query", json={
        "question": "What is the pediatric dose?",
        "filters": {"study_id": "STUDY-DOES-NOT-EXIST"},
        "top_k": 2
    })
    assert res_no_match.status_code == 200
    assert "insufficient evidence" in res_no_match.json()["answer"].lower()
    assert res_no_match.json()["confidence_score"] == 0.0


def test_document_not_found_handling():
    res = client.get("/api/documents/non_existent_id")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()

    del_res = client.delete("/api/documents/non_existent_id")
    assert del_res.status_code == 404

