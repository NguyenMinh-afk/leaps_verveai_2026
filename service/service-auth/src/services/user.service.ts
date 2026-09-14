import { prisma } from '../prisma/client';
import { NotFoundError } from '@verveai/error-types';

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, is_active: true, created_at: true },
  });
  if (!user) throw new NotFoundError('User', id);
  return user;
}

export async function listUsers(skip = 0, take = 20) {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      orderBy: { created_at: 'desc' },
      select: { id: true, email: true, name: true, role: true, is_active: true, created_at: true },
    }),
    prisma.user.count(),
  ]);
  return { users, total, skip, take };
}

/**
 * List users with filters - for admin panel
 */
export interface ListUsersFilters {
  skip?: number;
  take?: number;
  role?: string;
  is_active?: boolean;
  search?: string;
}

export async function listUsersAdmin(filters: ListUsersFilters = {}) {
  const { skip = 0, take = 20, role, is_active, search } = filters;

  const where: Record<string, unknown> = {};

  if (role) {
    where.role = role;
  }

  if (is_active !== undefined) {
    where.is_active = is_active;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: 'desc' },
      select: { id: true, email: true, name: true, role: true, is_active: true, created_at: true },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, skip, take };
}

/**
 * Get user statistics - for admin dashboard
 */
export async function getUserStats() {
  const [total, active, byRole] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { is_active: true } }),
    prisma.user.groupBy({
      by: ['role'],
      _count: true,
    }),
  ]);

  const byRoleMap: Record<string, number> = {};
  for (const r of byRole) {
    byRoleMap[r.role] = r._count;
  }

  return {
    total,
    active,
    inactive: total - active,
    byRole: byRoleMap,
  };
}

export async function updateUser(id: string, data: { name?: string; email?: string; is_active?: boolean; role?: string }) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError('User', id);

  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true, is_active: true },
  });
}

export async function deleteUser(id: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError('User', id);
  await prisma.user.delete({ where: { id } });
}
