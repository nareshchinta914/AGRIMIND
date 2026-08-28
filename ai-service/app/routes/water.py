from fastapi import APIRouter, HTTPException
from ..schemas.water import WaterRecommendationRequest, WaterRecommendationResponse
from ..services.water_service import water_service

router = APIRouter(tags=["Smart Water & Irrigation"])

@router.post("/recommendation", response_model=WaterRecommendationResponse)
async def get_water_recommendation(request: WaterRecommendationRequest):
    """
    POST /water/recommendation
    Precision water requirement and irrigation advisory based on crop, acreage, and evapotranspiration.
    """
    try:
        data = water_service.calculate_water_needs(request)
        return WaterRecommendationResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Water recommendation error: {str(e)}")
