from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class WaterRecommendationRequest(BaseModel):
    crop: str = Field(..., description="Name of standing or planned crop e.g. Paddy, Wheat, Cotton, Maize")
    farm_size: float = Field(..., gt=0, description="Farm acreage in acres")
    soil: str = Field("alluvial", description="Soil type e.g. alluvial, black, red, sandy, clay")
    growth_stage: Optional[str] = Field("Tillering & Booting", description="Current vegetative stage of crop")
    temperature: Optional[float] = Field(31.0, description="Current ambient temperature in Celsius")
    humidity: Optional[float] = Field(65.0, description="Current relative humidity %")
    rainfall: Optional[float] = Field(5.0, description="Recent 24h rainfall in mm")
    forecast_rain_chance: Optional[float] = Field(10.0, description="Upcoming rain probability %")

class IrrigationStageMilestone(BaseModel):
    stage_name: str
    status: str
    recommended_depth: str
    timing: str

class WaterRecommendationResponse(BaseModel):
    success: bool = True
    crop: str
    farm_size_acres: float
    estimated_water_requirement_liters: int
    irrigation_suggestion: str
    irrigation_frequency: str
    rain_based_recommendation: str
    water_saving_suggestions: List[str]
    critical_growth_milestones: List[IrrigationStageMilestone]
