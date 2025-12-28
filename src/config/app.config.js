/**
 * Application-wide configuration.
 * Contains settings that are used across the entire application.
 */

/**
 * API configuration
 */
export const API_CONFIG = {
  // Base URL for API requests (empty string means same origin)
  BASE_URL: process.env.VITE_API_BASE_URL || '',
  // Health check endpoint
  HEALTH_CHECK: '/api/health',
};

/**
 * Application metadata
 */
export const APP_METADATA = {
  NAME: 'Mini Apps Launchpad',
  TITLE: 'Launchpad - Mini Apps',
  DESCRIPTION: 'A React-based launchpad application that serves as a hub for mini-apps',
};

/**
 * Feature flags (for enabling/disabling features)
 */
export const FEATURES = {
  THEME_TOGGLE: true,
  HAMBURGER_MENU: true,
  HOME_BUTTON: true,
};

/**
 * Development configuration
 */
export const DEV_CONFIG = {
  // Enable debug logging in development
  DEBUG: process.env.NODE_ENV === 'development',
};

