from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.db.db import get_db
from backend.models.aqualayout_model import AquaLayoutCreate, AquaLayoutResponse
from backend.services.aquarium_service import AquariumService

LAYOUT_NOT_FOUND = "Layout not found"

router = APIRouter(prefix="/aquariums", tags=["Aquarium Layouts"])


@router.get("/", response_model=list[AquaLayoutResponse])
def list_layouts(email: str = Query(None), db: Session = Depends(get_db)):
    return AquariumService(db).get_all(email=email)


@router.get("/by-owner/{email}", response_model=list[AquaLayoutResponse])
def get_layouts_by_owner(email: str, db: Session = Depends(get_db)):
    return AquariumService(db).get_all(email=email)


@router.get("/{layout_id}", response_model=AquaLayoutResponse)
def get_layout(layout_id: int, db: Session = Depends(get_db)):
    layout = AquariumService(db).get_by_id(layout_id)
    if not layout:
        raise HTTPException(status_code=404, detail=LAYOUT_NOT_FOUND)
    return layout


@router.post("/", response_model=AquaLayoutResponse)
def create_layout(layout: AquaLayoutCreate, db: Session = Depends(get_db)):
    return AquariumService(db).create(layout)


@router.put("/{layout_id}", response_model=AquaLayoutResponse)
def update_layout(
    layout_id: int, layout: AquaLayoutCreate, db: Session = Depends(get_db)
):
    updated = AquariumService(db).update(layout_id, layout)
    if not updated:
        raise HTTPException(status_code=404, detail=LAYOUT_NOT_FOUND)
    return updated


@router.delete("/{layout_id}")
def delete_layout(layout_id: int, db: Session = Depends(get_db)):
    deleted = AquariumService(db).delete(layout_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=LAYOUT_NOT_FOUND)
    return {"status": "deleted"}
