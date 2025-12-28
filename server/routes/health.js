/**
 * Health check route handler.
 * Used by Render for service health monitoring.
 */

import express from 'express';

const router = express.Router();

/**
 * GET /api/health
 * Returns server health status
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Launchpad API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;

