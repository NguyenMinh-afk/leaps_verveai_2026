/**
 * Device routes — /api/sync/devices/*
 *
 * CRUD over registered devices + per-device sync_log history.
 */

import { Router, type Request, type Response } from 'express';
import { asyncHandler, validateOrThrow } from '@verveai/common-node';
import {
  deleteDevice,
  getDevice,
  getDeviceLogs,
  listDevices,
  registerDevice,
  updateDevice,
} from '../services/device.service.js';
import {
  deviceIdParamSchema,
  deviceLogsQuerySchema,
  listDevicesQuerySchema,
  registerDeviceSchema,
  updateDeviceSchema,
} from '../validators/device.validator.js';

const router: Router = Router();

// ─── List ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/sync/devices
 * List non-deleted devices with optional type filter and pagination.
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const q = validateOrThrow(listDevicesQuerySchema, req.query, 'Invalid list query');
    const result = await listDevices({ page: q.page, pageSize: q.pageSize }, { type: q.type });
    res.json({ success: true, ...result, error: null });
  }),
);

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * POST /api/sync/devices
 * Register a new device (returns the new device id).
 */
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const input = validateOrThrow(registerDeviceSchema, req.body, 'Invalid register payload');
    const result = await registerDevice(input);
    res.status(201).json({ success: true, data: result, error: null });
  }),
);

// ─── Get by id ────────────────────────────────────────────────────────────────

/**
 * GET /api/sync/devices/:id
 * Return a single device with the most-recent 50 sync logs.
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = validateOrThrow(deviceIdParamSchema, req.params, 'Invalid device id');
    const device = await getDevice(id);
    res.json({ success: true, data: device, error: null });
  }),
);

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * PUT /api/sync/devices/:id
 * Update name and/or last_seen_at.
 */
router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = validateOrThrow(deviceIdParamSchema, req.params, 'Invalid device id');
    const input = validateOrThrow(updateDeviceSchema, req.body, 'Invalid update payload');
    const device = await updateDevice(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.last_seen_at !== undefined ? { lastSeenAt: new Date(input.last_seen_at) } : {}),
    });
    res.json({ success: true, data: device, error: null });
  }),
);

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * DELETE /api/sync/devices/:id
 * Soft delete — sets deleted_at.
 */
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = validateOrThrow(deviceIdParamSchema, req.params, 'Invalid device id');
    await deleteDevice(id);
    res.json({ success: true, data: { id, deleted: true }, error: null });
  }),
);

// ─── Logs ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/sync/devices/:id/logs
 * Paginated sync_log history for a device.
 */
router.get(
  '/:id/logs',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = validateOrThrow(deviceIdParamSchema, req.params, 'Invalid device id');
    const q = validateOrThrow(deviceLogsQuerySchema, req.query, 'Invalid logs query');
    const result = await getDeviceLogs(id, { page: q.page, pageSize: q.pageSize });
    res.json({ success: true, ...result, error: null });
  }),
);

export default router;
