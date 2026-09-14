import { z } from 'zod';

/**
 * Validator schemas for /api/class/classes endpoints.
 *
 * Bodies, query strings, and URL params are validated against these Zod
 * schemas inside the route layer. The parsed value is forwarded to the
 * service layer so handlers always receive typed input.
 */

/** Request body for POST /api/class/classes. */
export const createClassSchema = z.object({
  name: z.string().min(2).max(100),
  subject: z.string().min(2).max(50)
});

/** Request body for PUT /api/class/classes/:id (all fields optional). */
export const updateClassSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  subject: z.string().min(2).max(50).optional(),
  teacherId: z.string().uuid({ message: 'teacherId must be a valid UUID' }).optional()
});

/** URL params for /api/class/classes/:id routes. */
export const classIdSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID' })
});

/**
 * Query string pagination schema. Coerces raw strings into integers and
 * applies sensible caps so callers cannot request arbitrarily large pages.
 */
export const paginationSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20)
});

/** Inferred input types — keep them in sync with the schemas above. */
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
