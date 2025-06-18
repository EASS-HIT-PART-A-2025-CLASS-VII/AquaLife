from passlib.context import CryptContext
import logging

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    hashed = pwd_context.hash(password)
    logger.debug("Password hashed successfully")
    return hashed

def verify_password(plain_password: str, hashed_password: str) -> bool:
    logger.debug("Attempting password verification")
    result = pwd_context.verify(plain_password, hashed_password)
    logger.debug(f"Password verification result: {result}")
    return result
