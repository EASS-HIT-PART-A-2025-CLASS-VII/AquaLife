from sqlalchemy.orm import Session
from backend.models.aqualayout_model import AquaLayout, AquaLayoutCreate


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
        self.db.delete(layout)
        self.db.commit()
        return layout
