/**
 * Config — Zod-based environment loader with validation.
 *
 * Usage:
 *   import { loadConfig, env } from '@verveai/common-node';
 *
 *   // Define your schema
 *   const config = loadConfig({
 *     PORT: z.coerce.number().default(3001),
 *     DATABASE_URL: z.string().url(),
 *     NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
 *     SERVICE_NAME: z.string(),
 *   });
 *
 *   // Access typed config
 *   console.log(config.PORT);        // number
 *   console.log(config.SERVICE_NAME); // string
 *
 * @module config
 */

import { z, type ZodRawShape, type ZodType } from 'zod';

export { z };

/**
 * Load and validate environment variables against a Zod schema.
 * Throws on missing/invalid required vars (fails fast at startup).
 *
 * @param schema  Zod object schema with env var definitions.
 * @param prefix  Optional prefix to strip from env keys (e.g. 'SVC_AUTH_' → 'AUTH_').
 */
export function loadConfig<T extends ZodRawShape>(
  schema: T,
  prefix = '',
): z.infer<z.ZodObject<T>> {
  // Strip prefix from env keys if provided
  const processed: Record<string, unknown> = {};
  for (const key of Object.keys(schema)) {
    const envKey = prefix ? `${prefix}${key}` : key;
    processed[key] = process.env[envKey] ?? process.env[key];
  }

  const envSchema = z.object(schema);
  const result = envSchema.safeParse(processed);

  if (!result.success) {
    const issues = result.error.issues.map(
      (i) => `[${i.path.join('.')}] ${i.message}`,
    );
    throw new Error(
      `❌ Config validation failed:\n  ${issues.join('\n  ')}\n\n` +
        `Missing or invalid environment variables. Check your .env file.`,
    );
  }

  return result.data;
}

/**
 * Get a single env var with type coercion and optional default.
 * Does NOT throw — returns default for missing optional vars.
 *
 * @param key       Env var name.
 * @param transform Zod schema for the value (e.g. z.coerce.number()).
 * @param fallback  Default value if missing.
 */
export function env<T>(
  key: string,
  transform: ZodType<T>,
  fallback?: T,
): T {
  const raw = process.env[key];
  if (raw === undefined) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env var: ${key}`);
  }
  const result = transform.safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid env var ${key}: expected ${raw}, got ${result.error.message}`);
  }
  return result.data;
}

/**
 * Check if the current environment is production.
 */
export function isProduction(): boolean {
  return process.env['NODE_ENV'] === 'production';
}

/**
 * Check if the current environment is development.
 */
export function isDevelopment(): boolean {
  return process.env['NODE_ENV'] === 'development';
}

/**
 * Check if the current environment is test.
 */
export function isTest(): boolean {
  return process.env['NODE_ENV'] === 'test';
}
