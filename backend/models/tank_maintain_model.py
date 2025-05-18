from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from backend.db.base import Base
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime


# SQLAlchemy model for tank maintenance entries
class TankMaintenance(Base):
    __tablename__ = 'tank_maintenance'

    id = Column(Integer, primary_key=True, autoincrement=True)
    layout_id = Column(Integer, ForeignKey('aquarium_layouts.id'), nullable=False)
    owner_email = Column(String, ForeignKey('users.email'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    maintenance_date = Column(DateTime(timezone=True), nullable=False)
    maintenance_type = Column(String, nullable=False)  # e.g., "Water Change", "Filter Cleaning", "Feeding"
    description = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    completed = Column(Integer, default=0)  # 0 for pending, 1 for completed


# Pydantic schemas
class TankMaintenanceCreate(BaseModel):
    layout_id: int
    owner_email: EmailStr
    maintenance_date: datetime
    maintenance_type: str
    description: Optional[str] = None
    notes: Optional[str] = None
    completed: Optional[int] = 0


class TankMaintenanceResponse(BaseModel):
    id: int
    layout_id: int
    owner_email: EmailStr
    created_at: datetime
    maintenance_date: datetime
    maintenance_type: str
    description: Optional[str] = None
    notes: Optional[str] = None
    completed: int

    model_config = ConfigDict(from_attributes=True) 