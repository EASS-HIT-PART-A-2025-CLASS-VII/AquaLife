from pydantic_settings import BaseSettings, SettingsConfigDict
import logging

logger = logging.getLogger(__name__)

class AISettings(BaseSettings):
    # Required from environment
    OPENROUTER_API_KEY: str
    
    # Sensible defaults (can be overridden via .env if needed)
    OPENROUTER_API_BASE: str = "https://openrouter.ai/api/v1/chat/completions"
    OPENROUTER_MODEL: str = "google/gemma-2-9b-it:free"
    DEBUG: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        extra='ignore'
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        logger.info(f"Initializing AI Settings with OpenRouter model: {self.OPENROUTER_MODEL}")

settings = AISettings()
