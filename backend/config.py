from pydantic_settings import BaseSettings
import logging

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str

    class Config:
        env_file = ".env"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        logger.debug(f"Loaded GOOGLE_CLIENT_ID: {self.GOOGLE_CLIENT_ID[:10]}...")
        logger.debug(f"Loaded GOOGLE_REDIRECT_URI: {self.GOOGLE_REDIRECT_URI}")

settings = Settings()
