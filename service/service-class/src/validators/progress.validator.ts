import { z } from 'zod';

/**
 * Validator schemas for /api/class/progress endpoints.
 */

/** URL params for routes that take a student id (e.g. /:studentId). */
export const studentIdParamSchema = z.object({
  studentId: z.string().uuid({ message: 'studentId must be a valid UUID' })
});

/** Request body for POST /api/class/progress/:studentId updates. */
export const updateProgressSchema = z.object({
  skillId: z.string().uuid({ message: 'skillId must be a valid UUID' }),
  pKnown: z.number().min(0).max(1)
});

/** Query string for /:studentId/history?skillId=&days=. */
export const progressHistorySchema = z.object({
  skillId: z.string().uuid({ message: 'skillId must be a valid UUID' }),
  days: z.coerce.number().int().min(1).max(365).default(30)
});

/** Query string pagination for /:studentId. */
export const progressPaginationSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20)
});

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type ProgressHistoryInput = z.infer<typeof progressHistorySchema>;
export type ProgressPaginationInput = z.infer<typeof progressPaginationSchema>;
