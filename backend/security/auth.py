from datetime import datetime, timedelta, timezone
from jose import jwt
from config import settings

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    to_encode["role"] = data.get("role", "user")  # Include the role
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str):
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except Exception:
        return None
