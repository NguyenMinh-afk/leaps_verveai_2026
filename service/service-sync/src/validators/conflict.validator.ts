/**
 * Conflict request validators — Zod schemas for /api/sync/conflicts/* endpoints.
 */

import { z } from 'zod';

// ─── Resolve ──────────────────────────────────────────────────────────────────

export const resolveConflictSchema = z.object({
  resolution: z.enum(['SERVER_WINS', 'CLIENT_WINS', 'MERGED']),
});

export type ResolveConflictInput = z.infer<typeof resolveConflictSchema>;

// ─── Detect ───────────────────────────────────────────────────────────────────

export const detectConflictSchema = z.object({
  deviceId: z.string().uuid({ message: 'deviceId must be a valid UUID' }),
  entityType: z.string().min(1).max(64),
  entityId: z.string().min(1).max(128),
  serverVersion: z.string().min(1).max(64),
  clientVersion: z.string().min(1).max(64),
});

export type DetectConflictInput = z.infer<typeof detectConflictSchema>;

// ─── List query ───────────────────────────────────────────────────────────────

export const listConflictsQuerySchema = z.object({
  resolved: z.coerce.boolean().optional(),
  deviceId: z.string().uuid().optional(),
  entity_type: z.string().optional(),
  entity_id: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListConflictsQuery = z.infer<typeof listConflictsQuerySchema>;

// ─── Params ───────────────────────────────────────────────────────────────────

export const conflictIdParamSchema = z.object({
  id: z.string().uuid({ message: 'conflict id must be a valid UUID' }),
});

export type ConflictIdParam = z.infer<typeof conflictIdParamSchema>;
