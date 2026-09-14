import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import type { JwtPayload } from '../types/jwt';

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'fallback-secret-min-32-chars!!';
const JWT_ISSUER = process.env['JWT_ISSUER'] ?? 'verveai';

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing authorization token' },
    });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER }) as JwtPayload;
    
    // Attach user info to request for downstream services
    req.headers['x-user-id'] = payload.sub;
    req.headers['x-user-role'] = payload.role;
    req.headers['x-user-email'] = payload.email ?? '';
    
    next();
  } catch (err) {
    const message = err instanceof jwt.TokenExpiredError
      ? 'Token expired'
      : err instanceof jwt.JsonWebTokenError
        ? 'Invalid token'
        : 'Authentication failed';
    
    logger.warn('JWT verification failed', { message, tokenPrefix: token.slice(0, 10) });
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message },
    });
  }
}

/**
 * Admin authorization middleware.
 * Must be used after verifyJwt middleware.
 * Checks x-user-role header (set by verifyJwt).
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userRole = req.headers['x-user-role'] as string | undefined;

  if (!userRole) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
    return;
  }

  if (userRole !== 'ADMIN') {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    });
    return;
  }

  next();
}

/**
 * Require specific roles middleware factory.
 * Must be used after verifyJwt middleware.
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.headers['x-user-role'] as string | undefined;

    if (!userRole) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
      return;
    }

    if (!roles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: `Required role: ${roles.join(' or ')}` },
      });
      return;
    }

    next();
  };
}
