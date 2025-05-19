import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai_service.routes import ai_routes
from ai_service.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('aquarium_ai.log')
    ]
)

# Configure logger
logger = logging.getLogger(__name__)

app = FastAPI(title="Aquarium AI Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers - updated prefix to match Nginx configuration
app.include_router(ai_routes.router)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Aquarium AI Service")
    logger.info(f"Using OpenAI model: {settings.OPENAI_MODEL}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Aquarium AI Service")


@app.get("/")
def read_root():
    return {"Hello": "ai-service"}
