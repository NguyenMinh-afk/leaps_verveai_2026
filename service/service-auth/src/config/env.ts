import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3001'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().default('verveai'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  CONSUL_HOST: z.string().default('localhost'),
  CONSUL_PORT: z.string().default('8500'),
});

export const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('Invalid environment variables:', env.error.issues);
  process.exit(1);
}

export const config = env.data;
