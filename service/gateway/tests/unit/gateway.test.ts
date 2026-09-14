import { describe, it, expect, vi, beforeEach } from 'vitest';

// IMPORTANT: set the JWT_SECRET env var BEFORE importing the policy so
// the policy module's `process.env.JWT_SECRET ?? fallback` picks up the
// same secret the test signs with. Using vi.hoisted ensures this runs
// before the `import` statement below.
const JWT_SECRET = 'test-secret-min-32-chars!!';
vi.hoisted(() => {
  process.env['JWT_SECRET'] = 'test-secret-min-32-chars!!';
});

import { verifyJwt } from '../../src/policies/jwt';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

describe('Gateway JWT Policy', () => { 
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFn: NextFunction;

  beforeEach(() => {
    mockReq = { headers: {}, ip: '127.0.0.1' };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    nextFn = vi.fn();
  });

  it('should return 401 when no token provided', () => {
    verifyJwt(mockReq as Request, mockRes as Response, nextFn);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ code: 'UNAUTHORIZED' }) })
    );
    expect(nextFn).not.toHaveBeenCalled();
  });

  it('should call next() for valid token', () => {
    const token = jwt.sign({ sub: 'user-1', role: 'TEACHER', email: 'test@example.com' }, JWT_SECRET, { issuer: 'verveai' });
    mockReq.headers = { authorization: `Bearer ${token}` };

    verifyJwt(mockReq as Request, mockRes as Response, nextFn);

    expect(nextFn).toHaveBeenCalled();
    expect(mockReq.headers['x-user-id']).toBe('user-1');
    expect(mockReq.headers['x-user-role']).toBe('TEACHER');
  });

  it('should return 401 for invalid token', () => {
    mockReq.headers = { authorization: 'Bearer invalid-token' };

    verifyJwt(mockReq as Request, mockRes as Response, nextFn);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(nextFn).not.toHaveBeenCalled();
  });
});
