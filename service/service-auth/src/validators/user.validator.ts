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
