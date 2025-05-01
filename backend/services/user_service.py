from sqlalchemy.orm import Session
from backend.models.user_model import User
from backend.repositories.user_repository import UserRepository
from backend.security.hashing import hash_password, verify_password
from backend.security.auth import create_access_token
from fastapi import HTTPException
from typing import List

# Constant for "User not found" message
USER_NOT_FOUND = "User not found"

class UserService:

    # Create User 
    @staticmethod
    def create_user(user_in, db: Session):
        # Check if username or email already exists
        if db.query(User).filter((User.username == user_in.username) | (User.email == user_in.email)).first():
            raise HTTPException(status_code=400, detail="Username or email already exists")

        # Just use the role as a string directly
        user_role = user_in.role if user_in.role else "user"  # Default to "user" if no role is provided

        # Create the new User instance with hashed password and role
        new_user = User(
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            username=user_in.username,
            email=user_in.email,
            birthdate=user_in.birthdate,
            password=hash_password(user_in.password),  # Password hashing
            role=user_role  # Use the role directly as a string
        )

        # Add the new user to the database, commit the transaction, and refresh the user object
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user  # Return the created user instance
    
    # Get User by ID 
    @staticmethod
    def get_user_by_id(user_id: int, db: Session):
        # Retrieve the user from the database by ID
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
        return user  # Return the found user

    # Get User by Usernames
    @staticmethod
    def get_user_by_username(username: str, db: Session) -> User:
        return db.query(User).filter(User.username == username).first()

    # Get all users
    @staticmethod
    def get_all_users(db: Session) -> List[User]:
        return db.query(User).all()

    # Verify User
    @staticmethod
    def verify_user_password(plain_password: str, hashed_password: str) -> bool:
        # Use the helper function to verify password hash
        return verify_password(plain_password, hashed_password)
    

    # Authenticate User
    @staticmethod
    def authenticate_user(user: User, password: str) -> str:
        if not UserService.verify_user_password(password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create and return an access token
        return create_access_token(data={"sub": user.username})

    # Update User
    @staticmethod
    def update_user(user_id: int, user_in, db: Session):
        # Retrieve the user from the database by ID
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail=USER_NOT_FOUND)

        # Update user fields if provided
        if user_in.first_name:
            user.first_name = user_in.first_name
        if user_in.last_name:
            user.last_name = user_in.last_name
        if user_in.username:
            user.username = user_in.username
        if user_in.email:
            user.email = user_in.email
        if user_in.birthdate:
            user.birthdate = user_in.birthdate
        if user_in.password:
            user.password = hash_password(user_in.password)  # Update password with hashed value

        # Commit the changes to the database
        db.commit()
        db.refresh(user)

        return user  # Return the updated user instance

    # Delete User
    @staticmethod
    def delete_user(user_id: int, db: Session):
        # Retrieve the user from the database by ID
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail=USER_NOT_FOUND)

        # Delete the user from the database
        db.delete(user)
        db.commit()

        return {"detail": "User deleted successfully"}