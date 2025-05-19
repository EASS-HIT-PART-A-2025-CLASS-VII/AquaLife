# Backend Service

The Backend Service is the core API for the AquaLife application, managing aquarium data, user authentication, and business logic.

## Directory Structure

```
backend/
├── config.py                # Configuration and settings
├── db/                      # Database connection and models
│   ├── base.py              # SQLAlchemy base setup
│   └── db.py                # Database connection management
├── Dockerfile               # Docker configuration
├── main.py                  # Application entry point
├── models/                  # Data models (Pydantic and SQLAlchemy)
├── README.md                # This documentation
├── repositories/            # Data access layer
├── requirements.txt         # Python dependencies
├── routes/                  # API endpoints
├── security/                # Authentication and authorization
│   ├── auth.py              # JWT handling
│   ├── dependencies.py      # Security dependencies
│   ├── hashing.py           # Password hashing
│   └── oauth_google.py      # OAuth integrations
└── services/                # Business logic layer
```

## Flow

1. **Startup**: 
   - The application starts in `main.py`
   - Database connections are established
   - Routes are registered
   - Middleware is configured

2. **Authentication**:
   - JWT-based authentication is used for API access
   - OAuth integration allows login with third-party providers
   - Password hashing ensures secure storage

3. **Request Processing**:
   - Incoming requests go through authentication middleware
   - Route handlers validate input data with Pydantic models
   - Business logic in the `services` directory is invoked
   - Data access occurs through the `repositories` layer

4. **Database**:
   - SQLAlchemy models define the database schema
   - Repositories provide data access abstractions
   - Migrations manage schema changes

## Development

### Local Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn backend.main:app --reload
```

### Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/aqualife
SECRET_KEY=your_secret_key_for_jwt
DEBUG=True
```

### Database Migrations

```bash
# Initialize Alembic
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

### Docker

```bash
# Build and run with Docker
docker build -t backend-service .
docker run -p 8000:8000 backend-service
```

## API Documentation

When running, API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc 