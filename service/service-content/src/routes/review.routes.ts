import { Router, Request, Response } from 'express';
import { asyncHandler, validateMiddleware, success } from '@verveai/common-node';
import {
  reviewActionSchema,
  reviewIdParamSchema,
  reviewPaginationSchema,
} from '../validators/review.validator.js';
import {
  listReviewQueue,
  approveReview,
  rejectReview,
  getReviewStats,
} from '../services/review.service.js';

const router: Router = Router();

interface AuthedRequest extends Request {
  headers: Request['headers'] & {
    'x-user-id'?: string;
    'x-user-role'?: string;
  };
}

/**
 * GET /api/content/review
 * List pending reviews (paginated, FIFO).
 */
router.get(
  '/',
  validateMiddleware(reviewPaginationSchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await listReviewQueue(req.query);
    res.json({
      success: true,
      data: result.items,
      meta: result.pagination,
      error: null,
    });
  }),
);

/**
 * GET /api/content/review/stats
 * Aggregate review counts and reviewer workload.
 */
router.get(
  '/stats',
  asyncHandler(async (_req: Request, res: Response) => {
    const stats = await getReviewStats();
    res.json(success(stats));
  }),
);

/**
 * POST /api/content/review/:id/approve
 * Approve a pending review.
 */
router.post(
  '/:id/approve',
  validateMiddleware(reviewIdParamSchema, 'params'),
  validateMiddleware(reviewActionSchema, 'body'),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const reviewerId =
      req.headers['x-user-id'] ??
      (req.body as { reviewerId?: string }).reviewerId ??
      '';
    const body = req.body as Record<string, unknown>;
    const { reviewerId: _ignored, ...payload } = body;
    const review = await approveReview(id, reviewerId, payload);
    res.json(success(review));
  }),
);

/**
 * POST /api/content/review/:id/reject
 * Reject a pending review.
 */
router.post(
  '/:id/reject',
  validateMiddleware(reviewIdParamSchema, 'params'),
  validateMiddleware(reviewActionSchema, 'body'),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const reviewerId =
      req.headers['x-user-id'] ??
      (req.body as { reviewerId?: string }).reviewerId ??
      '';
    const body = req.body as Record<string, unknown>;
    const { reviewerId: _ignored, ...payload } = body;
    const review = await rejectReview(id, reviewerId, payload);
    res.json(success(review));
  }),
);

export default router;
