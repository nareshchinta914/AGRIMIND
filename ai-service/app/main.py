import os
import sys

# Ensure UTF-8 stdout on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import predict, assistant, water, health

app = FastAPI(
    title="AGRIMIND AI & Smart Farming Engine",
    description="Machine Learning Crop Recommendation, Precision Water Advisory & Multilingual AI Assistant Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route Registrations
app.include_router(predict.router, prefix="/predict")
app.include_router(assistant.router, prefix="/assistant")
app.include_router(water.router, prefix="/water")
app.include_router(health.router)

@app.get("/")
async def root():
    return {
        "service": "AGRIMIND AI & Smart Farming Engine",
        "status": "ONLINE",
        "docs": "/docs",
        "endpoints": {
            "crop_prediction": "POST /predict/crop",
            "assistant_chat": "POST /assistant/chat",
            "water_recommendation": "POST /water/recommendation",
            "health_check": "GET /health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
