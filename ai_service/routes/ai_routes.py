import logging
from fastapi import APIRouter, HTTPException
from ai_service.models.ai_model import AquariumLayout, AIResponse
from ai_service.services.aqua_service import evaluate_aquarium_layout, AquariumServiceError, OpenAIError, ValidationError

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/evaluate", response_model=AIResponse)
async def evaluate_aquarium(layout: AquariumLayout):
    """
    Evaluate an aquarium layout 
    and provide AI advice.
    
    Args:
        layout: AquariumLayout model containing all aquarium details
        
    Returns:
        AIResponse containing the AI's evaluation
        
    Raises:
        HTTPException: If there's an error processing the request
    """
    try:
        logger.info("Received aquarium layout evaluation request")
        logger.debug(f"Request data: {layout.dict()}")
        
        result = await evaluate_aquarium_layout(layout)
        logger.info("Successfully generated aquarium advice")
        
        return result
        
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
        
    except OpenAIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise HTTPException(status_code=503, detail=str(e))
        
    except AquariumServiceError as e:
        logger.error(f"Aquarium service error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
        
    except Exception as e:
        logger.error(f"Unexpected error in evaluate_layout: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
