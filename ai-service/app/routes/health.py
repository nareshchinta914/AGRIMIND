from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["System Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "ONLINE",
        "service": "AGRIMIND AI & Machine Learning Service",
        "engine": "FastAPI + Scikit-Learn",
        "timestamp": datetime.utcnow().isoformat()
    }
