from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class CropPredictRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, le=300, description="Nitrogen content in soil (N)")
    phosphorus: float = Field(..., ge=0, le=300, description="Phosphorus content in soil (P)")
    potassium: float = Field(..., ge=0, le=300, description="Potassium content in soil (K)")
    ph: float = Field(..., ge=3.0, le=11.0, description="Soil pH level (3.0 to 11.0)")
    temperature: float = Field(..., ge=-10.0, le=60.0, description="Ambient temperature in Celsius")
    humidity: float = Field(..., ge=5.0, le=100.0, description="Relative air humidity in %")
    rainfall: float = Field(..., ge=0.0, le=2000.0, description="Annual / seasonal rainfall in mm")
    soil_type: Optional[str] = Field("alluvial", description="Soil classification e.g. alluvial, black, red, laterite")
    season: Optional[str] = Field("kharif", description="Agricultural cropping season e.g. kharif, rabi, zaid")

class CropRecommendationItem(BaseModel):
    crop: str
    confidence: float
    expected_yield: str
    optimal_sowing_window: str
    fertilizer_plan: str
    water_requirement: str
    market_outlook: str

class CropPredictResponse(BaseModel):
    success: bool = True
    predicted_crop: str
    confidence_score: float
    all_recommendations: List[CropRecommendationItem]
    model_type: str = "RandomForestClassifier (Scikit-Learn)"
    dataset_disclaimer: str = "Trained on Indian regional agricultural soil & agro-climatic parameters."
