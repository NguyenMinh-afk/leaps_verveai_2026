/**
 * VERVEAI Common Node — Umbrella package for backend services
 *
 * Re-exports the most common utilities used by every microservice:
 * - logger         (Pino + OpenTelemetry)
 * - response       (success / error / paginate)
 * - error          (DomainError, ValidationError, AuthError, ...)
 * - validation     (Zod helpers + common schemas)
 * - middleware     (error-handler, validate, async-handler, request-id, not-found)
 * - notification   (Notifier interface + Console/Email/Webhook)
 * - crypto         (bcrypt + JWT helpers)
 * - pagination     (paginate helper)
 * - http           (HTTP client wrapper)
 * - constants      (ErrorCode, Role, AuditAction, ...)
 * - config         (env loader with Zod)
 * - utils          (date/string/uuid/json)
 *
 * For heavier dependencies (Consul, Circuit Breaker, OpenTelemetry, Prisma)
 * each lives in its own package:
 * - @verveai/consul-client
 * - @verveai/circuit-breaker
 * - @verveai/jwt-utils
 * - @verveai/prisma-schema
 * - @verveai/tracing
 *
 * @packageDocumentation
 */

export * from './logger';
export * from './response';
export * from './error';
export * from './validation';
export * from './middleware';
export * from './notification';
export * from './crypto';
export * from './pagination';
export * from './http';
export * from './constants';
export * from './config';
export * from './utils/date';
export * from './utils/string';
export * from './utils/uuid';
export * from './utils/json';
