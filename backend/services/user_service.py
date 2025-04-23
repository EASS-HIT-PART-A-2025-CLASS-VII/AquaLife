# services/user_service.py

from sqlalchemy.orm import Session
from models.user_model import User
from repositories.user_repository import UserRepository
from security.hashing import hash_password, verify_password
from security.auth import create_access_token
from fastapi import HTTPException

class UserService:

    # Create User 
    @staticmethod
    def create_user(user_in, db: Session):

        # Check if username or email already exists
        if db.query(User).filter((User.username == user_in.username) | (User.email == user_in.email)).first():
            raise HTTPException(status_code=400, detail="Username or email already exists")

        # Create the new User instance with hashed password
        new_user = User(
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            username=user_in.username,
            email=user_in.email,
            birthdate=user_in.birthdate,
            password=hash_password(user_in.password)  # Password hashing
        )

        #Add the new user to the database, commit the transaction, and refresh the user object
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user  # Return the created user instance
    
    # Get User 
    @staticmethod
    def get_user_by_id(user_id: int, db: Session):
        # Retrieve the user from the database by ID
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user  # Return the found user

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
            raise HTTPException(status_code=404, detail="User not found")

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
            raise HTTPException(status_code=404, detail="User not found")

        # Delete the user from the database
        db.delete(user)
        db.commit()

        return {"detail": "User deleted successfully"}