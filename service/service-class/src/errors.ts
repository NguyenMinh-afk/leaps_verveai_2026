/**
 * Local error helpers for service-class.
 *
 * `ForbiddenError` is a thin subclass of `DomainError` with HTTP 403. It is
 * intentionally NOT added to `@verveai/error-types` because forbiddenness is
 * a service-layer concern (we are the authorization gate for class/student
 * records in this service), so each service is free to define its own.
 *
 * Keeping it here avoids polluting the shared error package with service-
 * specific semantics while still letting the global errorHandler treat it
 * like every other `DomainError`.
 */

import { DomainError } from '@verveai/error-types';

/**
 * Thrown when an authenticated caller is not allowed to access or mutate
 * the target resource (HTTP 403). Use this to signal ownership or role
 * mismatches discovered inside service code.
 */
export class ForbiddenError extends DomainError {
  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(code, message, 403, details);
    this.name = 'ForbiddenError';
    // Preserve `instanceof` after transpilation across module boundaries.
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
