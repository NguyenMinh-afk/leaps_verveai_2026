import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from '../../src/services/auth.service';
import { prisma } from '../../src/prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

vi.mock('../../src/prisma/client', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    session: {
      create: vi.fn(),
      updateMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../../src/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Test User',
        role: 'TEACHER',
        is_active: true,
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.session.create).mockResolvedValue({} as any);

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw AuthError for invalid credentials', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(authService.login('wrong@example.com', 'wrong')).rejects.toThrow();
    });

    it('should throw AuthError for inactive user', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Test User',
        role: 'TEACHER',
        is_active: false,
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      await expect(authService.login('test@example.com', 'password123')).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('should register new user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: '123',
        email: 'new@example.com',
        name: 'New User',
        role: 'TEACHER',
      } as any);

      const result = await authService.register('new@example.com', 'password123', 'New User', 'TEACHER');

      expect(result).toHaveProperty('id');
      expect(result.email).toBe('new@example.com');
    });

    it('should throw AuthError if email exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: '123',
        email: 'existing@example.com',
      } as any);

      await expect(authService.register('existing@example.com', 'password', 'User', 'TEACHER')).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should revoke session token', async () => {
      vi.mocked(prisma.session.updateMany).mockResolvedValue({ count: 1 } as any);

      await authService.logout('some-token');

      expect(prisma.session.updateMany).toHaveBeenCalledWith({
        where: { token: 'some-token' },
        data: expect.objectContaining({ revoked_at: expect.any(Date) }),
      });
    });
  });

  describe('refreshTokens', () => {
    it('should refresh valid refresh token', async () => {
      const mockSession = {
        id: '123',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'TEACHER',
          is_active: true,
        },
      };

      // Mock JWT verify
      vi.spyOn(jwt, 'verify').mockReturnValue({ sub: 'user-123', type: 'refresh' } as any);
      vi.mocked(prisma.session.findFirst).mockResolvedValue(mockSession as any);
      vi.mocked(prisma.session.update).mockResolvedValue({} as any);

      const result = await authService.refreshTokens('valid-refresh-token');

      expect(result).toHaveProperty('token');
      expect(prisma.session.update).toHaveBeenCalled();
    });

    it('should throw AuthError for invalid refresh token', async () => {
      vi.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshTokens('invalid-token')).rejects.toThrow();
    });
  });

  describe('getCurrentUser', () => {
    it('should return user data', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'TEACHER',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const result = await authService.getCurrentUser('123');

      expect(result).toHaveProperty('id', '123');
      expect(result).toHaveProperty('email', 'test@example.com');
    });

    it('should throw AuthError for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(authService.getCurrentUser('non-existent')).rejects.toThrow();
    });
  });
});
