import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, signJwt, verifyJwt, isJwtExpired } from '../src/crypto';

describe('crypto', () => {
  describe('hashPassword / verifyPassword', () => {
    it('should hash and verify a valid password', async () => {
      const hash = await hashPassword('Secret123!');
      expect(hash).not.toBe('Secret123!');
      expect(hash.startsWith('$2')).toBe(true); // bcrypt prefix

      const ok = await verifyPassword('Secret123!', hash);
      expect(ok).toBe(true);
    });

    it('should reject wrong password', async () => {
      const hash = await hashPassword('Secret123!');
      const ok = await verifyPassword('WrongPassword!', hash);
      expect(ok).toBe(false);
    });

    it('should reject empty password', async () => {
      const ok = await verifyPassword('', 'somehash');
      expect(ok).toBe(false);
    });

    it('should throw on password too short', async () => {
      await expect(hashPassword('short')).rejects.toThrow();
    });

    it('should throw on password too long', async () => {
      const long = 'A'.repeat(129);
      await expect(hashPassword(long)).rejects.toThrow();
    });
  });

  describe('signJwt / verifyJwt', () => {
    it('should sign and verify a JWT', () => {
      const token = signJwt({ sub: 'user-123', role: 'TEACHER', email: 'teacher@school.vn' });
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts

      const payload = verifyJwt(token);
      expect(payload.sub).toBe('user-123');
      expect(payload.role).toBe('TEACHER');
    });

    it('should sign with custom expiry', () => {
      const token = signJwt({ sub: 'user-1', role: 'STUDENT' }, { expiresIn: '1h' });
      const payload = verifyJwt(token);
      expect(payload.sub).toBe('user-1');
    });

    it('should reject tampered token', () => {
      const token = signJwt({ sub: 'user-1', role: 'STUDENT' });
      const tampered = token.slice(0, -5) + 'xxxxx';
      expect(() => verifyJwt(tampered)).toThrow();
    });
  });

  describe('isJwtExpired', () => {
    it('should return false for valid token', () => {
      const token = signJwt({ sub: 'user-1', role: 'STUDENT' }, { expiresIn: '1h' });
      expect(isJwtExpired(token)).toBe(false);
    });

    it('should return true for invalid token', () => {
      expect(isJwtExpired('not.a.valid.jwt')).toBe(true);
      expect(isJwtExpired('')).toBe(true);
    });
  });
});
