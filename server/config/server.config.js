/**
 * Server configuration for Express application.
 * Centralizes server settings, especially for Render deployment.
 */

/**
 * Server port configuration
 * Render provides PORT environment variable, fallback to 3001 for local development
 */
export const PORT = process.env.PORT || 3001;

/**
 * Environment configuration
 */
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

/**
 * Paths configuration
 */
export const PATHS = {
  // Static files directory (Vite build output)
  STATIC_DIR: '../dist',
  // Public directory (if needed)
  PUBLIC_DIR: '../public',
};

/**
 * API routes configuration
 */
export const API_ROUTES = {
  HEALTH: '/api/health',
  // Add more API routes here as needed
};

/**
 * CORS configuration (if needed in future)
 */
export const CORS_CONFIG = {
  // CORS settings can be added here when needed
  enabled: false,
  origin: '*',
};

/**
 * Server metadata
 */
export const SERVER_INFO = {
  name: 'Launchpad API',
  version: '1.0.0',
};

