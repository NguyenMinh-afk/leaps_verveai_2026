/**
 * Transfer routes — /api/sync/transfers/*
 */

import { Router, type Request, type Response } from 'express';
import { asyncHandler, validateOrThrow } from '@verveai/common-node';
import {
  completeTransfer,
  failTransfer,
  initiateTransfer,
} from '../services/transfer.service.js';
import {
  failTransferSchema,
  initiateTransferSchema,
  transferIdParamSchema,
} from '../validators/transfer.validator.js';

const router: Router = Router();

/**
 * POST /api/sync/transfers
 * Initiate a new student transfer.
 */
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const input = validateOrThrow(initiateTransferSchema, req.body, 'Invalid initiate payload');
    const transfer = await initiateTransfer(input);
    res.status(201).json({ success: true, data: transfer, error: null });
  }),
);

/**
 * POST /api/sync/transfers/:id/complete
 * Mark a transfer COMPLETED.
 */
router.post(
  '/:id/complete',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = validateOrThrow(transferIdParamSchema, req.params, 'Invalid transfer id');
    const transfer = await completeTransfer(id);
    res.json({ success: true, data: transfer, error: null });
  }),
);

/**
 * POST /api/sync/transfers/:id/fail
 * Mark a transfer FAILED with a reason.
 */
router.post(
  '/:id/fail',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = validateOrThrow(transferIdParamSchema, req.params, 'Invalid transfer id');
    const input = validateOrThrow(failTransferSchema, req.body, 'Invalid fail payload');
    const transfer = await failTransfer(id, input.reason);
    res.json({ success: true, data: transfer, error: null });
  }),
);

export default router;
