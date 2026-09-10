import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userService from '../../src/services/user.service';
import { prisma } from '../../src/prisma/client';
import { NotFoundError } from '@verveai/error-types';

vi.mock('../../src/prisma/client', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'TEACHER',
        is_active: true,
        created_at: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const result = await userService.getUserById('123');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          is_active: true,
          created_at: true,
        },
      });
    });

    it('should throw NotFoundError when user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(userService.getUserById('999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('listUsers', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User 1',
          role: 'TEACHER',
          is_active: true,
          created_at: new Date(),
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'User 2',
          role: 'ADMIN',
          is_active: true,
          created_at: new Date(),
        },
      ];

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any);
      vi.mocked(prisma.user.count).mockResolvedValue(2);

      const result = await userService.listUsers(0, 20);

      expect(result).toEqual({
        users: mockUsers,
        total: 2,
        skip: 0,
        take: 20,
      });
    });
  });

  describe('updateUser', () => {
    it('should update user when found', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'TEACHER',
        is_active: true,
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

      const result = await userService.updateUser('123', { name: 'Updated Name' });

      expect(result).toEqual(mockUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: { name: 'Updated Name' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          is_active: true,
        },
      });
    });

    it('should throw NotFoundError when user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(userService.updateUser('999', { name: 'Test' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteUser', () => {
    it('should delete user when found', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'TEACHER',
        is_active: true,
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as any);

      await userService.deleteUser('123');

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: '123' } });
    });

    it('should throw NotFoundError when user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(userService.deleteUser('999')).rejects.toThrow(NotFoundError);
    });
  });
});
