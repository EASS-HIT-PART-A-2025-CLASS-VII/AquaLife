# 🎨 Frontend Service

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Modern, responsive React UI with lightning-fast Vite development experience**

</div>

## 🎯 Overview

The Frontend Service provides the React + Vite-based user interface for the AquaLife application, offering an intuitive and responsive experience for aquarium management. Built with modern web technologies for optimal performance and developer experience.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         NGINX PROXY                            │
│            (Rate Limiting, Caching, Security)                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                    REACT APPLICATION                           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages/    │  │ Components/ │  │       Services/         │  │
│  │   Routes    │  │  UI Library │  │     API Clients         │  │
│  │             │  │             │  │                         │  │
│  │• Dashboard  │  │• Aquarium   │  │• Backend API (:8000)    │  │
│  │• Tank Mgmt  │  │• Fish Cards │  │• AI Service  (:8001)    │  │
│  │• Analytics  │  │• UI Kit     │  │• Auth Service           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              ZUSTAND STATE MANAGEMENT                       │  │
│  │        • User State • Aquarium Data • UI State             │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
frontend/
├── 🎨 src/                         # Source code
│   ├── components/                # Reusable UI components
│   │   ├── ui/                   # Base UI components (Radix-based)
│   │   │   ├── card.tsx          # Card component
│   │   │   ├── input.tsx         # Input components
│   │   │   ├── label.tsx         # Label component
│   │   │   ├── tabs.tsx          # Tab navigation
│   │   │   └── toast.tsx         # Toast notifications
│   │   ├── aquarium/             # Aquarium-specific components
│   │   │   └── Fish.tsx          # Fish display components
│   │   └── Logo.tsx              # Application logo
│   │
│   ├── pages/                    # Page components
│   │   └── Tank.tsx              # Tank management page
│   │
│   ├── services/                 # API integration services
│   │   ├── api.ts                # Base API configuration
│   │   ├── authService.ts        # Authentication API calls
│   │   ├── aquariumService.ts    # Aquarium API calls
│   │   └── aiService.ts          # AI service integration
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   ├── useAquarium.ts        # Aquarium data hook
│   │   └── useLocalStorage.ts    # Local storage hook
│   │
│   ├── stores/                   # Zustand state stores
│   │   ├── authStore.ts          # User authentication state
│   │   ├── aquariumStore.ts      # Aquarium data state
│   │   └── uiStore.ts            # UI state management
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── auth.ts               # Authentication types
│   │   ├── aquarium.ts           # Aquarium-related types
│   │   └── api.ts                # API response types
│   │
│   ├── utils/                    # Utility functions
│   │   ├── constants.ts          # Application constants
│   │   ├── helpers.ts            # Helper functions
│   │   └── validation.ts         # Form validation
│   │
│   ├── App.tsx                   # Main application component
│   ├── index.tsx                 # Application entry point
│   ├── config.ts                 # Application configuration
│   └── vite-env.d.ts             # Vite environment types
│
├── 🐳 nginx/                       # Nginx configuration
│   ├── nginx.conf                # Main Nginx config
│   ├── default.conf              # HTTP server configuration
│   └── default_SSL.conf          # HTTPS server configuration
│
├── 📦 public/                      # Static public assets
│   ├── favicon.ico               # Application favicon
│   ├── logo192.png               # App logo (192px)
│   ├── logo512.png               # App logo (512px)
│   └── manifest.json             # PWA manifest
│
├── 🔧 Configuration Files
│   ├── index.html                # Main HTML template (Vite entry)
│   ├── vite.config.ts            # Vite build configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── package.json              # npm dependencies and scripts
│   └── Dockerfile                # Container configuration
```

## 🔧 Technology Stack

### Core Framework
- **React 18** - Modern React with concurrent features and hooks
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Lightning-fast build tool and dev server
- **React Router** - Declarative client-side routing

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI primitives
- **Heroicons** - Beautiful hand-crafted SVG icons
- **PostCSS** - CSS processing with modern features

### State Management
- **Zustand** - Lightweight, flexible state management
- **React Query** - Server state management (planned)

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting
- **Vite HMR** - Hot Module Replacement for instant updates

### Build & Deployment
- **Vite Build** - Optimized production builds
- **Nginx** - High-performance web server and proxy
- **Docker** - Containerized deployment

## 🚀 Quick Start

### Prerequisites

```bash
# Required
- Node.js 18+
- npm or yarn

# Optional for development  
- Docker & Docker Compose
- VS Code with React extensions
```

### Local Development Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Start development server
npm run dev
# or alternatively
npm start

# 5. Open browser
# Application will be available at http://localhost:5173
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# === API Configuration ===
VITE_API_BASE_URL=http://localhost:8000
VITE_AI_SERVICE_URL=http://localhost:8001

# === Authentication Configuration ===
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# === Application Settings ===
VITE_APP_NAME=AquaLife
VITE_APP_VERSION=1.0.0

# === Development Settings ===
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

> **Note**: After migrating to Vite, environment variables now use the `VITE_` prefix instead of `REACT_APP_`.

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': 'http://localhost:8000',
      '/ai': 'http://localhost:8001'
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-label', '@radix-ui/react-slot']
        }
      }
    }
  }
})
```

## 🎯 Application Flow

1. **Application Initialization**:
   - Vite serves `index.html` which loads `src/index.tsx`
   - React app is mounted to the DOM
   - App component sets up routing and global state
   - Authentication state is restored from localStorage

2. **User Interface Flow**:
   - Pages represent different application views
   - Components are reused across pages with consistent styling
   - Hooks manage state and side effects
   - Services handle API communication

3. **Data Flow**:
   - **Zustand stores** manage application state
   - **Services** communicate with backend APIs
   - **Hooks** provide reactive data to components
   - **Components** render data and handle user interactions

4. **Build Process**:
   - **Development**: Vite provides instant HMR and TypeScript compilation
   - **Production**: Optimized builds with code splitting and tree shaking
   - **Deployment**: Nginx serves static assets with caching and compression

## 🌐 Key Features

### Aquarium Management
- **Real-time Dashboard** - Live aquarium monitoring
- **Fish Management** - Add, edit, and track fish inventory
- **Equipment Tracking** - Monitor filters, heaters, and lighting
- **Maintenance Scheduling** - Automated maintenance reminders

### AI Integration
- **Compatibility Analysis** - AI-powered fish compatibility checking
- **Smart Recommendations** - Personalized aquarium advice
- **Health Monitoring** - AI-assisted health assessments
- **Troubleshooting** - Intelligent problem diagnosis

### User Experience
- **Responsive Design** - Mobile-first, works on all devices
- **Dark/Light Mode** - Adaptive theming (planned)
- **Progressive Web App** - Offline capabilities (planned)
- **Accessibility** - WCAG 2.1 compliant components

## 🔒 Security Features

### Authentication
- **JWT Token Management** - Secure token storage and renewal
- **Google OAuth** - Social login integration
- **Route Protection** - Protected routes for authenticated users
- **Session Management** - Automatic logout on token expiry

### Data Protection
- **Input Validation** - Client-side form validation
- **XSS Prevention** - Sanitized user inputs
- **CSRF Protection** - Anti-CSRF tokens where needed
- **Secure Storage** - Encrypted local storage for sensitive data

## 🏗️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server with HMR
npm start           # Alternative dev server command

# Building
npm run build       # Create optimized production build
npm run preview     # Preview production build locally

# Testing
npm test           # Run test suite
npm run test:watch # Run tests in watch mode
npm run test:coverage # Generate test coverage report

# Linting & Formatting
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues automatically
npm run format     # Format code with Prettier

# Type Checking
npm run type-check # Run TypeScript compiler check
```

### Build Performance

#### Vite vs Create React App Comparison

| Metric | Create React App | Vite | Improvement |
|--------|------------------|------|-------------|
| **Dev Server Start** | 10-30 seconds | < 1 second | ⚡ 30x faster |
| **HMR Updates** | 2-5 seconds | < 100ms | ⚡ 20x faster |
| **Build Time** | 45-60 seconds | 15-20 seconds | ⚡ 3x faster |
| **Bundle Size** | Larger | Smaller | 🗜️ Better tree-shaking |

#### Production Build Output

```bash
✓ 1247 modules transformed.
build/index.html                   0.69 kB │ gzip:  0.40 kB
build/assets/vendor-Gm9i_4Ku.js   141.26 kB │ gzip: 45.40 kB
build/assets/index-CvYxIq9L.js     74.69 kB │ gzip: 20.54 kB  
build/assets/router-BThwlY6Z.js    19.02 kB │ gzip:  7.18 kB
build/assets/index-DOADTNv5.css    18.00 kB │ gzip:  4.08 kB
```

## 🧪 Testing

### Testing Strategy
- **Unit Tests** - Component testing with React Testing Library
- **Integration Tests** - User flow testing
- **E2E Tests** - End-to-end testing with Playwright (planned)
- **Visual Regression** - Screenshot testing (planned)

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🐳 Docker Deployment

### Multi-stage Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

The frontend includes production-ready Nginx configuration:

- **Static Asset Caching** - Long-term caching for JS/CSS/images
- **Gzip Compression** - Reduced bandwidth usage
- **Security Headers** - XSS and clickjacking protection  
- **API Proxying** - Backend and AI service routing
- **Rate Limiting** - Protection against abuse

## 📊 Performance Optimization

### Build Optimizations
- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Elimination of unused code
- **Asset Optimization** - Image compression and optimization
- **Bundle Analysis** - Bundle size monitoring

### Runtime Optimizations
- **React.memo** - Component memoization
- **useMemo/useCallback** - Hook optimization
- **Lazy Loading** - Component lazy loading
- **Service Workers** - Caching and offline support (planned)

## 🔄 Migration from Create React App

This project was successfully migrated from Create React App to Vite:

### ✅ Migration Benefits
- **⚡ 30x faster** dev server startup
- **🔥 Instant HMR** updates (< 100ms)
- **📦 Smaller bundles** with better tree-shaking
- **🧹 Cleaner dependencies** (removed 1,167 packages, added only 10)
- **🔧 Better dev tools** with native ESM support

### 🔧 Key Changes Made
- Replaced `react-scripts` with Vite and plugins
- Moved `index.html` from `public/` to root directory
- Updated environment variables from `REACT_APP_*` to `VITE_*`
- Added `vite.config.ts` for build configuration
- Updated npm scripts for new workflow

### 🔄 Compatibility
- ✅ All existing React components work unchanged
- ✅ Same build output directory (`build/`) for deployment
- ✅ Docker build process remains identical
- ✅ All dependencies maintained compatibility

## 📚 Documentation & Resources

### Component Library
- **Storybook** (planned) - Interactive component documentation
- **Style Guide** - Design system documentation
- **API Integration** - Backend service integration guide

### External Resources
- [React Documentation](https://reactjs.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)

---

<div align="center">

**Built with React + Vite for lightning-fast development experience**

[Live Demo](http://localhost) • [Report Issues](https://github.com/your-username/AquaLife/issues) • [Component Library](http://localhost:6006)

</div> 