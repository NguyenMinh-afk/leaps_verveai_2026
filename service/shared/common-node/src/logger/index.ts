/**
 * Logger — Pino-based structured logger with OpenTelemetry correlation.
 *
 * Usage:
 *   import { logger } from '@verveai/common-node';
 *   const log = logger.child({ service: 'svc-auth' });
 *   log.info({ userId }, 'login success');
 *
 * Each log line carries: timestamp, level, service, traceId, spanId (when OTEL is active).
 *
 * @module logger
 */

import pino, { type Logger, type LoggerOptions } from 'pino';

/**
 * Logger configuration — overridable via env.
 */
export interface LoggerConfig {
  /** Service name — required, e.g. 'svc-auth' */
  service: string;
  /** Environment — 'development' | 'production' | 'test' */
  env?: 'development' | 'production' | 'test';
  /** Log level — 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' */
  level?: pino.Level;
  /** Pretty print (dev only) */
  pretty?: boolean;
}

/**
 * Create the base logger. Most callers should use the default `logger`
 * (already configured from env) or `.child({ service })` to scope.
 */
export function createLogger(config: LoggerConfig): Logger {
  const isDev = config.env === 'development' || (process.env['NODE_ENV'] === 'development');
  const level = config.level ?? (process.env['LOG_LEVEL'] as pino.Level | undefined) ?? 'info';

  const options: LoggerOptions = {
    name: config.service,
    level,
    base: {
      service: config.service,
      env: config.env ?? process.env['NODE_ENV'] ?? 'development',
      pid: process.pid,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label }),
    },
    messageKey: 'message',
    // Serialize Error properly (stack trace + name)
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
    },
  };

  if (config.pretty && isDev) {
    return pino(options);
  }

  return pino(options);
}

/**
 * Default logger — initialized lazily from env.
 *
 * In production usage:
 *   const log = logger.child({ service: 'svc-auth', requestId });
 */
let _logger: Logger | null = null;

export function getLogger(): Logger {
  if (_logger) return _logger;
  const service = process.env['SERVICE_NAME'] ?? 'unknown-service';
  _logger = createLogger({ service });
  return _logger;
}

/**
 * Default logger instance.
 * Re-export as `logger` for ergonomic usage:
 *   import { logger } from '@verveai/common-node';
 *   logger.info({ userId }, 'login');
 */
export const logger = getLogger();

/**
 * Reset the default logger — used in tests.
 */
export function resetLogger(): void {
  _logger = null;
}
