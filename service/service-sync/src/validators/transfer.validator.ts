/**
 * Transfer request validators — Zod schemas for /api/sync/transfers/* endpoints.
 */

import { z } from 'zod';

// ─── Initiate ─────────────────────────────────────────────────────────────────

export const initiateTransferSchema = z
  .object({
    fromDeviceId: z.string().uuid({ message: 'fromDeviceId must be a valid UUID' }),
    toDeviceId: z.string().uuid({ message: 'toDeviceId must be a valid UUID' }),
    studentIds: z.array(z.string().uuid()).max(500).optional(),
  })
  .refine((data) => data.fromDeviceId !== data.toDeviceId, {
    message: 'fromDeviceId and toDeviceId must differ',
    path: ['toDeviceId'],
  });

export type InitiateTransferInput = z.infer<typeof initiateTransferSchema>;

// ─── Params ───────────────────────────────────────────────────────────────────

export const transferIdParamSchema = z.object({
  id: z.string().uuid({ message: 'transfer id must be a valid UUID' }),
});

export type TransferIdParam = z.infer<typeof transferIdParamSchema>;

// ─── Fail body ────────────────────────────────────────────────────────────────

export const failTransferSchema = z.object({
  reason: z.string().min(1).max(500),
});

export type FailTransferInput = z.infer<typeof failTransferSchema>;
