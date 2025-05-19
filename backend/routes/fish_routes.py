from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.db import get_db
from backend.models.fish_model import FishCreate, FishResponse
from backend.services.fish_service import FishService

FISH_NOT_FOUND = "Fish not found"

router = APIRouter(prefix="/fish", tags=["Fish Catalog"])


@router.get("/", response_model=list[FishResponse])
def list_fish(db: Session = Depends(get_db)):
    return FishService(db).get_all()


@router.get("/name/{fish_name}", response_model=FishResponse)
def get_fish_by_name(fish_name: str, db: Session = Depends(get_db)):
    fish = FishService(db).get_by_name(fish_name)
    if not fish:
        raise HTTPException(status_code=404, detail=FISH_NOT_FOUND)
    return fish


@router.get("/{fish_id}", response_model=FishResponse)
def get_fish(fish_id: int, db: Session = Depends(get_db)):
    fish = FishService(db).get_by_id(fish_id)
    if not fish:
        raise HTTPException(status_code=404, detail=FISH_NOT_FOUND)
    return fish


@router.post("/", response_model=FishResponse)
def create_fish(fish: FishCreate, db: Session = Depends(get_db)):
    return FishService(db).create(fish)


@router.put("/{fish_id}", response_model=FishResponse)
def update_fish(fish_id: int, fish: FishCreate, db: Session = Depends(get_db)):
    updated = FishService(db).update(fish_id, fish)
    if not updated:
        raise HTTPException(status_code=404, detail=FISH_NOT_FOUND)
    return updated


@router.delete("/{fish_id}")
def delete_fish(fish_id: int, db: Session = Depends(get_db)):
    deleted = FishService(db).delete(fish_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=FISH_NOT_FOUND)
    return {"status": "deleted"}
