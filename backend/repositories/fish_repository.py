from sqlalchemy.orm import Session
from backend.models.fish_model import Fish, FishCreate
from typing import List, Optional


class FishRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Fish]:
        """Get all fish from the catalog"""
        return self.db.query(Fish).order_by(Fish.name).all()

    def get_by_id(self, fish_id: int) -> Optional[Fish]:
        """Get a fish by ID"""
        return self.db.query(Fish).filter(Fish.id == fish_id).first()

    def get_by_name(self, name: str) -> Optional[Fish]:
        """Get a fish by name"""
        return self.db.query(Fish).filter(Fish.name == name).first()

    def search_by_name(self, search_term: str) -> List[Fish]:
        """Search fish by name (case-insensitive partial match)"""
        return self.db.query(Fish).filter(
            Fish.name.ilike(f"%{search_term}%")
        ).order_by(Fish.name).all()

    def create(self, fish_data: FishCreate) -> Fish:
        """Create a new fish in the catalog"""
        fish = Fish(
            name=fish_data.name,
            image_url=fish_data.image_url
        )
        self.db.add(fish)
        self.db.commit()
        self.db.refresh(fish)
        return fish

    def update(self, fish_id: int, fish_data: FishCreate) -> Optional[Fish]:
        """Update an existing fish"""
        fish = self.get_by_id(fish_id)
        if fish:
            fish.name = fish_data.name
            fish.image_url = fish_data.image_url
            self.db.commit()
            self.db.refresh(fish)
        return fish

    def delete(self, fish_id: int) -> bool:
        """Delete a fish from the catalog"""
        fish = self.get_by_id(fish_id)
        if fish:
            self.db.delete(fish)
            self.db.commit()
            return True
        return False

    def get_count(self) -> int:
        """Get total number of fish in catalog"""
        return self.db.query(Fish).count() 