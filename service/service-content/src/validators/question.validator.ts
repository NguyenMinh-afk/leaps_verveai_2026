/**
 * Zod schemas for question validation.
 * Extends content validation with question-specific fields.
 */

import { z } from 'zod';

// ─── Question Types ────────────────────────────────────────────────────────────

export const questionTypeSchema = z.enum(['multiple-choice', 'true-false', 'short-answer'], {
  errorMap: () => ({ message: 'type must be one of: multiple-choice, true-false, short-answer' }),
});

export const questionDifficultySchema = z.enum(['easy', 'medium', 'hard'], {
  errorMap: () => ({ message: 'difficulty must be one of: easy, medium, hard' }),
});

// Map frontend difficulty to database difficulty (1-5)
const difficultyToNumber: Record<string, number> = {
  easy: 1,
  medium: 3,
  hard: 5,
};

export function difficultyToDbValue(difficulty: string): number {
  return difficultyToNumber[difficulty] ?? 3;
}

// ─── Question Option ───────────────────────────────────────────────────────────

export const questionOptionSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, 'Option content is required'),
  contentVi: z.string().optional(),
});

export const questionOptionsSchema = z.array(questionOptionSchema).min(2, 'At least 2 options required');

// ─── Question Metadata ─────────────────────────────────────────────────────────

export const questionMetadataSchema = z.object({
  type: questionTypeSchema,
  options: questionOptionsSchema.optional(),
  correctOptionIndex: z.number().int().min(0).optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().optional(),
  explanationVi: z.string().optional(),
  topicId: z.string().optional(),
  topicName: z.string().optional(),
  topicNameVi: z.string().optional(),
  tags: z.array(z.string()).optional(),
  // Legacy fields for Vietnamese content
  contentVi: z.string().optional(),
});

// ─── Create Question ───────────────────────────────────────────────────────────

export const createQuestionSchema = z.object({
  title: z.string().min(3, 'title must be at least 3 characters').max(255, 'title must be at most 255 characters'),
  body: z.string().min(1, 'question body is required'),
  difficulty: questionDifficultySchema,
  topic: z.string().optional(),
  chapter: z.string().optional(),
  metadata: questionMetadataSchema,
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type QuestionMetadataInput = z.infer<typeof questionMetadataSchema>;

// ─── Update Question ───────────────────────────────────────────────────────────

export const updateQuestionSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  body: z.string().min(1).optional(),
  difficulty: questionDifficultySchema.optional(),
  topic: z.string().optional(),
  chapter: z.string().optional(),
  metadata: questionMetadataSchema.partial().optional(),
});

export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

// ─── Question Filters ──────────────────────────────────────────────────────────

export const questionFilterSchema = z.object({
  search: z.string().optional(),
  difficulty: questionDifficultySchema.optional(),
  type: questionTypeSchema.optional(),
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED']).optional(),
  topic: z.string().optional(),
  authorId: z.string().uuid({ message: 'authorId must be a valid UUID' }).optional(),
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(20),
});

export type QuestionFilterInput = z.infer<typeof questionFilterSchema>;

// ─── Submit for Review ─────────────────────────────────────────────────────────

export const submitReviewSchema = z.object({});

// ─── Review Action (Approve/Reject) ─────────────────────────────────────────

export const reviewActionSchema = z.object({
  comment: z.string().min(5, 'comment must be at least 5 characters').max(1000, 'comment must be at most 1000 characters').optional(),
});

export type ReviewActionInput = z.infer<typeof reviewActionSchema>;

// ─── ID Parameter ──────────────────────────────────────────────────────────────

export const idParamSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID' }),
});

export type IdParam = z.infer<typeof idParamSchema>;
