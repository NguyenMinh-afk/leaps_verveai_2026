import { z } from 'zod';

/**
 * Validator for PUT /api/bkt/interventions/:id
 */
export const updateInterventionSchema = z
  .object({
    priority: z.number().int().min(0).max(100).optional(),
    status: z.enum(['ACTIVE', 'RESOLVED', 'CANCELLED']).optional(),
    notes: z.string().max(2000).optional(),
  })
  .strict();

export type UpdateInterventionInput = z.infer<typeof updateInterventionSchema>;

/**
 * Validator for PUT /api/bkt/interventions/:id/override
 * Implements FR-17 — teacher override of an automated intervention.
 */
export const overrideInterventionSchema = z.object({
  reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(1000, 'Reason must be at most 1000 characters'),
  newStatus: z.enum(['ACTIVE', 'RESOLVED', 'CANCELLED']),
});

export type OverrideInterventionInput = z.infer<typeof overrideInterventionSchema>;

/**
 * Validator for POST /api/bkt/interventions/:id/note
 */
export const addNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'Note content cannot be empty')
    .max(2000, 'Note content must be at most 2000 characters'),
});

export type AddNoteInput = z.infer<typeof addNoteSchema>;

/**
 * Validator for GET /api/bkt/interventions path query.
 * Allows filter by status, priority, classId and pagination.
 */
export const listInterventionsQuerySchema = z.object({
  status: z.enum(['ACTIVE', 'RESOLVED', 'CANCELLED']).optional(),
  minPriority: z.coerce.number().int().min(0).max(100).optional(),
  maxPriority: z.coerce.number().int().min(0).max(100).optional(),
  classId: z.string().uuid({ message: 'classId must be a UUID' }).optional(),
  studentId: z.string().uuid({ message: 'studentId must be a UUID' }).optional(),
  skillId: z.string().uuid({ message: 'skillId must be a UUID' }).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListInterventionsQuery = z.infer<typeof listInterventionsQuerySchema>;

/**
 * Validator for path params — intervention id.
 */
export const interventionIdParamSchema = z.object({
  id: z.string().uuid({ message: 'interventionId must be a UUID' }),
});

export type InterventionIdParam = z.infer<typeof interventionIdParamSchema>;

/**
 * Validator for class id path param.
 */
export const classIdParamSchema = z.object({
  id: z.string().uuid({ message: 'classId must be a UUID' }),
});

export type ClassIdParam = z.infer<typeof classIdParamSchema>;
