import { describe, it, expect } from 'vitest';
import {
  AuthError,
  ConflictError,
  DomainError,
  InternalError,
  NotFoundError,
  ValidationError,
  errorToString,
  formatDomainError,
  isDomainError,
} from './index';

describe('DomainError', () => {
  it('creates with correct code, message, and default httpStatus', () => {
    const err = new DomainError('CUSTOM_CODE', 'something went wrong');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(DomainError);
    expect(err.code).toBe('CUSTOM_CODE');
    expect(err.message).toBe('something went wrong');
    expect(err.httpStatus).toBe(500);
    expect(err.name).toBe('DomainError');
    expect(err.details).toBeUndefined();
  });

  it('accepts an explicit httpStatus and details', () => {
    const err = new DomainError(
      'TEAPOT',
      'I am a teapot',
      418,
      { foo: 'bar' },
    );
    expect(err.code).toBe('TEAPOT');
    expect(err.httpStatus).toBe(418);
    expect(err.details).toEqual({ foo: 'bar' });
  });
});

describe('ValidationError', () => {
  it('creates with issues array and httpStatus 400', () => {
    const issues = [
      { path: ['email'], message: 'Invalid email', code: 'invalid_string' },
      { path: ['age'], message: 'Must be positive', code: 'too_small' },
    ];
    const err = new ValidationError(issues);
    expect(err).toBeInstanceOf(DomainError);
    expect(err).toBeInstanceOf(ValidationError);
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('VALIDATION_FAILED');
    expect(err.httpStatus).toBe(400);
    expect(err.name).toBe('ValidationError');
    expect(err.issues).toEqual(issues);
    expect(err.issues).toHaveLength(2);
    expect(err.details).toEqual({ issues });
  });

  it('uses the provided message when supplied', () => {
    const err = new ValidationError(
      [{ path: ['x'], message: 'bad', code: 'x' }],
      'Custom validation message',
    );
    expect(err.message).toBe('Custom validation message');
  });

  it('defaults message to "Validation failed"', () => {
    const err = new ValidationError([]);
    expect(err.message).toBe('Validation failed');
  });
});

describe('AuthError', () => {
  it('extends DomainError with httpStatus 401', () => {
    const err = new AuthError('AUTH_INVALID_CREDENTIALS', 'Bad credentials');
    expect(err).toBeInstanceOf(DomainError);
    expect(err).toBeInstanceOf(AuthError);
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('AUTH_INVALID_CREDENTIALS');
    expect(err.message).toBe('Bad credentials');
    expect(err.httpStatus).toBe(401);
    expect(err.name).toBe('AuthError');
  });

  it('preserves the custom code provided by callers', () => {
    const err = new AuthError('AUTH_TOKEN_EXPIRED', 'Token has expired');
    expect(err.code).toBe('AUTH_TOKEN_EXPIRED');
  });
});

describe('NotFoundError', () => {
  it('formats message with resource name and id when provided', () => {
    const err = new NotFoundError('User', 'user-123');
    expect(err).toBeInstanceOf(DomainError);
    expect(err).toBeInstanceOf(NotFoundError);
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.httpStatus).toBe(404);
    expect(err.name).toBe('NotFoundError');
    expect(err.message).toBe('User user-123 not found');
  });

  it('formats message with resource name only when id omitted', () => {
    const err = new NotFoundError('Student');
    expect(err.message).toBe('Student not found');
    expect(err.httpStatus).toBe(404);
  });
});

describe('ConflictError', () => {
  it('uses httpStatus 409', () => {
    const err = new ConflictError('Email already in use');
    expect(err).toBeInstanceOf(DomainError);
    expect(err).toBeInstanceOf(ConflictError);
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('CONFLICT');
    expect(err.httpStatus).toBe(409);
    expect(err.name).toBe('ConflictError');
    expect(err.message).toBe('Email already in use');
  });
});

describe('InternalError', () => {
  it('uses httpStatus 500 and default message', () => {
    const err = new InternalError();
    expect(err).toBeInstanceOf(DomainError);
    expect(err).toBeInstanceOf(InternalError);
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('INTERNAL');
    expect(err.httpStatus).toBe(500);
    expect(err.name).toBe('InternalError');
    expect(err.message).toBe('Internal server error');
  });

  it('accepts a custom message', () => {
    const err = new InternalError('Database is on fire');
    expect(err.message).toBe('Database is on fire');
    expect(err.httpStatus).toBe(500);
  });
});

describe('instanceof Error guarantees', () => {
  it('all domain error classes are instanceof Error', () => {
    const errors: Error[] = [
      new DomainError('C', 'm'),
      new ValidationError([]),
      new AuthError('C', 'm'),
      new NotFoundError('R'),
      new ConflictError('m'),
      new InternalError(),
    ];

    for (const err of errors) {
      expect(err).toBeInstanceOf(Error);
      expect(err.stack).toBeDefined();
    }
  });
});

describe('errorToString', () => {
  it('returns the message of Error instances', () => {
    expect(errorToString(new Error('boom'))).toBe('boom');
    expect(errorToString(new DomainError('C', 'domain boom'))).toBe('domain boom');
  });

  it('returns string primitives as-is', () => {
    expect(errorToString('plain')).toBe('plain');
    expect(errorToString('')).toBe('');
  });

  it('renders null and undefined safely', () => {
    expect(errorToString(null)).toBe('null');
    expect(errorToString(undefined)).toBe('undefined');
  });

  it('serializes plain objects via JSON.stringify', () => {
    expect(errorToString({ code: 'X' })).toBe('{"code":"X"}');
  });

  it('falls back to String() for non-serializable objects', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    // JSON.stringify will throw; helper should fall back to String()
    expect(errorToString(circular)).toBe(circular.toString());
  });
});

describe('formatDomainError', () => {
  it('returns a serializable shape with the core fields', () => {
    const err = new NotFoundError('Class', 'class-9');
    const formatted = formatDomainError(err);
    expect(formatted).toEqual({
      code: 'NOT_FOUND',
      name: 'NotFoundError',
      message: 'Class class-9 not found',
      httpStatus: 404,
    });
  });

  it('includes details when present', () => {
    const err = new ValidationError([
      { path: ['x'], message: 'bad', code: 'x' },
    ]);
    const formatted = formatDomainError(err);
    expect(formatted.details).toEqual({
      issues: [{ path: ['x'], message: 'bad', code: 'x' }],
    });
  });

  it('attaches context when provided', () => {
    const err = new AuthError('AUTH_TOKEN_EXPIRED', 'expired');
    const formatted = formatDomainError(err, {
      requestId: 'req-1',
      userId: 'user-1',
      service: 'svc-auth',
    });
    expect(formatted.context).toEqual({
      requestId: 'req-1',
      userId: 'user-1',
      service: 'svc-auth',
    });
  });
});

describe('isDomainError', () => {
  it('returns true for DomainError instances and subclasses', () => {
    expect(isDomainError(new DomainError('C', 'm'))).toBe(true);
    expect(isDomainError(new ValidationError([]))).toBe(true);
    expect(isDomainError(new AuthError('C', 'm'))).toBe(true);
    expect(isDomainError(new NotFoundError('R'))).toBe(true);
    expect(isDomainError(new ConflictError('m'))).toBe(true);
    expect(isDomainError(new InternalError())).toBe(true);
  });

  it('returns false for non-DomainError values', () => {
    expect(isDomainError(new Error('plain'))).toBe(false);
    expect(isDomainError('boom')).toBe(false);
    expect(isDomainError(null)).toBe(false);
    expect(isDomainError(undefined)).toBe(false);
    expect(isDomainError({ code: 'X' })).toBe(false);
  });
});
