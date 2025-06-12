# 🐠 AquaLife

<div align="center">

![image](https://github.com/user-attachments/assets/6a64e21e-cdf0-48be-bad2-536c1c55b7a0)


**A sophisticated containerized microservices application for intelligent aquarium management with AI-powered advisory capabilities.**

[![Python](https://img.shields.io/badge/Python-55%25-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-35%25-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-10%25-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

</div>

## 🏗️ Architecture Overview
![image](https://github.com/user-attachments/assets/56238c1a-66d1-4343-9330-059a8f62a7b4)

AquaLife implements a secure, scalable microservices architecture with advanced container isolation and intelligent networking:

```
┌─────────────────────────────────────────────────────────────────┐
│                          NGINX PROXY                           │
│                  (Rate Limiting & Security)                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼──────┐ ┌────────▼──────┐ ┌────────▼──────┐
│   Frontend   │ │    Backend    │ │  AI Service   │
│    (React)   │ │   (FastAPI)   │ │  (OpenRouter) │
│              │ │               │ │               │
│ Port: 80     │ │ Port: 8000    │ │ Port: 8001    │
└──────────────┘ └───────┬───────┘ └───────────────┘
                         │
                ┌────────▼──────┐
                │  PostgreSQL   │
                │   Database    │
                │ Port: 5432    │
                └───────────────┘
```

## 🚀 Project Structure

```
AquaLife/
├── 🎨 frontend/                    # React + Vite + TypeScript UI
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Application pages
│   │   └── services/              # API integration
│   ├── nginx/                     # Nginx configuration
│   │   ├── nginx.conf            # Main Nginx config
│   │   ├── default.conf          # Server block config
│   │   └── default_SSL.conf      # SSL configuration
│   └── Dockerfile                # Frontend container
│
├── ⚙️ backend/                     # FastAPI Core Service
│   ├── models/                   # Pydantic & SQLAlchemy models
│   ├── routes/                   # API endpoints
│   ├── services/                 # Business logic
│   ├── repositories/             # Data access layer
│   ├── security/                 # Authentication & authorization
│   │   ├── auth.py              # JWT handling
│   │   ├── oauth_google.py      # Google OAuth integration
│   │   ├── hashing.py           # Password security
│   │   └── dependencies.py      # Security dependencies
│   └── db/                       # Database configuration
│
├── 🤖 ai_service/                  # AI Recommendation Engine
│   ├── models/                   # AI data models
│   ├── services/                 # AI business logic
│   ├── routes/                   # AI API endpoints
│   └── config.py                 # AI configuration
│
├── 🐳 Docker Configuration
│   ├── docker-compose.yml        # Multi-container orchestration
│   ├── docker-compose_SSL.yml    # SSL-enabled configuration
│   └── init-letsencrypt.sh       # SSL certificate automation
│
└── 📚 Documentation
    ├── README.md                 # This file
    ├── SSL_README.md             # SSL setup guide
    └── service-specific README files
```

## 🔧 Technology Stack

### Frontend
- **React 18** with **TypeScript** for type-safe development
- **Vite** for lightning-fast builds and development
- **Tailwind CSS** for responsive, utility-first styling
- **Radix UI** for accessible component primitives
- **Zustand** for lightweight state management
- **Axios** for HTTP client with interceptors

### Backend
- **FastAPI** for high-performance async API development
- **SQLAlchemy** with async support for database ORM
- **PostgreSQL** for robust data persistence
- **JWT** authentication with refresh token support
- **Pydantic** for data validation and serialization
- **Pytest** for comprehensive testing

### AI Service
- **OpenRouter API** for AI model access
- **FastAPI** for consistent API patterns
- **Async HTTP** for efficient external API calls

### Infrastructure
- **Docker** & **Docker Compose** for containerization
- **Nginx** as reverse proxy with rate limiting
- **Let's Encrypt** for SSL/TLS certificates
- **PostgreSQL** for production-ready database

## 🚀 Quick Start

### Prerequisites

```bash
# Required software
- Docker & Docker Compose
- Git

# Optional for local development
- Node.js 18+ (frontend development)
- Python 3.12+ (backend development)
```

### Environment Configuration

Create a `.env` file in the root directory:

```bash
# === Database Configuration ===
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=aqualife
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/aqualife

# === Authentication & Security ===
SECRET_KEY=your_super_secret_jwt_key_at_least_32_characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# === Google OAuth Configuration ===
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost/auth/google/callback

# === AI Service Configuration ===
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key

# === Application Configuration ===
FRONTEND_URL=http://localhost
DEBUG=False
```

#### 🔐 Google OAuth Setup

1. **Create Google Cloud Project**:
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search and enable "Google+ API"

3. **Create OAuth 2.0 Credentials**:
   ```
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: Web application
   - Authorized redirect URIs: http://localhost/auth/google/callback
   ```

4. **Required OAuth Scopes**:
   ```
   - openid
   - email  
   - profile
   ```

### 🚀 Launch Application

```bash
# Clone the repository
git clone https://github.com/your-username/AquaLife.git
cd AquaLife

# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🌐 Service Endpoints

| Service | Description | URL | Status |
|---------|-------------|-----|--------|
| **Frontend** | React UI | http://localhost | ✅ |
| **Backend API** | FastAPI service | http://localhost/api | ✅ |
| **AI Service** | AI recommendations | http://localhost/ai | ✅ |
| **API Documentation** | Swagger UI | http://localhost/api/docs | ✅ |
| **Database** | PostgreSQL | localhost:5432 | ✅ |

## 🔒 Security & Network Architecture

### Container Isolation Strategy

AquaLife implements a **multi-network security model** for enhanced isolation:

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Network Segmentation                              │
│  ├── aqualife-network (Backend + Database)                 │
│  ├── ai_network (AI Service isolation)                     │
│  └── Frontend bridges both networks                        │
│                                                             │
│ Layer 2: Container Isolation                               │
│  ├── No direct container-to-container communication        │
│  ├── All traffic routed through Nginx proxy               │
│  └── AI service completely isolated from database          │
│                                                             │
│ Layer 3: Application Security                              │
│  ├── JWT-based authentication                              │
│  ├── OAuth 2.0 integration                                 │
│  ├── Rate limiting on AI endpoints                         │
│  └── Input validation with Pydantic                        │
└─────────────────────────────────────────────────────────────┘
```

### Network Security Configuration

#### 🔐 Container Network Isolation

```yaml
networks:
  aqualife-network:    # Backend ↔ Database communication
    driver: bridge
    internal: false
    
  ai_network:          # AI service isolation
    driver: bridge  
    internal: false    # Allows external API calls
```

**Security Benefits**:
- ✅ **AI Service Isolation**: Cannot access database directly
- ✅ **Network Segmentation**: Services isolated by network boundaries  
- ✅ **Controlled Communication**: All traffic routed through Nginx
- ✅ **Zero-Trust Architecture**: No implicit trust between services

#### 🛡️ Nginx Security Configuration

```nginx
# Rate limiting for AI service abuse prevention
limit_req_zone $binary_remote_addr zone=ai_limit:10m rate=10r/s;

location /ai/ {
    limit_req zone=ai_limit burst=5 nodelay;
    
    # Extended timeouts for AI processing
    proxy_connect_timeout 120s;
    proxy_read_timeout 300s;
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
```

**Security Features**:
- 🚫 **Rate Limiting**: 10 requests/second per IP for AI endpoints
- ⏱️ **Timeout Protection**: Prevents resource exhaustion
- 🔒 **Security Headers**: XSS and clickjacking protection
- 📊 **Traffic Monitoring**: Comprehensive logging and metrics

#### 🔥 Firewall & Access Control

```nginx
# Backend API security
location /api/ {
    # CORS security
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    
    # Proxy caching for performance
    proxy_cache_valid 200 302 10m;
    proxy_cache_methods GET HEAD;
}
```

### 🔐 Authentication & Authorization

#### Multi-Factor Authentication Support
- **JWT Tokens**: Secure, stateless authentication
- **Google OAuth**: Enterprise-grade social login
- **Refresh Tokens**: Automatic session management
- **Role-Based Access**: Granular permission control

#### Data Protection
- **Password Hashing**: Bcrypt with salt rounds
- **SQL Injection Prevention**: SQLAlchemy ORM protection
- **Input Validation**: Pydantic schema validation
- **HTTPS Enforcement**: SSL/TLS encryption

## 🚀 Development

### Local Development Setup

```bash
# Backend development
cd backend
pip install -r requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Frontend development  
cd frontend
npm install
npm run dev

# AI Service development
cd ai_service
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

### 🧪 Testing

```bash
# Backend tests
cd backend
pytest -v --cov

# Frontend tests
cd frontend  
npm test

# Integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```


## 📈 Monitoring & Observability

### Health Checks
- **Service Health**: `/health` endpoints for all services
- **Database Connectivity**: Automatic connection testing
- **External API Status**: OpenRouter API monitoring

### Logging Strategy
- **Structured Logging**: JSON format for all services
- **Log Aggregation**: Centralized log management
- **Error Tracking**: Comprehensive error reporting


### Performance Optimization
- **Nginx Caching**: Static asset optimization
- **Database Indexing**: Query performance optimization  
- **Connection Pooling**: Efficient database connections
- **CDN Ready**: Static asset distribution support



**Built with ❤️ for the aquarium community**


</div>

