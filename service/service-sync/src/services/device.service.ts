/**
 * Device management service.
 *
 * Devices are physical endpoints (Android tablets, Windows desktops, ...)
 * that run the Flutter app. Each device is registered through svc-sync
 * so the server can track last_seen and the history of sync attempts.
 *
 * Soft delete (`deleted_at`) is used so historical sync logs stay
 * referentially intact.
 */

import { prisma } from '../prisma/client.js';
import { NotFoundError } from '@verveai/error-types';
import { logger } from '../utils/logger.js';

// ─── Public types ─────────────────────────────────────────────────────────────

export type DeviceType = 'ANDROID' | 'WINDOWS' | 'TABLET';

export interface DeviceInput {
  type: DeviceType;
  name: string;
}

export interface UpdateDeviceInput {
  name?: string;
  lastSeenAt?: Date;
}

export interface Device {
  id: string;
  type: DeviceType;
  name: string;
  lastSeenAt: Date;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface SyncLogEntry {
  id: string;
  deviceId: string;
  direction: 'PUSH' | 'PULL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  recordCount: number;
  errorMessage: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

export interface DeviceWithSyncCount extends Device {
  syncCount: number;
}

export interface DeviceWithLogs extends Device {
  logs: SyncLogEntry[];
}

export interface PaginationInput {
  page: number;
  pageSize: number;
}

export interface PaginatedDevices {
  items: DeviceWithSyncCount[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── listDevices ──────────────────────────────────────────────────────────────

/**
 * List non-deleted devices with their aggregate sync count.
 */
export async function listDevices(
  pagination: PaginationInput,
  filter?: { type?: DeviceType },
): Promise<PaginatedDevices> {
  const where = {
    deleted_at: null,
    ...(filter?.type ? { type: filter.type } : {}),
  };

  const skip = (Math.max(1, pagination.page) - 1) * Math.min(Math.max(1, pagination.pageSize), 100);
  const take = Math.min(Math.max(1, pagination.pageSize), 100);

  const [rows, total] = await Promise.all([
    prisma.device.findMany({
      where,
      orderBy: { last_seen_at: 'desc' },
      skip,
      take,
      include: {
        _count: {
          select: { sync_logs: true },
        },
      },
    }),
    prisma.device.count({ where }),
  ]);

  const items: DeviceWithSyncCount[] = rows.map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    lastSeenAt: row.last_seen_at,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
    syncCount: row._count.sync_logs,
  }));

  const totalPages = Math.max(1, Math.ceil(total / take));
  return {
    items,
    meta: {
      page: pagination.page,
      pageSize: take,
      total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
  };
}

// ─── getDevice ────────────────────────────────────────────────────────────────

/**
 * Return a single device with its most-recent 50 sync logs.
 */
export async function getDevice(id: string): Promise<DeviceWithLogs> {
  const row = await prisma.device.findFirst({
    where: { id, deleted_at: null },
    include: {
      sync_logs: {
        orderBy: { created_at: 'desc' },
        take: 50,
      },
    },
  });

  if (!row) {
    throw new NotFoundError('Device', id);
  }

  return {
    id: row.id,
    type: row.type,
    name: row.name,
    lastSeenAt: row.last_seen_at,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
    logs: row.sync_logs.map(toSyncLog),
  };
}

// ─── registerDevice ───────────────────────────────────────────────────────────

/**
 * Insert a new device row. Returns the id of the new record.
 */
export async function registerDevice(input: DeviceInput): Promise<{ id: string; device: Device }> {
  const row = await prisma.device.create({
    data: {
      type: input.type,
      name: input.name,
      last_seen_at: new Date(),
    },
  });

  logger.info('device registered', { id: row.id, type: row.type, name: row.name });

  return {
    id: row.id,
    device: {
      id: row.id,
      type: row.type,
      name: row.name,
      lastSeenAt: row.last_seen_at,
      createdAt: row.created_at,
      deletedAt: row.deleted_at,
    },
  };
}

// ─── updateDevice ─────────────────────────────────────────────────────────────

/**
 * Update mutable device fields. Rejects updates to soft-deleted devices.
 */
export async function updateDevice(id: string, input: UpdateDeviceInput): Promise<Device> {
  const existing = await prisma.device.findFirst({
    where: { id, deleted_at: null },
  });

  if (!existing) {
    throw new NotFoundError('Device', id);
  }

  const data: { name?: string; last_seen_at?: Date } = {};
  if (input.name !== undefined) {
    data.name = input.name;
  }
  if (input.lastSeenAt !== undefined) {
    data.last_seen_at = input.lastSeenAt;
  }

  const row = await prisma.device.update({
    where: { id },
    data,
  });

  logger.info('device updated', { id: row.id, fields: Object.keys(data) });

  return {
    id: row.id,
    type: row.type,
    name: row.name,
    lastSeenAt: row.last_seen_at,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
  };
}

// ─── deleteDevice ─────────────────────────────────────────────────────────────

/**
 * Soft delete — sets `deleted_at` so historical sync logs remain valid.
 */
export async function deleteDevice(id: string): Promise<void> {
  const existing = await prisma.device.findFirst({
    where: { id, deleted_at: null },
  });

  if (!existing) {
    throw new NotFoundError('Device', id);
  }

  await prisma.device.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  logger.info('device soft-deleted', { id });
}

// ─── getDeviceLogs ────────────────────────────────────────────────────────────

/**
 * Paginated history of sync_log rows for a device (newest first).
 */
export async function getDeviceLogs(
  id: string,
  pagination: PaginationInput,
): Promise<{ items: SyncLogEntry[]; meta: PaginatedDevices['meta'] }> {
  const device = await prisma.device.findFirst({
    where: { id, deleted_at: null },
    select: { id: true },
  });

  if (!device) {
    throw new NotFoundError('Device', id);
  }

  const skip = (Math.max(1, pagination.page) - 1) * Math.min(Math.max(1, pagination.pageSize), 100);
  const take = Math.min(Math.max(1, pagination.pageSize), 100);

  const [rows, total] = await Promise.all([
    prisma.sync_log.findMany({
      where: { device_id: id },
      orderBy: { created_at: 'desc' },
      skip,
      take,
    }),
    prisma.sync_log.count({ where: { device_id: id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));

  return {
    items: rows.map(toSyncLog),
    meta: {
      page: pagination.page,
      pageSize: take,
      total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSyncLog(row: {
  id: string;
  device_id: string;
  direction: 'PUSH' | 'PULL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  record_count: number;
  error_message: string | null;
  created_at: Date;
  completed_at: Date | null;
}): SyncLogEntry {
  return {
    id: row.id,
    deviceId: row.device_id,
    direction: row.direction,
    status: row.status,
    recordCount: row.record_count,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}
