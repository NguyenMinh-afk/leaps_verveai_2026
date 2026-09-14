/**
 * Question generation routes for service-ai.
 *
 * POST /api/ai/generate/questions
 *   Generate questions using AI. Optionally auto-submit to content service.
 *
 * All routes require JWT authentication via X-User-Id and X-User-Role headers.
 * Only teachers and admins can generate questions.
 */

import { Router, type Request, type Response } from 'express';
import { validateEnv } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AIError, AIErrorCode } from '../types/errors.js';
import { createProvider, type LLMConfig } from '../services/providers/index.js';
import { generateQuestions } from '../services/generation.service.js';
import { getContentClient } from '../services/content-client.js';
import {
  generateQuestionsInputSchema,
  type GenerateQuestionsInput,
} from '../validators/generation.validator.js';

const env = validateEnv();
const router: Router = Router();

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthedRequest extends Request {
  headers: Request['headers'] & {
    'x-user-id'?: string;
    'x-user-role'?: string;
  };
}

interface GenerationSuccessResponse {
  success: boolean;
  data: {
    questions: unknown[];
    meta: {
      topic?: string;
      difficulty?: string;
      questionType?: string;
      requestedCount: number;
      generatedCount: number;
      provider: string;
      model: string;
      latencyMs: number;
    };
  };
  error: null;
}

interface AutoSubmitSuccessResponse {
  success: boolean;
  data: {
    questions: Array<{
      draft: unknown;
      questionId: string;
      status: string;
    }>;
    meta: {
      totalCreated: number;
      provider: string;
      model: string;
      latencyMs: number;
    };
  };
  error: null;
}

interface ErrorResponse {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────

/**
 * Verify user is authenticated and authorized.
 * Sets user context on the request object.
 */
function requireAuth(req: AuthedRequest): { userId: string; role: string } | null {
  const userId = req.headers['x-user-id'];
  const role = req.headers['x-user-role']?.toLowerCase();

  if (!userId) {
    return null;
  }

  return { userId, role: role ?? 'unknown' };
}

/**
 * Verify user has teacher or admin role.
 */
function isTeacherOrAdmin(role: string): boolean {
  return role === 'teacher' || role === 'admin';
}

// ─── Response Helpers ──────────────────────────────────────────────────────────

function ok<T>(res: Response, data: T): void {
  res.status(200).json({ success: true, data, error: null });
}

function created<T>(res: Response, data: T): void {
  res.status(201).json({ success: true, data, error: null });
}

function error(res: Response, status: number, code: string, message: string, details?: Record<string, unknown>): void {
  const response: ErrorResponse = {
    success: false,
    data: null,
    error: { code, message, details },
  };
  res.status(status).json(response);
}

// ─── Provider Factory ─────────────────────────────────────────────────────────

/**
 * Create AI provider from environment configuration.
 */
function createAIProvider(): ReturnType<typeof createProvider> {
  if (env.LLM_PROVIDER === 'openai') {
    return createProvider({
      type: 'openai',
      apiKey: env.OPENAI_API_KEY ?? '',
      model: env.OPENAI_MODEL,
      baseUrl: env.OPENAI_BASE_URL,
      timeoutMs: env.OPENAI_TIMEOUT_MS,
    });
  }

  if (env.LLM_PROVIDER === 'anthropic') {
    return createProvider({
      type: 'anthropic',
      apiKey: env.ANTHROPIC_API_KEY ?? '',
      model: env.ANTHROPIC_MODEL,
      timeoutMs: env.ANTHROPIC_TIMEOUT_MS,
    });
  }

  return createProvider({
    type: 'local',
    baseUrl: env.LOCAL_LLM_URL,
    model: env.LOCAL_LLM_MODEL,
    timeoutMs: env.LOCAL_LLM_TIMEOUT_MS,
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/ai/generate/questions
 * Generate questions using AI.
 *
 * Request body:
 * - topic?: string - Topic for question generation
 * - topicName?: string - Display name for the topic
 * - difficulty?: 'easy' | 'medium' | 'hard' | 'mixed'
 * - questionType?: 'multiple-choice' | 'true-false' | 'short-answer' | 'mixed'
 * - questionCount?: number - Number of questions (1-50, default from env)
 * - skillId?: string - Optional BKT skill ID to tag
 * - language?: 'vi' | 'en' - Default 'vi'
 * - additionalInstructions?: string - Extra context for the AI
 * - autoSubmit?: boolean - Whether to persist to content service (default false)
 *
 * Responses:
 * - 200: Questions generated successfully
 * - 400: Invalid input or AI returned invalid response
 * - 401: Missing authentication
 * - 403: User is not a teacher or admin
 * - 503: AI provider unavailable
 * - 504: AI request timed out
 */
router.post('/api/ai/generate/questions', async (req: AuthedRequest, res: Response) => {
  // Authenticate
  const auth = requireAuth(req);
  if (!auth) {
    logger.warn('Unauthorized question generation attempt', {
      ip: req.ip,
      path: req.path,
    });
    error(res, 401, 'UNAUTHORIZED', 'Authentication required. Provide X-User-Id header.');
    return;
  }

  // Check role
  if (!isTeacherOrAdmin(auth.role)) {
    logger.warn('Forbidden question generation attempt', {
      userId: auth.userId,
      role: auth.role,
      path: req.path,
    });
    error(res, 403, 'FORBIDDEN', 'Only teachers and admins can generate questions.');
    return;
  }

  // Validate input
  const parsed = generateQuestionsInputSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');

    logger.debug('Invalid generation input', {
      userId: auth.userId,
      errors,
    });

    error(res, 400, 'VALIDATION_ERROR', `Invalid input: ${errors}`);
    return;
  }

  const input: GenerateQuestionsInput = parsed.data;

  logger.info('Question generation request', {
    userId: auth.userId,
    role: auth.role,
    topic: input.topic,
    difficulty: input.difficulty,
    questionType: input.questionType,
    questionCount: input.questionCount,
    autoSubmit: input.autoSubmit,
  });

  try {
    // Create provider and generate
    const provider = createAIProvider();

    if (!provider.isConfigured) {
      throw new AIError(
        AIErrorCode.AI_PROVIDER_NOT_CONFIGURED,
        `AI provider (${env.LLM_PROVIDER}) is not configured with valid credentials`
      );
    }

    const result = await generateQuestions({ provider, input });

    // Handle auto-submit
    if (input.autoSubmit) {
      const contentClient = getContentClient();
      const createdQuestions: Array<{
        draft: unknown;
        questionId: string;
        status: string;
      }> = [];

      for (const question of result.questions) {
        try {
          const created = await contentClient.createQuestion(
            question,
            auth.userId,
            input.skillId
          );
          createdQuestions.push({
            draft: question,
            questionId: created.data.id,
            status: created.data.status,
          });

          // Submit for review
          await contentClient.submitForReview(created.data.id, auth.userId);
        } catch (err) {
          logger.error('Failed to create question in content service', {
            userId: auth.userId,
            questionTitle: question.title,
            error: err instanceof Error ? err.message : String(err),
          });
          // Continue with other questions
        }
      }

      const response: AutoSubmitSuccessResponse = {
        success: true,
        data: {
          questions: createdQuestions,
          meta: {
            totalCreated: createdQuestions.length,
            provider: result.meta.provider,
            model: result.meta.model,
            latencyMs: result.meta.latencyMs,
          },
        },
        error: null,
      };

      created(res, response.data);
      return;
    }

    // Return generated questions
    const response: GenerationSuccessResponse = {
      success: true,
      data: {
        questions: result.questions,
        meta: result.meta,
      },
      error: null,
    };

    ok(res, response.data);
  } catch (err) {
    if (err instanceof AIError) {
      const statusMap: Record<AIErrorCode, number> = {
        [AIErrorCode.AI_INVALID_INPUT]: 400,
        [AIErrorCode.AI_INVALID_RESPONSE]: 400,
        [AIErrorCode.AI_REQUEST_TOO_LARGE]: 400,
        [AIErrorCode.AI_PROVIDER_NOT_CONFIGURED]: 500,
        [AIErrorCode.AI_CONFIGURATION_ERROR]: 500,
        [AIErrorCode.AI_PROVIDER_UNAVAILABLE]: 503,
        [AIErrorCode.AI_TIMEOUT]: 504,
        [AIErrorCode.AI_RATE_LIMITED]: 429,
        [AIErrorCode.AI_CONTENT_FILTERED]: 422,
        [AIErrorCode.AI_UNKNOWN_ERROR]: 500,
      };

      const status = statusMap[err.code] ?? 500;

      error(res, status, err.code, err.message, err.details);
      return;
    }

    logger.error('Unexpected error in question generation', {
      userId: auth.userId,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    error(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred');
  }
});

export default router;
