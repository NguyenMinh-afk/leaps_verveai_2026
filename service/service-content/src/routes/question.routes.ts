/**
 * Question routes (svc-content).
 *
 * Routes for Question CRUD and review workflow.
 * All routes require authentication (X-User-Id from Gateway JWT).
 */

import { Router, type Request, type Response } from 'express';
import { asyncHandler } from '@verveai/common-node';
import {
  questionFilterSchema,
  createQuestionSchema,
  updateQuestionSchema,
  reviewActionSchema,
  idParamSchema,
} from '../validators/question.validator.js';
import {
  listQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  submitQuestionForReview,
  approveQuestion,
  rejectQuestion,
  getQuestionStats,
} from '../services/question.service.js';

const router: Router = Router();

interface AuthedRequest extends Request {
  headers: Request['headers'] & {
    'x-user-id'?: string;
    'x-user-role'?: string;
  };
}

// ─── Response helpers ────────────────────────────────────────────────────────────

function ok<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ success: true, data, error: null });
}

function created<T>(res: Response, data: T): void {
  res.status(201).json({ success: true, data, error: null });
}

function noContent(res: Response): void {
  res.status(204).send();
}

function notFound(res: Response, message: string): void {
  res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message } });
}

// ─── List Questions ───────────────────────────────────────────────────────────

/**
 * GET /api/content/questions
 * List question content items with filters.
 *
 * Query params:
 * - search: string (search in title, body, topic)
 * - difficulty: 'easy' | 'medium' | 'hard'
 * - type: 'multiple-choice' | 'true-false' | 'short-answer'
 * - status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'
 * - topic: string (filter by topic)
 * - authorId: UUID
 * - page: number (default 1)
 * - pageSize: number (default 20)
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = questionFilterSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid query parameters' },
      });
      return;
    }
    const result = await listQuestions(parsed.data);
    ok(res, result.items);
    res.json({
      success: true,
      data: result.items,
      meta: result.pagination,
      error: null,
    });
  }),
);

// ─── Get Question ────────────────────────────────────────────────────────────

/**
 * GET /api/content/questions/:id
 * Get a single question by ID.
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      notFound(res, 'Invalid question ID format');
      return;
    }
    const { id } = parsed.data;
    const question = await getQuestion(id);

    if (!question) {
      notFound(res, `Question ${id} not found`);
      return;
    }

    ok(res, question);
  }),
);

// ─── Create Question ──────────────────────────────────────────────────────────

/**
 * POST /api/content/questions
 * Create a new question in DRAFT status.
 *
 * Body:
 * - title: string (required, 3-255 chars)
 * - body: string (required)
 * - difficulty: 'easy' | 'medium' | 'hard' (required)
 * - topic: string (optional)
 * - chapter: string (optional)
 * - metadata: QuestionMetadata object (required)
 */
router.post(
  '/',
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const parsed = createQuestionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid question data' },
      });
      return;
    }
    const userId =
      req.headers['x-user-id'] ??
      (req.body as { authorId?: string }).authorId ??
      '';

    const question = await createQuestion(parsed.data, userId);

    created(res, question);
  }),
);

// ─── Update Question ─────────────────────────────────────────────────────────

/**
 * PUT /api/content/questions/:id
 * Update a question. Only DRAFT or REJECTED questions can be edited.
 *
 * Body (all optional):
 * - title: string
 * - body: string
 * - difficulty: 'easy' | 'medium' | 'hard'
 * - topic: string
 * - chapter: string
 * - metadata: Partial<QuestionMetadata>
 */
router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const paramParsed = idParamSchema.safeParse(req.params);
    if (!paramParsed.success) {
      notFound(res, 'Invalid question ID format');
      return;
    }
    const bodyParsed = updateQuestionSchema.safeParse(req.body);
    if (!bodyParsed.success) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid update data' },
      });
      return;
    }
    const { id } = paramParsed.data;
    const question = await updateQuestion(id, bodyParsed.data);

    ok(res, question);
  }),
);

// ─── Delete Question ─────────────────────────────────────────────────────────

/**
 * DELETE /api/content/questions/:id
 * Soft-delete a question. Only DRAFT questions can be deleted.
 */
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      notFound(res, 'Invalid question ID format');
      return;
    }
    const { id } = parsed.data;
    await deleteQuestion(id);
    noContent(res);
  }),
);

// ─── Submit for Review ───────────────────────────────────────────────────────

/**
 * POST /api/content/questions/:id/submit
 * Submit a question for review.
 * Transitions: DRAFT/REJECTED → PENDING_REVIEW
 */
router.post(
  '/:id/submit',
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      notFound(res, 'Invalid question ID format');
      return;
    }
    const { id } = parsed.data;
    const userId =
      req.headers['x-user-id'] ??
      (req.body as { authorId?: string }).authorId ??
      '';

    const question = await submitQuestionForReview(id, userId);

    ok(res, question);
  }),
);

// ─── Approve Question ────────────────────────────────────────────────────────

/**
 * POST /api/content/questions/:id/approve
 * Approve a question in review.
 * Transitions: PENDING_REVIEW → APPROVED
 */
router.post(
  '/:id/approve',
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const paramParsed = idParamSchema.safeParse(req.params);
    if (!paramParsed.success) {
      notFound(res, 'Invalid question ID format');
      return;
    }
    const bodyParsed = reviewActionSchema.safeParse(req.body);
    if (!bodyParsed.success) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid request body' },
      });
      return;
    }
    const { id } = paramParsed.data;
    const reviewerId =
      req.headers['x-user-id'] ??
      (req.body as { reviewerId?: string }).reviewerId ??
      '';

    const question = await approveQuestion(id, reviewerId, bodyParsed.data.comment);

    ok(res, question);
  }),
);

// ─── Reject Question ─────────────────────────────────────────────────────────

/**
 * POST /api/content/questions/:id/reject
 * Reject a question in review.
 * Transitions: PENDING_REVIEW → REJECTED
 */
router.post(
  '/:id/reject',
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const paramParsed = idParamSchema.safeParse(req.params);
    if (!paramParsed.success) {
      notFound(res, 'Invalid question ID format');
      return;
    }
    const bodyParsed = reviewActionSchema.safeParse(req.body);
    if (!bodyParsed.success || !bodyParsed.data.comment) {
      res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Rejection reason is required (min 5 characters)',
        },
      });
      return;
    }
    const { id } = paramParsed.data;
    const reviewerId =
      req.headers['x-user-id'] ??
      (req.body as { reviewerId?: string }).reviewerId ??
      '';

    const question = await rejectQuestion(id, reviewerId, bodyParsed.data.comment);

    ok(res, question);
  }),
);

// ─── Admin Stats ─────────────────────────────────────────────────────────────

/**
 * GET /api/content/questions/admin/stats
 * Get question statistics for admin dashboard.
 * Requires ADMIN role.
 */
router.get(
  '/admin/stats',
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const userRole = req.headers['x-user-role'];
    if (userRole !== 'ADMIN') {
      res.status(403).json({
        success: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      });
      return;
    }
    const stats = await getQuestionStats();
    ok(res, stats);
  }),
);

export default router;
