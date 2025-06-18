from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.db.db import get_db
from backend.models.user_model import User, UserCreate, UserResponse, UserLogin
from backend.security.auth import get_current_user, create_access_token
from backend.security.oauth_google import get_google_oauth_url, get_google_user_info
from backend.services.user_service import UserService
from datetime import timedelta
from typing import List
import logging
from fastapi.responses import RedirectResponse
import urllib.parse
import json
from backend.config import settings

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/auth/google")
async def google_auth():
    """Redirect to Google OAuth login page"""
    try:
        url = get_google_oauth_url()
        logger.debug(f"Generated Google OAuth URL: {url}")
        return {"url": url}
    except Exception as e:
        logger.error(f"Error generating Google OAuth URL: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate Google OAuth URL"
        )

@router.get("/auth/google/callback")
async def google_auth_callback(code: str = None, data: str = None, db: Session = Depends(get_db)):
    """Handle Google OAuth callback"""
    try:
        # If we have data, this is the redirect from our backend
        if data:
            # Redirect to the frontend with the data
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/google/callback?data={data}")

        # Otherwise, this is the initial callback from Google
        logger.debug(f"Received callback with code: {code}")
        
        # Get user info from Google
        user_info = await get_google_user_info(code)
        logger.debug(f"Received user info from Google: {user_info}")
        
        email = user_info.get("email")
        logger.debug(f"Extracted email: {email}")
        
        if not email:
            logger.error("No email found in Google user info")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not get email from Google"
            )

        # Check if user exists
        user = UserService.get_user_by_email(email, db)
        logger.debug(f"Existing user found: {user is not None}")
        
        if not user:
            logger.debug("Creating new user from Google info")
            # Create new user
            user_data = UserCreate(
                email=email,
                first_name=user_info.get("given_name", ""),
                last_name=user_info.get("family_name", ""),
                password="",  # Google users don't need a password
                role="user"
            )
            user = UserService.create_user(user_data, db)
            logger.debug(f"Created new user with ID: {user.id}")

        # Create access token
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role},
            expires_delta=timedelta(minutes=30)
        )
        logger.debug("Created access token successfully")

        # Create the response data
        response_data = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role
            }
        }

        # Convert to JSON string and encode for URL
        json_data = json.dumps(response_data)
        encoded_data = urllib.parse.quote(json_data)
        
        # Redirect to the frontend with the data
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/google/callback?data={encoded_data}")

    except Exception as e:
        logger.error(f"Google auth error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not authenticate with Google: {str(e)}"
        )

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return UserService.create_user(user, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
def login_for_access_token(user_data: UserLogin, db: Session = Depends(get_db)):
    logger.debug(f"Login attempt for email: {user_data.email}")
    
    # Get user by email
    user = UserService.get_user_by_email(user_data.email, db)
    logger.debug(f"User found: {user is not None}")
    
    if not user:
        logger.debug("User not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not UserService.verify_user_password(user_data.password, user.password):
        logger.debug("Password verification failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    logger.debug("Password verification successful")
    
    # Create access token
    access_token = UserService.authenticate_user(user, user_data.password)
    logger.debug("Access token created successfully")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role
        }
    }

@router.get("/users/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/users", response_model=List[UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = UserService.get_all_users(db)
    return users[skip : skip + limit]

@router.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    return UserService.get_user_by_id(user_id, db)

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    return UserService.update_user(user_id, user, db)

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return UserService.delete_user(user_id, db)



