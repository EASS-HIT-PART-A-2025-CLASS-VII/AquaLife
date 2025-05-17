from pydantic_settings import BaseSettings
import logging

logger = logging.getLogger(__name__)

class AISettings(BaseSettings):
    OPENAI_API_KEY: str
    OPENAI_API_BASE: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-4"
    DEBUG: bool = False

    class Config:
        env_file = ".env"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        logger.debug("AISettings loaded. Model: %s", self.OPENAI_MODEL)

settings = AISettings()
