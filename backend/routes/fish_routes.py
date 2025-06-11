from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.db.db import get_db
from backend.models.fish_model import FishCreate, FishResponse
from backend.services.fish_service import FishService

FISH_NOT_FOUND = "Fish not found"

router = APIRouter(prefix="/fish", tags=["Fish Catalog"])


@router.get("/", response_model=list[FishResponse])
def list_fish(db: Session = Depends(get_db)):
    """Get all fish in the catalog"""
    return FishService(db).get_all()


@router.get("/by-water-type/{water_type}", response_model=list[FishResponse])
def list_fish_by_water_type(water_type: str, db: Session = Depends(get_db)):
    """Get fish by water type (freshwater or saltwater)"""
    if water_type not in ["freshwater", "saltwater"]:
        raise HTTPException(status_code=400, detail="Water type must be 'freshwater' or 'saltwater'")
    return FishService(db).get_by_water_type(water_type)


@router.get("/search", response_model=list[FishResponse])
def search_fish(
    q: str = Query(..., min_length=1, description="Search term for fish name"),
    db: Session = Depends(get_db)
):
    """Search for fish by name (partial match)"""
    return FishService(db).search_by_name(q)


@router.get("/count")
def get_fish_count(db: Session = Depends(get_db)):
    """Get total number of fish in catalog"""
    count = FishService(db).get_count()
    return {"count": count}


@router.get("/name/{fish_name}", response_model=FishResponse)
def get_fish_by_name(fish_name: str, db: Session = Depends(get_db)):
    """Get a fish by exact name match"""
    fish = FishService(db).get_by_name(fish_name)
    if not fish:
        raise HTTPException(status_code=404, detail=FISH_NOT_FOUND)
    return fish


@router.get("/{fish_id}", response_model=FishResponse)
def get_fish(fish_id: int, db: Session = Depends(get_db)):
    """Get a fish by ID"""
    fish = FishService(db).get_by_id(fish_id)
    if not fish:
        raise HTTPException(status_code=404, detail=FISH_NOT_FOUND)
    return fish


@router.post("/", response_model=FishResponse)
def create_fish(fish: FishCreate, db: Session = Depends(get_db)):
    """Create a new fish in the catalog"""
    return FishService(db).create(fish)


@router.put("/{fish_id}", response_model=FishResponse)
def update_fish(fish_id: int, fish: FishCreate, db: Session = Depends(get_db)):
    """Update an existing fish"""
    updated = FishService(db).update(fish_id, fish)
    if not updated:
        raise HTTPException(status_code=404, detail=FISH_NOT_FOUND)
    return updated


@router.delete("/{fish_id}")
def delete_fish(fish_id: int, db: Session = Depends(get_db)):
    """Delete a fish from the catalog"""
    deleted = FishService(db).delete(fish_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=FISH_NOT_FOUND)
    return {"status": "deleted"}
