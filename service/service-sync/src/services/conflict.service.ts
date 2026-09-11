/**
 * Conflict resolution service.
 *
 * A conflict is recorded when a client tries to write a record whose
 * `client_version` doesn't match the current `server_version`. Conflicts
 * are then resolved by either taking the server value, taking the client
 * value, or merging both (the merge payload comes from the API caller).
 */

import { prisma } from '../prisma/client.js';
import { NotFoundError, ValidationError } from '@verveai/error-types';
import { logger } from '../utils/logger.js';

// ─── Public types ─────────────────────────────────────────────────────────────

export type ConflictResolution = 'SERVER_WINS' | 'CLIENT_WINS' | 'MERGED';

export interface ConflictInput {
  deviceId: string;
  entityType: string;
  entityId: string;
  serverVersion: string;
  clientVersion: string;
}

export interface Conflict {
  id: string;
  deviceId: string;
  entityType: string;
  entityId: string;
  serverVersion: string;
  clientVersion: string;
  resolvedAt: Date | null;
  resolution: ConflictResolution | null;
  detectedAt: Date;
}

export interface ConflictFilters {
  resolved?: boolean;
  deviceId?: string;
  entityType?: string;
  entityId?: string;
}

export interface ConflictListInput extends ConflictFilters {
  page: number;
  pageSize: number;
}

export interface PaginatedConflicts {
  items: Conflict[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── listConflicts ────────────────────────────────────────────────────────────

/**
 * List conflicts with optional filters and pagination.
 */
export async function listConflicts(input: ConflictListInput): Promise<PaginatedConflicts> {
  const where: Record<string, unknown> = {};
  if (input.resolved !== undefined) {
    where['resolved_at'] = input.resolved ? { not: null } : null;
  }
  if (input.deviceId !== undefined) {
    where['device_id'] = input.deviceId;
  }
  if (input.entityType !== undefined) {
    where['entity_type'] = input.entityType;
  }
  if (input.entityId !== undefined) {
    where['entity_id'] = input.entityId;
  }

  const skip = (Math.max(1, input.page) - 1) * Math.min(Math.max(1, input.pageSize), 100);
  const take = Math.min(Math.max(1, input.pageSize), 100);

  const [rows, total] = await Promise.all([
    prisma.sync_conflict.findMany({
      where,
      orderBy: { detected_at: 'desc' },
      skip,
      take,
    }),
    prisma.sync_conflict.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));

  return {
    items: rows.map(toConflict),
    meta: {
      page: input.page,
      pageSize: take,
      total,
      totalPages,
      hasNext: input.page < totalPages,
      hasPrev: input.page > 1,
    },
  };
}

// ─── resolveConflict ──────────────────────────────────────────────────────────

/**
 * Mark a conflict as resolved with the chosen strategy.
 * Throws NotFoundError when the conflict does not exist or has already
 * been resolved.
 */
export async function resolveConflict(
  id: string,
  resolution: ConflictResolution,
): Promise<Conflict> {
  const existing = await prisma.sync_conflict.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError('Conflict', id);
  }

  if (existing.resolved_at !== null) {
    throw new ValidationError(
      [{ path: ['resolution'], message: `Conflict ${id} already resolved`, code: 'already_resolved' }],
      'Conflict already resolved',
    );
  }

  const row = await prisma.sync_conflict.update({
    where: { id },
    data: {
      resolution,
      resolved_at: new Date(),
    },
  });

  logger.info('conflict resolved', { id, resolution });

  return toConflict(row);
}

// ─── detectConflict ───────────────────────────────────────────────────────────

/**
 * Insert a new conflict if (and only if) the server and client versions
 * differ. Returns `null` when no conflict was recorded.
 *
 * - If versions match, we silently return null (this is the happy path).
 * - If the device was soft-deleted, we throw NotFoundError.
 */
export async function detectConflict(input: ConflictInput): Promise<Conflict | null> {
  if (input.serverVersion === input.clientVersion) {
    return null;
  }

  const device = await prisma.device.findFirst({
    where: { id: input.deviceId, deleted_at: null },
    select: { id: true },
  });

  if (!device) {
    throw new NotFoundError('Device', input.deviceId);
  }

  const row = await prisma.sync_conflict.create({
    data: {
      device_id: input.deviceId,
      entity_type: input.entityType,
      entity_id: input.entityId,
      server_version: input.serverVersion,
      client_version: input.clientVersion,
    },
  });

  logger.info('conflict detected', {
    id: row.id,
    deviceId: input.deviceId,
    entityType: input.entityType,
    entityId: input.entityId,
  });

  return toConflict(row);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toConflict(row: {
  id: string;
  device_id: string;
  entity_type: string;
  entity_id: string;
  server_version: string;
  client_version: string;
  resolved_at: Date | null;
  resolution: ConflictResolution | null;
  detected_at: Date;
}): Conflict {
  return {
    id: row.id,
    deviceId: row.device_id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    serverVersion: row.server_version,
    clientVersion: row.client_version,
    resolvedAt: row.resolved_at,
    resolution: row.resolution,
    detectedAt: row.detected_at,
  };
}
