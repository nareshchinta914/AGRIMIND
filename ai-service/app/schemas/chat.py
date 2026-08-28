from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class FarmerContext(BaseModel):
    location: Optional[str] = "Thanjavur, Tamil Nadu"
    current_crop: Optional[str] = "Paddy (Ponni Samba)"
    soil_type: Optional[str] = "Alluvial Loam"
    farm_size: Optional[float] = 5.0
    weather_summary: Optional[str] = "31°C, Partly Cloudy, 10% rain chance"
    farm_history: Optional[List[str]] = ["Paddy 2025 Kharif (135 Quintals)", "Wheat 2024 Rabi (110 Quintals)"]

class AssistantChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Farmer user voice query or text message")
    language: str = Field("ta", description="Target language code: ta, te, hi, kn, ml, mr, bn, en")
    farmer_context: Optional[FarmerContext] = Field(default_factory=FarmerContext)

class AssistantChatResponse(BaseModel):
    success: bool = True
    reply: str
    language: str
    audio_text: str
    suggested_actions: List[str]
    context_used: Dict[str, Any]
