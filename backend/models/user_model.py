from sqlalchemy import Column, Integer, String, Date
from db.base import Base



class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    birthdate = Column(Date, nullable=True)
    password = Column(String, nullable=False)
