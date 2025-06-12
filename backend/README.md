# ⚙️ Backend Service

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

**High-performance async API service powering AquaLife's core functionality**

</div>

## 🎯 Overview

The Backend Service is the heart of the AquaLife application, providing secure, scalable APIs for aquarium management, user authentication, and business logic. Built with FastAPI for maximum performance and developer experience.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                           │
│                   (FastAPI + Uvicorn)                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────────────────────────┐
    │                 │                                     │
┌───▼───┐    ┌───────▼────────┐    ┌──────────▼─────────┐
│Security│    │Business Logic  │    │   Data Access      │
│Layer   │    │(Services)      │    │ (Repositories)     │
│        │    │                │    │                    │
│• JWT   │    │• Aquarium Mgmt │    │• SQLAlchemy ORM    │
│• OAuth │    │• User Mgmt     │    │• Query Optimization│
│• CORS  │    │• Analytics     │    │• Connection Pool   │
└────────┘    └────────────────┘    └────────┬───────────┘
                                             │
                                    ┌────────▼──────────┐
                                    │   PostgreSQL      │
                                    │    Database       │
                                    └───────────────────┘
```

## 📁 Directory Structure

```
backend/
├── 🚀 main.py                      # FastAPI application entry point
├── ⚙️ config.py                    # Configuration management
├── 📄 requirements.txt             # Python dependencies
├── 🐳 Dockerfile                   # Container configuration
├── 📚 README.md                    # This documentation
│
├── 🔒 security/                    # Authentication & Authorization
│   ├── auth.py                    # JWT token management
│   ├── dependencies.py            # Security dependencies
│   ├── hashing.py                 # Password hashing (bcrypt)
│   └── oauth_google.py            # Google OAuth integration
│
├── 🗄️ db/                          # Database Layer
│   ├── base.py                    # SQLAlchemy base configuration
│   └── db.py                      # Database connection management
│
├── 📊 models/                      # Data Models
│   ├── user.py                    # User models (Pydantic & SQLAlchemy)
│   ├── aquarium.py                # Aquarium models
│   └── shared.py                  # Shared model utilities
│
├── 🛠️ services/                    # Business Logic Layer
│   ├── user_service.py            # User business logic
│   ├── aquarium_service.py        # Aquarium management
│   └── analytics_service.py       # Data analytics
│
├── 🗃️ repositories/                # Data Access Layer
│   ├── base_repository.py         # Generic repository pattern
│   ├── user_repository.py         # User data access
│   └── aquarium_repository.py     # Aquarium data access
│
└── 🌐 routes/                      # API Endpoints
    ├── auth_routes.py             # Authentication endpoints
    ├── user_routes.py             # User management endpoints
    ├── aquarium_routes.py         # Aquarium CRUD endpoints
    └── analytics_routes.py        # Analytics endpoints
```

## 🔧 Technology Stack

### Core Framework
- **FastAPI** - High-performance async web framework
- **Uvicorn** - Lightning-fast ASGI server
- **Pydantic** - Data validation using Python type hints
- **SQLAlchemy** - Powerful Python SQL toolkit and ORM

### Database & Persistence
- **PostgreSQL** - Production-ready relational database
- **Alembic** - Database migration management
- **Databases** - Async database support

### Security & Authentication
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Google OAuth 2.0** - Social authentication
- **Bcrypt** - Password hashing with salt
- **CORS** - Cross-Origin Resource Sharing

### Development & Testing
- **Pytest** - Comprehensive testing framework
- **HTTPX** - Async HTTP client for testing
- **Python-dotenv** - Environment variable management

## 🚀 Quick Start

### Prerequisites

```bash
# Required
- Python 3.12+
- PostgreSQL 13+

# Optional for development
- Docker & Docker Compose
- Postman or similar API testing tool
```

### Local Development Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables (see Configuration section)
cp .env.example .env

# 5. Initialize database
alembic upgrade head

# 6. Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root directory:

```bash
# === Database Configuration ===
DATABASE_URL=postgresql://postgres:password@localhost:5432/aqualife
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=aqualife

# === Security Configuration ===
SECRET_KEY=your_super_secret_jwt_key_minimum_32_characters_long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days

# === Google OAuth Configuration ===
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost/auth/google/callback

# === Application Settings ===
FRONTEND_URL=http://localhost
DEBUG=True

# === Optional: AI Service Integration ===
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key
```

### 🔐 Google OAuth Setup

Refer to the main README for detailed Google OAuth setup instructions. The backend requires:

```python
# Required environment variables
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret  
GOOGLE_REDIRECT_URI=http://localhost/auth/google/callback

# Required OAuth scopes
- openid
- email
- profile
```

## 🎯 Application Flow

1. **Startup**: 
   - The application starts in `main.py`
   - Database connections are established
   - Routes are registered
   - Security middleware is configured

2. **Authentication**:
   - JWT-based authentication for API access
   - Google OAuth integration for social login
   - Password hashing ensures secure storage
   - Token refresh for session management

3. **Request Processing**:
   - Incoming requests go through authentication middleware
   - Route handlers validate input data with Pydantic models
   - Business logic in the `services` directory is invoked
   - Data access occurs through the `repositories` layer

4. **Database Operations**:
   - SQLAlchemy models define the database schema
   - Repositories provide data access abstractions
   - Alembic manages schema migrations

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/login` | User login with email/password | ❌ |
| `POST` | `/auth/register` | User registration | ❌ |
| `GET` | `/auth/google` | Google OAuth login | ❌ |
| `POST` | `/auth/google/callback` | Google OAuth callback | ❌ |
| `POST` | `/auth/refresh` | Refresh JWT token | ✅ |
| `POST` | `/auth/logout` | User logout | ✅ |

### User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users/me` | Get current user profile | ✅ |
| `PUT` | `/users/me` | Update user profile | ✅ |
| `DELETE` | `/users/me` | Delete user account | ✅ |

### Aquarium Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/aquariums` | List user's aquariums | ✅ |
| `POST` | `/aquariums` | Create new aquarium | ✅ |
| `GET` | `/aquariums/{id}` | Get aquarium details | ✅ |
| `PUT` | `/aquariums/{id}` | Update aquarium | ✅ |
| `DELETE` | `/aquariums/{id}` | Delete aquarium | ✅ |

### Health & Monitoring
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/health` | Service health check | ❌ |
| `GET` | `/docs` | Interactive API documentation | ❌ |
| `GET` | `/redoc` | Alternative API documentation | ❌ |

## 🔒 Security Features

### Authentication Flow
1. **User Registration/Login** → JWT token issued
2. **Token Validation** → Middleware validates on each request
3. **Role-Based Access** → Permissions checked per endpoint
4. **Token Refresh** → Automatic token renewal

### Security Measures
- **Password Hashing**: Bcrypt with salt rounds
- **SQL Injection Prevention**: SQLAlchemy ORM protection
- **Input Validation**: Pydantic schema validation
- **CORS Configuration**: Controlled cross-origin access
- **Security Headers**: XSS and CSRF protection

## 🗄️ Database Management

### Migrations with Alembic

```bash
# Initialize Alembic (first time only)
alembic init migrations

# Create a new migration
alembic revision --autogenerate -m "Add new feature"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# View migration history
alembic history
```

### Database Schema

```sql
-- Core tables
users (id, email, username, created_at, updated_at)
aquariums (id, user_id, name, volume, water_type, created_at)
fish (id, aquarium_id, species, quantity, added_date)
maintenance_logs (id, aquarium_id, type, date, notes)
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=backend --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run tests in parallel
pytest -n auto
```

## 🐳 Docker Deployment

### Standalone Container

```bash
# Build image
docker build -t aqualife-backend .

# Run container
docker run -p 8000:8000 --env-file .env aqualife-backend
```

### Docker Compose Integration

The backend integrates seamlessly with the main `docker-compose.yml`:

```yaml
fastapi-backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  container_name: fastapi-backend
  ports:
    - "8000:8000"
  networks:
    - aqualife-network
  depends_on:
    - postgres
  env_file:  
    - .env
```

## 📚 API Documentation

When running locally, comprehensive API documentation is available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## 🚀 Production Considerations

### Performance Optimization
- **Connection Pooling**: Optimized database connections
- **Query Optimization**: Efficient SQL queries
- **Async Operations**: Non-blocking I/O operations

### Security Best Practices
- **Environment Variables**: All secrets in environment
- **HTTPS Only**: SSL/TLS encryption enforced
- **Input Sanitization**: All inputs validated
- **Error Handling**: No sensitive data in error responses

---

<div align="center">

**Built with FastAPI for maximum performance and developer experience**

[API Documentation](http://localhost:8000/docs) • [Report Issues](https://github.com/your-username/AquaLife/issues)

</div> 