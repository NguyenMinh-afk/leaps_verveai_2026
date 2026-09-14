/**
 * Service Exam - Main Entry Point
 */

import { createApp } from './app.js';
import { validateEnv } from './config/env.js';
import { logger } from './utils/logger.js';
import { disconnectPrisma } from './prisma/client.js';

async function main(): Promise<void> {
  const env = validateEnv();

  logger.info('Starting service-exam', {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    serviceName: env.SERVICE_NAME,
  });

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}, shutting down gracefully`);
    server.close(async () => {
      await disconnectPrisma();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error('Failed to start service', { error: err });
  process.exit(1);
});
