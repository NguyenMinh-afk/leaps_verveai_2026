/**
 * Tests for JWT verification utilities
 */

import { describe, it, expect, beforeAll, vi, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { verify, decode, isExpired, type JwtPayload } from './verify';

const TEST_SECRET = 'test-secret-min-32-chars!!';
const TEST_ISSUER = 'verveai-test';

beforeAll(() => {
  process.env.JWT_SECRET = TEST_SECRET;
  process.env.JWT_ISSUER = TEST_ISSUER;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('verify', () => {
  it('should verify a valid token and return payload', () => {
    const payload: JwtPayload = {
      sub: 'user-123',
      role: 'TEACHER',
      email: 'teacher@example.com',
      name: 'Test Teacher',
    };

    const token = jwt.sign(payload, TEST_SECRET, {
      issuer: TEST_ISSUER,
      expiresIn: '1h',
    });

    const result = verify(token, { secret: TEST_SECRET, issuer: TEST_ISSUER });

    expect(result.sub).toBe('user-123');
    expect(result.role).toBe('TEACHER');
    expect(result.email).toBe('teacher@example.com');
    expect(result.name).toBe('Test Teacher');
    expect(result.iat).toBeDefined();
    expect(result.exp).toBeDefined();
    expect(result.iss).toBe(TEST_ISSUER);
  });

  it('should use default JWT_SECRET from env', () => {
    const payload: JwtPayload = {
      sub: 'user-456',
      role: 'ADMIN',
    };

    const token = jwt.sign(payload, TEST_SECRET, {
      issuer: TEST_ISSUER,
      expiresIn: '1h',
    });

    const result = verify(token);

    expect(result.sub).toBe('user-456');
    expect(result.role).toBe('ADMIN');
  });

  it('should throw for invalid token', () => {
    expect(() => verify('invalid-token')).toThrow();
  });

  it('should throw for token with wrong signature', () => {
    const payload: JwtPayload = { sub: 'user-123', role: 'TEACHER' };
    const wrongSecret = 'wrong-secret-min-32-chars!!!';

    const token = jwt.sign(payload, wrongSecret, {
      issuer: TEST_ISSUER,
      expiresIn: '1h',
    });

    expect(() => verify(token, { secret: TEST_SECRET, issuer: TEST_ISSUER })).toThrow();
  });

  it('should throw TokenExpiredError for expired token', () => {
    const payload: JwtPayload = { sub: 'user-123', role: 'TEACHER' };

    // Create an expired token (expires 1 hour ago)
    const token = jwt.sign(payload, TEST_SECRET, {
      issuer: TEST_ISSUER,
      expiresIn: '-1h',
    });

    expect(() => verify(token, { secret: TEST_SECRET, issuer: TEST_ISSUER })).toThrow();
    // Verify it's specifically a TokenExpiredError
    try {
      verify(token, { secret: TEST_SECRET, issuer: TEST_ISSUER });
    } catch (error) {
      expect(error).toBeInstanceOf(jwt.TokenExpiredError);
    }
  });

  it('should throw for token with wrong issuer', () => {
    const payload: JwtPayload = { sub: 'user-123', role: 'TEACHER' };

    const token = jwt.sign(payload, TEST_SECRET, {
      issuer: 'wrong-issuer',
      expiresIn: '1h',
    });

    expect(() => verify(token, { secret: TEST_SECRET, issuer: TEST_ISSUER })).toThrow();
  });

  it('should throw when JWT_SECRET is not set', () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    try {
      expect(() => verify('any-token')).toThrow('JWT_SECRET environment variable is not set');
    } finally {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  it('should throw when payload missing sub', () => {
    // Manually craft an invalid token with no sub
    const token = jwt.sign({ role: 'TEACHER' }, TEST_SECRET, {
      issuer: TEST_ISSUER,
      expiresIn: '1h',
    });

    expect(() => verify(token, { secret: TEST_SECRET, issuer: TEST_ISSUER })).toThrow('JWT payload missing required field: sub');
  });

  it('should throw when payload missing role', () => {
    const token = jwt.sign({ sub: 'user-123' }, TEST_SECRET, {
      issuer: TEST_ISSUER,
      expiresIn: '1h',
    });

    expect(() => verify(token, { secret: TEST_SECRET, issuer: TEST_ISSUER })).toThrow('JWT payload missing required field: role');
  });

  it('should use default issuer from env', () => {
    const originalIssuer = process.env.JWT_ISSUER;
    delete process.env.JWT_ISSUER;

    try {
      const payload: JwtPayload = { sub: 'user-123', role: 'TEACHER' };
      const token = jwt.sign(payload, TEST_SECRET, {
        issuer: 'verveai',
        expiresIn: '1h',
      });

      const result = verify(token, { secret: TEST_SECRET });
      expect(result.sub).toBe('user-123');
    } finally {
      process.env.JWT_ISSUER = originalIssuer;
    }
  });
});

describe('decode', () => {
  it('should decode a token without verifying signature', () => {
    const payload: JwtPayload = {
      sub: 'user-123',
      role: 'TEACHER',
      email: 'teacher@example.com',
    };

    const token = jwt.sign(payload, TEST_SECRET, {
      issuer: TEST_ISSUER,
      expiresIn: '1h',
    });

    const decoded = decode(token);

    expect(decoded).not.toBeNull();
    expect(decoded?.sub).toBe('user-123');
    expect(decoded?.role).toBe('TEACHER');
    expect(decoded?.email).toBe('teacher@example.com');
  });

  it('should decode even with wrong signature', () => {
    const payload: JwtPayload = { sub: 'user-123', role: 'TEACHER' };

    const token = jwt.sign(payload, 'wrong-secret-min-32-chars!!!', {
      issuer: TEST_ISSUER,
      expiresIn: '1h',
    });

    const decoded = decode(token);

    expect(decoded?.sub).toBe('user-123');
  });

  it('should return null for malformed token', () => {
    expect(decode('not-a-valid-token')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(decode('')).toBeNull();
  });

  it('should return null when decoded value is not an object', () => {
    // Decode a string token (non-standard JWT)
    expect(decode('abc.def')).toBeNull();
  });
});

describe('isExpired', () => {
  it('should return true for expired token', () => {
    const payload: JwtPayload = { sub: 'user-123', role: 'TEACHER' };

    const token = jwt.sign(payload, TEST_SECRET, {
      issuer: TEST_ISSUER,
      expiresIn: '-1h', // Expired 1 hour ago
    });

    expect(isExpired(token)).toBe(true);
  });

  it('should return false for valid token', () => {
    const payload: JwtPayload = { sub: 'user-123', role: 'TEACHER' };

    const token = jwt.sign(payload, TEST_SECRET, {
      issuer: TEST_ISSUER,
      expiresIn: '1h',
    });

    expect(isExpired(token)).toBe(false);
  });

  it('should return true for token without exp', () => {
    const token = jwt.sign({ sub: 'user-123', role: 'TEACHER' }, TEST_SECRET, {
      issuer: TEST_ISSUER,
    });

    expect(isExpired(token)).toBe(true);
  });

  it('should return true for malformed token', () => {
    expect(isExpired('not-a-valid-token')).toBe(true);
  });

  it('should return true for empty string', () => {
    expect(isExpired('')).toBe(true);
  });

  it('should return true for token expiring exactly now', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    const payload: JwtPayload = { sub: 'user-123', role: 'TEACHER' };

    // Sign with expiresIn: 1h, then decode exp
    const token = jwt.sign(payload, TEST_SECRET, {
      issuer: TEST_ISSUER,
      expiresIn: '1h',
    });

    const decoded = decode(token);
    const expTime = decoded!.exp! * 1000;

    // Mock time to be exactly at exp
    vi.setSystemTime(new Date(expTime));

    expect(isExpired(token)).toBe(true);

    vi.useRealTimers();
  });
});
