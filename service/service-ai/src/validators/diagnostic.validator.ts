/**
 * Input validation for diagnostic interpretation requests.
 */

import { z } from 'zod';

export const diagnosticRequestSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  includeEvidence: z.boolean().optional().default(true),
  includePrerequisites: z.boolean().optional().default(false),
  maxSkills: z.number().int().min(1).max(50).optional().default(10),
  language: z.enum(['vi', 'en']).optional().default('vi'),
});

export type DiagnosticRequest = z.infer<typeof diagnosticRequestSchema>;

export const diagnosticQuerySchema = z.object({
  includeEvidence: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  includePrerequisites: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  maxSkills: z.coerce.number().int().min(1).max(50).optional(),
  language: z.enum(['vi', 'en']).optional(),
});

export type DiagnosticQuery = z.infer<typeof diagnosticQuerySchema>;
