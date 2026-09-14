/**
 * Express application for service-exam.
 */

import express, { Express } from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { validateEnv } from './config/env.js';
import examRoutes from './routes/exam.routes.js';
import resultRoutes from './routes/result.routes.js';
import mappingRoutes from './routes/mapping.routes.js';
import diagnosisRoutes from './routes/diagnosis.routes.js';

export function createApp(): Express {
  const app = express();
  const env = validateEnv();

  app.use(express.json({ limit: '1mb' }));

  app.use((req, _res, next) => {
    logger.info('Request', { method: req.method, path: req.path });
    next();
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: env.SERVICE_NAME, timestamp: new Date().toISOString() });
  });

  app.use('/', examRoutes);
  app.use('/', resultRoutes);
  app.use('/', mappingRoutes);
  app.use('/exam/diagnosis', diagnosisRoutes);

  app.use(errorHandler);

  return app;
}
