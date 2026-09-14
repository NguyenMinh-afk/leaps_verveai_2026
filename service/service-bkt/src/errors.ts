import { DomainError, type ValidationIssue } from '@verveai/error-types';

/**
 * 403 Forbidden — used when the caller's `X-User-Role` does not permit
 * the requested action (e.g. a teacher trying to call an admin route).
 *
 * Note: the base `DomainError.details` is typed as
 * `Record<string, unknown>`; for a list of validation-style issues we
 * use `ValidationIssue[]` and coerce at the response boundary.
 */
export class ForbiddenError extends DomainError {
  public override readonly code = 'FORBIDDEN';
  public override readonly httpStatus = 403;

  constructor(message = 'Forbidden', issues?: ValidationIssue[]) {
    super(
      'FORBIDDEN',
      message,
      403,
      issues && issues.length > 0 ? { issues } : undefined
    );
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
