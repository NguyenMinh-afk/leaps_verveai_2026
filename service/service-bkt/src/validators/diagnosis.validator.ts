import { z } from 'zod';

/**
 * Validator for POST /api/bkt/diagnosis/run
 * Runs a BKT diagnosis for a single (student, skill) pair.
 */
export const runDiagnosisSchema = z.object({
  studentId: z.string().uuid({ message: 'studentId must be a UUID' }),
  skillId: z.string().uuid({ message: 'skillId must be a UUID' }),
});

export type RunDiagnosisInput = z.infer<typeof runDiagnosisSchema>;

/**
 * Validator for POST /api/bkt/diagnosis/batch
 * Runs a BKT diagnosis for multiple skills for one student.
 */
export const batchDiagnosisSchema = z.object({
  studentId: z.string().uuid({ message: 'studentId must be a UUID' }),
  skillIds: z
    .array(z.string().uuid({ message: 'each skillId must be a UUID' }))
    .min(1, 'skillIds must contain at least 1 skill')
    .max(20, 'skillIds may contain at most 20 skills'),
});

export type BatchDiagnosisInput = z.infer<typeof batchDiagnosisSchema>;

/**
 * Validator for GET /api/bkt/diagnosis/student/:id
 * Path params — student id.
 */
export const studentIdParamSchema = z.object({
  id: z.string().uuid({ message: 'studentId must be a UUID' }),
});

export type StudentIdParam = z.infer<typeof studentIdParamSchema>;
