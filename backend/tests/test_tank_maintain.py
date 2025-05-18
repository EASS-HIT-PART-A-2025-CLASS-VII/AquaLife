import pytest
from unittest.mock import Mock, patch
from datetime import datetime, timezone
from backend.models.tank_maintain_model import TankMaintenanceCreate, TankMaintenanceResponse
from backend.services.tank_maintain_service import TankMaintenanceService
from backend.services.aquarium_service import AquariumService
from backend.models.aqualayout_model import AquaLayoutCreate, FishEntry
from fastapi import HTTPException

# Test data
SAMPLE_MAINTENANCE = {
    "layout_id": 1,
    "owner_email": "test@example.com",
    "maintenance_date": datetime.now(timezone.utc),
    "maintenance_type": "Water Change",
    "description": "Regular 25% water change",
    "notes": "Water parameters look good",
    "completed": 0
}

SAMPLE_LAYOUT = {
    "owner_email": "test@example.com",
    "tank_name": "Test Tank",
    "tank_length": 60,
    "tank_width": 30,
    "tank_height": 40,
    "water_type": "freshwater",
    "fish_data": [
        {
            "name": "Neon Tetra",
            "quantity": 6
        }
    ],
    "comments": "Test aquarium setup"
}

@pytest.fixture
def mock_db():
    return Mock()

@pytest.fixture
def mock_aquarium_service():
    return Mock(spec=AquariumService)

@pytest.fixture
def sample_maintenance():
    return TankMaintenanceCreate(**SAMPLE_MAINTENANCE)

@pytest.fixture
def sample_layout():
    return AquaLayoutCreate(**SAMPLE_LAYOUT)

class TestTankMaintenance:
    def test_create_maintenance_entry(self, mock_db, mock_aquarium_service, sample_maintenance, sample_layout):
        # Mock the aquarium service to return a valid layout
        mock_aquarium_service.get_by_id.return_value = Mock(
            id=1,
            owner_email=sample_maintenance.owner_email
        )
        
        # Create service with mocked dependencies
        service = TankMaintenanceService(mock_db)
        service.aquarium_service = mock_aquarium_service
        
        # Mock the repository create method
        mock_db.add = Mock()
        mock_db.commit = Mock()
        mock_db.refresh = Mock()
        
        # Create maintenance entry
        result = service.create(sample_maintenance)
        
        # Verify the correct data was used
        assert result.layout_id == sample_maintenance.layout_id
        assert result.owner_email == sample_maintenance.owner_email
        assert result.maintenance_type == sample_maintenance.maintenance_type
        assert result.description == sample_maintenance.description
        assert result.notes == sample_maintenance.notes
        assert result.completed == sample_maintenance.completed

    def test_get_maintenance_by_id(self, mock_db, sample_maintenance):
        # Mock the repository to return a maintenance entry
        mock_db.query.return_value.filter.return_value.first.return_value = Mock(
            id=1,
            layout_id=sample_maintenance.layout_id,
            owner_email=sample_maintenance.owner_email
        )
        
        service = TankMaintenanceService(mock_db)
        result = service.get_by_id(1)
        
        assert result.id == 1
        assert result.layout_id == sample_maintenance.layout_id
        assert result.owner_email == sample_maintenance.owner_email

    def test_get_maintenance_by_layout(self, mock_db, mock_aquarium_service, sample_maintenance):
        # Mock the aquarium service to return a valid layout
        mock_aquarium_service.get_by_id.return_value = Mock(id=1)
        
        # Mock the repository to return a list of maintenance entries
        mock_db.query.return_value.filter.return_value.all.return_value = [
            Mock(
                id=1,
                layout_id=1,
                owner_email=sample_maintenance.owner_email
            )
        ]
        
        service = TankMaintenanceService(mock_db)
        service.aquarium_service = mock_aquarium_service
        
        result = service.get_by_layout(1)
        
        assert len(result) == 1
        assert result[0].layout_id == 1
        assert result[0].owner_email == sample_maintenance.owner_email

    def test_get_maintenance_by_owner(self, mock_db, sample_maintenance):
        # Mock the repository to return a list of maintenance entries
        mock_db.query.return_value.filter.return_value.all.return_value = [
            Mock(
                id=1,
                layout_id=1,
                owner_email=sample_maintenance.owner_email
            )
        ]
        
        service = TankMaintenanceService(mock_db)
        result = service.get_by_owner(sample_maintenance.owner_email)
        
        assert len(result) == 1
        assert result[0].owner_email == sample_maintenance.owner_email

    def test_update_maintenance(self, mock_db, mock_aquarium_service, sample_maintenance):
        # Mock the repository to return a maintenance entry
        mock_db.query.return_value.filter.return_value.first.return_value = Mock(
            id=1,
            layout_id=1,
            owner_email=sample_maintenance.owner_email
        )
        
        # Mock the aquarium service to return a valid layout
        mock_aquarium_service.get_by_id.return_value = Mock(id=1)
        
        service = TankMaintenanceService(mock_db)
        service.aquarium_service = mock_aquarium_service
        
        # Update maintenance
        updated_data = sample_maintenance.dict()
        updated_data["maintenance_type"] = "Filter Cleaning"
        updated_data["description"] = "Monthly filter maintenance"
        updated_maintenance = TankMaintenanceCreate(**updated_data)
        
        result = service.update(1, updated_maintenance)
        
        assert result.maintenance_type == "Filter Cleaning"
        assert result.description == "Monthly filter maintenance"

    def test_delete_maintenance(self, mock_db, sample_maintenance):
        # Mock the repository to return a maintenance entry
        mock_db.query.return_value.filter.return_value.first.return_value = Mock(
            id=1,
            layout_id=1,
            owner_email=sample_maintenance.owner_email
        )
        
        service = TankMaintenanceService(mock_db)
        result = service.delete(1, sample_maintenance.owner_email)
        
        assert result is not None
        mock_db.delete.assert_called_once()

    def test_invalid_layout(self, mock_db, mock_aquarium_service, sample_maintenance):
        # Mock the aquarium service to return None (layout not found)
        mock_aquarium_service.get_by_id.return_value = None
        
        service = TankMaintenanceService(mock_db)
        service.aquarium_service = mock_aquarium_service
        
        with pytest.raises(HTTPException) as exc_info:
            service.create(sample_maintenance)
        assert exc_info.value.status_code == 404
        assert "Aquarium layout not found" in str(exc_info.value.detail)

    def test_unauthorized_update(self, mock_db, mock_aquarium_service, sample_maintenance):
        # Mock the repository to return a maintenance entry
        mock_db.query.return_value.filter.return_value.first.return_value = Mock(
            id=1,
            layout_id=1,
            owner_email=sample_maintenance.owner_email
        )
        
        service = TankMaintenanceService(mock_db)
        service.aquarium_service = mock_aquarium_service
        
        # Try to update with different owner
        updated_data = sample_maintenance.dict()
        updated_data["owner_email"] = "other@example.com"
        updated_maintenance = TankMaintenanceCreate(**updated_data)
        
        with pytest.raises(HTTPException) as exc_info:
            service.update(1, updated_maintenance)
        assert exc_info.value.status_code == 403
        assert "You can only update your own maintenance entries" in str(exc_info.value.detail)

    def test_unauthorized_delete(self, mock_db, sample_maintenance):
        # Mock the repository to return a maintenance entry
        mock_db.query.return_value.filter.return_value.first.return_value = Mock(
            id=1,
            layout_id=1,
            owner_email=sample_maintenance.owner_email
        )
        
        service = TankMaintenanceService(mock_db)
        
        # Try to delete with different owner
        with pytest.raises(HTTPException) as exc_info:
            service.delete(1, "other@example.com")
        assert exc_info.value.status_code == 403
        assert "You can only delete your own maintenance entries" in str(exc_info.value.detail) 