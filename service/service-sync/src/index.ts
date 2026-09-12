import 'dotenv/config';

import { createApp } from './app.js';
import { validateEnv } from './config/env.js';
import { registerWithConsul, deregisterFromConsul } from './config/consul.js';
import { logger } from './utils/logger.js';
import { prisma, disconnectPrisma } from './prisma/client.js';

const env = validateEnv();
const app = createApp();

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
      logger.info(`svc-sync listening on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

start();
