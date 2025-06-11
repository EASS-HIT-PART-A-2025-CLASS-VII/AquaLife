import httpx
from backend.models.aqualayout_model import AquaLayoutCreate
import logging

logger = logging.getLogger(__name__)

AI_SERVICE_URL = "http://ai-service:8001/evaluate"  # docker-compose name

async def evaluate_with_ai(layout: AquaLayoutCreate):
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            logger.info(f"Sending request to AI service: {AI_SERVICE_URL}")
            logger.debug(f"Request data: {layout.dict()}")
            
            response = await client.post(AI_SERVICE_URL, json=layout.dict())
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"AI service response: {result}")
            return result
            
        except httpx.ConnectError as e:
            logger.error(f"Failed to connect to AI service: {e}")
            return {"status": "error", "response": "AI service is currently unavailable. Please try again later."}
        except httpx.TimeoutException as e:
            logger.error(f"AI service timeout: {e}")
            return {"status": "error", "response": "AI service timed out. Please try again with a simpler request."}
        except httpx.HTTPError as e:
            logger.error(f"HTTP error from AI service: {e}")
            return {"status": "error", "response": f"AI service error: {str(e)}"}
        except Exception as e:
            logger.error(f"Unexpected error calling AI service: {e}")
            return {"status": "error", "response": "An unexpected error occurred while processing your request."}
