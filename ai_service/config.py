from pydantic_settings import BaseSettings, SettingsConfigDict
import logging

logger = logging.getLogger(__name__)

class AISettings(BaseSettings):
    OPENAI_API_KEY: str
    OPENAI_API_BASE: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    DEBUG: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        extra='ignore'
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        logger.info(f"Initializing AI Settings with model: {self.OPENAI_MODEL}")

settings = AISettings()
