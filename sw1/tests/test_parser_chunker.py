import pytest
from app.services.parser import DocumentParser
from app.services.chunker import ClinicalChunker


SAMPLE_CLINICAL_DOC = """
--- Page 1 ---
1. INDICATIONS AND USAGE
CardioFix (zenilimod) is indicated for the reduction of cardiovascular mortality and heart failure hospitalization in adult patients with chronic heart failure (NYHA class II-IV).

2. DOSAGE AND ADMINISTRATION
The recommended starting dose of CardioFix is 25 mg orally once daily. Titrate every 2 to 4 weeks to a target maintenance dose of 100 mg orally once daily based on patient tolerance and blood pressure.

--- Page 2 ---
4. CONTRAINDICATIONS
CardioFix is contraindicated in patients with a history of serious hypersensitivity reaction to zenilimod or any component of the formulation. CardioFix is contraindicated in severe hepatic impairment (Child-Pugh Class C).

5. WARNINGS AND PRECAUTIONS
Hyperkalemia has been reported in clinical trials. Monitor serum potassium and renal function periodically during treatment. Discontinue if potassium exceeds 5.5 mEq/L.
"""


def test_parser_extracts_pages_and_sections():
    parsed = DocumentParser.parse_text(SAMPLE_CLINICAL_DOC, filename="CardioFix_Label.txt")
    
    assert parsed.title == "CardioFix_Label.txt"
    assert parsed.total_pages == 2
    assert len(parsed.sections) >= 4
    
    section_names = [s.section_name for s in parsed.sections]
    assert any("INDICATIONS" in s for s in section_names)
    assert any("DOSAGE" in s for s in section_names)
    assert any("CONTRAINDICATIONS" in s for s in section_names)
    assert any("WARNINGS" in s for s in section_names)
    
    # Verify page assignment
    for s in parsed.sections:
        if "CONTRAINDICATIONS" in s.section_name:
            assert s.page_number == 2
        elif "INDICATIONS" in s.section_name:
            assert s.page_number == 1


def test_chunker_attaches_metadata():
    parsed = DocumentParser.parse_text(SAMPLE_CLINICAL_DOC, filename="CardioFix_Label.txt")
    chunker = ClinicalChunker(target_chunk_size=300, chunk_overlap=50)
    
    chunks = chunker.chunk_document(
        parsed_doc=parsed,
        document_id="doc_test_123",
        study_id="STUDY-CF-301",
        document_type="drug_label"
    )
    
    assert len(chunks) >= 4
    first_chunk = chunks[0]
    
    assert first_chunk.metadata.document_id == "doc_test_123"
    assert first_chunk.metadata.study_id == "STUDY-CF-301"
    assert first_chunk.metadata.document_type == "drug_label"
    assert first_chunk.metadata.page_number in [1, 2]
    assert len(first_chunk.text) > 10
