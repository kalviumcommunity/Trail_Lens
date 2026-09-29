import sys
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("\n=================== 1. SYSTEM HEALTH ===================")
health = client.get("/api/health").json()
print(f"Status: {health['status']}")
print(f"Indexed Documents: {health['total_indexed_documents']}")
print(f"Indexed Chunks: {health['total_indexed_chunks']}")
print(f"Active Provider: {health['active_llm_provider']}")

print("\n=================== 2. LIST STUDIES ===================")
studies = client.get("/api/studies").json()
for s in studies["studies"]:
    print(f"• Study ID: {s['study_id']} ({s['document_count']} docs, types: {s['document_types']})")

test_questions = [
    "What was the median Overall Survival and hazard ratio in KEY-ONCO-301?",
    "What is the starting dose and titration schedule for CardioFix?",
    "What are the withholding criteria for hepatotoxicity under Hy's Law?",
    "What are the primary symptoms of malaria infection?"
]

print("\n=================== 3. CLINICAL RESEARCH Q&A (RAG) ===================")
for q in test_questions:
    print(f"\n❓ Question: {q}")
    response = client.post("/api/query", json={"question": q, "top_k": 2})
    if response.status_code != 200:
        print(f"Error {response.status_code}: {response.text}")
        continue
    res = response.json()
    print(f"💡 Answer:\n{res['answer']}")
    print(f"📊 Confidence Score: {res['confidence_score']}")
    print(f"🔍 Citations ({len(res['citations'])}):")
    for c in res['citations']:
        print(f"   - {c['citation_tag']}")
        print(f"     Relevance: {c['relevance_score']} | Excerpt: {c['snippet'][:100]}...")
