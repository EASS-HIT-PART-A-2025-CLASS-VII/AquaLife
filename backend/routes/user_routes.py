# routes/user_routes.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.db import get_db
from models.user_model import UserCreate, UserProfile
from services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# ➕ Create a new user
@router.post("/", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    new_user = UserService.create_user(user_in, db)  # Call the service method
    return UserProfile.model_validate(new_user)

# 🔍 Get a user by ID
@router.get("/{user_id}", response_model=UserProfile)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = UserService.get_user_by_id(user_id, db)  # Call the service method
    return UserProfile.model_validate(user)



# 1) SQLAlchemy retrieves the User from DB (user = db.query(...))
# 2) Pydantic converts it to a response object (UserProfile.model_validate(user))
# 3) FastAPI returns it as JSON to the client