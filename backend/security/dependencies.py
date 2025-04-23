from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from security.auth import decode_access_token
from models.user_model import User
from db.db import SessionLocal

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db = SessionLocal()
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    db.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def require_role(required_role: str):
    def role_checker(user: User = Depends(get_current_user)):
        if user.role != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return role_checker
