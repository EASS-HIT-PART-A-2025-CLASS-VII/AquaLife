from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.db import get_db
from models.user_model import UserCreate, UserProfile
from services.user_service import UserService
from security.dependencies import require_role



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

# 🔍 Get all users (only admins can see)
@router.get("/", response_model=list[UserProfile], dependencies=[Depends(require_role("admin"))])
def get_all_users(db: Session = Depends(get_db)):
    users = UserService.get_all_users(db)
    return [UserProfile.model_validate(user) for user in users]


# 🔄 Update a user by ID
@router.put("/{user_id}", response_model=UserProfile)
def update_user(user_id: int, user_in: UserCreate, db: Session = Depends(get_db)):
    # Call the update_user service method
    updated_user = UserService.update_user(user_id, user_in, db)
    return UserProfile.model_validate(updated_user)


# 🗑️ Delete a user by ID
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    # Call the delete_user service method
    UserService.delete_user(user_id, db)
    return {"detail": "User deleted successfully"}