# Launchpad - Mini Apps Collection

A React-based launchpad application that serves as a hub for mini-apps, starting with a classic Snake game.

## Documentation

- **[AGENT.md](AGENT.md)** - Comprehensive guide for AI agents working on this project
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture and system design

## Features

- 🚀 **Launchpad Interface**: Clean, modern interface to browse and launch mini-apps
- 🐍 **Snake Game**: Full-featured browser-based snake game with:
  - Arrow key controls
  - Score tracking
  - Collision detection (walls and self)
  - Game over screen with restart functionality
  - Smooth gameplay

## Tech Stack

- **Frontend**: React 18+ with React Router v6
- **Backend**: Express.js (Node.js)
- **Build Tool**: Vite
- **Deployment**: Render

## Project Structure

```
helloworld/
├── server/                    # Express server
│   ├── config/
│   │   └── server.config.js   # Server configuration
│   ├── routes/
│   │   ├── index.js           # Route aggregator
│   │   └── health.js          # Health check route
│   ├── middleware/            # Express middleware
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
│   ├── App.jsx                # Main app with routing
│   └── index.jsx              # React entry point
├── public/                    # Static assets
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── render.yaml                # Render deployment config
├── AGENT.md                   # Agent documentation
├── ARCHITECTURE.md             # Technical architecture
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the development server:

```bash
npm run dev
```

This will start the Vite development server on `http://localhost:3000`

For production development with the Express server:

1. Build the React app:
   ```bash
   npm run build
   ```

2. Start the Express server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3001` (or the PORT environment variable)

### Deployment on Render

This project is optimized for deployment on [Render.com](https://render.com). The deployment uses a **build-then-serve** architecture:

#### Build Process

1. **Install Dependencies**: `npm install`
2. **Build React App**: `npm run build` (Vite creates optimized production bundle in `dist/`)
3. **Start Express Server**: `npm start` (serves static files from `dist/`)

#### Render Configuration

The `render.yaml` file configures the Render service:

```yaml
services:
  - type: web
    name: launchpad-app
    env: node
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
```

#### How It Works

1. **Build Stage**: Render runs `npm install && npm run build`
   - Vite bundles and optimizes the React app
   - Production assets are created in the `dist/` directory

2. **Runtime Stage**: Render runs `npm start`
   - Express server starts on the PORT provided by Render
   - Static files are served from `dist/` directory
   - API routes are available at `/api/*`
   - All other routes serve `index.html` for client-side routing

3. **Health Monitoring**: Render monitors `/api/health` endpoint
   - Returns server status and timestamp
   - Used by Render to ensure service is running

#### Environment Variables

Render automatically provides:
- `PORT` - Server port (required)
- `NODE_ENV` - Set to `production`

Optional variables (can be added in Render dashboard):
- `VITE_API_BASE_URL` - Base URL for API requests

#### Testing Production Build Locally

Before deploying, test the production build:

```bash
npm run build
npm start
```

Verify:
- Static files are served correctly
- Health check works: `http://localhost:3001/api/health`
- Client-side routing works (navigate between pages)
- All routes serve `index.html` correctly

For more details, see [AGENT.md](AGENT.md#render-deployment) and [ARCHITECTURE.md](ARCHITECTURE.md#render-deployment-architecture).

## Adding New Mini-Apps

To add a new mini-app, follow these steps:

1. **Create the component** in `src/components/games/YourGame.jsx`
2. **Add route constant** in `src/constants/routes.js`:
   ```javascript
   export const ROUTES = {
     // ... existing routes
     YOUR_GAME: '/your-game',
   };
   ```
3. **Add app registry entry** in `src/constants/apps.js`:
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
4. **Add route** in `src/App.jsx`:
   ```javascript
   import YourGame from './components/games/YourGame';
   import { ROUTES } from './constants/routes';
   
   <Route path={ROUTES.YOUR_GAME} element={<YourGame />} />
   ```
5. **Create styles** in `src/styles/YourGame.css`

The app will automatically appear in the launchpad grid. For detailed instructions, see [AGENT.md](AGENT.md#adding-new-mini-apps).

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build the React app for production
- `npm run preview` - Preview the production build locally
- `npm start` - Start the Express server (production)
- `npm run server` - Alias for `npm start`

## License

MIT

