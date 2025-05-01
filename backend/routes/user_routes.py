from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.db.db import get_db
from backend.models.user_model import UserCreate, UserProfile, UserLogin, TokenUserResponse
from backend.services.user_service import UserService
from backend.security.dependencies import require_role
from backend.security.hashing import verify_password
from backend.security.auth import create_access_token



router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# 🔑 Login and get access token
@router.post("/login", response_model=TokenUserResponse)
def login_for_access_token(user_in: UserLogin, db: Session = Depends(get_db)):
    user = UserService.get_user_by_username(user_in.username, db)
    
    # Check if user exists and password is valid
    if not user or not verify_password(user_in.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create an access token and return user profile
    access_token = create_access_token(data={"sub": user.id, "role": str(user.role)})
    return {"access_token": access_token, "token_type": "bearer", **UserProfile.model_validate(user).dict()}



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



