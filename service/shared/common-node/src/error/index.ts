/**
 * Error classes — re-export from @verveai/error-types + add helpers.
 *
 * Why? `@verveai/error-types` is a separate package (heavy dep isolation).
 * This module re-exports everything from there PLUS adds:
 * - ErrorCode enum (string codes for i18n)
 * - errorToResponse(err) — convert any error to API response shape
 *
 * @module error
 */

import { DomainError } from '@verveai/error-types';
import type { ResponseError } from '../response';

type ErrorResponse = ResponseError;

// Re-export the error classes so consumers can do:
//   import { DomainError, NotFoundError } from '@verveai/common-node';
export {
  DomainError,
  AuthError,
  ConflictError,
  InternalError,
  NotFoundError,
  ValidationError,
} from '@verveai/error-types';

/**
 * Stable string codes used by the API and the FE.
 * The FE/i18n layer maps these codes to localized messages.
 */
export enum ErrorCode {
  // 400-class
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  // 401
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  // 403
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSION = 'INSUFFICIENT_PERMISSION',
  // 404
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_GONE = 'RESOURCE_GONE',
  // 409
  CONFLICT = 'CONFLICT',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  VERSION_MISMATCH = 'VERSION_MISMATCH',
  // 422
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  // 429
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  // 5xx
  INTERNAL = 'INTERNAL',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  UPSTREAM_FAILURE = 'UPSTREAM_FAILURE',
  // Inter-service
  CIRCUIT_BREAKER_OPEN = 'CIRCUIT_BREAKER_OPEN',
  SERVICE_DISCOVERY_FAILED = 'SERVICE_DISCOVERY_FAILED',
}

/**
 * Convert any thrown value to a normalized ErrorResponse.
 * Handles DomainError, ZodError, SyntaxError, generic Error, etc.
 */
export function errorToResponse(err: unknown): ErrorResponse {
  // DomainError (custom hierarchy)
  if (err instanceof DomainError) {
    return {
      success: false,
      data: null,
      error: {
        code: err.code ?? ErrorCode.INTERNAL,
        message: err.message,
        details: err.details as unknown as Array<{ path: string; message: string }> | undefined,
      },
    };
  }

  // ZodError — convert issues to flat details
  if (isZodError(err)) {
    return {
      success: false,
      data: null,
      error: {
        code: ErrorCode.VALIDATION_FAILED,
        message: 'Request validation failed',
        details: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
      },
    };
  }

  // Generic Error
  if (err instanceof Error) {
    return {
      success: false,
      data: null,
      error: {
        code: ErrorCode.INTERNAL,
        message: err.message,
      },
    };
  }

  // Unknown — never leak
  return {
    success: false,
    data: null,
    error: {
      code: ErrorCode.INTERNAL,
      message: 'Unknown error',
    },
  };
}

/**
 * Type guard for ZodError (avoid direct import dependency in callers).
 */
function isZodError(err: unknown): err is { issues: Array<{ path: (string | number)[]; message: string; code: string }> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'issues' in err &&
    Array.isArray((err as { issues: unknown }).issues)
  );
}

/**
 * Helper — wrap an async function to throw a DomainError.
 * Useful for guarding with type-safe factory.
 */
export function asDomainError(
  err: unknown,
  fallbackCode: ErrorCode = ErrorCode.INTERNAL,
): DomainError {
  if (err instanceof DomainError) return err;
  const message = err instanceof Error ? err.message : String(err);
  return new DomainError(fallbackCode, message);
}
