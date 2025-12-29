/**
 * Centralized mini-app registry.
 * This is the single source of truth for all mini-apps available in the launchpad.
 * 
 * To add a new mini-app:
 * 1. Add an entry to the APPS array below
 * 2. Add the corresponding route in src/constants/routes.js
 * 3. Add the route in src/App.jsx
 * 4. Create the component in src/components/games/ or appropriate location
 */

import { ROUTES } from './routes';

/**
 * Mini-app configuration structure:
 * - id: Unique identifier (used as React key)
 * - title: Display name
 * - description: Short description shown on app card
 * - icon: Emoji or icon identifier
 * - path: Route path (should match a route in routes.js)
 */
export const APPS = [
  {
    id: 'snake',
    title: 'Snake Game',
    description: 'Classic snake game with arrow key controls',
    icon: '🐍',
    path: ROUTES.SNAKE,
    category: 'games',
  },
  {
    id: 'platformer',
    title: 'Platformer',
    description: 'Side-scrolling platformer game - jump over obstacles!',
    icon: '🏃',
    path: ROUTES.PLATFORMER,
    category: 'games',
  },
  {
    id: 'blogger',
    title: 'Knowledge Blog',
    description: 'Read insightful articles and tutorials',
    icon: '📚',
    path: ROUTES.BLOGGER,
    category: 'knowledge',
  },
  // Future apps can be added here
];

/**
 * Get app by ID
 * @param {string} id - App identifier
 * @returns {Object|undefined} App configuration or undefined
 */
export const getAppById = (id) => {
  return APPS.find((app) => app.id === id);
};

/**
 * Get app by path
 * @param {string} path - Route path
 * @returns {Object|undefined} App configuration or undefined
 */
export const getAppByPath = (path) => {
  return APPS.find((app) => app.path === path);
};

/**
 * Get apps grouped by category
 * @returns {Object} Object with categories as keys and arrays of apps as values
 */
export const getAppsByCategory = () => {
  return APPS.reduce((acc, app) => {
    if (!acc[app.category]) {
      acc[app.category] = [];
    }
    acc[app.category].push(app);
    return acc;
  }, {});
};

/**
 * Get all available categories
 * @returns {Array} Array of unique category names
 */
export const getCategories = () => {
  return [...new Set(APPS.map(app => app.category))];
};

/**
 * Get category metadata for display
 * @returns {Object} Object with category names as keys and display info as values
 */
export const getCategoryMetadata = () => {
  return {
    games: {
      label: 'Games',
      icon: '🎮',
      description: 'Fun games to play',
    },
    utilities: {
      label: 'Utilities',
      icon: '🛠️',
      description: 'Useful tools and applications',
    },
    knowledge: {
      label: 'Knowledge',
      icon: '📚',
      description: 'Educational content and resources',
    },
  };
};

