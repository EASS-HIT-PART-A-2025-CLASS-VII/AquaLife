from pydantic_settings import BaseSettings
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    # Database Configuration
    DATABASE_URL: str
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = None
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str
    
    # Frontend
    FRONTEND_URL: str = "http://localhost"
    
    # OpenRouter (for AI service integration)
    OPENROUTER_API_KEY: Optional[str] = None
    
    # Debug
    DEBUG: bool = False

    class Config:
        env_file = ".env"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        logger.debug(f"Loaded GOOGLE_CLIENT_ID: {self.GOOGLE_CLIENT_ID[:10]}...")
        logger.debug(f"Loaded GOOGLE_REDIRECT_URI: {self.GOOGLE_REDIRECT_URI}")
        if self.DEBUG:
            logger.debug("Debug mode enabled")

settings = Settings()
