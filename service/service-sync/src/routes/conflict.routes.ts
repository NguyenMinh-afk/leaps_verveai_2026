/**
 * Conflict routes — /api/sync/conflicts/*
 */

import { Router, type Request, type Response } from 'express';
import { asyncHandler, validateOrThrow } from '@verveai/common-node';
import {
  listConflicts,
  resolveConflict as resolveConflictInDb,
} from '../services/conflict.service.js';
import {
  conflictIdParamSchema,
  listConflictsQuerySchema,
  resolveConflictSchema,
} from '../validators/conflict.validator.js';

const router: Router = Router();

/**
 * GET /api/sync/conflicts
 * Paginated conflict list with optional filters.
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const q = validateOrThrow(listConflictsQuerySchema, req.query, 'Invalid conflict query');
    const result = await listConflicts({
      resolved: q.resolved,
      deviceId: q.deviceId,
      entityType: q.entity_type,
      entityId: q.entity_id,
      page: q.page,
      pageSize: q.pageSize,
    });
    res.json({ success: true, ...result, error: null });
  }),
);

/**
 * POST /api/sync/conflicts/:id/resolve
 * Resolve a specific conflict.
 */
router.post(
  '/:id/resolve',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = validateOrThrow(conflictIdParamSchema, req.params, 'Invalid conflict id');
    const input = validateOrThrow(resolveConflictSchema, req.body, 'Invalid resolve payload');
    const conflict = await resolveConflictInDb(id, input.resolution);
    res.json({ success: true, data: conflict, error: null });
  }),
);

export default router;
