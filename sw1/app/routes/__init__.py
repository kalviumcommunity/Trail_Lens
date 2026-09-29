from app.routes.documents import router as documents_router
from app.routes.query import router as query_router
from app.routes.system import router as system_router

__all__ = ["documents_router", "query_router", "system_router"]
