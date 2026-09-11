import { Consul } from '@verveai/consul-client';
import { validateEnv } from './env.js';
import { logger } from '../utils/logger.js';

const env = validateEnv();

export async function registerWithConsul(): Promise<void> {
  try {
    await Consul.register({
      name: env.SERVICE_NAME,
      port: env.SERVICE_PORT,
      healthCheck: '/health',
      tags: ['sync', 'v1', 'microservice']
    });
    logger.info(`Registered with Consul as ${env.SERVICE_NAME}:${env.SERVICE_PORT}`);
  } catch (error) {
    logger.error('Failed to register with Consul', { error });
    throw error;
  }
}

export async function deregisterFromConsul(): Promise<void> {
  try {
    await Consul.deregister();
    logger.info(`Deregistered from Consul: ${env.SERVICE_NAME}`);
  } catch (error) {
    logger.error('Failed to deregister from Consul', { error });
  }
}
