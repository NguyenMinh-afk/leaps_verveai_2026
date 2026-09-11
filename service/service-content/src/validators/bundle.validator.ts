/**
 * Zod schemas for bundle validation.
 */

import { z } from 'zod';

export const buildBundleSchema = z.object({
  name: z.string().min(2, 'name must be at least 2 characters').max(100, 'name must be at most 100 characters'),
  contentIds: z.array(z.string().uuid({ message: 'each contentId must be a valid UUID' })).min(1, 'at least one content ID is required').max(500, 'bundle cannot contain more than 500 items'),
});

export type BuildBundleInput = z.infer<typeof buildBundleSchema>;

export const bundleIdParamSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID' }),
});

export type BundleIdParam = z.infer<typeof bundleIdParamSchema>;

export const paginationSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
