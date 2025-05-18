from sqlalchemy.orm import Session
from fastapi import HTTPException
from backend.models.tank_maintain_model import TankMaintenanceCreate
from backend.repositories.tank_maintain_repository import TankMaintenanceRepository
from backend.services.aquarium_service import AquariumService

MAINTENANCE_NOT_FOUND = "Maintenance entry not found"
LAYOUT_NOT_FOUND = "Aquarium layout not found"

class TankMaintenanceService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = TankMaintenanceRepository(db)
        self.aquarium_service = AquariumService(db)

    def get_by_id(self, maintenance_id: int):
        maintenance = self.repository.get_by_id(maintenance_id)
        if not maintenance:
            raise HTTPException(status_code=404, detail=MAINTENANCE_NOT_FOUND)
        return maintenance

    def get_by_layout(self, layout_id: int):
        # Verify layout exists
        layout = self.aquarium_service.get_by_id(layout_id)
        if not layout:
            raise HTTPException(status_code=404, detail=LAYOUT_NOT_FOUND)
        return self.repository.get_by_layout(layout_id)

    def get_by_owner(self, owner_email: str):
        return self.repository.get_by_owner(owner_email)

    def create(self, maintenance_data: TankMaintenanceCreate):
        # Verify layout exists
        layout = self.aquarium_service.get_by_id(maintenance_data.layout_id)
        if not layout:
            raise HTTPException(status_code=404, detail=LAYOUT_NOT_FOUND)
        
        # Verify owner matches layout
        if layout.owner_email != maintenance_data.owner_email:
            raise HTTPException(status_code=403, detail="You can only create maintenance entries for your own aquariums")
        
        return self.repository.create(maintenance_data.dict())

    def update(self, maintenance_id: int, maintenance_data: TankMaintenanceCreate):
        maintenance = self.get_by_id(maintenance_id)
        
        # Verify owner matches
        if maintenance.owner_email != maintenance_data.owner_email:
            raise HTTPException(status_code=403, detail="You can only update your own maintenance entries")
        
        # Verify layout exists if changed
        if maintenance.layout_id != maintenance_data.layout_id:
            layout = self.aquarium_service.get_by_id(maintenance_data.layout_id)
            if not layout:
                raise HTTPException(status_code=404, detail=LAYOUT_NOT_FOUND)
        
        return self.repository.update(maintenance_id, maintenance_data.dict())

    def delete(self, maintenance_id: int, owner_email: str):
        maintenance = self.get_by_id(maintenance_id)
        
        # Verify owner matches
        if maintenance.owner_email != owner_email:
            raise HTTPException(status_code=403, detail="You can only delete your own maintenance entries")
        
        return self.repository.delete(maintenance_id) 