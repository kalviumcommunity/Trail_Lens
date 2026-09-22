import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
INDEX_FILE = DATA_DIR / "vector_index.json"

# Ensure directories exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    app_name: str = "TrialLens - Clinical Research Assistant API"
    app_version: str = "1.0.0"
    base_dir: Path = BASE_DIR
    data_dir: Path = DATA_DIR
    upload_dir: Path = UPLOAD_DIR
    index_file: Path = INDEX_FILE
    
    # RAG Settings
    default_top_k: int = 4
    max_top_k: int = 15
    chunk_size: int = 650
    chunk_overlap: int = 100
    similarity_threshold: float = 0.05
    
    # Optional LLM Config
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "llama3")

settings = Settings()
