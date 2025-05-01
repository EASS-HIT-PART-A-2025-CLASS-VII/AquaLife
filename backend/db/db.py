from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.config import settings
from backend.db.base import Base

# ✅ Import model(s) so SQLAlchemy sees them
from backend.models.user_model import User

# Create the engine
engine = create_engine(settings.DATABASE_URL, echo=True)

# Create the tables
Base.metadata.create_all(bind=engine)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



#Dependency Injection for Sessions:
def get_db():
    db = SessionLocal()  # Get a new session
    try:
        yield db
    finally:
        db.close()  # Ensure the session is closed after use
