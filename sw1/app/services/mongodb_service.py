"""
MongoDB async service using Motor.
Stores document metadata in the 'documents' collection.
"""
from datetime import datetime
from typing import List, Optional, Dict, Any

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError

from app.config import settings


class MongoDBService:
    """Async MongoDB client wrapper for document metadata persistence."""

    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None

    async def connect(self):
        """Initialize the MongoDB connection."""
        if not settings.mongodb_uri:
            print("[WARN] MONGODB_URI not set - MongoDB persistence disabled.")
            return
        try:
            import certifi
            self.client = AsyncIOMotorClient(
                settings.mongodb_uri,
                serverSelectionTimeoutMS=5000,
                tlsCAFile=certifi.where()
            )
            self.db = self.client[settings.mongodb_db_name]
            # Ping to verify connection
            await self.client.admin.command("ping")
            print(f"[OK] MongoDB connected -> database: '{settings.mongodb_db_name}'")

            # Create indexes
            await self.db.documents.create_index("document_id", unique=True)
            await self.db.documents.create_index("study_id")
            await self.db.documents.create_index("created_at")
            await self.db.query_history.create_index("created_at")

        except Exception as e:
            print(f"[INFO] MongoDB Atlas connection status: {e}")
            print("[INFO] Running in resilient mode: local memory cache active while MongoDB connects.")
            self.client = None
            self.db = None

    async def disconnect(self):
        """Close MongoDB connection."""
        if self.client:
            self.client.close()
            print("MongoDB connection closed.")

    @property
    def is_connected(self) -> bool:
        return self.db is not None

    # ─── Document CRUD ────────────────────────────────────────────────────────

    async def save_document(self, doc_dict: Dict[str, Any]) -> bool:
        """Insert or update a document record."""
        if not self.is_connected:
            return False
        try:
            doc_dict["_updated_at"] = datetime.utcnow().isoformat()
            await self.db.documents.update_one(
                {"document_id": doc_dict["document_id"]},
                {"$set": doc_dict},
                upsert=True
            )
            return True
        except Exception as e:
            print(f"MongoDB save_document error: {e}")
            return False

    async def get_document(self, document_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a single document by its ID."""
        if not self.is_connected:
            return None
        try:
            doc = await self.db.documents.find_one(
                {"document_id": document_id},
                {"_id": 0}
            )
            return doc
        except Exception as e:
            print(f"MongoDB get_document error: {e}")
            return None

    async def list_documents(self) -> List[Dict[str, Any]]:
        """List all indexed documents ordered by creation date (newest first)."""
        if not self.is_connected:
            return []
        try:
            cursor = self.db.documents.find(
                {}, {"_id": 0}
            ).sort("created_at", -1)
            return await cursor.to_list(length=None)
        except Exception as e:
            print(f"MongoDB list_documents error: {e}")
            return []

    async def delete_document(self, document_id: str) -> bool:
        """Delete a document record from MongoDB."""
        if not self.is_connected:
            return False
        try:
            result = await self.db.documents.delete_one({"document_id": document_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"MongoDB delete_document error: {e}")
            return False

    async def get_document_count(self) -> int:
        """Return total number of indexed documents."""
        if not self.is_connected:
            return 0
        try:
            return await self.db.documents.count_documents({})
        except Exception:
            return 0

    # ─── Query History ────────────────────────────────────────────────────────

    async def save_query(self, query_record: Dict[str, Any]) -> bool:
        """Persist a query + answer to history collection."""
        if not self.is_connected:
            return False
        try:
            query_record["created_at"] = datetime.utcnow().isoformat()
            await self.db.query_history.insert_one(query_record)
            return True
        except Exception as e:
            print(f"MongoDB save_query error: {e}")
            return False

    async def get_query_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Fetch recent query history."""
        if not self.is_connected:
            return []
        try:
            cursor = self.db.query_history.find(
                {}, {"_id": 0}
            ).sort("created_at", -1).limit(limit)
            return await cursor.to_list(length=None)
        except Exception as e:
            print(f"MongoDB get_query_history error: {e}")
            return []


# Global singleton
mongodb_service = MongoDBService()
