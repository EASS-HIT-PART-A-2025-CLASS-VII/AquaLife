from sqlalchemy.orm import Session
from backend.models.fish_model import Fish, FishCreate


class FishService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(Fish).all()

    def get_by_id(self, fish_id: int):
        return self.db.query(Fish).filter(Fish.id == fish_id).first()
    
    def get_by_name(self, name: str):
        return self.db.query(Fish).filter(Fish.name.ilike(name)).first()

    def create(self, fish_data: FishCreate):
        fish = Fish(**fish_data.dict())
        self.db.add(fish)
        self.db.commit()
        self.db.refresh(fish)
        return fish

    def update(self, fish_id: int, fish_data: FishCreate):
        fish = self.get_by_id(fish_id)
        if not fish:
            return None
        for field, value in fish_data.dict().items():
            setattr(fish, field, value)
        self.db.commit()
        self.db.refresh(fish)
        return fish

    def delete(self, fish_id: int):
        fish = self.get_by_id(fish_id)
        if not fish:
            return None
        self.db.delete(fish)
        self.db.commit()
        return fish
