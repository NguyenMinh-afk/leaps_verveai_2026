import { z } from 'zod';

/**
 * Validator for POST /api/bkt/evidence
 */
export const recordEvidenceSchema = z.object({
  diagnosisId: z.string().uuid({ message: 'diagnosisId must be a UUID' }),
  itemId: z.string().uuid({ message: 'itemId must be a UUID' }),
  extractedAnswer: z.string().max(2000).optional(),
  correct: z.boolean({ required_error: 'correct is required' }),
  confidence: z.number().min(0).max(1).default(0),
  quality: z.enum(['HIGH', 'MEDIUM', 'LOW', 'UNKNOWN']).default('UNKNOWN'),
});

export type RecordEvidenceInput = z.infer<typeof recordEvidenceSchema>;

/**
 * Validator for GET /api/bkt/evidence/:id
 */
export const evidenceIdParamSchema = z.object({
  id: z.string().uuid({ message: 'evidenceId must be a UUID' }),
});

export type EvidenceIdParam = z.infer<typeof evidenceIdParamSchema>;

/**
 * Validator for GET /api/bkt/evidence/:id/chain
 * Path params — diagnosis id.
 */
export const diagnosisIdParamSchema = z.object({
  id: z.string().uuid({ message: 'diagnosisId must be a UUID' }),
});

export type DiagnosisIdParam = z.infer<typeof diagnosisIdParamSchema>;
