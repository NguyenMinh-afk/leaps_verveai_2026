/**
 * Zod schemas for content validation.
 */

import { z } from 'zod';

export const contentTypeSchema = z.enum(['ITEM_QUESTION', 'ITEM_EXPLANATION', 'ITEM_MEDIA'], {
  errorMap: () => ({ message: 'type must be one of: ITEM_QUESTION, ITEM_EXPLANATION, ITEM_MEDIA' }),
});

export const contentStatusSchema = z.enum(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'], {
  errorMap: () => ({ message: 'status must be one of: DRAFT, PENDING_REVIEW, APPROVED, REJECTED' }),
});

export const createContentSchema = z.object({
  type: contentTypeSchema,
  title: z.string().min(3, 'title must be at least 3 characters').max(255, 'title must be at most 255 characters'),
  body: z.string().min(1, 'body is required'),
  difficulty: z.coerce.number().int().min(1, 'difficulty must be at least 1').max(5, 'difficulty must be at most 5').default(1),
});

export type CreateContentInput = z.infer<typeof createContentSchema>;

export const updateContentSchema = createContentSchema.partial();

export type UpdateContentInput = z.infer<typeof updateContentSchema>;

export const contentFilterSchema = z.object({
  type: contentTypeSchema.optional(),
  status: contentStatusSchema.optional(),
  authorId: z.string().uuid({ message: 'authorId must be a valid UUID' }).optional(),
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20),
});

export type ContentFilterInput = z.infer<typeof contentFilterSchema>;

export const submitForReviewSchema = z.object({});

export const idParamSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID' }),
});

export type IdParam = z.infer<typeof idParamSchema>;
