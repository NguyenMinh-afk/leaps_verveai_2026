import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  is_active: z.boolean().optional(),
  role: z.enum(['TEACHER', 'ADMIN', 'SUPERVISOR']).optional(),
});

export const userIdSchema = z.object({
  id: z.string().uuid(),
});

export const listUsersQuerySchema = z.object({
  skip: z.coerce.number().min(0).optional().default(0),
  take: z.coerce.number().min(1).max(100).optional().default(20),
  role: z.enum(['TEACHER', 'ADMIN', 'SUPERVISOR']).optional(),
  is_active: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
});
