/**
 * Express application factory for service-ai.
 */

import express, { Express } from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { validateEnv } from './config/env.js';
import generationRoutes from './routes/generation.routes.js';
import diagnosticRoutes from './routes/diagnostic.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';

export function createApp(): Express {
  const app = express();
  const env = validateEnv();

  app.use(express.json({ limit: '1mb' }));

  app.use((req, _res, next) => {
    logger.info('Request', {
      method: req.method,
      path: req.path,
      requestId: req.headers['x-request-id'],
    });
    next();
  });

  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: env.SERVICE_NAME,
      provider: env.LLM_PROVIDER,
      timestamp: new Date().toISOString(),
    });
  });

  // Routes
  app.use('/', generationRoutes);
  app.use('/', diagnosticRoutes);
  app.use('/', recommendationRoutes);

  app.use(errorHandler);

  return app;
}
