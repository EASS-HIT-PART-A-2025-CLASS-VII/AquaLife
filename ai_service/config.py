from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class AISettings(BaseSettings):
    model_config = ConfigDict(env_file=".env")

    OPENAI_API_KEY: str
    OPENAI_API_BASE: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-4"
    DEBUG: bool = False

settings = AISettings()
