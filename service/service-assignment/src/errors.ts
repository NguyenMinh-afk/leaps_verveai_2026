/**
 * Local error helpers for service-assignment.
 *
 * ForbiddenError is used for authorization failures when the user is
 * authenticated but not allowed to perform the action.
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
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
