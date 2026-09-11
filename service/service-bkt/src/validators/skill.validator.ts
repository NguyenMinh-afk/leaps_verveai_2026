import { z } from 'zod';

/**
 * Validator for GET /api/bkt/skills path query (pagination).
 */
export const listSkillsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListSkillsQuery = z.infer<typeof listSkillsQuerySchema>;

/**
 * Validator for path params — skill id.
 */
export const skillIdParamSchema = z.object({
  id: z.string().uuid({ message: 'skillId must be a UUID' }),
});

export type SkillIdParam = z.infer<typeof skillIdParamSchema>;
