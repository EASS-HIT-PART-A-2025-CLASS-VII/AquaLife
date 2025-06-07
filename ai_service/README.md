# 🐠 AquaLife AI Service

An intelligent aquarium consultation service powered by **OpenRouter AI** that provides real-time fish compatibility analysis, tank capacity calculations, and expert aquarium management advice.

## 🎯 Overview

The AI Service provides intelligent recommendations and analysis for aquarium management using OpenRouter's API with various AI models.

## 🏗️ Architecture Flow

```
Frontend (React) → Backend (FastAPI) → AI Service (FastAPI) → OpenRouter API → AI Model
```

### Request Flow:
1. **User Interface**: User selects fish in React frontend
2. **Backend Proxy**: FastAPI backend forwards request to AI service
3. **AI Processing**: AI service builds prompt and calls OpenRouter
4. **AI Response**: OpenRouter returns expert aquarium advice
5. **User Feedback**: Immediate compatibility analysis displayed

## 📁 Directory Structure

```
ai_service/
├── main.py                 # FastAPI application entry point
├── config.py               # OpenRouter configuration
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container configuration
├── README.md              # This documentation
├── models/
│   └── ai_model.py        # Pydantic data models (AquariumLayout, FishEntry, AIResponse)
├── routes/
│   └── ai_routes.py       # API endpoints (/evaluate)
├── services/
│   ├── aqua_service.py    # OpenRouter integration & response handling
│   └── prompt_builder.py  # AI prompt construction with tank calculations
└── tests/
    └── test_aquarium_service.py # Unit tests with OpenRouter mocking
```

## ⚙️ Configuration

### Environment Variables

The service requires an OpenRouter API key in the `.env` file (project root):

```env
# OpenRouter settings
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Default Configuration (config.py)

```python
class AISettings(BaseSettings):
    # Required from environment
    OPENROUTER_API_KEY: str
    
    # Sensible defaults (can be overridden via .env if needed)
    OPENROUTER_API_BASE: str = "https://openrouter.ai/api/v1/chat/completions"
    OPENROUTER_MODEL: str = "google/gemma-2-9b-it:free"
    DEBUG: bool = False
```

### Available Models

**Free Models:**
- `google/gemma-2-9b-it:free` (default - best performance)
- `google/gemma-7b-it:free`
- `meta-llama/llama-3.1-8b-instruct:free`
- `microsoft/phi-3-mini-128k-instruct:free`

**To Change Model:** Add to `.env` file:
```env
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

## 🚀 Development Setup

### Local Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --port 8001
```

### Docker

```bash
# Build and run with Docker
docker build -t ai-service .
docker run -p 8001:8001 --env-file .env ai-service
```

## 📡 API Endpoints

### POST /evaluate

**Description:** Analyzes an aquarium setup and provides AI recommendations.

**Request Body:**
```json
{
  "owner_email": "user@example.com",
  "tank_name": "My Test Aquarium",
  "tank_length": 36,
  "tank_width": 18,
  "tank_height": 24,
  "water_type": "freshwater",
  "fish_data": [
    {
      "name": "Neon Tetra",
      "quantity": 6
    },
    {
      "name": "Guppy",
      "quantity": 2
    }
  ],
  "comments": "Testing compatibility"
}
```

**Response:**
```json
{
  "status": "success",
  "response": "## Aquarium Assessment:\n\n**Tank Volume:** 67.3 gallons\n\n**Bioload:** Low - excellent capacity remaining\n\n**Compatibility:** Neon Tetras and Guppies are both peaceful community fish...\n\n**Rating:** 8/10"
}
```

### GET /

**Description:** Health check endpoint.

**Response:**
```json
{
  "Hello": "ai-service"
}
```

## 🧠 AI Features

### Automatic Tank Calculations
- **Volume Calculation**: `(L × W × H) ÷ 231 = gallons`
- **Liter Conversion**: `gallons × 3.785 = liters`
- **Bioload Estimate**: Conservative stocking capacity
- **Surface Area**: For oxygen exchange calculations

### Fish Expertise
- **Schooling Requirements**: Warns about solitary schooling fish
- **Compatibility Analysis**: Temperature, pH, behavior compatibility
- **Size Considerations**: Adult size vs tank capacity
- **Water Parameters**: Freshwater vs saltwater requirements
- **Swimming Levels**: Top, middle, bottom dwellers

### Smart System Features
- **Response Validation**: Detects AI failures (< 50 characters)
- **Intelligent Fallbacks**: Provides reasonable advice when AI fails
- **Comprehensive Logging**: Request/response tracking for debugging
- **Error Handling**: Graceful degradation with meaningful error messages

## 💡 Usage Examples

### Interactive Fish Selection Flow

```bash
# 1. Start with single fish (triggers schooling warning)
curl -X POST http://localhost:8001/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "owner_email": "test@example.com",
    "tank_name": "Community Tank",
    "tank_length": 36,
    "tank_width": 18,
    "tank_height": 24,
    "water_type": "freshwater",
    "fish_data": [{"name": "Neon Tetra", "quantity": 1}],
    "comments": "First fish selection"
  }'

# 2. Add proper school (improves rating)
curl -X POST http://localhost:8001/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "owner_email": "test@example.com",
    "tank_name": "Community Tank",
    "tank_length": 36,
    "tank_width": 18,
    "tank_height": 24,
    "water_type": "freshwater",
    "fish_data": [{"name": "Neon Tetra", "quantity": 6}],
    "comments": "Added proper school"
  }'

# 3. Test problematic combination (compatibility warning)
curl -X POST http://localhost:8001/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "owner_email": "test@example.com",
    "tank_name": "Community Tank",
    "tank_length": 36,
    "tank_width": 18,
    "tank_height": 24,
    "water_type": "freshwater",
    "fish_data": [
      {"name": "Neon Tetra", "quantity": 6},
      {"name": "Betta Fish", "quantity": 1}
    ],
    "comments": "Testing Betta compatibility"
  }'
```

## 🔧 OpenRouter Integration

### Client Configuration
```python
# services/aqua_service.py
client = openai.OpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url=settings.OPENROUTER_API_BASE.rstrip('/').replace('/chat/completions', '')
)
```

### API Call Parameters
```python
response = client.chat.completions.create(
    model=settings.OPENROUTER_MODEL,
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt}
    ],
    max_tokens=800,
    temperature=0.8,
    top_p=0.95,
    stop=None
)
```

### System Prompt
```python
SYSTEM_PROMPT = """
You are an expert aquarium consultant. Analyze the provided aquarium setup and give professional advice about fish compatibility, tank capacity, and recommendations.

Be concise and practical in your response.
"""
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=services --cov-report=html
```

### Test Structure
- **Unit Tests**: Mock OpenRouter API calls
- **Integration Tests**: Full request/response cycle
- **Validation Tests**: Input validation and error handling
- **Fallback Tests**: Short response handling

## 🐛 Debugging & Troubleshooting

### Enable Debug Logging
```python
# config.py
DEBUG = True
```

### Check Logs
```bash
# Docker logs
docker logs ai-service --tail 50

# Live logs
docker logs ai-service -f
```

### Common Issues

#### 1. API Key Missing
```
ValidationError: OPENROUTER_API_KEY Field required
```
**Solution**: Add `OPENROUTER_API_KEY=your_key` to `.env` file

#### 2. Model Not Available
```
Error code: 404 - No endpoints found for model
```
**Solution**: Use a valid model from the free tier list

#### 3. Short AI Responses
The service automatically detects and handles responses < 50 characters with intelligent fallbacks.

#### 4. Network Issues
```
502 Bad Gateway
```
**Solution**: Check if AI service container is running: `docker ps`

### Performance Monitoring

**Typical Metrics:**
- Response Time: 2-5 seconds
- Success Rate: >95% (with fallbacks)
- Fallback Activation: <5% of requests

**Logged Information:**
- Request/response times
- AI response lengths
- Fallback activation
- Error frequencies

## 🔄 Data Models

### AquariumLayout (Input)
```python
class AquariumLayout(BaseModel):
    owner_email: EmailStr
    tank_name: str
    tank_length: int    # inches
    tank_width: int     # inches  
    tank_height: int    # inches
    water_type: str     # "freshwater" or "saltwater"
    fish_data: List[FishEntry]
    comments: Optional[str] = None
```

### FishEntry
```python
class FishEntry(BaseModel):
    name: str      # e.g., "Neon Tetra"
    quantity: int  # number of fish
```

### AIResponse (Output)
```python
class AIResponse(BaseModel):
    status: str     # "success" or "error"
    response: str   # AI-generated advice
```

## 📊 Monitoring & Health Checks

### Health Check
```bash
curl http://localhost:8001/
# Response: {"Hello": "ai-service"}
```

### Service Status
```bash
# Check if service is responding
curl -X POST http://localhost:8001/evaluate \
  -H "Content-Type: application/json" \
  -d '{"owner_email":"test@test.com","tank_name":"Test","tank_length":20,"tank_width":10,"tank_height":12,"water_type":"freshwater","fish_data":[{"name":"Test Fish","quantity":1}]}'
```

## 🚀 Deployment

### Production Considerations
- **API Keys**: Use secure secret management
- **Rate Limiting**: Monitor OpenRouter usage
- **Logging**: Implement centralized logging
- **Monitoring**: Set up health checks and alerts

### Environment Variables
```env
# Production .env
OPENROUTER_API_KEY=your_production_key
OPENROUTER_MODEL=google/gemma-2-9b-it:free
DEBUG=False
```

## 📄 API Documentation

When running, interactive API documentation is available at:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

---

**Built with ❤️ for the aquarium community** 🐠

For questions or contributions, please see the main project README. 