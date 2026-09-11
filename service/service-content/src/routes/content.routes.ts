import { Router, Request, Response } from 'express';
import { asyncHandler, validateMiddleware, success } from '@verveai/common-node';
import {
  createContentSchema,
  updateContentSchema,
  contentFilterSchema,
  idParamSchema,
} from '../validators/content.validator.js';
import {
  listContent,
  createContent,
  getContent,
  updateContent,
  deleteContent,
  submitForReview,
} from '../services/content.service.js';

const router: Router = Router();

interface AuthedRequest extends Request {
  headers: Request['headers'] & {
    'x-user-id'?: string;
    'x-user-role'?: string;
  };
}

/**
 * GET /api/content
 * List content items with optional filters and pagination.
 */
router.get(
  '/',
  validateMiddleware(contentFilterSchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await listContent(req.query);
    res.json({
      success: true,
      data: result.items,
      meta: result.pagination,
      error: null,
    });
  }),
);

/**
 * POST /api/content
 * Create a new content item.
 *
 * Author ID is taken from the `x-user-id` header injected by the gateway.
 * Falls back to req.body.authorId for backward compatibility.
 */
router.post(
  '/',
  validateMiddleware(createContentSchema, 'body'),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const userId =
      req.headers['x-user-id'] ??
      (req.body as { authorId?: string }).authorId ??
      '';
    const body = req.body as Record<string, unknown>;
    const { authorId: _ignored, ...payload } = body;
    const created = await createContent(payload, userId);
    res.status(201).json(success(created));
  }),
);

/**
 * GET /api/content/:id
 * Get a single content item by ID.
 */
router.get(
  '/:id',
  validateMiddleware(idParamSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const item = await getContent(id);
    if (!item) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: `Content item ${id} not found` },
      });
      return;
    }
    res.json(success(item));
  }),
);

/**
 * PUT /api/content/:id
 * Update a content item. Only DRAFT / REJECTED items can be edited.
 */
router.put(
  '/:id',
  validateMiddleware(idParamSchema, 'params'),
  validateMiddleware(updateContentSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const updated = await updateContent(id, req.body);
    res.json(success(updated));
  }),
);

/**
 * DELETE /api/content/:id
 * Soft-delete a content item. Only DRAFT items can be deleted.
 */
router.delete(
  '/:id',
  validateMiddleware(idParamSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await deleteContent(id);
    res.status(204).send();
  }),
);

/**
 * POST /api/content/:id/submit
 * Submit a DRAFT or REJECTED item for review.
 */
router.post(
  '/:id/submit',
  validateMiddleware(idParamSchema, 'params'),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const userId =
      req.headers['x-user-id'] ??
      (req.body as { authorId?: string }).authorId ??
      '';
    const updated = await submitForReview(id, userId);
    res.json(success(updated));
  }),
);

export default router;
