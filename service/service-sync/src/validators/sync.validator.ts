/**
 * Sync request validators — Zod schemas for /api/sync/* endpoints.
 */

import { z } from 'zod';

// ─── Push ─────────────────────────────────────────────────────────────────────

export const pushRecordSchema = z.object({
  entity_type: z.string().min(1).max(64),
  entity_id: z.string().min(1).max(128),
  payload: z.record(z.unknown()),
  client_version: z.string().min(1).max(64),
});

export const pushSchema = z.object({
  deviceId: z.string().uuid({ message: 'deviceId must be a valid UUID' }),
  records: z.array(pushRecordSchema).min(1).max(1000),
});

export type PushInput = z.infer<typeof pushSchema>;
export type PushRecord = z.infer<typeof pushRecordSchema>;

// ─── Pull ─────────────────────────────────────────────────────────────────────

export const pullSchema = z.object({
  deviceId: z.string().uuid({ message: 'deviceId must be a valid UUID' }),
  since: z.string().datetime({ message: 'since must be ISO 8601 datetime' }).optional(),
});

export const pullSinceSchema = z.object({
  since: z.string().datetime({ message: 'since must be ISO 8601 datetime' }).optional(),
});

export type PullInput = z.infer<typeof pullSchema>;
export type PullSinceInput = z.infer<typeof pullSinceSchema>;

// ─── Resolve (legacy /sync/resolve) ───────────────────────────────────────────

export const resolveSchema = z.object({
  conflictId: z.string().uuid({ message: 'conflictId must be a valid UUID' }),
  resolution: z.enum(['SERVER_WINS', 'CLIENT_WINS', 'MERGED']),
});

export type ResolveInput = z.infer<typeof resolveSchema>;

// ─── Sync log query ───────────────────────────────────────────────────────────

export const syncLogQuerySchema = z.object({
  direction: z.enum(['PUSH', 'PULL']).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type SyncLogQuery = z.infer<typeof syncLogQuerySchema>;
