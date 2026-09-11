/**
 * Student transfer service.
 *
 * When a student moves between devices (e.g. class change, device handover),
 * svc-sync orchestrates the move by recording a `student_transfer` row
 * that tracks the source device, destination device, and status.
 *
 * Status transitions:
 *   PENDING → IN_PROGRESS → COMPLETED
 *                          → FAILED
 */

import { prisma } from '../prisma/client.js';
import { NotFoundError, ValidationError } from '@verveai/error-types';
import { logger } from '../utils/logger.js';

// ─── Public types ─────────────────────────────────────────────────────────────

export type TransferStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface InitiateTransferInput {
  fromDeviceId: string;
  toDeviceId: string;
  studentIds?: string[];
}

export interface StudentTransfer {
  id: string;
  fromDeviceId: string;
  toDeviceId: string;
  status: TransferStatus;
  transferredAt: Date | null;
  failedAt: Date | null;
  errorReason: string | null;
  studentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── initiateTransfer ─────────────────────────────────────────────────────────

/**
 * Create a new transfer in PENDING state after validating that both
 * devices exist and are not soft-deleted. The transfer starts in
 * PENDING — `completeTransfer`/`failTransfer` will move it forward.
 */
export async function initiateTransfer(input: InitiateTransferInput): Promise<StudentTransfer> {
  if (input.fromDeviceId === input.toDeviceId) {
    throw new ValidationError(
      [{ path: ['toDeviceId'], message: 'Source and destination devices must differ', code: 'same_device' }],
      'Invalid transfer',
    );
  }

  const [fromDevice, toDevice] = await Promise.all([
    prisma.device.findFirst({
      where: { id: input.fromDeviceId, deleted_at: null },
      select: { id: true },
    }),
    prisma.device.findFirst({
      where: { id: input.toDeviceId, deleted_at: null },
      select: { id: true },
    }),
  ]);

  if (!fromDevice) {
    throw new NotFoundError('Source device', input.fromDeviceId);
  }

  if (!toDevice) {
    throw new NotFoundError('Destination device', input.toDeviceId);
  }

  const row = await prisma.student_transfer.create({
    data: {
      from_device_id: input.fromDeviceId,
      to_device_id: input.toDeviceId,
      status: 'PENDING',
      student_ids: input.studentIds ?? [],
    },
  });

  logger.info('transfer initiated', {
    id: row.id,
    fromDeviceId: input.fromDeviceId,
    toDeviceId: input.toDeviceId,
    studentCount: (input.studentIds ?? []).length,
  });

  return toTransfer(row);
}

// ─── completeTransfer ─────────────────────────────────────────────────────────

/**
 * Mark a transfer COMPLETED and stamp `transferred_at`. The transfer
 * must currently be in PENDING or IN_PROGRESS — re-completing throws.
 */
export async function completeTransfer(id: string): Promise<StudentTransfer> {
  const existing = await prisma.student_transfer.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError('Transfer', id);
  }

  if (existing.status === 'COMPLETED') {
    throw new ValidationError(
      [{ path: ['status'], message: `Transfer ${id} is already completed`, code: 'already_completed' }],
      'Transfer already completed',
    );
  }

  if (existing.status === 'FAILED') {
    throw new ValidationError(
      [{ path: ['status'], message: `Transfer ${id} is already failed`, code: 'already_failed' }],
      'Transfer already failed',
    );
  }
  const row = await prisma.student_transfer.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      transferred_at: new Date(),
      failed_at: null,
      error_reason: null,
    },
  });

  logger.info('transfer completed', { id });

  return toTransfer(row);
}

// ─── failTransfer ─────────────────────────────────────────────────────────────

/**
 * Mark a transfer FAILED, stamp `failed_at`, and persist the reason.
 */
export async function failTransfer(id: string, reason: string): Promise<StudentTransfer> {
  if (!reason || reason.trim().length === 0) {
    throw new ValidationError(
      [{ path: ['reason'], message: 'reason is required', code: 'missing_reason' }],
      'Failure reason required',
    );
  }

  const existing = await prisma.student_transfer.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError('Transfer', id);
  }

  if (existing.status === 'COMPLETED') {
    throw new ValidationError(
      [{ path: ['status'], message: `Transfer ${id} is already completed`, code: 'already_completed' }],
      'Transfer already completed',
    );
  }

  const row = await prisma.student_transfer.update({
    where: { id },
    data: {
      status: 'FAILED',
      failed_at: new Date(),
      error_reason: reason,
    },
  });

  logger.info('transfer failed', { id, reason });

  return toTransfer(row);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface TransferRow {
  id: string;
  from_device_id: string;
  to_device_id: string;
  status: TransferStatus;
  transferred_at: Date | null;
  failed_at: Date | null;
  error_reason: string | null;
  student_ids: string[];
  created_at: Date;
  updated_at: Date;
}

function toTransfer(row: TransferRow): StudentTransfer {
  return {
    id: row.id,
    fromDeviceId: row.from_device_id,
    toDeviceId: row.to_device_id,
    status: row.status,
    transferredAt: row.transferred_at,
    failedAt: row.failed_at,
    errorReason: row.error_reason,
    studentIds: row.student_ids,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
