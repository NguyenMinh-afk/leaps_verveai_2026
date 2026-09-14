/**
 * Environment validation for service-exam.
 */

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3007),
  SERVICE_NAME: z.string().default('service-exam'),
  SERVICE_PORT: z.coerce.number().int().default(3007),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  DATABASE_URL: z.string().url(),
  CONSUL_HOST: z.string().default('localhost'),
  CONSUL_PORT: z.coerce.number().int().default(8500),
  OTEL_SERVICE_NAME: z.string().default('service-exam'),
  SVC_BKT_URL: z.string().url().optional(),
  SVC_AUTH_URL: z.string().url().optional(),
  SVC_CONTENT_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
  return result.data;
}

export function getEnv(): Env {
  return validateEnv();
}
