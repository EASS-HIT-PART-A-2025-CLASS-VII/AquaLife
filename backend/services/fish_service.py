from sqlalchemy.orm import Session
from backend.models.fish_model import Fish, FishCreate
from backend.repositories.fish_repository import FishRepository
from typing import List, Optional


class FishService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = FishRepository(db)

    def get_all(self) -> List[Fish]:
        """Get all fish from the catalog, ordered by name"""
        return self.repository.get_all()

    def get_by_id(self, fish_id: int) -> Optional[Fish]:
        """Get a fish by ID"""
        return self.repository.get_by_id(fish_id)
    
    def get_by_name(self, name: str) -> Optional[Fish]:
        """Get a fish by exact name match"""
        return self.repository.get_by_name(name)

    def search_by_name(self, search_term: str) -> List[Fish]:
        """Search fish by name (partial match)"""
        return self.repository.search_by_name(search_term)

    def create(self, fish_data: FishCreate) -> Fish:
        """Create a new fish entry"""
        # Generate image URL if not provided
        if not fish_data.image_url:
            # Convert fish name to URL-friendly format
            image_filename = fish_data.name.lower().replace(" ", "_").replace("-", "_") + ".jpg"
            fish_data.image_url = f"/static/images/fish/{image_filename}"
        
        return self.repository.create(fish_data)

    def update(self, fish_id: int, fish_data: FishCreate) -> Optional[Fish]:
        """Update an existing fish entry"""
        return self.repository.update(fish_id, fish_data)

    def delete(self, fish_id: int) -> bool:
        """Delete a fish from the catalog"""
        return self.repository.delete(fish_id)

    def get_count(self) -> int:
        """Get total number of fish in catalog"""
        return self.repository.get_count()
