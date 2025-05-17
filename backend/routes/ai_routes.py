from fastapi import APIRouter
from backend.models.aqualayout_model import AquaLayoutCreate
from backend.services.ai_proxy_service import evaluate_with_ai

router = APIRouter(prefix="/ai", tags=["AI Evaluation"])

@router.post("/evaluate")
async def evaluate_layout(layout: AquaLayoutCreate):
    result = await evaluate_with_ai(layout)
    return result
