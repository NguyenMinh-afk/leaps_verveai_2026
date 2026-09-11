/**
 * Zod schemas for review validation.
 */

import { z } from 'zod';

export const reviewActionSchema = z.object({
  comment: z.string().min(5, 'comment must be at least 5 characters').max(1000, 'comment must be at most 1000 characters'),
});

export type ReviewActionInput = z.infer<typeof reviewActionSchema>;

export const reviewIdParamSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID' }),
});

export type ReviewIdParam = z.infer<typeof reviewIdParamSchema>;

export const reviewPaginationSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20),
});

export type ReviewPaginationInput = z.infer<typeof reviewPaginationSchema>;
