/**
 * Crypto — bcrypt password hashing + JWT sign/verify helpers.
 *
 * Usage:
 *   import { hashPassword, verifyPassword, signJwt, verifyJwt } from '@verveai/common-node';
 *
 *   const hash = await hashPassword('secret123');
 *   const ok = await verifyPassword('secret123', hash);
 *
 *   const token = signJwt({ userId: '123', role: 'TEACHER' }, '1d');
 *   const payload = verifyJwt(token);
 *
 * @module crypto
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { InternalError } from '../error';

// ─── bcrypt helpers ────────────────────────────────────────────────────────────

/** Bcrypt salt rounds — production minimum is 12 */
export const BCRYPT_ROUNDS = Number(process.env['BCRYPT_ROUNDS']) || 12;

/**
 * Hash a plaintext password.
 * @param plaintext  Plaintext password (8-128 chars).
 */
export async function hashPassword(plaintext: string): Promise<string> {
  if (!plaintext || plaintext.length < 8 || plaintext.length > 128) {
    throw new InternalError('Password must be 8–128 characters');
  }
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

/**
 * Verify a plaintext password against a bcrypt hash.
 * Uses timing-safe comparison.
 */
export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  if (!plaintext || !hash) return false;
  try {
    return bcrypt.compare(plaintext, hash);
  } catch {
    return false;
  }
}

// ─── JWT helpers ────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string;          // user ID
  role: string;         // UserRole
  email?: string;
  name?: string;
}

export interface JwtOptions {
  expiresIn?: string;    // e.g. '1d', '7d', '15m' — default '1d'
  issuer?: string;      // default SERVICE_NAME
}

const JWT_SECRET = process.env['JWT_SECRET'] ?? (() => {
  if (process.env['NODE_ENV'] === 'production') {
    throw new InternalError('JWT_SECRET env var is required in production');
  }
  return 'dev-secret-do-not-use-in-production';
})();

const JWT_ISSUER = process.env['SERVICE_NAME'] ?? 'verveai';

/**
 * Sign a payload into a JWT.
 */
export function signJwt(payload: JwtPayload, options: JwtOptions = {}): string {
  const { expiresIn = '1d', issuer = JWT_ISSUER } = options;
  return jwt.sign(payload, JWT_SECRET, { expiresIn, issuer });
}

/**
 * Verify and decode a JWT.
 * Throws on invalid/expired token.
 */
export function verifyJwt(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER });
    return decoded as JwtPayload;
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      const { AuthError, ErrorCode } = require('../error');
      throw new AuthError(ErrorCode.TOKEN_EXPIRED, 'Token has expired');
    }
    if (e instanceof jwt.JsonWebTokenError) {
      const { AuthError, ErrorCode } = require('../error');
      throw new AuthError(ErrorCode.INVALID_TOKEN, 'Invalid token');
    }
    throw e;
  }
}

/**
 * Decode a JWT without verification (for logging/debugging only).
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Check if a token is expired (without verifying signature).
 * Useful for UI to show "session expired" without server call.
 */
export function isJwtExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
