import { Router, Request, Response } from 'express';
import { asyncHandler, validateMiddleware, success, z } from '@verveai/common-node';
import {
  getAggregateReport,
  getClassReport,
  getStudentReport,
  exportReport,
} from '../services/report.service.js';

const router: Router = Router();

const idParamSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID' }),
});

const exportTypeSchema = z.object({
  type: z.enum(['aggregate', 'classes', 'bundles', 'content', 'reviews']),
  format: z.enum(['json', 'csv']).default('json'),
});

/**
 * GET /api/content/reports/aggregate
 * Aggregate cross-service stats.
 */
router.get(
  '/aggregate',
  asyncHandler(async (_req: Request, res: Response) => {
    const report = await getAggregateReport();
    res.json(success(report));
  }),
);

/**
 * GET /api/content/reports/class/:id
 * Class-level report.
 */
router.get(
  '/class/:id',
  validateMiddleware(idParamSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const report = await getClassReport(id);
    res.json(success(report));
  }),
);

/**
 * GET /api/content/reports/student/:id
 * Student-level report (combined svc-class + svc-bkt data).
 */
router.get(
  '/student/:id',
  validateMiddleware(idParamSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const report = await getStudentReport(id);
    res.json(success(report));
  }),
);

/**
 * GET /api/content/reports/export
 * Export a report as JSON or CSV.
 *
 * Query params:
 *   type: aggregate | classes | bundles | content | reviews
 *   format: json | csv (default json)
 */
router.get(
  '/export',
  validateMiddleware(exportTypeSchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await exportReport(req.query);
    res.json(success(result));
  }),
);

export default router;
