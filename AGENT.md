# Agent Documentation

This document provides comprehensive information for AI agents working on this project. It covers architecture, patterns, conventions, and workflows to enable efficient development.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Render Deployment](#render-deployment)
4. [Project Structure](#project-structure)
5. [Coding Conventions](#coding-conventions)
6. [Common Patterns](#common-patterns)
7. [Adding New Mini-Apps](#adding-new-mini-apps)
8. [Adding API Endpoints](#adding-api-endpoints)
9. [File Organization Rules](#file-organization-rules)
10. [Dependencies](#dependencies)
11. [Development Workflow](#development-workflow)

## Project Overview

**Launchpad - Mini Apps Collection** is a React-based application that serves as a hub for mini-apps (primarily games). It provides a clean, modern interface to browse and launch various mini-applications.

### Key Characteristics

- **Frontend**: React 18+ with React Router v6 for client-side routing
- **Backend**: Express.js server that serves the built React app and provides API endpoints
- **Build Tool**: Vite for fast development and optimized production builds
- **Deployment**: Render.com (primary hosting platform)
- **State Management**: React Context API (ThemeContext)
- **Styling**: CSS modules with theme support (light/dark mode)

## Architecture

### High-Level Architecture

The application follows a **build-then-serve** architecture optimized for Render:

1. **Development**: Vite dev server runs React app directly (port 3000)
2. **Production**: Vite builds React app → Express serves static files from `dist/` directory
3. **Routing**: React Router handles client-side routing; Express serves `index.html` for all routes

### Component Hierarchy

```
App (ThemeProvider + Router)
├── Launchpad (Home page with app grid)
│   ├── HamburgerMenu (Navigation)
│   └── AppCard (App tiles)
├── SnakeGame (Mini-app)
└── PlatformerGame (Mini-app)
```

### Data Flow

- **Theme State**: ThemeContext → Components (via `useTheme` hook)
- **Navigation**: React Router → Components (via `useNavigate`, `useLocation`)
- **App Registry**: Centralized in `src/constants/apps.js`
- **Routes**: Centralized in `src/constants/routes.js`

## Render Deployment

### Build/Serve Architecture

The project uses a **two-stage deployment** pattern:

1. **Build Stage**: `npm install && npm run build`
   - Installs dependencies
   - Vite builds React app to `dist/` directory
   - Creates optimized production bundle

2. **Serve Stage**: `npm start`
   - Express server starts on Render-provided PORT
   - Serves static files from `dist/` directory
   - Handles API routes (`/api/*`)
   - Serves `index.html` for all other routes (SPA routing)

### Environment Variables

Render automatically provides:
- `PORT`: Server port (required, provided by Render)
- `NODE_ENV`: Set to `production` in Render

Optional (can be added in Render dashboard):
- `VITE_API_BASE_URL`: Base URL for API requests (if different from same origin)

### Health Check Pattern

The application implements a health check endpoint for Render monitoring:

- **Endpoint**: `/api/health`
- **Method**: GET
- **Response**: JSON with status, message, and timestamp
- **Location**: `server/routes/health.js`

Render is configured to use this endpoint via `render.yaml`:
```yaml
healthCheckPath: /api/health
```

### Static File Serving

Express serves static files using:
```javascript
app.use(express.static(path.join(__dirname, '../dist')));
```

This serves all files from the Vite build output directory. The catch-all route (`app.get('*', ...)`) must be **last** to allow API routes and static files to be served first.

### Deployment Workflow

1. **Render Build Process**:
   - Runs `npm install` (installs dependencies)
   - Runs `npm run build` (builds React app)
   - Creates `dist/` directory with production assets

2. **Render Start Process**:
   - Runs `npm start` (starts Express server)
   - Server listens on Render-provided PORT
   - Health check endpoint becomes available

3. **File Structure on Render**:
   ```
   /app
   ├── dist/              # Vite build output (served statically)
   ├── server/            # Express server code
   ├── package.json
   └── render.yaml        # Render configuration
   ```

## Project Structure

```
helloworld/
├── server/                    # Express server
│   ├── config/
│   │   └── server.config.js   # Server configuration (PORT, paths, etc.)
│   ├── routes/
│   │   ├── index.js           # Route aggregator
│   │   └── health.js          # Health check route
│   ├── middleware/            # Express middleware (future)
│   └── server.js              # Main Express app
├── src/
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── AppCard.jsx
│   │   │   ├── HamburgerMenu.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── HomeButton.jsx
│   │   └── games/             # Game/mini-app components
│   │       ├── SnakeGame.jsx
│   │       └── PlatformerGame.jsx
│   ├── features/
│   │   └── launchpad/         # Launchpad feature
│   │       └── Launchpad.jsx
│   ├── contexts/              # React contexts
│   │   └── ThemeContext.jsx
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   ├── constants/             # Constants and configuration
│   │   ├── routes.js          # Route definitions
│   │   └── apps.js            # Mini-app registry
│   ├── config/                # Application configuration
│   │   └── app.config.js      # App-wide config
│   ├── styles/                # CSS files
│   ├── App.jsx                # Main app component (routing)
│   └── index.jsx              # React entry point
├── public/                    # Static assets (if any)
├── dist/                      # Vite build output (gitignored)
├── package.json
├── vite.config.js
├── render.yaml                 # Render deployment config
├── AGENT.md                    # This file
├── ARCHITECTURE.md             # Technical architecture
└── README.md                   # User-facing documentation
```

### Directory Purposes

- **`server/`**: Express server code, organized by concern (routes, config, middleware)
- **`src/components/ui/`**: Reusable UI components used across the app
- **`src/components/games/`**: Mini-app/game components (self-contained applications)
- **`src/features/`**: Feature-specific components (e.g., launchpad)
- **`src/constants/`**: Centralized constants (routes, app registry)
- **`src/config/`**: Application configuration
- **`src/hooks/`**: Custom React hooks for reusable logic
- **`src/utils/`**: Pure utility functions
- **`src/contexts/`**: React Context providers
- **`src/styles/`**: CSS files (one per component typically)

## Coding Conventions

### Naming Conventions

- **Components**: PascalCase (e.g., `AppCard.jsx`, `SnakeGame.jsx`)
- **Files**: Match component name exactly
- **Functions**: camelCase (e.g., `handleClick`, `toggleMenu`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ROUTES`, `API_CONFIG`)
- **Hooks**: camelCase starting with `use` (e.g., `useTheme`, `useGameLoop`)
- **CSS Classes**: kebab-case (e.g., `app-card`, `hamburger-button`)

### Code Style Patterns

1. **Imports**: Group by type, then alphabetically
   ```javascript
   // React imports first
   import React, { useState, useEffect } from 'react';
   import { useNavigate, useLocation } from 'react-router-dom';
   
   // Local imports (components)
   import AppCard from './AppCard';
   import HamburgerMenu from './HamburgerMenu';
   
   // Local imports (styles)
   import '../styles/Launchpad.css';
   ```

2. **Component Structure**:
   ```javascript
   // 1. Imports
   // 2. Component function
   function ComponentName() {
     // 3. Hooks
     // 4. State
     // 5. Effects
     // 6. Handlers
     // 7. Render
     return (...);
   }
   // 8. Export
   export default ComponentName;
   ```

3. **Export Patterns**:
   - Default export for components
   - Named exports for utilities, constants, configs

### Import Organization

1. External libraries (React, React Router, etc.)
2. Internal components
3. Contexts/hooks
4. Utilities/constants/config
5. Styles

## Common Patterns

### Theme Context Usage

```javascript
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, changeTheme } = useTheme();
  
  // Use theme for conditional styling
  const className = `my-component ${theme}`;
  
  // Toggle theme
  const handleToggle = () => {
    changeTheme(theme === 'light' ? 'dark' : 'light');
  };
}
```

Theme is applied via `data-theme` attribute on `<html>` element. CSS uses attribute selectors:
```css
[data-theme="light"] { /* light theme styles */ }
[data-theme="dark"] { /* dark theme styles */ }
```

### Routing Patterns

**Using centralized routes:**
```javascript
import { ROUTES } from '../constants/routes';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(ROUTES.SNAKE);
  };
}
```

**Route definitions in App.jsx:**
```javascript
import { ROUTES } from './constants/routes';
import SnakeGame from './components/games/SnakeGame';

<Route path={ROUTES.SNAKE} element={<SnakeGame />} />
```

### Component Structure

**Standard component pattern:**
```javascript
import React, { useState } from 'react';
import './ComponentName.css';

function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  
  const handleAction = () => {
    // Handler logic
  };
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

### State Management Approach

- **Local State**: `useState` for component-specific state
- **Shared State**: React Context (currently only ThemeContext)
- **URL State**: React Router (`useLocation`, `useNavigate`)
- **No Global State Library**: Intentionally simple; add Redux/Zustand only if needed

### Server Route Patterns

**Adding a new API route:**

1. Create route handler in `server/routes/`:
```javascript
// server/routes/myRoute.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello' });
});

export default router;
```

2. Add to route aggregator:
```javascript
// server/routes/index.js
import myRoute from './myRoute.js';
import { API_ROUTES } from '../config/server.config.js';

router.use(API_ROUTES.MY_ROUTE, myRoute);
```

3. Update server config if needed:
```javascript
// server/config/server.config.js
export const API_ROUTES = {
  HEALTH: '/api/health',
  MY_ROUTE: '/api/my-route',
};
```

## Adding New Mini-Apps

Follow these steps to add a new mini-app:

### Step 1: Create the Component

Create the component in `src/components/games/YourGame.jsx`:

```javascript
import React from 'react';
import '../../styles/YourGame.css';

function YourGame() {
  return (
    <div className="your-game">
      {/* Your game implementation */}
    </div>
  );
}

export default YourGame;
```

### Step 2: Add Route Constant

Add to `src/constants/routes.js`:

```javascript
export const ROUTES = {
  HOME: '/',
  SNAKE: '/snake',
  PLATFORMER: '/platformer',
  YOUR_GAME: '/your-game',  // Add this
};
```

### Step 3: Add App Registry Entry

Add to `src/constants/apps.js`:

```javascript
export const APPS = [
  // ... existing apps
  {
    id: 'your-game',
    title: 'Your Game',
    description: 'Description of your game',
    icon: '🎮',
    path: ROUTES.YOUR_GAME,
  },
];
```

### Step 4: Add Route in App.jsx

Add to `src/App.jsx`:

```javascript
import YourGame from './components/games/YourGame';
import { ROUTES } from './constants/routes';

<Route path={ROUTES.YOUR_GAME} element={<YourGame />} />
```

### Step 5: (Optional) Add to Menu

If you want it in the hamburger menu, it will automatically appear if `showInMenu: true` is set in `ROUTE_METADATA` in `src/constants/routes.js`.

### Step 6: Create Styles

Create `src/styles/YourGame.css` with your component styles.

## Adding API Endpoints

To add a new API endpoint for a mini-app:

### Step 1: Create Route Handler

Create `server/routes/yourEndpoint.js`:

```javascript
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ data: 'your data' });
});

// Add more routes as needed
router.post('/', (req, res) => {
  // Handle POST request
});

export default router;
```

### Step 2: Add to Route Aggregator

Update `server/routes/index.js`:

```javascript
import yourEndpointRouter from './yourEndpoint.js';
import { API_ROUTES } from '../config/server.config.js';

router.use(API_ROUTES.YOUR_ENDPOINT, yourEndpointRouter);
```

### Step 3: Add Route Constant

Update `server/config/server.config.js`:

```javascript
export const API_ROUTES = {
  HEALTH: '/api/health',
  YOUR_ENDPOINT: '/api/your-endpoint',
};
```

### Step 4: Use in Frontend

In your component:

```javascript
import { API_CONFIG } from '../config/app.config.js';

const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.YOUR_ENDPOINT}`);
const data = await response.json();
```

## File Organization Rules

### Where to Put Files

- **UI Components**: `src/components/ui/` - Reusable across the app
- **Game Components**: `src/components/games/` - Self-contained mini-apps
- **Feature Components**: `src/features/[feature-name]/` - Feature-specific components
- **Custom Hooks**: `src/hooks/` - Reusable logic hooks
- **Utilities**: `src/utils/` - Pure functions, helpers
- **Constants**: `src/constants/` - Route definitions, app registry, constants
- **Config**: `src/config/` - Application configuration
- **Contexts**: `src/contexts/` - React Context providers
- **Styles**: `src/styles/` - CSS files (one per component typically)
- **Server Routes**: `server/routes/` - API route handlers
- **Server Middleware**: `server/middleware/` - Express middleware
- **Server Config**: `server/config/` - Server configuration

### File Naming

- Components: `ComponentName.jsx`
- Styles: `ComponentName.css` (matches component name)
- Hooks: `useHookName.js`
- Utils: `utilityName.js`
- Constants: `constantName.js` (e.g., `routes.js`, `apps.js`)
- Config: `configName.config.js` (e.g., `app.config.js`)

## Dependencies

### Key Dependencies

- **react** (^18.2.0): React library
- **react-dom** (^18.2.0): React DOM rendering
- **react-router-dom** (^6.20.1): Client-side routing
- **express** (^4.18.2): Server framework
- **vite** (^7.3.0): Build tool and dev server
- **@vitejs/plugin-react** (^4.2.1): Vite plugin for React

### Dependency Purposes

- **React**: UI framework
- **React Router**: Client-side routing (SPA navigation)
- **Express**: Serves static files and provides API endpoints
- **Vite**: Fast development server and optimized production builds

## Development Workflow

### Local Development

1. **Start Vite dev server**:
   ```bash
   npm run dev
   ```
   - Runs on `http://localhost:3000`
   - Hot module replacement enabled
   - Fast refresh for React components

2. **Development with Express** (to test production setup):
   ```bash
   npm run build  # Build React app
   npm start      # Start Express server
   ```
   - Express server runs on `http://localhost:3001` (or PORT env var)

### Production Testing

Before deploying to Render, test the production build locally:

```bash
npm run build
npm start
```

Verify:
- Static files are served correctly
- API endpoints work (`/api/health`)
- Client-side routing works (navigate between pages)
- All routes serve `index.html` correctly

### Render Deployment Process

1. **Push to Git**: Render watches your repository
2. **Automatic Build**: Render runs `npm install && npm run build`
3. **Automatic Start**: Render runs `npm start`
4. **Health Check**: Render monitors `/api/health` endpoint

### Common Commands

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build (Vite preview server)
- `npm start` - Start Express server (production)
- `npm run server` - Alias for `npm start`

## Best Practices for Agents

1. **Always use centralized config**: Use `ROUTES`, `APPS` constants instead of hardcoding
2. **Follow file organization**: Put files in the correct directories
3. **Maintain consistency**: Follow existing patterns and conventions
4. **Test locally**: Test production build before suggesting changes
5. **Consider Render**: Remember the build-then-serve architecture
6. **Update docs**: If adding new patterns, update this document
7. **Health checks**: Keep health check endpoint simple and fast
8. **Static serving**: Ensure catch-all route is last in Express middleware chain

## Questions?

If you encounter patterns not covered here:
1. Check existing code for similar patterns
2. Follow React and Express best practices
3. Consider Render deployment constraints
4. Update this document with new patterns

