from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL

# Create the engine
engine = create_engine(DATABASE_URL, echo=True)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



#Dependency Injection for Sessions:
def get_db():
    db = SessionLocal()  # Get a new session
    try:
        yield db
    finally:
        db.close()  # Ensure the session is closed after use
