import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1024).max(65535).default(3004),
  SERVICE_NAME: z.string().default('svc-content'),
  SERVICE_PORT: z.coerce.number().int().default(3004),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  DATABASE_URL: z.string().url(),
  CONSUL_HOST: z.string().default('localhost'),
  CONSUL_PORT: z.coerce.number().int().default(8500),
  OTEL_SERVICE_NAME: z.string().default('svc-content'),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  KEYS_DIR: z.string().default('/app/keys'),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function validateEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Environment validation failed: ${errors}`);
  }

  cachedEnv = result.data;
  return cachedEnv;
}
