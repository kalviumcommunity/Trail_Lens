# TrialLens 🔬 — AI-Powered Clinical Research Assistant Backend

TrialLens is a specialized Retrieval-Augmented Generation (RAG) backend engineered for pharmaceutical companies to query large repositories of **clinical trial reports**, **drug prescribing labels**, and **safety bulletins**. It provides researchers with precise, evidence-grounded answers with exact source citations (Document Name, Study ID, Section, and Page Number).

---

## 🚀 Key Features

- **Evidence-Preserving Ingestion**: Parses PDF, TXT, and Markdown files while detecting clinical section headers and extracting page boundaries.
- **Granular Metadata Chunking**: Chunks text with sliding windows while retaining `document_id`, `study_id`, `document_type`, `section`, and `page_number`.
- **Hybrid Clinical Retrieval**: Combines deterministic dense embedding vectors with medical keyword overlap weighting and metadata filtering.
- **Strict Evidence Grounding**: Answering engine that strictly answers from retrieved documents and cites `[Ref X: Document, Study, Section, Page]`. If evidence is absent or insufficient, it explicitly admits it without hallucinating.
- **Pluggable LLM Provider**: Works out-of-the-box with a zero-dependency local clinical evidence synthesizer, with seamless hooks for OpenAI (`gpt-4o`, `gpt-4o-mini`) or local Ollama instances.
- **RESTful Endpoints**: Built on FastAPI with auto-generated OpenAPI / Swagger UI docs.

---

## 🛠️ Quickstart

### 1. Environment Setup
```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### 2. Seed Sample Clinical Documents
Seed sample clinical trial reports (KEY-ONCO-301), FDA drug labels (CardioFix), and safety bulletins:
```bash
python3 scripts/seed_demo_data.py
```

### 3. Start the API Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Interactive API documentation will be available at: **[http://localhost:8000/docs](http://localhost:8000/docs)**.

### 4. Run Automated Tests
```bash
pytest tests/ -v
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/documents/upload` | Upload & index PDF/TXT/MD document with study metadata |
| `POST` | `/api/documents/text` | Ingest raw text or markdown directly |
| `GET` | `/api/documents` | List all indexed clinical documents |
| `GET` | `/api/documents/{doc_id}` | Retrieve document metadata and its constituent chunks |
| `DELETE` | `/api/documents/{doc_id}` | Delete document and remove all vector embeddings |
| `POST` | `/api/search` | Semantic search with relevance scores & metadata filters |
| `POST` | `/api/query` | **RAG endpoint**: Natural language Q&A with exact citations |
| `GET` | `/api/studies` | Aggregate listing of clinical studies and document counts |
| `GET` | `/api/health` | Service health, indexed document/chunk stats, active LLM |

---

## 🧪 Example API Usage

### Query with Citations (RAG)
```bash
curl -X POST "http://localhost:8000/api/query" \
     -H "Content-Type: application/json" \
     -d '{
       "question": "What was the median Overall Survival in KEY-ONCO-301?",
       "top_k": 3
     }'
```

**Example Response**:
```json
{
  "question": "What was the median Overall Survival in KEY-ONCO-301?",
  "answer": "Based on the retrieved clinical evidence from 2 source document(s):\n\n• Results:\n• Median Overall Survival was 22.1 months (95% CI: 19.8-24.6) in the OncoMab arm versus 15.3 months (95% CI: 13.7-17.1) in the chemotherapy-alone arm. [Ref 1: KEY-ONCO-301 Phase 3 Clinical Study Report, Study: KEY-ONCO-301, Section: '1. STUDY OBJECTIVES AND DESIGN', Page: 3]\n\nSummary: Evidence derived directly from study records across 1 verified citation(s).",
  "confidence_score": 0.93,
  "citations": [
    {
      "document_id": "seed_doc_001",
      "document_name": "KEY-ONCO-301 Phase 3 Clinical Study Report",
      "study_id": "KEY-ONCO-301",
      "document_type": "clinical_trial_report",
      "section": "1. STUDY OBJECTIVES AND DESIGN",
      "page_number": 3,
      "relevance_score": 0.6752,
      "snippet": "3. PRIMARY AND SECONDARY EFFICACY ENDPOINTS\nThe dual primary endpoints were Overall Survival (OS)...",
      "citation_tag": "[Ref 1: KEY-ONCO-301 Phase 3 Clinical Study Report, Study: KEY-ONCO-301, Section: '1. STUDY OBJECTIVES AND DESIGN', Page: 3]"
    }
  ],
  "evidence_chunks_consulted": 2,
  "model_used": "triallens-clinical-synthesizer-v1"
}
```

### Upload a Document
```bash
curl -X POST "http://localhost:8000/api/documents/upload" \
     -F "file=@clinical_protocol.pdf" \
     -F "study_id=NCT05912345" \
     -F "document_type=clinical_trial_report" \
     -F "title=Phase 3 Oncology Protocol"
```

---

## ⚙️ Configuration

Set optional environment variables in `.env` or system environment:
- `OPENAI_API_KEY`: If provided, TrialLens uses OpenAI (`gpt-4o-mini` by default) for natural language answers.
- `OPENAI_MODEL`: Desired model (default: `gpt-4o-mini`).
- `OLLAMA_BASE_URL`: Local Ollama server (default: `http://localhost:11434`).
- `OLLAMA_MODEL`: Desired local model (default: `llama3`).
