import { z } from 'zod';

/**
 * Validator schemas for /api/class/students endpoints.
 */

/** Request body for POST /api/class/students. */
export const createStudentSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255).optional()
});

/** Request body for PUT /api/class/students/:id (all fields optional). */
export const updateStudentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().max(255).nullable().optional()
});

/** URL params for /api/class/students/:id routes. */
export const studentIdSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID' })
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
