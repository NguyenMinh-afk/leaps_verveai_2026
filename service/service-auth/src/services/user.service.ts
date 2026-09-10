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
