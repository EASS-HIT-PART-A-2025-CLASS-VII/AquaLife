from sqlalchemy.orm import Session
from backend.models.user_model import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_username(self, username: str):
        return self.db.query(User).filter(User.username == username).first()

    def create(self, first_name: str, last_name: str, username: str, email: str, birthdate, password: str):
        user = User(
            first_name=first_name,
            last_name=last_name,
            username=username,
            email=email,
            birthdate=birthdate,
            password=password
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

