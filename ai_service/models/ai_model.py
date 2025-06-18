from pydantic import BaseModel, EmailStr
from typing import List, Optional

class FishEntry(BaseModel):
    name: str
    quantity: int

class AquariumLayout(BaseModel):
    owner_email: EmailStr
    tank_name: str
    tank_length: int
    tank_width: int
    tank_height: int
    water_type: str
    fish_data: List[FishEntry]
    comments: Optional[str] = None
    unit: Optional[str] = "cm"  # "cm" or "inch"

class AIResponse(BaseModel):
    status: str
    response: str