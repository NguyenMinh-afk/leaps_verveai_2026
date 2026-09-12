/**
 * Express app factory for svc-sync.
 *
 * Separating the app factory from the HTTP listener lets us:
 *   • Production: start the server in `index.ts` after registering
 *     with Consul.
 *   • Tests:     boot the app in-process and exercise it with supertest
 *     without ever opening a TCP port.
 *
 * Mirrors the structure of `service-bkt/src/app.ts`.
 */

import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { errorHandler } from './middleware/errorHandler.js';
import { metricsMiddleware, metricsHandler } from './middleware/metrics.js';
import healthRoutes from './routes/health.routes.js';
import syncRoutes from './routes/index.js';

export interface CreateAppOptions {
  /**
   * Skip body-parser / helmet / cors for tests that want a thin pipeline.
   * Defaults to `false`.
   */
  minimal?: boolean;
}

export function createApp(options: CreateAppOptions = {}): Express {
  const app = express();

  if (!options.minimal) {
    // Security middleware — same order as production.
    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: '1mb' }));
  } else {
    // Minimal pipeline: body parser only (no security overhead).
    app.use(express.json({ limit: '1mb' }));
  }

  // Metrics middleware (tracks every request).
  app.use(metricsMiddleware);

  // Health routes — registered at root so Consul can probe `/health`
  // and `/health/ready` regardless of service prefix.
  app.use('/health', healthRoutes);

  // Prometheus scrape endpoint.
  app.get('/metrics', metricsHandler);

  // Domain routes — mounted at `/api/sync` (gateway strips the prefix).
  app.use('/api/sync', syncRoutes);

  // Error handler MUST be last so it catches errors from all routes.
  app.use(errorHandler);

  return app;
}
