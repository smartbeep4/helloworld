# Launchpad - Mini Apps Collection

A React-based launchpad application that serves as a hub for mini-apps, starting with a classic Snake game.

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
├── server/
│   └── server.js              # Express server
├── src/
│   ├── components/
│   │   ├── Launchpad.jsx      # Main launchpad component
│   │   ├── SnakeGame.jsx      # Snake game component
│   │   └── AppCard.jsx        # Card component for app listings
│   ├── App.jsx                # Main app with routing
│   ├── index.jsx              # React entry point
│   └── styles/
│       ├── index.css          # Global styles
│       ├── Launchpad.css      # Launchpad styles
│       └── SnakeGame.css      # Snake game styles
├── public/
│   └── index.html             # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── render.yaml                # Render deployment config
└── README.md
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

This project is configured for deployment on Render:

1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm start`

The `render.yaml` file is provided for easy configuration. Render will:
- Install dependencies
- Build the React app
- Start the Express server
- Serve the application

Make sure your Render service is configured to:
- Use Node.js environment
- Run the build command before starting
- Use the start command to launch the server

## Adding New Mini-Apps

To add a new mini-app:

1. Create a new component in `src/components/`
2. Add a route in `src/App.jsx`
3. Add an app entry in `src/components/Launchpad.jsx`:
   ```javascript
   {
     id: 'new-app',
     title: 'New App',
     description: 'Description of the new app',
     icon: '🎮',
     path: '/new-app',
   }
   ```

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build the React app for production
- `npm run preview` - Preview the production build locally
- `npm start` - Start the Express server (production)
- `npm run server` - Alias for `npm start`

## License

MIT

