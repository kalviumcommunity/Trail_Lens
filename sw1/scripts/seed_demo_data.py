"""
Seed script for TrialLens.
Ingests three representative pharmaceutical documents:
1. A Clinical Trial Report (KEY-ONCO-301)
2. An FDA Drug Prescribing Label (CardioFix / zenilimod)
3. A Clinical Safety Bulletin (HepatoSafe Bulletin)
"""
import sys
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.models.schemas import TextIngestRequest, DocumentType
from app.services.parser import DocumentParser
from app.services.chunker import ClinicalChunker
from app.services.vector_store import vector_store_service
from app.models.schemas import DocumentMetadata
import datetime


SAMPLE_DOCS = [
    {
        "title": "KEY-ONCO-301 Phase 3 Clinical Study Report",
        "study_id": "KEY-ONCO-301",
        "document_type": DocumentType.CLINICAL_TRIAL_REPORT,
        "content": """
--- Page 1 ---
1. STUDY OBJECTIVES AND DESIGN
KEY-ONCO-301 is a randomized, double-blind, multicenter Phase 3 clinical study evaluating OncoMab (anti-PD-L1) plus platinum doublet chemotherapy versus placebo plus chemotherapy in 784 adult patients with previously untreated metastatic non-small cell lung cancer (NSCLC).

--- Page 2 ---
2. PATIENT POPULATION AND ELIGIBILITY
Patients aged 18 years or older with histologically confirmed Stage IV NSCLC, ECOG performance status 0 or 1, and no prior systemic therapy for metastatic disease were eligible. Patients with untreated central nervous system metastases or active autoimmune disorders requiring systemic corticosteroids (>10 mg prednisone equivalent daily) were excluded.

--- Page 3 ---
3. PRIMARY AND SECONDARY EFFICACY ENDPOINTS
The dual primary endpoints were Overall Survival (OS) and Progression-Free Survival (PFS) assessed by blinded independent central review (BICR) using RECIST v1.1.
Results:
• Median Overall Survival was 22.1 months (95% CI: 19.8-24.6) in the OncoMab arm versus 15.3 months (95% CI: 13.7-17.1) in the chemotherapy-alone arm.
• Hazard Ratio for death was 0.68 (95% CI: 0.57-0.81, p < 0.0001), representing a 32% reduction in the risk of mortality.
• Median Progression-Free Survival was 8.8 months versus 5.2 months (HR 0.54, 95% CI: 0.45-0.65, p < 0.0001).
• Objective Response Rate (ORR) was 48.2% in the combination group compared to 29.8% in the control group.

--- Page 4 ---
4. SAFETY AND ADVERSE EVENTS
The incidence of Grade 3 to 5 treatment-emergent adverse events was 53.4% in the OncoMab group and 46.1% in the placebo group. The most common Grade 3/4 events in the OncoMab arm were neutropenia (15.2%), anemia (12.1%), fatigue (6.4%), and immune-mediated pneumonitis (3.1%). Treatment-related deaths occurred in 1.8% of patients in the OncoMab arm.
"""
    },
    {
        "title": "CardioFix (zenilimod) FDA Prescribing Information",
        "study_id": "STUDY-CF-301",
        "document_type": DocumentType.DRUG_LABEL,
        "content": """
--- Page 1 ---
1. INDICATIONS AND USAGE
CardioFix (zenilimod tablets) is indicated to reduce the risk of cardiovascular death and hospitalization for heart failure in adult patients with chronic heart failure with reduced ejection fraction (HFrEF, NYHA Class II-IV, LVEF ≤ 40%).

2. DOSAGE AND ADMINISTRATION
The recommended starting dose of CardioFix is 25 mg orally once daily. Patients should be assessed for renal function and serum potassium prior to initiation.
Titrate the dose every 2 to 4 weeks, doubling the dose to 50 mg once daily, then to the target maintenance dose of 100 mg orally once daily, as tolerated by the patient. Take with or without food.

--- Page 2 ---
4. CONTRAINDICATIONS
CardioFix is contraindicated in:
• Patients with known hypersensitivity to zenilimod or any inactive ingredients.
• Patients with severe hepatic impairment (Child-Pugh Class C).
• Concomitant use with aliskiren in patients with diabetes mellitus.

5. WARNINGS AND PRECAUTIONS
• Hyperkalemia: CardioFix can increase serum potassium. In clinical trials, serum potassium > 5.5 mEq/L was documented in 8.3% of treated patients. Periodic monitoring is recommended, particularly in patients with eGFR < 30 mL/min/1.73 m2.
• Hypotension: Symptomatic hypotension occurred in 9.2% of patients. Consider reducing doses of concomitant diuretics if hypotension develops.
"""
    },
    {
        "title": "Clinical Safety Bulletin: Drug-Induced Liver Injury Monitoring",
        "study_id": "SAFETY-BULLETIN-2026-04",
        "document_type": DocumentType.SAFETY_BULLETIN,
        "content": """
--- Page 1 ---
SAFETY BULLETIN: HEPATOTOXICITY ALERT AND RISK MITIGATION
Audience: Clinical Investigators, Safety Officers, and Trial Coordinators.

Summary:
Routine safety surveillance across Phase 2 and Phase 3 kinase inhibitor trials has identified cases of idiosyncratic drug-induced liver injury (DILI). Elevations in serum alanine aminotransferase (ALT) or aspartate aminotransferase (AST) > 3x Upper Limit of Normal (ULN) accompanied by total bilirubin > 2x ULN (Hy's Law criteria) represent a critical indicator of severe hepatotoxicity.

--- Page 2 ---
MANDATORY PROTOCOL ACTIONS AND DOSE MODIFICATIONS:
1. Baseline Testing: Obtain ALT, AST, alkaline phosphatase, and total bilirubin prior to study drug initiation.
2. Routine Monitoring: Repeat liver biochemistries every 2 weeks for the first 3 months of therapy, and monthly thereafter.
3. Withholding Criteria: Interrupt study treatment immediately if ALT or AST exceeds 5x ULN, or if ALT/AST > 3x ULN with total bilirubin > 2x ULN.
4. Permanent Discontinuation: Do not rechallenge patients who meet Hy's Law criteria or develop signs of hepatic decompensation (INR > 1.5, ascites, or encephalopathy).
"""
    }
]


def seed_database():
    print("🌱 Seeding TrialLens database with clinical trial documents...")
    chunker = ClinicalChunker(target_chunk_size=650, chunk_overlap=100)
    total_chunks = 0

    for idx, doc_data in enumerate(SAMPLE_DOCS, start=1):
        doc_id = f"seed_doc_{idx:03d}"
        parsed = DocumentParser.parse_text(doc_data["content"], filename=doc_data["title"])
        chunks = chunker.chunk_document(
            parsed_doc=parsed,
            document_id=doc_id,
            study_id=doc_data["study_id"],
            document_type=doc_data["document_type"].value
        )
        
        meta = DocumentMetadata(
            document_id=doc_id,
            document_name=doc_data["title"],
            study_id=doc_data["study_id"],
            document_type=doc_data["document_type"],
            total_pages=parsed.total_pages,
            total_chunks=len(chunks),
            file_size_bytes=len(doc_data["content"].encode("utf-8")),
            created_at=datetime.datetime.utcnow().isoformat(),
            extra_metadata={"source": "seed_script"}
        )
        
        vector_store_service.add_document(meta, chunks)
        total_chunks += len(chunks)
        print(f"  ✓ Indexed '{doc_data['title']}' ({len(chunks)} chunks, Study: {doc_data['study_id']})")

    print(f"\n🎉 Successfully seeded {len(SAMPLE_DOCS)} documents ({total_chunks} total chunks indexed into {vector_store_service.index_path}).")


if __name__ == "__main__":
    seed_database()
