# Frontend Service

The Frontend Service provides the React + Vite-based user interface for the AquaLife application, offering an intuitive experience for aquarium management.

## Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management

## Directory Structure

```
frontend/
├── build/                   # Production build output (Vite)
├── index.html              # Main HTML template (Vite entry point)
├── vite.config.ts          # Vite configuration
├── Dockerfile              # Docker configuration
├── nginx/                  # Nginx configuration for production
│   └── nginx.conf          # Nginx server config
├── package.json            # npm dependencies and scripts
├── package-lock.json       # Locked npm dependencies
├── postcss.config.js       # PostCSS configuration
├── public/                 # Static public assets
├── README.md               # This documentation
├── src/                    # Source code
│   ├── vite-env.d.ts       # Vite environment types
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API clients and services
│   ├── config.ts           # Application configuration
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Flow

1. **Application Initialization**:
   - Vite serves `index.html` which loads `src/index.tsx`
   - React app is mounted to the DOM
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

4. **Build Process**:
   - Vite provides instant hot module replacement (HMR)
   - TypeScript compilation and type checking
   - Optimized production builds with code splitting

5. **Styling**:
   - Tailwind CSS provides utility-based styling
   - PostCSS for CSS processing
   - Component-specific styles when needed

## Development

### Local Setup

```bash
# Install dependencies
npm install

# Run development server (Vite)
npm run dev
# or alternatively
npm start

# Preview production build
npm run preview
```

### Building for Production

```bash
# Create optimized production build
npm run build
```

#### Build Output Example
```
build/assets/vendor-Gm9i_4Ku.js   141.26 kB │ gzip: 45.40 kB
build/assets/index-CvYxIq9L.js     74.69 kB │ gzip: 20.54 kB  
build/assets/router-BThwlY6Z.js    19.02 kB │ gzip:  7.18 kB
build/assets/index-DOADTNv5.css    18.00 kB │ gzip:  4.08 kB
```

### Environment Variables

Create a `.env.local` file with the following variables:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_AI_SERVICE_URL=http://localhost:8001
```

Note: After migrating to Vite, environment variables now use the `VITE_` prefix instead of `REACT_APP_`.

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

## Migration from Create React App

This project was successfully migrated from Create React App to Vite for improved performance:

### Performance Improvements
- **Faster dev server**: Instant startup vs 10-30 seconds with CRA
- **Hot Module Replacement**: Millisecond updates instead of seconds  
- **Smaller bundles**: Better tree-shaking and code splitting
- **Reduced dependencies**: Removed 1,167 packages, added only 10

### Key Changes Made
- Replaced `react-scripts` with Vite
- Moved `index.html` from `public/` to root
- Updated environment variables from `REACT_APP_*` to `VITE_*`
- Added `vite.config.ts` for build configuration
- Updated scripts: `npm run dev` for development

### Compatibility
- All existing React components work unchanged
- Docker build process remains the same
- Same output directory (`build/`) for deployment

## Key Features

- Real-time aquarium monitoring
- Fish and equipment management
- AI-powered recommendations
- Maintenance scheduling
- Mobile-responsive design 