import { Router, Request, Response } from 'express';
import { asyncHandler, validateMiddleware, success } from '@verveai/common-node';
import {
  buildBundleSchema,
  bundleIdParamSchema,
  paginationSchema,
} from '../validators/bundle.validator.js';
import {
  listBundles,
  getBundle,
  buildBundle,
  signBundle,
  publishBundle,
} from '../services/bundle.service.js';

const router: Router = Router();

/**
 * GET /api/content/bundles
 * List bundles with pagination.
 */
router.get(
  '/',
  validateMiddleware(paginationSchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await listBundles(req.query);
    res.json({
      success: true,
      data: result.items,
      meta: result.pagination,
      error: null,
    });
  }),
);

/**
 * GET /api/content/bundles/:id
 * Get a single bundle with its signatures.
 */
router.get(
  '/:id',
  validateMiddleware(bundleIdParamSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const bundle = await getBundle(id);
    if (!bundle) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: `Bundle ${id} not found` },
      });
      return;
    }
    res.json(success(bundle));
  }),
);

/**
 * POST /api/content/bundles/build
 * Build a new bundle from APPROVED content items.
 */
router.post(
  '/build',
  validateMiddleware(buildBundleSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const bundle = await buildBundle(req.body);
    res.status(201).json(success(bundle));
  }),
);

/**
 * POST /api/content/bundles/:id/sign
 * Sign a bundle with Ed25519.
 */
router.post(
  '/:id/sign',
  validateMiddleware(bundleIdParamSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const signature = await signBundle(id);
    res.json(success(signature));
  }),
);

/**
 * POST /api/content/bundles/:id/publish
 * Publish a signed bundle.
 */
router.post(
  '/:id/publish',
  validateMiddleware(bundleIdParamSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const bundle = await publishBundle(id);
    res.json(success(bundle));
  }),
);

export default router;
