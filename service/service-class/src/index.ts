import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { validateEnv } from './config/env.js';
import { registerWithConsul, deregisterFromConsul } from './config/consul.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { metricsMiddleware, metricsHandler } from './middleware/metrics.js';
import { prisma, disconnectPrisma } from './prisma/client.js';
import healthRoutes from './routes/health.routes.js';
import classRoutes from './routes/index.js';

const env = validateEnv();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());

// Metrics middleware
app.use(metricsMiddleware);

// Health routes
app.use('/health', healthRoutes);

// Metrics endpoint
app.get('/metrics', metricsHandler);

// Class routes
app.use('/api/class', classRoutes);

// Error handler
app.use(errorHandler);

// Graceful shutdown handler
async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  try {
    await deregisterFromConsul();
    await disconnectPrisma();
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', { error });
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start server
async function start(): Promise<void> {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Connected to database');

    // Register with Consul
    await registerWithConsul();

    // Start HTTP server
    app.listen(env.PORT, () => {
      logger.info(`svc-class listening on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

start();
