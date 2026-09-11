/**
 * Device request validators — Zod schemas for /api/sync/devices/* endpoints.
 */

import { z } from 'zod';

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerDeviceSchema = z.object({
  type: z.enum(['ANDROID', 'WINDOWS', 'TABLET']),
  name: z.string().min(2).max(100),
});

export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateDeviceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  last_seen_at: z.string().datetime({ message: 'last_seen_at must be ISO 8601 datetime' }).optional(),
});

export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;

// ─── List query ───────────────────────────────────────────────────────────────

export const listDevicesQuerySchema = z.object({
  type: z.enum(['ANDROID', 'WINDOWS', 'TABLET']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListDevicesQuery = z.infer<typeof listDevicesQuerySchema>;

// ─── Logs query ───────────────────────────────────────────────────────────────

export const deviceLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type DeviceLogsQuery = z.infer<typeof deviceLogsQuerySchema>;

// ─── Params ───────────────────────────────────────────────────────────────────

export const deviceIdParamSchema = z.object({
  id: z.string().uuid({ message: 'device id must be a valid UUID' }),
});

export type DeviceIdParam = z.infer<typeof deviceIdParamSchema>;
