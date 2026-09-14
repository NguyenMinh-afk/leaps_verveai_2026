/**
 * Entry point for service-ai.
 */

import { createApp } from './app.js';
import { validateEnv } from './config/env.js';
import { logger, setLogLevel } from './utils/logger.js';

async function main(): Promise<void> {
  try {
    const env = validateEnv();
    setLogLevel(env.LOG_LEVEL);

    logger.info('Starting service-ai', {
      service: env.SERVICE_NAME,
      provider: env.LLM_PROVIDER,
      port: env.PORT,
    });

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info('service-ai started', {
        port: env.PORT,
        provider: env.LLM_PROVIDER,
      });
    });

    // Graceful shutdown
    const shutdown = (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully`);
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start service-ai', {
      error: err instanceof Error ? err.message : String(err),
    });
    process.exit(1);
  }
}

main();
