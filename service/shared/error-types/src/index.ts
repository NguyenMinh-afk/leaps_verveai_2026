/**
 * Domain error classes for VERVEAI microservices.
 *
 * Provides a base `DomainError` and a hierarchy of specialized error types
 * (ValidationError, AuthError, NotFoundError, ConflictError, InternalError)
 * that map cleanly to HTTP status codes for use across the service layer.
 */

import type { ErrorContext } from './types';
import { DomainError } from './errors';

export {
  AuthError,
  ConflictError,
  DomainError,
  InternalError,
  NotFoundError,
  ValidationError,
} from './errors';

export type { ErrorContext, ValidationIssue } from './types';

/**
 * Convert any thrown value into a stable string suitable for logging.
 *
 * - Returns the `message` of `Error` instances.
 * - Returns `String(value)` for primitives and other objects.
 * - Always returns a string (never `undefined` or throws).
 */
export function errorToString(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  if (err === null || err === undefined) {
    return String(err);
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Helper to format a `DomainError` into a serializable structure suitable
 * for API responses or logging systems.
 */
export function formatDomainError(
  err: DomainError,
  context?: ErrorContext,
): {
  code: string;
  name: string;
  message: string;
  httpStatus: number;
  details?: Record<string, unknown>;
  context?: ErrorContext;
} {
  const formatted: {
    code: string;
    name: string;
    message: string;
    httpStatus: number;
    details?: Record<string, unknown>;
    context?: ErrorContext;
  } = {
    code: err.code,
    name: err.name,
    message: err.message,
    httpStatus: err.httpStatus,
  };

  if (err.details !== undefined) {
    formatted.details = err.details;
  }

  if (context !== undefined) {
    formatted.context = context;
  }

  return formatted;
}

/**
 * Type guard to check whether an unknown value is a `DomainError`.
 */
export function isDomainError(err: unknown): err is DomainError {
  return err instanceof DomainError;
}
