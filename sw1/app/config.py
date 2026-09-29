import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env from project root (two levels up from this file)
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent.parent / ".env")

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

    # Google Gemini Config (primary LLM)
    google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    # MongoDB Config
    mongodb_uri: str = os.getenv("MONGODB_URI", "")
    mongodb_db_name: str = os.getenv("MONGODB_DB_NAME", "triallens")

    # Legacy OpenAI (kept for fallback compatibility, not used)
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    class Config:
        arbitrary_types_allowed = True


settings = Settings()
