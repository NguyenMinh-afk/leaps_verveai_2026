/**
 * Domain errors for service-exam.
 */

export class ForbiddenError extends Error {
  public readonly code: string;
  public readonly httpStatus = 403;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.code = code;
  }
}
