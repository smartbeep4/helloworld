import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/index.js';
import { PORT, PATHS, SERVER_INFO } from './config/server.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the React app build directory (Vite build output)
app.use(express.static(path.join(__dirname, PATHS.STATIC_DIR)));

// Mount API routes
app.use('/api', apiRoutes);

// Catch-all handler: send back React's index.html file for client-side routing
// This must be last to allow API routes and static files to be served first
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, PATHS.STATIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`${SERVER_INFO.name} v${SERVER_INFO.version} is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

