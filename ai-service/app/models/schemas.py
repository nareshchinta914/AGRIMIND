from pydantic import BaseModel, Field
from typing import List, Optional

class ImageQualityCheck(BaseModel):
    is_valid: bool = True
    resolution: Optional[str] = None
    brightness: Optional[int] = None
    message: Optional[str] = None

class DiseaseDiagnosisResponse(BaseModel):
    crop: str
    problem: str
    confidence: float = Field(..., ge=0, le=100)
    symptoms: str
    what_to_do: str
    water_advice: str
    important_notice: str
    spoken_text: str
    language: str = "en"
    quality_check: Optional[ImageQualityCheck] = None

class MultipleImageDiagnosisResponse(BaseModel):
    crop: str
    problem: str
    confidence: float
    symptoms: str
    what_to_do: str
    water_advice: str
    important_notice: str
    spoken_text: str
    images_analyzed: int
    language: str = "en"

class VoiceAssistantQuery(BaseModel):
    query: str
    language: str = "ta"
    user_context: Optional[dict] = None

class VoiceAssistantResponse(BaseModel):
    reply: str
    spoken_text: str
    navigation_intent: Optional[str] = None
    language: str = "ta"
