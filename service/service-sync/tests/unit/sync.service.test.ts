/**
 * Unit tests for sync.service — getStatus / push / pull / pullSince.
 *
 * Prisma is mocked at the module boundary; inter-service helpers are
 * stubbed so the unit tests don't touch the network.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/prisma/client', () => ({
  prisma: {
    device: {
      findFirst: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    sync_log: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    sync_conflict: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock('../../src/services/inter-service', () => ({
  verifyStudent: vi.fn(),
  syncEvidenceToBkt: vi.fn(),
}));

import { prisma } from '../../src/prisma/client';
import * as interService from '../../src/services/inter-service';
import {
  getStatus,
  pull,
  pullSince,
  push,
} from '../../src/services/sync.service';

describe('sync.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── getStatus ───────────────────────────────────────────────────────────

  describe('getStatus', () => {
    it('aggregates counts and lastSyncAt correctly', async () => {
      vi.mocked(prisma.device.count).mockImplementation(async (args) => {
        const where = (args as { where?: { last_seen_at?: unknown } })?.where ?? {};
        if ('last_seen_at' in where) return 3; // active devices
        return 10; // total
      });
      vi.mocked(prisma.sync_log.count).mockResolvedValue(2);
      vi.mocked(prisma.sync_conflict.count).mockResolvedValue(1);
      vi.mocked(prisma.sync_log.findFirst).mockResolvedValue({
        completed_at: new Date('2026-01-01T00:00:00Z'),
      });

      const status = await getStatus();

      expect(status.totalDevices).toBe(10);
      expect(status.activeDevices).toBe(3);
      expect(status.pendingLogs).toBe(2);
      expect(status.pendingConflicts).toBe(1);
      expect(status.lastSyncAt).toEqual(new Date('2026-01-01T00:00:00Z'));
    });

    it('returns null lastSyncAt when no completed logs exist', async () => {
      vi.mocked(prisma.device.count).mockResolvedValue(0);
      vi.mocked(prisma.sync_log.count).mockResolvedValue(0);
      vi.mocked(prisma.sync_conflict.count).mockResolvedValue(0);
      vi.mocked(prisma.sync_log.findFirst).mockResolvedValue(null);

      const status = await getStatus();

      expect(status.lastSyncAt).toBeNull();
      expect(status.totalDevices).toBe(0);
      expect(status.activeDevices).toBe(0);
    });
  });

  // ─── push ────────────────────────────────────────────────────────────────

  describe('push', () => {
    const deviceId = '11111111-1111-1111-1111-111111111111';

    it('creates a sync_log row and forwards evidence to svc-bkt', async () => {
      vi.mocked(prisma.device.findFirst).mockResolvedValue({
        id: deviceId,
        type: 'ANDROID',
        name: 'tablet-1',
        last_seen_at: new Date(),
        created_at: new Date(),
        deleted_at: null,
      });
      vi.mocked(interService.verifyStudent).mockResolvedValue({ id: 'stu-1', classId: 'cls-1' });
      vi.mocked(interService.syncEvidenceToBkt).mockResolvedValue('evidence-up-1');
      vi.mocked(prisma.sync_log.create).mockResolvedValue({
        id: 'log-1',
        device_id: deviceId,
        direction: 'PUSH',
        status: 'COMPLETED',
        record_count: 1,
        error_message: null,
        created_at: new Date(),
        completed_at: new Date(),
      });
      vi.mocked(prisma.device.update).mockResolvedValue({});

      const result = await push({
        deviceId,
        records: [
          {
            entityType: 'evidence',
            entityId: 'ev-1',
            data: { studentId: 'stu-1', skillId: 'sk-1', correct: true },
            version: 'v1',
          },
        ],
      });

      expect(result.logId).toBe('log-1');
      expect(result.accepted).toContain('evidence:ev-1');
      expect(result.rejected).toHaveLength(0);
      expect(result.forwarded).toEqual([{ entityType: 'evidence', entityId: 'evidence-up-1' }]);
      expect(interService.syncEvidenceToBkt).toHaveBeenCalledOnce();
    });

    it('rejects evidence referencing unknown students', async () => {
      vi.mocked(prisma.device.findFirst).mockResolvedValue({
        id: deviceId,
        type: 'ANDROID',
        name: 'tablet-1',
        last_seen_at: new Date(),
        created_at: new Date(),
        deleted_at: null,
      });
      vi.mocked(interService.verifyStudent).mockResolvedValue(null);
      vi.mocked(prisma.sync_log.create).mockResolvedValue({
        id: 'log-2',
        device_id: deviceId,
        direction: 'PUSH',
        status: 'FAILED',
        record_count: 1,
        error_message: '1/1 records rejected',
        created_at: new Date(),
        completed_at: null,
      });
      vi.mocked(prisma.device.update).mockResolvedValue({});

      const result = await push({
        deviceId,
        records: [
          {
            entityType: 'evidence',
            entityId: 'ev-1',
            data: { studentId: 'missing', skillId: 'sk-1', correct: true },
            version: 'v1',
          },
        ],
      });

      expect(result.rejected).toEqual([
        { id: 'evidence:ev-1', reason: 'referenced student not found in svc-class' },
      ]);
      expect(result.accepted).toHaveLength(0);
      expect(interService.syncEvidenceToBkt).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when device is unknown', async () => {
      vi.mocked(prisma.device.findFirst).mockResolvedValue(null);

      await expect(
        push({
          deviceId,
          records: [
            {
              entityType: 'generic',
              entityId: 'x',
              data: {},
              version: 'v1',
            },
          ],
        }),
      ).rejects.toThrow('Device 11111111-1111-1111-1111-111111111111 not found');
    });
  });

  // ─── pull ────────────────────────────────────────────────────────────────

  describe('pull', () => {
    const deviceId = '22222222-2222-2222-2222-222222222222';

    it('returns records since timestamp and writes a PULL log', async () => {
      vi.mocked(prisma.device.findFirst).mockResolvedValue({
        id: deviceId,
        type: 'ANDROID',
        name: 'tablet-2',
        last_seen_at: new Date(),
        created_at: new Date(),
        deleted_at: null,
      });
      vi.mocked(prisma.sync_log.findMany).mockResolvedValue([
        {
          id: 'log-1',
          device_id: deviceId,
          direction: 'PUSH',
          status: 'COMPLETED',
          record_count: 5,
          error_message: null,
          created_at: new Date('2026-02-01T00:00:00Z'),
          completed_at: new Date('2026-02-01T00:00:01Z'),
        },
      ]);
      vi.mocked(prisma.sync_conflict.findMany).mockResolvedValue([]);
      vi.mocked(prisma.sync_log.create).mockResolvedValue({
        id: 'pull-log',
        device_id: deviceId,
        direction: 'PULL',
        status: 'COMPLETED',
        record_count: 1,
        error_message: null,
        created_at: new Date(),
        completed_at: new Date(),
      });
      vi.mocked(prisma.device.update).mockResolvedValue({});

      const since = new Date('2026-01-01T00:00:00Z');
      const result = await pull({ deviceId, since });

      expect(result.logId).toBe('pull-log');
      expect(result.records).toHaveLength(1);
      expect(result.records[0]?.entityType).toBe('sync_log');
      expect(result.since).toEqual(since);
    });

    it('returns empty records when nothing has changed since timestamp', async () => {
      vi.mocked(prisma.device.findFirst).mockResolvedValue({
        id: deviceId,
        type: 'TABLET',
        name: 'tablet-3',
        last_seen_at: new Date(),
        created_at: new Date(),
        deleted_at: null,
      });
      vi.mocked(prisma.sync_log.findMany).mockResolvedValue([]);
      vi.mocked(prisma.sync_conflict.findMany).mockResolvedValue([]);
      vi.mocked(prisma.sync_log.create).mockResolvedValue({
        id: 'pull-log-empty',
        device_id: deviceId,
        direction: 'PULL',
        status: 'COMPLETED',
        record_count: 0,
        error_message: null,
        created_at: new Date(),
        completed_at: new Date(),
      });
      vi.mocked(prisma.device.update).mockResolvedValue({});

      const result = await pull({ deviceId, since: new Date('2026-01-01') });

      expect(result.records).toHaveLength(0);
      expect(result.logId).toBe('pull-log-empty');
    });
  });

  // ─── pullSince ───────────────────────────────────────────────────────────

  describe('pullSince', () => {
    it('returns server-wide records since the given timestamp', async () => {
      vi.mocked(prisma.sync_log.findMany).mockResolvedValue([]);
      vi.mocked(prisma.sync_conflict.findMany).mockResolvedValue([
        {
          id: 'conf-1',
          device_id: 'dev-1',
          entity_type: 'evidence',
          entity_id: 'ev-1',
          server_version: 'v1',
          client_version: 'v2',
          resolved_at: null,
          resolution: null,
          detected_at: new Date('2026-03-01T00:00:00Z'),
        },
      ]);

      const records = await pullSince(new Date('2026-01-01T00:00:00Z'));

      expect(records).toHaveLength(1);
      expect(records[0]?.entityType).toBe('sync_conflict');
      expect(records[0]?.entityId).toBe('conf-1');
    });

    it('returns empty list when since is undefined', async () => {
      vi.mocked(prisma.sync_log.findMany).mockResolvedValue([]);
      vi.mocked(prisma.sync_conflict.findMany).mockResolvedValue([]);

      const records = await pullSince(undefined);

      expect(records).toEqual([]);
    });
  });
});
