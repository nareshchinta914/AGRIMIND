from fastapi import APIRouter, HTTPException
from ..schemas.crop import CropPredictRequest, CropPredictResponse
from ..services.ml_service import ml_service

router = APIRouter(tags=["Crop Machine Learning"])

@router.post("/crop", response_model=CropPredictResponse)
async def predict_crop(request: CropPredictRequest):
    """
    POST /predict/crop
    Predicts optimal agricultural crop using trained Random Forest Scikit-learn model.
    """
    try:
        result = ml_service.predict(
            n=request.nitrogen,
            p=request.phosphorus,
            k=request.potassium,
            temp=request.temperature,
            hum=request.humidity,
            ph=request.ph,
            rain=request.rainfall
        )

        return CropPredictResponse(
            success=True,
            predicted_crop=result["predicted_crop"],
            confidence_score=result["confidence_score"],
            all_recommendations=result["all_recommendations"],
            model_type="RandomForestClassifier (Scikit-Learn)",
            dataset_disclaimer="Trained on Indian regional agricultural soil & agro-climatic parameters."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction engine error: {str(e)}")
