import { ConsulClient } from '@verveai/consul-client';
import { logger } from '../utils/logger';

const consulHost = process.env['CONSUL_HOST'] ?? 'localhost';
const consulPort = Number(process.env['CONSUL_PORT'] ?? 8500);
const consul = new ConsulClient(consulHost, consulPort);

export async function registerService(): Promise<void> {
  try {
    await consul.register({
      name: 'svc-auth',
      port: Number(process.env['SERVICE_PORT'] ?? 3001),
      host: process.env['HOSTNAME'] ?? 'localhost',
      healthCheck: '/health',
      tags: ['auth', 'v1', 'microservice'],
      meta: { version: '1.0.0' },
    });
    logger.info('Service registered with Consul', { host: consulHost, port: consulPort });
  } catch (err) {
    logger.error('Failed to register with Consul', { error: String(err) });
    // Don't exit — service should still work without Consul
  }
}

export { consul };
