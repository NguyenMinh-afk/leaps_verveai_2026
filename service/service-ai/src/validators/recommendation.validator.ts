/**
 * Input validation schema for the recommendation endpoint.
 */

import { z } from 'zod';

export const recommendationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(5),
  includeContent: z.coerce.boolean().default(true),
  language: z.enum(['vi', 'en']).default('vi'),
});

export type RecommendationQueryInput = z.infer<typeof recommendationQuerySchema>;
