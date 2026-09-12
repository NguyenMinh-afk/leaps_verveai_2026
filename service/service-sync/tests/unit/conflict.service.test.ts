/**
 * Unit tests for conflict.service — list / resolve / detect.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/prisma/client', () => ({
  prisma: {
    sync_conflict: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    device: {
      findFirst: vi.fn(),
    },
  },
}));

import { prisma } from '../../src/prisma/client';
import {
  detectConflict,
  listConflicts,
  resolveConflict,
} from '../../src/services/conflict.service';

describe('conflict.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── resolveConflict ──────────────────────────────────────────────────────

  describe('resolveConflict', () => {
    const conflictId = '33333333-3333-3333-3333-333333333333';

    it('marks an unresolved conflict as resolved', async () => {
      vi.mocked(prisma.sync_conflict.findUnique).mockResolvedValue({
        id: conflictId,
        device_id: 'dev-1',
        entity_type: 'evidence',
        entity_id: 'ev-1',
        server_version: 'v1',
        client_version: 'v2',
        resolved_at: null,
        resolution: null,
        detected_at: new Date('2026-01-01T00:00:00Z'),
      });
      vi.mocked(prisma.sync_conflict.update).mockResolvedValue({
        id: conflictId,
        device_id: 'dev-1',
        entity_type: 'evidence',
        entity_id: 'ev-1',
        server_version: 'v1',
        client_version: 'v2',
        resolved_at: new Date('2026-02-01T00:00:00Z'),
        resolution: 'SERVER_WINS',
        detected_at: new Date('2026-01-01T00:00:00Z'),
      });

      const result = await resolveConflict(conflictId, 'SERVER_WINS');

      expect(result.id).toBe(conflictId);
      expect(result.resolution).toBe('SERVER_WINS');
      expect(result.resolvedAt).toEqual(new Date('2026-02-01T00:00:00Z'));
      expect(prisma.sync_conflict.update).toHaveBeenCalledWith({
        where: { id: conflictId },
        data: {
          resolution: 'SERVER_WINS',
          resolved_at: expect.any(Date),
        },
      });
    });

    it('throws NotFoundError for unknown conflict id', async () => {
      vi.mocked(prisma.sync_conflict.findUnique).mockResolvedValue(null);

      await expect(resolveConflict('missing-id', 'CLIENT_WINS')).rejects.toThrow(
        'Conflict missing-id not found',
      );
    });

    it('rejects resolving an already-resolved conflict', async () => {
      vi.mocked(prisma.sync_conflict.findUnique).mockResolvedValue({
        id: conflictId,
        device_id: 'dev-1',
        entity_type: 'evidence',
        entity_id: 'ev-1',
        server_version: 'v1',
        client_version: 'v2',
        resolved_at: new Date('2026-01-15T00:00:00Z'),
        resolution: 'SERVER_WINS',
        detected_at: new Date('2026-01-01T00:00:00Z'),
      });

      await expect(resolveConflict(conflictId, 'CLIENT_WINS')).rejects.toThrow(
        'Conflict already resolved',
      );
      expect(prisma.sync_conflict.update).not.toHaveBeenCalled();
    });
  });

  // ─── detectConflict ───────────────────────────────────────────────────────

  describe('detectConflict', () => {
    it('inserts a conflict when server and client versions differ', async () => {
      const deviceId = '44444444-4444-4444-4444-444444444444';
      vi.mocked(prisma.device.findFirst).mockResolvedValue({ id: deviceId });
      vi.mocked(prisma.sync_conflict.create).mockResolvedValue({
        id: 'conf-new',
        device_id: deviceId,
        entity_type: 'evidence',
        entity_id: 'ev-9',
        server_version: 'v1',
        client_version: 'v2',
        resolved_at: null,
        resolution: null,
        detected_at: new Date(),
      });

      const result = await detectConflict({
        deviceId,
        entityType: 'evidence',
        entityId: 'ev-9',
        serverVersion: 'v1',
        clientVersion: 'v2',
      });

      expect(result).not.toBeNull();
      expect(result?.entityId).toBe('ev-9');
      expect(prisma.sync_conflict.create).toHaveBeenCalledOnce();
    });

    it('does NOT insert a conflict when versions match', async () => {
      const result = await detectConflict({
        deviceId: 'any',
        entityType: 'evidence',
        entityId: 'ev-1',
        serverVersion: 'v3',
        clientVersion: 'v3',
      });

      expect(result).toBeNull();
      expect(prisma.sync_conflict.create).not.toHaveBeenCalled();
      expect(prisma.device.findFirst).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when device does not exist', async () => {
      vi.mocked(prisma.device.findFirst).mockResolvedValue(null);

      await expect(
        detectConflict({
          deviceId: 'missing-device',
          entityType: 'evidence',
          entityId: 'ev-1',
          serverVersion: 'v1',
          clientVersion: 'v2',
        }),
      ).rejects.toThrow('Device missing-device not found');
    });
  });

  // ─── listConflicts ────────────────────────────────────────────────────────

  describe('listConflicts', () => {
    it('returns paginated conflicts', async () => {
      vi.mocked(prisma.sync_conflict.findMany).mockResolvedValue([
        {
          id: 'c-1',
          device_id: 'dev-1',
          entity_type: 'evidence',
          entity_id: 'ev-1',
          server_version: 'v1',
          client_version: 'v2',
          resolved_at: null,
          resolution: null,
          detected_at: new Date(),
        },
      ]);
      vi.mocked(prisma.sync_conflict.count).mockResolvedValue(1);

      const result = await listConflicts({ page: 1, pageSize: 20 });

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.pageSize).toBe(20);
      expect(result.meta.hasNext).toBe(false);
    });

    it('applies resolved filter (true → only resolved)', async () => {
      vi.mocked(prisma.sync_conflict.findMany).mockResolvedValue([]);
      vi.mocked(prisma.sync_conflict.count).mockResolvedValue(0);

      await listConflicts({ page: 1, pageSize: 20, resolved: true });

      expect(prisma.sync_conflict.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { resolved_at: { not: null } },
        }),
      );
    });
  });
});
