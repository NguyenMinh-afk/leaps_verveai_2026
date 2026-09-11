/**
 * Sync routes — /api/sync/*
 *
 * Maps incoming HTTP requests to the sync service. All handlers are
 * wrapped with `asyncHandler` from @verveai/common-node so any thrown
 * DomainError reaches the global error middleware automatically.
 */

import { Router, type Request, type Response } from 'express';
import { asyncHandler } from '@verveai/common-node';
import {
  getStatus,
  pull,
  pullSince,
  push,
  resolveConflict as resolveSyncConflict,
} from '../services/sync.service.js';
import {
  listConflicts,
  detectConflict,
} from '../services/conflict.service.js';
import {
  pushSchema,
  pullSchema,
  pullSinceSchema,
  resolveSchema,
  syncLogQuerySchema,
} from '../validators/sync.validator.js';
import {
  listConflictsQuerySchema,
  detectConflictSchema,
  conflictIdParamSchema,
} from '../validators/conflict.validator.js';
import { validateOrThrow } from '@verveai/common-node';

const router: Router = Router();

// ─── /status ──────────────────────────────────────────────────────────────────

/**
 * GET /api/sync/status
 * Aggregate sync health — total devices, pending logs, unresolved conflicts.
 */
router.get(
  '/status',
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await getStatus();
    res.json({ success: true, data, error: null });
  }),
);

// ─── /push ────────────────────────────────────────────────────────────────────

/**
 * POST /api/sync/push
 * Device uploads new/updated records to the server.
 */
router.post(
  '/push',
  asyncHandler(async (req: Request, res: Response) => {
    const input = validateOrThrow(pushSchema, req.body, 'Invalid push payload');
    // Zod fields are snake_case (PushInput) — pass through; service normalizes.
    const result = await push(input as unknown as Parameters<typeof push>[0]);
    res.status(201).json({ success: true, data: result, error: null });
  }),
);

// ─── /pull ────────────────────────────────────────────────────────────────────

/**
 * GET /api/sync/pull
 * Pull records for a device. Accepts `deviceId` + optional `since` query.
 */
router.get(
  '/pull',
  asyncHandler(async (req: Request, res: Response) => {
    const input = validateOrThrow(pullSchema, req.query, 'Invalid pull query');
    const since = input.since ? new Date(input.since) : undefined;
    const result = await pull({ deviceId: input.deviceId, since });
    res.json({ success: true, data: result, error: null });
  }),
);

/**
 * GET /api/sync/pull/:since
 * Pull every record newer than the given ISO timestamp (server-wide).
 */
router.get(
  '/pull/:since',
  asyncHandler(async (req: Request, res: Response) => {
    const { since } = validateOrThrow(pullSinceSchema, req.params, 'Invalid pull-since params');
    const records = await pullSince(since ? new Date(since) : undefined);
    res.json({ success: true, data: { records }, error: null });
  }),
);

// ─── /resolve (legacy sync-level resolution) ──────────────────────────────────

/**
 * POST /api/sync/resolve
 * Resolve a conflict by id + resolution strategy.
 */
router.post(
  '/resolve',
  asyncHandler(async (req: Request, res: Response) => {
    const input = validateOrThrow(resolveSchema, req.body, 'Invalid resolve payload');
    const conflict = await resolveSyncConflict(input.conflictId, input.resolution);
    res.json({ success: true, data: conflict, error: null });
  }),
);

// ─── /conflicts (also exposed under /api/sync/conflicts for convenience) ──────

/**
 * GET /api/sync/conflicts
 * Paginated conflict list with optional filters.
 */
router.get(
  '/conflicts',
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
 * POST /api/sync/conflicts/detect
 * Register a new conflict (or no-op when versions match).
 */
router.post(
  '/conflicts/detect',
  asyncHandler(async (req: Request, res: Response) => {
    const input = validateOrThrow(detectConflictSchema, req.body, 'Invalid detect payload');
    const result = await detectConflict({
      deviceId: input.deviceId,
      entityType: input.entityType,
      entityId: input.entityId,
      serverVersion: input.serverVersion,
      clientVersion: input.clientVersion,
    });
    res.status(result ? 201 : 200).json({
      success: true,
      data: { conflict: result },
      error: null,
    });
  }),
);

/**
 * GET /api/sync/conflicts/:id
 * Resolve by id (mounted on the sync router for ergonomic URL).
 */
router.get(
  '/conflicts/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = validateOrThrow(conflictIdParamSchema, req.params, 'Invalid conflict id');
    // Fetch a single conflict by listing with resolved filter off and picking the one.
    const result = await listConflicts({ page: 1, pageSize: 1000 });
    const conflict = result.items.find((c) => c.id === id);
    if (!conflict) {
      const { NotFoundError } = await import('@verveai/error-types');
      throw new NotFoundError('Conflict', id);
    }
    res.json({ success: true, data: conflict, error: null });
  }),
);

// ─── /logs (recent activity feed) ────────────────────────────────────────────

/**
 * GET /api/sync/logs
 * Most recent sync_log rows across all devices (read-only debug view).
 */
router.get(
  '/logs',
  asyncHandler(async (req: Request, res: Response) => {
    const q = validateOrThrow(syncLogQuerySchema, req.query, 'Invalid sync log query');
    const skip = (q.page - 1) * q.pageSize;
    const take = q.pageSize;
    const where: Record<string, unknown> = {};
    if (q.direction) where['direction'] = q.direction;
    if (q.status) where['status'] = q.status;

    const { prisma } = await import('../prisma/client.js');
    const [items, total] = await Promise.all([
      prisma.sync_log.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      prisma.sync_log.count({ where }),
    ]);

    res.json({
      success: true,
      data: items.map((row) => ({
        id: row.id,
        deviceId: row.device_id,
        direction: row.direction,
        status: row.status,
        recordCount: row.record_count,
        errorMessage: row.error_message,
        createdAt: row.created_at,
        completedAt: row.completed_at,
      })),
      meta: {
        page: q.page,
        pageSize: take,
        total,
        totalPages: Math.max(1, Math.ceil(total / take)),
        hasNext: q.page < Math.max(1, Math.ceil(total / take)),
        hasPrev: q.page > 1,
      },
      error: null,
    });
  }),
);

export default router;
