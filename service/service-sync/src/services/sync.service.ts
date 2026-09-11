/**
 * Sync orchestration service.
 *
 * Coordinates PUSH/PULL operations between devices and the server.
 * Records every sync attempt as a `sync_log` entry, surfaces unresolved
 * conflicts, and validates incoming records via cross-service calls
 * (svc-bkt for evidence, svc-class for students).
 */

import { prisma } from '../prisma/client.js';
import { NotFoundError, ValidationError } from '@verveai/error-types';
import { logger } from '../utils/logger.js';
import { syncEvidenceToBkt, verifyStudent } from './inter-service.js';

// ─── Public types ─────────────────────────────────────────────────────────────

export type SyncDirection = 'PUSH' | 'PULL';
export type SyncStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
export type ConflictResolution = 'SERVER_WINS' | 'CLIENT_WINS' | 'MERGED';

export interface SyncRecord {
  entityType: string;
  entityId: string;
  data: unknown;
  version: string;
}

/**
 * Input accepted by `push()` after route-layer adapter translates Zod fields
 * (snake_case) to camelCase.
 */
export interface RawSyncRecord {
  entity_type: string;
  entity_id: string;
  payload: Record<string, unknown>;
  client_version: string;
}

export interface SyncPushInput {
  deviceId: string;
  records: SyncRecord[];
}

export interface SyncPullInput {
  deviceId: string;
  since?: Date;
}

export interface PushResult {
  logId: string;
  accepted: string[];
  rejected: Array<{ id: string; reason: string }>;
  forwarded: Array<{ entityType: string; entityId: string }>;
}

export interface PullResult {
  logId: string;
  records: SyncRecord[];
  since: Date;
}

export interface SyncStatusInfo {
  totalDevices: number;
  activeDevices: number;
  pendingLogs: number;
  pendingConflicts: number;
  lastSyncAt: Date | null;
}

export interface SyncLogEntry {
  id: string;
  deviceId: string;
  direction: SyncDirection;
  status: SyncStatus;
  recordCount: number;
  errorMessage: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

// ─── getStatus ────────────────────────────────────────────────────────────────

/**
 * Aggregate health/sync metrics.
 *
 * - `totalDevices` counts non-deleted devices.
 * - `activeDevices` counts devices seen within the last 24 h.
 * - `pendingLogs` counts sync_log rows that haven't reached a terminal state.
 * - `pendingConflicts` counts sync_conflict rows where resolved_at IS NULL.
 * - `lastSyncAt` is the most recent successful sync_log.
 */
export async function getStatus(): Promise<SyncStatusInfo> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [totalDevices, activeDevices, pendingLogs, pendingConflicts, lastLog] = await Promise.all([
    prisma.device.count({ where: { deleted_at: null } }),
    prisma.device.count({
      where: { deleted_at: null, last_seen_at: { gte: cutoff } },
    }),
    prisma.sync_log.count({
      where: { status: { in: ['PENDING', 'IN_PROGRESS'] } },
    }),
    prisma.sync_conflict.count({ where: { resolved_at: null } }),
    prisma.sync_log.findFirst({
      where: { status: 'COMPLETED' },
      orderBy: { completed_at: 'desc' },
      select: { completed_at: true },
    }),
  ]);

  return {
    totalDevices,
    activeDevices,
    pendingLogs,
    pendingConflicts,
    lastSyncAt: lastLog?.completed_at ?? null,
  };
}

// ─── push ─────────────────────────────────────────────────────────────────────

/**
 * Store a PUSH log entry, validate records (entity types) via inter-service
 * checks, and forward evidence records to svc-bkt. Rejects unknown device ids.
 *
 * Accepts either canonical camelCase `SyncRecord` shape or raw snake_case
 * records from the Zod validator (`PushInput`).
 */
export async function push(
  input: SyncPushInput & { records: Array<SyncRecord | RawSyncRecord> },
): Promise<PushResult> {
  if (input.records.length === 0) {
    throw new ValidationError(
      [{ path: ['records'], message: 'records must contain at least 1 entry', code: 'empty' }],
      'PUSH payload is empty',
    );
  }

  const device = await prisma.device.findFirst({
    where: { id: input.deviceId, deleted_at: null },
  });

  if (!device) {
    throw new NotFoundError('Device', input.deviceId);
  }

  const accepted: string[] = [];
  const rejected: Array<{ id: string; reason: string }> = [];
  const forwarded: Array<{ entityType: string; entityId: string }> = [];

  for (const record of input.records) {
    const key = `${record.entityType}:${record.entityId}`;

    // Validate evidence via svc-bkt (entity_type === 'evidence')
    if (record.entityType === 'evidence') {
      const data = record.data as { studentId?: unknown; skillId?: unknown; correct?: unknown };
      if (typeof data?.studentId !== 'string' || typeof data?.skillId !== 'string') {
        rejected.push({ id: key, reason: 'evidence payload missing studentId/skillId' });
        continue;
      }
      const student = await verifyStudent(data.studentId);
      if (!student) {
        rejected.push({ id: key, reason: 'referenced student not found in svc-class' });
        continue;
      }
      const upstreamId = await syncEvidenceToBkt({
        id: record.entityId,
        studentId: data.studentId,
        skillId: data.skillId,
        correct: Boolean(data.correct),
      });
      forwarded.push({ entityType: record.entityType, entityId: upstreamId });
      accepted.push(key);
      continue;
    }

    // All other entity types are accepted as-is for now.
    accepted.push(key);
  }

  const allRejected = rejected.length === input.records.length;
  const status: SyncStatus = allRejected ? 'FAILED' : 'COMPLETED';
  const errorMessage =
    rejected.length > 0
      ? `${rejected.length}/${input.records.length} records rejected`
      : null;

  const log = await prisma.sync_log.create({
    data: {
      device_id: input.deviceId,
      direction: 'PUSH',
      status,
      record_count: input.records.length,
      error_message: errorMessage,
      completed_at: status === 'COMPLETED' ? new Date() : null,
    },
  });

  // Touch device.last_seen_at so dashboards reflect the push.
  await prisma.device.update({
    where: { id: input.deviceId },
    data: { last_seen_at: new Date() },
  });

  logger.info('sync push processed', {
    deviceId: input.deviceId,
    logId: log.id,
    accepted: accepted.length,
    rejected: rejected.length,
  });

  return {
    logId: log.id,
    accepted,
    rejected,
    forwarded,
  };
}

// ─── pull ─────────────────────────────────────────────────────────────────────

/**
 * Return the records updated since `since` for a given device.
 * Also writes a PULL sync_log entry and refreshes device.last_seen_at.
 */
export async function pull(input: SyncPullInput): Promise<PullResult> {
  const device = await prisma.device.findFirst({
    where: { id: input.deviceId, deleted_at: null },
  });

  if (!device) {
    throw new NotFoundError('Device', input.deviceId);
  }

  const since = input.since ?? new Date(0);
  const records = await collectRecordsSince(since);

  const log = await prisma.sync_log.create({
    data: {
      device_id: input.deviceId,
      direction: 'PULL',
      status: 'COMPLETED',
      record_count: records.length,
      completed_at: new Date(),
    },
  });

  await prisma.device.update({
    where: { id: input.deviceId },
    data: { last_seen_at: new Date() },
  });

  logger.info('sync pull processed', {
    deviceId: input.deviceId,
    logId: log.id,
    count: records.length,
    since: since.toISOString(),
  });

  return {
    logId: log.id,
    records,
    since,
  };
}

/**
 * Convenience helper — returns every changed record (sync_log + sync_conflict)
 * since the given timestamp. Useful for the `/api/sync/pull/:since` route.
 */
export async function pullSince(since: Date | undefined): Promise<SyncRecord[]> {
  const cutoff = since ?? new Date(0);
  return collectRecordsSince(cutoff);
}

// ─── resolveConflict (sync-level) ─────────────────────────────────────────────

/**
 * Mark a conflict as resolved. Delegates the actual mutation to the
 * conflict service so both routes share a single source of truth.
 */
export async function resolveConflict(
  conflictId: string,
  resolution: ConflictResolution,
): Promise<void> {
  const { resolveConflict: resolveConflictInDb } = await import('./conflict.service.js');
  await resolveConflictInDb(conflictId, resolution);
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function collectRecordsSince(since: Date): Promise<SyncRecord[]> {
  // sync_log entries are themselves "events" the client may need to replay.
  const [logs, conflicts] = await Promise.all([
    prisma.sync_log.findMany({
      where: { created_at: { gt: since } },
      orderBy: { created_at: 'asc' },
    }),
    prisma.sync_conflict.findMany({
      where: { detected_at: { gt: since } },
      orderBy: { detected_at: 'asc' },
    }),
  ]);

  const records: SyncRecord[] = [];

  for (const log of logs) {
    records.push({
      entityType: 'sync_log',
      entityId: log.id,
      data: {
        device_id: log.device_id,
        direction: log.direction,
        status: log.status,
        record_count: log.record_count,
        error_message: log.error_message,
        created_at: log.created_at,
        completed_at: log.completed_at,
      },
      version: log.created_at.toISOString(),
    });
  }

  for (const conflict of conflicts) {
    records.push({
      entityType: 'sync_conflict',
      entityId: conflict.id,
      data: {
        device_id: conflict.device_id,
        entity_type: conflict.entity_type,
        entity_id: conflict.entity_id,
        server_version: conflict.server_version,
        client_version: conflict.client_version,
        resolved_at: conflict.resolved_at,
        resolution: conflict.resolution,
      },
      version: conflict.detected_at.toISOString(),
    });
  }

  return records;
}
