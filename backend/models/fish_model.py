from sqlalchemy import Column, Integer, String
from backend.db.base import Base
from pydantic import BaseModel, ConfigDict

# SQLAlchemy table for fish catalog
class Fish(Base):
    __tablename__ = 'fish_catalog'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)
    image_url = Column(String, nullable=True)


# Pydantic schema for response
class FishResponse(BaseModel):
    id: int
    name: str
    image_url: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Pydantic schema for creation
class FishCreate(BaseModel):
    name: str
    image_url: str | None = None
