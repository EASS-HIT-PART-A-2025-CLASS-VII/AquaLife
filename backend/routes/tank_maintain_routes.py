from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from backend.db.db import get_db
from backend.models.tank_maintain_model import TankMaintenanceCreate, TankMaintenanceResponse
from backend.services.tank_maintain_service import TankMaintenanceService

router = APIRouter(prefix="/maintenance", tags=["Tank Maintenance"])


@router.get("/{maintenance_id}", response_model=TankMaintenanceResponse)
def get_maintenance(maintenance_id: int, db: Session = Depends(get_db)):
    return TankMaintenanceService(db).get_by_id(maintenance_id)


@router.get("/layout/{layout_id}", response_model=List[TankMaintenanceResponse])
def get_maintenance_by_layout(layout_id: int, db: Session = Depends(get_db)):
    return TankMaintenanceService(db).get_by_layout(layout_id)


@router.get("/owner/{email}", response_model=List[TankMaintenanceResponse])
def get_maintenance_by_owner(email: str, db: Session = Depends(get_db)):
    return TankMaintenanceService(db).get_by_owner(email)


@router.post("/", response_model=TankMaintenanceResponse)
def create_maintenance(maintenance: TankMaintenanceCreate, db: Session = Depends(get_db)):
    return TankMaintenanceService(db).create(maintenance)


@router.put("/{maintenance_id}", response_model=TankMaintenanceResponse)
def update_maintenance(
    maintenance_id: int,
    maintenance: TankMaintenanceCreate,
    db: Session = Depends(get_db)
):
    return TankMaintenanceService(db).update(maintenance_id, maintenance)


@router.delete("/{maintenance_id}")
def delete_maintenance(
    maintenance_id: int,
    owner_email: str = Query(..., description="Email of the owner for verification"),
    db: Session = Depends(get_db)
):
    return TankMaintenanceService(db).delete(maintenance_id, owner_email) 