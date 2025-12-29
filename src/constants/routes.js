/**
 * Centralized route definitions for the application.
 * This is the single source of truth for all frontend routes.
 */

export const ROUTES = {
  HOME: '/',
  SNAKE: '/snake',
  PLATFORMER: '/platformer',
  BLOGGER: '/blogger',
};

/**
 * Array of all routes for iteration purposes
 */
export const ROUTE_LIST = Object.values(ROUTES);

/**
 * Route metadata for navigation menus
 */
export const ROUTE_METADATA = {
  [ROUTES.HOME]: {
    label: 'Home',
    icon: '🏠',
    showInMenu: true,
  },
  [ROUTES.SNAKE]: {
    label: 'Snake Game',
    icon: '🐍',
    showInMenu: true,
  },
  [ROUTES.PLATFORMER]: {
    label: 'Platformer',
    icon: '🏃',
    showInMenu: true,
  },
  [ROUTES.BLOGGER]: {
    label: 'Knowledge Blog',
    icon: '📚',
    showInMenu: true,
  },
};

/**
 * Get menu items for navigation components
 * @returns {Array} Array of menu items with path, label, and icon
 */
export const getMenuItems = () => {
  return Object.entries(ROUTE_METADATA)
    .filter(([_, metadata]) => metadata.showInMenu)
    .map(([path, metadata]) => ({
      path,
      label: metadata.label,
      icon: metadata.icon,
    }));
};

