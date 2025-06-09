# AquaLife

A containerized microservices application for aquarium management with an AI-powered advisor.

![image](https://github.com/user-attachments/assets/d942ce66-923b-4595-acb0-0cbbf4220e1e)

![image](https://github.com/user-attachments/assets/9ceacfd1-c283-4ec8-b6d3-96a9ec0efc22)

![2025-06-09 22 26 46](https://github.com/user-attachments/assets/d99479d2-014a-4938-b107-bec6cd0806d8)


## Project Structure

AquaLife follows a microservices architecture with three main components:

```
AquaLife/
├── ai_service/            # AI recommendations service using OpenAI
│   ├── Dockerfile         # AI service container configuration
│   ├── requirements.txt   # AI service Python dependencies
│   └── ...                # Other AI service files
│
├── backend/               # Core API service using FastAPI
│   ├── Dockerfile         # Backend container configuration
│   ├── requirements.txt   # Backend Python dependencies  
│   └── ...                # Other backend files
│
├── frontend/              # User interface using React
│   ├── Dockerfile         # Frontend container configuration
│   └── ...                # Other frontend files
│
├── docker-compose.yml     # Multi-container orchestration
└── .env                   # Environment variables (create this file)
```

Each service has its own README.md with detailed documentation.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local frontend development)
- Python 3.12+ (for local backend development)

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=aqualife

# OpenRouter Configuration 
OPENROUTER_API_KEY=your_api_key
```

### Running with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

## Services

| Service | Description | Port | Documentation |
|---------|-------------|------|---------------|
| Frontend | React-based UI | 80 | [frontend/README.md](frontend/README.md) |
| Backend | FastAPI core service | 8000 | [backend/README.md](backend/README.md) |
| AI Service | OpenAI-powered recommendations | 8001 | [ai_service/README.md](ai_service/README.md) |
| PostgreSQL | Database | 5432 | - |

## Development

See each service's README for specific development instructions.

