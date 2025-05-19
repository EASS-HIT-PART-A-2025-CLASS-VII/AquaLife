# Frontend Service

The Frontend Service provides the React-based user interface for the AquaLife application, offering an intuitive experience for aquarium management.

## Directory Structure

```
frontend/
├── build/                   # Production build output
├── Dockerfile               # Docker configuration
├── nginx/                   # Nginx configuration for production
│   └── nginx.conf           # Nginx server config
├── package.json             # npm dependencies and scripts
├── package-lock.json        # Locked npm dependencies
├── postcss.config.js        # PostCSS configuration
├── public/                  # Static public assets
├── README.md                # This documentation
├── src/                     # Source code
│   ├── assets/              # Images, fonts, and other static files
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── services/            # API clients and services
│   ├── App.js               # Main application component
│   └── index.js             # Application entry point
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Flow

1. **Application Initialization**:
   - The application starts in `index.js`
   - App component is rendered, which sets up routing
   - Initial state is loaded

2. **User Interface**:
   - Pages represent different views in the application
   - Components are reused across pages
   - Hooks manage state and side effects

3. **Data Flow**:
   - Services connect to the backend API
   - Hooks consume services and provide data to components
   - Components render data and handle user interactions

4. **Styling**:
   - Tailwind CSS provides utility-based styling
   - Component-specific styles when needed

## Development

### Local Setup

```bash
# Install dependencies
npm install

# Run development server
npm start
```

### Building for Production

```bash
# Create optimized production build
npm run build
```

### Environment Variables

Create a `.env` file with the following variables:

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_AI_SERVICE_URL=http://localhost:8001
```

### Docker

```bash
# Build and run with Docker
docker build -t frontend-service .
docker run -p 80:80 frontend-service
```

## Testing

```bash
# Run tests
npm test
```

## Key Features

- Real-time aquarium monitoring
- Fish and equipment management
- AI-powered recommendations
- Maintenance scheduling
- Mobile-responsive design 