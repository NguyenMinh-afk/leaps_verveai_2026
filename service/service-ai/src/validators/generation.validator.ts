/**
 * Zod schemas for AI question generation.
 * Defines the input DTO for generating questions via the AI service.
 */

import { z } from 'zod';

// ─── Input Schemas ─────────────────────────────────────────────────────────────

export const questionTypeInputSchema = z.enum(['multiple-choice', 'true-false', 'short-answer', 'mixed'], {
  errorMap: () => ({
    message: 'questionType must be one of: multiple-choice, true-false, short-answer, mixed',
  }),
});

export const difficultyInputSchema = z.enum(['easy', 'medium', 'hard', 'mixed'], {
  errorMap: () => ({
    message: 'difficulty must be one of: easy, medium, hard, mixed',
  }),
});

export const languageInputSchema = z.enum(['vi', 'en'], {
  errorMap: () => ({
    message: 'language must be one of: vi, en',
  }),
});

/**
 * Input DTO for question generation request.
 * All fields are optional — the AI will use sensible defaults.
 */
export const generateQuestionsInputSchema = z.object({
  /** Topic name for question generation (e.g. "Algebra", "Quadratic Equations") */
  topic: z.string().max(200, 'topic must be at most 200 characters').optional(),

  /** Display name for the topic (Vietnamese context) */
  topicName: z.string().max(200, 'topicName must be at most 200 characters').optional(),

  /** Difficulty level for the generated questions */
  difficulty: difficultyInputSchema.optional(),

  /** Type of questions to generate */
  questionType: questionTypeInputSchema.optional(),

  /** Number of questions to generate (1 to MAX_QUESTIONS_PER_REQUEST from env) */
  questionCount: z.coerce.number().int().min(1).max(50).optional(),

  /** Optional BKT skill ID to tag the questions */
  skillId: z.string().max(100, 'skillId must be at most 100 characters').optional(),

  /** Language for generated questions (default: vi) */
  language: languageInputSchema.default('vi'),

  /** Additional instructions for the AI */
  additionalInstructions: z.string().max(1000, 'additionalInstructions must be at most 1000 characters').optional(),

  /** Whether to automatically submit generated questions to content service */
  autoSubmit: z.boolean().default(false),
});

export type GenerateQuestionsInput = z.infer<typeof generateQuestionsInputSchema>;

// ─── Output Schemas ────────────────────────────────────────────────────────────

/**
 * Schema for a single generated question draft.
 * This is returned to the caller for review before persistence.
 */
export const generatedQuestionDraftSchema = z.object({
  /** Short title for the question */
  title: z.string().min(1, 'title is required').max(255, 'title must be at most 255 characters'),

  /** Question body text */
  body: z.string().min(1, 'body is required'),

  /** Difficulty level (1=easy, 2-4=medium, 5=hard) */
  difficulty: z.number().int().min(1).max(5),

  /** Type of question */
  type: z.enum(['multiple-choice', 'true-false', 'short-answer']),

  /** Options for multiple-choice or true-false questions */
  options: z
    .array(
      z.object({
        text: z.string().min(1, 'option text is required'),
        isCorrect: z.boolean(),
      })
    )
    .optional(),

  /** Correct answer for short-answer questions */
  correctAnswer: z.string().optional(),

  /** Explanation for the correct answer */
  explanation: z.string().min(1, 'explanation is required'),

  /** Optional topic associated with the question */
  topic: z.string().optional(),

  /** Additional metadata */
  metadata: z
    .object({
      topicId: z.string().optional(),
      skillId: z.string().optional(),
      language: z.string().optional(),
    })
    .optional(),
});

export type GeneratedQuestionDraft = z.infer<typeof generatedQuestionDraftSchema>;

/**
 * Schema for the complete generation response.
 */
export const generationResponseSchema = z.object({
  /** Array of generated question drafts */
  questions: z.array(generatedQuestionDraftSchema),

  /** Metadata about the generation request */
  meta: z.object({
    topic: z.string().optional(),
    difficulty: z.string().optional(),
    questionType: z.string().optional(),
    requestedCount: z.number(),
    generatedCount: z.number(),
    provider: z.string(),
    model: z.string(),
    latencyMs: z.number(),
  }),
});

export type GenerationResponse = z.infer<typeof generationResponseSchema>;

/**
 * Schema for auto-submit response (when questions are persisted).
 */
export const autoSubmitResponseSchema = z.object({
  questions: z.array(
    z.object({
      /** Draft of the generated question */
      draft: generatedQuestionDraftSchema,
      /** ID of the created question in content service */
      questionId: z.string().uuid(),
      /** Status of the created question */
      status: z.string(),
    })
  ),
  meta: z.object({
    totalCreated: z.number(),
    provider: z.string(),
    model: z.string(),
    latencyMs: z.number(),
  }),
});

export type AutoSubmitResponse = z.infer<typeof autoSubmitResponseSchema>;
