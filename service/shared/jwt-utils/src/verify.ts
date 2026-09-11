/**
 * JWT verification utilities for VERVEAI Gateway
 *
 * This module is used by the API Gateway to verify JWT tokens.
 * Services trust the Gateway's verification and use the X-User-Id
 * and X-User-Role headers instead of re-verifying JWT.
 */

import jwt from 'jsonwebtoken';

export interface JwtPayload {
  /** User ID */
  sub: string;
  /** User role */
  role: string;
  /** User email (optional) */
  email?: string;
  /** User name (optional) */
  name?: string;
  /** Issued at (Unix timestamp) */
  iat?: number;
  /** Expiration (Unix timestamp) */
  exp?: number;
  /** Issuer */
  iss?: string;
}

export interface VerifyOptions {
  /** Secret key (default: from JWT_SECRET env) */
  secret?: string;
  /** Expected issuer (default: from JWT_ISSUER env or 'verveai') */
  issuer?: string;
}

/**
 * Get the default JWT secret from environment
 */
function getDefaultSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

/**
 * Get the default JWT issuer from environment
 */
function getDefaultIssuer(): string {
  return process.env.JWT_ISSUER || 'verveai';
}

/**
 * Verify a JWT token and return its payload
 * Throws if the token is invalid, expired, or has a wrong issuer
 */
export function verify(token: string, options?: VerifyOptions): JwtPayload {
  const secret = options?.secret || getDefaultSecret();
  const issuer = options?.issuer || getDefaultIssuer();

  try {
    const decoded = jwt.verify(token, secret, {
      issuer,
      algorithms: ['HS256'],
    }) as JwtPayload;

    if (!decoded.sub) {
      throw new Error('JWT payload missing required field: sub');
    }

    if (!decoded.role) {
      throw new Error('JWT payload missing required field: role');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw error;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw error;
    }
    throw error;
  }
}

/**
 * Decode a JWT token without verifying its signature
 * Returns null if the token is malformed
 */
export function decode(token: string): JwtPayload | null {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded !== 'object') {
      return null;
    }
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Check if a JWT token is expired
 * Returns true if expired, false if still valid
 * Note: This decodes without verifying signature
 */
export function isExpired(token: string): boolean {
  const payload = decode(token);
  if (!payload || !payload.exp) {
    return true;
  }
  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 <= Date.now();
}
