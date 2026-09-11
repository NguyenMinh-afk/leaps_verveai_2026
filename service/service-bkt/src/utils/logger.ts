import winston from 'winston';
import { validateEnv } from '../config/env.js';

const env = validateEnv();

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${String(timestamp)} [${service || 'svc-bkt'}] ${level}: ${String(message)} ${metaStr}`;
  })
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: env.SERVICE_NAME },
  transports: [
    new winston.transports.Console({
      format: env.NODE_ENV === 'production' ? logFormat : consoleFormat
    })
  ]
});

export function createChildLogger(context: Record<string, unknown>): winston.Logger {
  return logger.child(context);
}
