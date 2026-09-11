/**
 * Domain error hierarchy for VERVEAI microservices.
 *
 * All errors extend `DomainError`, which carries:
 *   - `code`: a stable, machine-readable error code (e.g. `VALIDATION_FAILED`).
 *   - `message`: a human-readable description.
 *   - `httpStatus`: the HTTP status code that should be returned to clients.
 *   - `details`: optional structured context for logs / API responses.
 *
 * Concrete subclasses provide sensible defaults for common failure modes
 * (validation, authentication, not found, conflict, internal) so service
 * code can throw precise errors without re-deriving status codes.
 */

import type { ValidationIssue } from './types';

/**
 * Base class for all domain-level errors thrown by VERVEAI services.
 *
 * Subclasses set `code`, `message`, and `httpStatus` so the error can be
 * translated directly into an HTTP response by gateway/middleware code.
 */
export class DomainError extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    httpStatus = 500,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.httpStatus = httpStatus;
    if (details !== undefined) {
      this.details = details;
    }
    // Maintain proper prototype chain for `instanceof` after transpilation.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when user-supplied input fails schema validation.
 *
 * `issues` follows a Zod-like shape so middleware can render field-level
 * errors in API responses without re-validating.
 */
export class ValidationError extends DomainError {
  public readonly issues: ValidationIssue[];

  constructor(
    issues: ValidationIssue[],
    message = 'Validation failed',
  ) {
    super('VALIDATION_FAILED', message, 400, { issues });
    this.name = 'ValidationError';
    this.issues = issues;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown for authentication and authorization failures (HTTP 401).
 *
 * `code` distinguishes failure modes for the client
 * (e.g. `AUTH_INVALID_CREDENTIALS`, `AUTH_TOKEN_EXPIRED`).
 */
export class AuthError extends DomainError {
  constructor(code: string, message: string) {
    super(code, message, 401);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a requested resource cannot be located (HTTP 404).
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} ${id} not found` : `${resource} not found`;
    super('NOT_FOUND', message, 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when an operation conflicts with existing state (HTTP 409)
 * — for example, creating a resource that already exists.
 */
export class ConflictError extends DomainError {
  constructor(message: string) {
    super('CONFLICT', message, 409);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown for unexpected, unrecoverable server-side failures (HTTP 500).
 *
 * Intended as a safe default for "should never happen" situations that
 * must still be surfaced as a structured error rather than a bare `Error`.
 */
export class InternalError extends DomainError {
  constructor(message = 'Internal server error') {
    super('INTERNAL', message, 500);
    this.name = 'InternalError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
