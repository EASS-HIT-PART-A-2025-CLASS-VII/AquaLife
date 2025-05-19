# AI Service

The AI Service provides intelligent recommendations and analysis for aquarium management using OpenAI's models.

## Directory Structure

```
ai_service/
├── config.py                # Configuration and settings
├── Dockerfile               # Docker configuration
├── main.py                  # Application entry point
├── models/                  # Data models and schemas
├── README.md                # This documentation
├── requirements.txt         # Python dependencies
├── routes/                  # API endpoints
├── services/                # Business logic
└── tests/                   # Unit and integration tests
```

## Flow

1. **Configuration Loading**: The service starts by loading configuration from the `config.py` file, which uses Pydantic for validation.

2. **API Initialization**: The FastAPI application is initialized in `main.py`, setting up CORS, logging, and registering routes.

3. **Request Handling**:
   - Incoming requests are routed to appropriate handlers in the `routes` directory.
   - The route handlers validate input using Pydantic models.
   - Business logic is then invoked from the `services` directory.

4. **OpenAI Integration**:
   - The service connects to OpenAI using the configured API key and model.
   - Prompts are constructed based on user input and aquarium data.
   - Responses are processed and returned to the client.

## Development

### Local Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn ai_service.main:app --reload
```

### Environment Variables

Create a `.env` file with the following variables:

```
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-3.5-turbo
DEBUG=True
```

### Docker

```bash
# Build and run with Docker
docker build -t ai-service .
docker run -p 8001:8001 ai-service
```

## API Documentation

When running, API documentation is available at:
- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc 