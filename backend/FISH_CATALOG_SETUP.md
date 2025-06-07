# 🐠 Fish Catalog System - Complete Setup Guide

## 📋 Overview

The Fish Catalog system provides a complete backend solution for managing aquarium fish data with image support. Users can browse, search, and select fish for their aquarium setups.

## 🏗️ Architecture

```
Frontend (React) → Backend API → Fish Service → Fish Repository → Database
                                     ↓
                              Static File Server (Images)
```

## 📁 File Structure

```
backend/
├── models/
│   └── fish_model.py              # Fish data models (SQLAlchemy + Pydantic)
├── repositories/
│   └── fish_repository.py         # Database operations layer
├── services/
│   └── fish_service.py            # Business logic layer
├── routes/
│   └── fish_routes.py             # API endpoints
├── static/
│   └── images/
│       └── fish/                  # Fish image storage
│           ├── freshwater/        # Freshwater fish images
│           ├── saltwater/         # Saltwater fish images
│           └── README.md          # Image organization guide
├── scripts/
│   ├── seed_fish_data.py          # Database seeding script
│   └── test_fish_api.py           # API testing script
└── main.py                        # FastAPI app with static file serving
```

## 🔧 Components Created

### 1. **Fish Model** (`models/fish_model.py`)
- **SQLAlchemy Model**: `Fish` table with id, name, image_url
- **Pydantic Schemas**: `FishResponse`, `FishCreate` for API serialization
- **Database Table**: `fish_catalog`

### 2. **Fish Repository** (`repositories/fish_repository.py`)
- **CRUD Operations**: Create, Read, Update, Delete
- **Search Functionality**: Name-based search with partial matching
- **Data Validation**: Input validation and error handling

### 3. **Fish Service** (`services/fish_service.py`)
- **Business Logic**: Automatic image URL generation
- **Repository Integration**: Uses FishRepository for data access
- **Type Safety**: Full type hints and return types

### 4. **Fish Routes** (`routes/fish_routes.py`)
- **RESTful API**: Complete CRUD endpoints
- **Search Endpoint**: `/search?q=term` for fish discovery
- **Count Endpoint**: `/count` for catalog statistics

### 5. **Static File Server** (`main.py`)
- **Image Serving**: `/static/images/fish/` URL structure
- **CORS Configuration**: Frontend integration support
- **File Organization**: Categorized by water type and species

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/fish/` | Get all fish (ordered by name) |
| `GET` | `/api/fish/search?q=term` | Search fish by name |
| `GET` | `/api/fish/count` | Get total fish count |
| `GET` | `/api/fish/{id}` | Get fish by ID |
| `GET` | `/api/fish/name/{name}` | Get fish by exact name |
| `POST` | `/api/fish/` | Create new fish |
| `PUT` | `/api/fish/{id}` | Update existing fish |
| `DELETE` | `/api/fish/{id}` | Delete fish |

### Example API Usage

```bash
# Get all fish
curl http://localhost:8000/api/fish/

# Search for tetras
curl "http://localhost:8000/api/fish/search?q=tetra"

# Get fish count
curl http://localhost:8000/api/fish/count

# Create new fish
curl -X POST http://localhost:8000/api/fish/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Blue Tang", "image_url": "/static/images/fish/saltwater/tangs/blue_tang.jpg"}'
```

## 🖼️ Image Storage System

### Directory Structure
```
static/images/fish/
├── freshwater/
│   ├── tetras/           # Neon, Cardinal, Black Skirt
│   ├── cichlids/         # Angelfish, Discus, Rams
│   ├── livebearers/      # Guppies, Mollies, Platies
│   ├── catfish/          # Corydoras, Plecos
│   ├── bettas/           # Betta varieties
│   ├── danios/           # Zebra, Pearl Danios
│   ├── barbs/            # Tiger, Cherry Barbs
│   └── goldfish/         # Goldfish varieties
└── saltwater/
    ├── clownfish/        # Ocellaris, Percula, Maroon
    ├── tangs/            # Blue, Yellow, Powder Blue
    ├── angelfish/        # Queen, French, Flame
    ├── gobies/           # Mandarin, Watchman, Firefish
    ├── wrasses/          # Six Line, Fairy, Cleaner
    └── damsels/          # Blue, Yellowtail Damsels
```

### Image Guidelines
- **Format**: JPG preferred (smaller file size)
- **Size**: 400x300px (4:3 aspect ratio)
- **Naming**: `lowercase_with_underscores.jpg`
- **File Size**: < 500KB per image
- **Quality**: Clear, aquarium environment preferred

### URL Structure
```
http://localhost:8000/static/images/fish/freshwater/tetras/neon_tetra.jpg
http://localhost:8000/static/images/fish/saltwater/clownfish/ocellaris_clownfish.jpg
```

## 🗄️ Database Schema

```sql
CREATE TABLE fish_catalog (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    image_url VARCHAR
);
```

## 🚀 Setup Instructions

### 1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

### 2. **Database Setup**
Ensure your PostgreSQL database is running and configured in `config.py`.

### 3. **Create Tables**
The fish table will be created automatically when you run the application.

### 4. **Seed Database**
```bash
# Seed with popular fish species
python scripts/seed_fish_data.py

# Clear and re-seed
python scripts/seed_fish_data.py --clear

# Clear only (no seeding)
python scripts/seed_fish_data.py --clear-only
```

### 5. **Start Server**
```bash
uvicorn main:app --reload --port 8000
```

### 6. **Test API**
```bash
# Run comprehensive API tests
python scripts/test_fish_api.py
```

## 🧪 Testing

### Automated Testing
```bash
# Test all endpoints
python scripts/test_fish_api.py

# Expected output:
# ✅ GET /api/fish/ - Success! Found X fish
# ✅ GET /api/fish/search - Success! Found Y tetras
# ✅ POST /api/fish/ - Success! Created test fish
# ✅ PUT /api/fish/X - Success! Updated fish
# ✅ DELETE /api/fish/X - Success! Deleted fish
```

### Manual Testing
```bash
# Check API documentation
open http://localhost:8000/docs

# Test static file serving
open http://localhost:8000/static/images/fish/README.md
```

## 📊 Sample Data

The seeding script includes **40+ popular fish species**:

### Freshwater (22 species)
- **Tetras**: Neon, Cardinal, Black Skirt, Serpae
- **Livebearers**: Guppy, Molly, Platy, Swordtail
- **Bettas**: Betta Fish, Crown Tail Betta
- **Cichlids**: Angelfish, Discus, German Blue Ram
- **Catfish**: Corydoras, Bristlenose Pleco, Glass Catfish
- **Others**: Zebra Danio, Pearl Danio, Tiger Barb, Cherry Barb, Goldfish, Fancy Goldfish

### Saltwater (18 species)
- **Clownfish**: Ocellaris, Percula, Maroon
- **Tangs**: Blue, Yellow, Powder Blue
- **Angelfish**: Queen, French, Flame
- **Gobies**: Mandarin, Yellow Watchman, Firefish
- **Wrasses**: Six Line, Fairy, Cleaner
- **Damsels**: Blue, Yellowtail

## 🔄 Integration with AI Service

The fish catalog integrates seamlessly with the AI service:

1. **Frontend**: User selects fish from catalog
2. **Backend**: Validates fish selection
3. **AI Service**: Receives fish data for compatibility analysis
4. **Response**: AI provides expert aquarium advice

### Fish Data Format for AI
```json
{
  "fish_data": [
    {"name": "Neon Tetra", "quantity": 6},
    {"name": "Guppy", "quantity": 2}
  ]
}
```

## 🛠️ Maintenance

### Adding New Fish
1. **Add Image**: Place in appropriate category folder
2. **Create Entry**: Use POST `/api/fish/` endpoint
3. **Test**: Verify image URL accessibility

### Updating Fish Data
```bash
# Update via API
curl -X PUT http://localhost:8000/api/fish/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "image_url": "/new/path.jpg"}'
```

### Backup Considerations
- **Database**: Regular PostgreSQL backups
- **Images**: Backup `static/images/fish/` directory
- **Version Control**: Images can be version controlled if needed

## 🔍 Troubleshooting

### Common Issues

1. **Images Not Loading**
   - Check static file mount in `main.py`
   - Verify file paths and permissions
   - Test: `http://localhost:8000/static/images/fish/README.md`

2. **Database Errors**
   - Ensure PostgreSQL is running
   - Check database connection in `config.py`
   - Verify table creation

3. **API Errors**
   - Check server logs: `uvicorn main:app --reload --log-level debug`
   - Test with: `python scripts/test_fish_api.py`

### Performance Optimization
- **Image Compression**: Optimize images for web
- **Database Indexing**: Add indexes on frequently searched fields
- **Caching**: Consider Redis for frequently accessed fish data

## 📈 Next Steps

1. **Add More Fish**: Expand catalog with regional species
2. **Image Management**: Implement image upload functionality
3. **Categories**: Add fish categories, care levels, water parameters
4. **Frontend Integration**: Build React fish selection component
5. **Advanced Search**: Filter by water type, size, temperament
6. **Admin Panel**: Create admin interface for catalog management

## 🎯 Production Considerations

- **CDN**: Use CDN for image serving in production
- **Database**: Optimize queries and add proper indexing
- **Security**: Implement rate limiting and input validation
- **Monitoring**: Add logging and performance monitoring
- **Backup**: Automated backup strategy for images and data

---

**🐠 Fish Catalog System Ready for Production!** 

The system provides a solid foundation for fish selection and aquarium management with room for future enhancements. 