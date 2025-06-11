from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Float
from sqlalchemy.sql import func
from backend.db.base import Base
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime


# SQLAlchemy model for aquarium layouts
class AquaLayout(Base):
    __tablename__ = 'aquarium_layouts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    owner_email = Column(String, ForeignKey('users.email'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    tank_name = Column(String, nullable=False)
    tank_length = Column(Float, nullable=False)  # in cm (stored as decimal)
    tank_width = Column(Float, nullable=False)  # in cm (stored as decimal)
    tank_height = Column(Float, nullable=False)  # in cm (stored as decimal)
    water_type = Column(String, nullable=False)  # Freshwater or Saltwater
    fish_data = Column(JSON, nullable=False)  # [{"name": "Goldfish", "quantity": 2}]
    comments = Column(String, nullable=True)


# Pydantic schemas
class FishEntry(BaseModel):
    name: str
    quantity: int


class AquaLayoutCreate(BaseModel):
    owner_email: EmailStr
    tank_name: str
    tank_length: float
    tank_width: float
    tank_height: float
    water_type: str
    fish_data: List[FishEntry]
    comments: Optional[str] = None


class AquaLayoutResponse(BaseModel):
    id: int
    owner_email: EmailStr
    created_at: datetime
    tank_name: str
    tank_length: float
    tank_width: float
    tank_height: float
    water_type: str
    fish_data: List[FishEntry]
    comments: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
