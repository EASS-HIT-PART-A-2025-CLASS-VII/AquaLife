from sqlalchemy import Column, Integer, String, Date
from backend.db.base import Base
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Literal, Optional
from datetime import date


# SQLAlchemy model for define the actual table structure
# This is what ORM uses to query, update, or delete from PostgreSQL
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    birthdate = Column(Date, nullable=True)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="user")


# Pydantic model for user profile.
# These define the schemas for API requests/responses
# Used for validating input data (e.g. POST /register)
# Used for serializing output (e.g. GET /user/1)
# Easily converted to/from JSON
# Prevent leaking sensitive data (e.g. password hashes)
class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    birthdate: Optional[date] = None
    role: str 
    
    # This allows FastAPI to auto-convert SQLAlchemy models into Pydantic ones
    model_config = ConfigDict(from_attributes=True)


# Pydantic model for user creation.
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    birthdate: Optional[str] = None
    role: Optional[Literal['admin', 'user', 'moderator']] = "user"

    # This allows FastAPI to auto-convert SQLAlchemy models into Pydantic ones
    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    email: str
    password: str


class TokenUserResponse(BaseModel):
    access_token: str
    token_type: str
    id: int
    first_name: str
    last_name: str
    email: str
    birthdate: Optional[date] = None




# 1) SQLAlchemy retrieves the User from DB (user = db.query(...))
# 2) Pydantic converts it to a response object (UserResponse.model_validate(user))
# 3) FastAPI returns it as JSON to the client