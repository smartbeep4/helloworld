/**
 * API routes aggregator.
 * Imports and mounts all API route handlers.
 */

import express from 'express';
import healthRouter from './health.js';
import { API_ROUTES } from '../config/server.config.js';

const router = express.Router();

// Mount route handlers
router.use(API_ROUTES.HEALTH, healthRouter);

// Add more route handlers here as needed
// router.use(API_ROUTES.OTHER_ROUTE, otherRouter);

export default router;

