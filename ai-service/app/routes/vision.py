from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
from ..services.image_classifier import classifier
from ..models.schemas import DiseaseDiagnosisResponse, MultipleImageDiagnosisResponse

router = APIRouter(prefix="/api/vision", tags=["Computer Vision"])

@router.post("/analyze", response_model=DiseaseDiagnosisResponse)
async def analyze_crop_image(
    file: UploadFile = File(...),
    language: str = Form("ta")
):
    """
    Diagnose single crop leaf or plant photograph
    """
    image_bytes = await file.read()
    result = classifier.predict_single(image_bytes, language=language)
    return result

@router.post("/analyze-multiple", response_model=MultipleImageDiagnosisResponse)
async def analyze_multiple_images(
    files: List[UploadFile] = File(...),
    language: str = Form("ta"),
    voice_prompt: Optional[str] = Form(None)
):
    """
    Ensemble diagnostic combining whole plant, damaged leaf, and pest close-up photos
    """
    if len(files) == 0:
        raise HTTPException(status_code=400, detail="At least one image is required")

    images_bytes_list = []
    for f in files:
        b = await f.read()
        images_bytes_list.append(b)

    result = classifier.predict_multiple(images_bytes_list, language=language, voice_prompt=voice_prompt or "")
    return result

@router.post("/detect-disease")
async def detect_disease(
    file: UploadFile = File(...),
    language: str = Form("ta")
):
    image_bytes = await file.read()
    return classifier.predict_single(image_bytes, language=language)

@router.post("/detect-pest")
async def detect_pest(
    file: UploadFile = File(...),
    language: str = Form("ta")
):
    image_bytes = await file.read()
    return classifier.predict_single(image_bytes, language=language)
