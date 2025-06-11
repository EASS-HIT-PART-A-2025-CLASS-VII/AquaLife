from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from backend.models.aqualayout_model import AquaLayout, AquaLayoutCreate
from backend.models.tank_maintain_model import TankMaintenance


class AquariumService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, email: str = None):
        query = self.db.query(AquaLayout)
        if email:
            query = query.filter(AquaLayout.owner_email == email)
        return query.order_by(AquaLayout.created_at.desc()).all()

    def get_by_id(self, layout_id: int):
        return self.db.query(AquaLayout).filter(AquaLayout.id == layout_id).first()

    def create(self, layout_data: AquaLayoutCreate):
        layout = AquaLayout(**layout_data.dict())
        self.db.add(layout)
        self.db.commit()
        self.db.refresh(layout)
        return layout

    def update(self, layout_id: int, layout_data: AquaLayoutCreate):
        layout = self.get_by_id(layout_id)
        if not layout:
            return None
        for field, value in layout_data.dict().items():
            setattr(layout, field, value)
        self.db.commit()
        self.db.refresh(layout)
        return layout

    def delete(self, layout_id: int):
        layout = self.get_by_id(layout_id)
        if not layout:
            return None
        
        try:
            # First, delete all maintenance records for this layout using bulk delete
            self.db.query(TankMaintenance).filter(
                TankMaintenance.layout_id == layout_id
            ).delete()
            
            # Flush to execute the maintenance deletions immediately
            self.db.flush()
            
            # Then delete the layout itself
            self.db.delete(layout)
            
            # Commit all deletions
            self.db.commit()
            
            return layout
        except IntegrityError as e:
            self.db.rollback()
            # This shouldn't happen now with cascading delete, but just in case
            if "foreign key" in str(e).lower() or "tank_maintenance_layout_id_fkey" in str(e):
                raise ValueError("Cannot delete layout because it has maintenance records. Delete maintenance records first.")
            else:
                raise ValueError(f"Database constraint violation: {str(e)}")
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error deleting layout: {str(e)}")
