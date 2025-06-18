from sqlalchemy.orm import Session
from backend.models.aqualayout_model import AquaLayout, AquaLayoutCreate
from typing import List, Optional


class AquaLayoutRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[AquaLayout]:
        """Get all aquarium layouts ordered by creation date (newest first)"""
        return self.db.query(AquaLayout).order_by(AquaLayout.created_at.desc()).all()

    def get_by_id(self, layout_id: int) -> Optional[AquaLayout]:
        """Get an aquarium layout by ID"""
        return self.db.query(AquaLayout).filter(AquaLayout.id == layout_id).first()

    def get_by_user_email(self, owner_email: str) -> List[AquaLayout]:
        """Get all aquarium layouts for a specific user"""
        return self.db.query(AquaLayout).filter(
            AquaLayout.owner_email == owner_email
        ).order_by(AquaLayout.created_at.desc()).all()

    def get_by_user_and_tank_name(self, owner_email: str, tank_name: str) -> Optional[AquaLayout]:
        """Get a specific tank by user and tank name"""
        return self.db.query(AquaLayout).filter(
            AquaLayout.owner_email == owner_email,
            AquaLayout.tank_name == tank_name
        ).first()

    def search_by_tank_name(self, search_term: str) -> List[AquaLayout]:
        """Search layouts by tank name (case-insensitive partial match)"""
        return self.db.query(AquaLayout).filter(
            AquaLayout.tank_name.ilike(f"%{search_term}%")
        ).order_by(AquaLayout.created_at.desc()).all()

    def get_by_water_type(self, water_type: str) -> List[AquaLayout]:
        """Get all layouts by water type (freshwater/saltwater)"""
        return self.db.query(AquaLayout).filter(
            AquaLayout.water_type.ilike(water_type)
        ).order_by(AquaLayout.created_at.desc()).all()

    def get_by_tank_size_range(self, min_gallons: float, max_gallons: float) -> List[AquaLayout]:
        """Get layouts within a tank size range (calculated volume in gallons)
        Formula: (length × width × height) ÷ 231 = gallons
        """
        # Calculate volume bounds in cubic inches
        min_cubic_inches = min_gallons * 231
        max_cubic_inches = max_gallons * 231
        
        return self.db.query(AquaLayout).filter(
            (AquaLayout.tank_length * AquaLayout.tank_width * AquaLayout.tank_height) >= min_cubic_inches,
            (AquaLayout.tank_length * AquaLayout.tank_width * AquaLayout.tank_height) <= max_cubic_inches
        ).order_by(AquaLayout.created_at.desc()).all()

    def get_recent_layouts(self, limit: int = 10) -> List[AquaLayout]:
        """Get most recent aquarium layouts"""
        return self.db.query(AquaLayout).order_by(
            AquaLayout.created_at.desc()
        ).limit(limit).all()

    def create(self, layout_data: AquaLayoutCreate) -> AquaLayout:
        """Create a new aquarium layout"""
        # Convert fish_data from Pydantic models to JSON-serializable format
        fish_data_json = [fish.model_dump() for fish in layout_data.fish_data]
        
        layout = AquaLayout(
            owner_email=layout_data.owner_email,
            tank_name=layout_data.tank_name,
            tank_length=layout_data.tank_length,
            tank_width=layout_data.tank_width,
            tank_height=layout_data.tank_height,
            water_type=layout_data.water_type,
            fish_data=fish_data_json,
            comments=layout_data.comments
        )
        self.db.add(layout)
        self.db.commit()
        self.db.refresh(layout)
        return layout

    def update(self, layout_id: int, layout_data: AquaLayoutCreate) -> Optional[AquaLayout]:
        """Update an existing aquarium layout"""
        layout = self.get_by_id(layout_id)
        if layout:
            # Convert fish_data from Pydantic models to JSON-serializable format
            fish_data_json = [fish.model_dump() for fish in layout_data.fish_data]
            
            layout.tank_name = layout_data.tank_name
            layout.tank_length = layout_data.tank_length
            layout.tank_width = layout_data.tank_width
            layout.tank_height = layout_data.tank_height
            layout.water_type = layout_data.water_type
            layout.fish_data = fish_data_json
            layout.comments = layout_data.comments
            
            self.db.commit()
            self.db.refresh(layout)
        return layout

    def delete(self, layout_id: int) -> bool:
        """Delete an aquarium layout"""
        layout = self.get_by_id(layout_id)
        if layout:
            self.db.delete(layout)
            self.db.commit()
            return True
        return False

    def delete_by_user_and_tank(self, owner_email: str, tank_name: str) -> bool:
        """Delete a specific tank by user and tank name"""
        layout = self.get_by_user_and_tank_name(owner_email, tank_name)
        if layout:
            self.db.delete(layout)
            self.db.commit()
            return True
        return False

    def get_count(self) -> int:
        """Get total number of aquarium layouts"""
        return self.db.query(AquaLayout).count()

    def get_count_by_user(self, owner_email: str) -> int:
        """Get number of layouts for a specific user"""
        return self.db.query(AquaLayout).filter(
            AquaLayout.owner_email == owner_email
        ).count()

    def get_layouts_with_fish(self, fish_name: str) -> List[AquaLayout]:
        """Get all layouts that contain a specific fish species
        Note: This uses JSON contains operation - database-specific
        """
        # For PostgreSQL JSON operations
        return self.db.query(AquaLayout).filter(
            AquaLayout.fish_data.contains([{"name": fish_name}])
        ).order_by(AquaLayout.created_at.desc()).all()

    def get_user_tank_names(self, owner_email: str) -> List[str]:
        """Get all tank names for a specific user"""
        results = self.db.query(AquaLayout.tank_name).filter(
            AquaLayout.owner_email == owner_email
        ).order_by(AquaLayout.tank_name).all()
        
        return [result[0] for result in results]

    def calculate_tank_volume_gallons(self, layout: AquaLayout) -> float:
        """Calculate tank volume in gallons
        Formula: (length × width × height) ÷ 231 = gallons
        """
        cubic_inches = layout.tank_length * layout.tank_width * layout.tank_height
        return round(cubic_inches / 231, 1)

    def get_tank_statistics(self) -> dict:
        """Get statistics about all tanks in the system"""
        total_layouts = self.get_count()
        
        # Get water type distribution
        freshwater_count = self.db.query(AquaLayout).filter(
            AquaLayout.water_type.ilike('freshwater')
        ).count()
        
        saltwater_count = self.db.query(AquaLayout).filter(
            AquaLayout.water_type.ilike('saltwater')
        ).count()
        
        return {
            "total_layouts": total_layouts,
            "freshwater_tanks": freshwater_count,
            "saltwater_tanks": saltwater_count,
            "unique_users": self.db.query(AquaLayout.owner_email).distinct().count()
        } 