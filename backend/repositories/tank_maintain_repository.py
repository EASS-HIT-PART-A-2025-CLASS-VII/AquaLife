from sqlalchemy.orm import Session
from backend.models.tank_maintain_model import TankMaintenance


class TankMaintenanceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, maintenance_id: int):
        return self.db.query(TankMaintenance).filter(TankMaintenance.id == maintenance_id).first()

    def get_by_layout(self, layout_id: int):
        return self.db.query(TankMaintenance).filter(TankMaintenance.layout_id == layout_id).all()

    def get_by_owner(self, owner_email: str):
        return self.db.query(TankMaintenance).filter(TankMaintenance.owner_email == owner_email).all()

    def create(self, maintenance_data: dict):
        maintenance = TankMaintenance(**maintenance_data)
        self.db.add(maintenance)
        self.db.commit()
        self.db.refresh(maintenance)
        return maintenance

    def update(self, maintenance_id: int, maintenance_data: dict):
        maintenance = self.get_by_id(maintenance_id)
        if not maintenance:
            return None
        for field, value in maintenance_data.items():
            setattr(maintenance, field, value)
        self.db.commit()
        self.db.refresh(maintenance)
        return maintenance

    def delete(self, maintenance_id: int):
        maintenance = self.get_by_id(maintenance_id)
        if not maintenance:
            return None
        self.db.delete(maintenance)
        self.db.commit()
        return maintenance 