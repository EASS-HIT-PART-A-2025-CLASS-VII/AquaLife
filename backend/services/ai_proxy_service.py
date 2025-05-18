import httpx
from backend.models.aqualayout_model import AquaLayoutCreate

AI_SERVICE_URL = "http://ai-service:8001/evaluate"  # docker-compose name

async def evaluate_with_ai(layout: AquaLayoutCreate):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(AI_SERVICE_URL, json=layout.dict())
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            return {"error": str(e)}
