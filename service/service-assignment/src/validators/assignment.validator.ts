import { z } from 'zod';

/**
 * Validator schemas for /api/assignment endpoints.
 *
 * Bodies, query strings, and URL params are validated against these Zod
 * schemas inside the route layer. The parsed value is forwarded to the
 * service layer so handlers always receive typed input.
 */

/** Request body for POST /api/assignment */
export const createAssignmentSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title must be at most 200 characters'),
  description: z.string().max(2000, 'Description must be at most 2000 characters').optional(),
  classId: z.string().uuid({ message: 'classId must be a valid UUID' }),
  startsAt: z.string().datetime({ message: 'startsAt must be a valid ISO 8601 datetime' }).optional().nullable(),
  dueAt: z.string().datetime({ message: 'dueAt must be a valid ISO 8601 datetime' }).optional().nullable(),
  maxAttempts: z.number().int().min(1, 'maxAttempts must be at least 1').default(1)
});

/** Request body for PUT /api/assignment/:id (all fields optional) */
export const updateAssignmentSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title must be at most 200 characters').optional(),
  description: z.string().max(2000, 'Description must be at most 2000 characters').optional().nullable(),
  classId: z.string().uuid({ message: 'classId must be a valid UUID' }).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  startsAt: z.string().datetime({ message: 'startsAt must be a valid ISO 8601 datetime' }).optional().nullable(),
  dueAt: z.string().datetime({ message: 'dueAt must be a valid ISO 8601 datetime' }).optional().nullable(),
  maxAttempts: z.number().int().min(1, 'maxAttempts must be at least 1').optional()
});

/** URL params for /api/assignment/:id routes */
export const assignmentIdSchema = z.object({
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

/**
 * Query string for listing assignments with filters.
 */
export const listAssignmentsQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20),
  teacherId: z.string().uuid({ message: 'teacherId must be a valid UUID' }).optional(),
  classId: z.string().uuid({ message: 'classId must be a valid UUID' }).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional()
});

/** Inferred input types */
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type ListAssignmentsQuery = z.infer<typeof listAssignmentsQuerySchema>;
