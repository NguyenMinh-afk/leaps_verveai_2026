/**
 * Unit tests for transfer.service — initiate / complete / fail.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/prisma/client', () => ({
  prisma: {
    device: {
      findFirst: vi.fn(),
    },
    student_transfer: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from '../../src/prisma/client';
import {
  completeTransfer,
  failTransfer,
  initiateTransfer,
} from '../../src/services/transfer.service';

describe('transfer.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const deviceA = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const deviceB = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  // ─── initiateTransfer ─────────────────────────────────────────────────────

  describe('initiateTransfer', () => {
    it('creates a PENDING transfer when both devices exist', async () => {
      vi.mocked(prisma.device.findFirst).mockImplementation(async (args) => {
        const where = (args as { where?: { id?: string } })?.where ?? {};
        if (where.id === deviceA) return { id: deviceA };
        if (where.id === deviceB) return { id: deviceB };
        return null;
      });
      vi.mocked(prisma.student_transfer.create).mockResolvedValue({
        id: 'tr-1',
        from_device_id: deviceA,
        to_device_id: deviceB,
        status: 'PENDING',
        transferred_at: null,
        failed_at: null,
        error_reason: null,
        student_ids: [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await initiateTransfer({ fromDeviceId: deviceA, toDeviceId: deviceB });

      expect(result.id).toBe('tr-1');
      expect(result.status).toBe('PENDING');
      expect(result.fromDeviceId).toBe(deviceA);
      expect(result.toDeviceId).toBe(deviceB);
      expect(prisma.student_transfer.create).toHaveBeenCalledWith({
        data: {
          from_device_id: deviceA,
          to_device_id: deviceB,
          status: 'PENDING',
          student_ids: [],
        },
      });
    });

    it('throws NotFoundError when the source device is missing', async () => {
      vi.mocked(prisma.device.findFirst).mockImplementation(async (args) => {
        const where = (args as { where?: { id?: string } })?.where ?? {};
        if (where.id === deviceB) return { id: deviceB };
        return null;
      });

      await expect(
        initiateTransfer({ fromDeviceId: deviceA, toDeviceId: deviceB }),
      ).rejects.toThrow(`Source device ${deviceA} not found`);
      expect(prisma.student_transfer.create).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when the destination device is missing', async () => {
      vi.mocked(prisma.device.findFirst).mockImplementation(async (args) => {
        const where = (args as { where?: { id?: string } })?.where ?? {};
        if (where.id === deviceA) return { id: deviceA };
        return null;
      });

      await expect(
        initiateTransfer({ fromDeviceId: deviceA, toDeviceId: deviceB }),
      ).rejects.toThrow(`Destination device ${deviceB} not found`);
    });

    it('rejects when source and destination are the same device', async () => {
      await expect(
        initiateTransfer({ fromDeviceId: deviceA, toDeviceId: deviceA }),
      ).rejects.toThrow('Invalid transfer');
      expect(prisma.device.findFirst).not.toHaveBeenCalled();
    });
  });

  // ─── completeTransfer ─────────────────────────────────────────────────────

  describe('completeTransfer', () => {
    it('stamps transferred_at and sets status COMPLETED', async () => {
      vi.mocked(prisma.student_transfer.findUnique).mockResolvedValue({
        id: 'tr-1',
        from_device_id: deviceA,
        to_device_id: deviceB,
        status: 'PENDING',
        transferred_at: null,
        failed_at: null,
        error_reason: null,
        student_ids: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
      vi.mocked(prisma.student_transfer.update).mockResolvedValue({
        id: 'tr-1',
        from_device_id: deviceA,
        to_device_id: deviceB,
        status: 'COMPLETED',
        transferred_at: new Date('2026-05-01T00:00:00Z'),
        failed_at: null,
        error_reason: null,
        student_ids: [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await completeTransfer('tr-1');

      expect(result.status).toBe('COMPLETED');
      expect(result.transferredAt).toEqual(new Date('2026-05-01T00:00:00Z'));
      expect(prisma.student_transfer.update).toHaveBeenCalledWith({
        where: { id: 'tr-1' },
        data: {
          status: 'COMPLETED',
          transferred_at: expect.any(Date),
          failed_at: null,
          error_reason: null,
        },
      });
    });

    it('rejects completing an already-completed transfer', async () => {
      vi.mocked(prisma.student_transfer.findUnique).mockResolvedValue({
        id: 'tr-1',
        from_device_id: deviceA,
        to_device_id: deviceB,
        status: 'COMPLETED',
        transferred_at: new Date(),
        failed_at: null,
        error_reason: null,
        student_ids: [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(completeTransfer('tr-1')).rejects.toThrow('Transfer already completed');
      expect(prisma.student_transfer.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundError for unknown transfer id', async () => {
      vi.mocked(prisma.student_transfer.findUnique).mockResolvedValue(null);

      await expect(completeTransfer('missing')).rejects.toThrow('Transfer missing not found');
    });
  });

  // ─── failTransfer ─────────────────────────────────────────────────────────

  describe('failTransfer', () => {
    it('stamps failed_at and persists error_reason', async () => {
      vi.mocked(prisma.student_transfer.findUnique).mockResolvedValue({
        id: 'tr-1',
        from_device_id: deviceA,
        to_device_id: deviceB,
        status: 'IN_PROGRESS',
        transferred_at: null,
        failed_at: null,
        error_reason: null,
        student_ids: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
      vi.mocked(prisma.student_transfer.update).mockResolvedValue({
        id: 'tr-1',
        from_device_id: deviceA,
        to_device_id: deviceB,
        status: 'FAILED',
        transferred_at: null,
        failed_at: new Date('2026-05-02T00:00:00Z'),
        error_reason: 'network down',
        student_ids: [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await failTransfer('tr-1', 'network down');

      expect(result.status).toBe('FAILED');
      expect(result.errorReason).toBe('network down');
      expect(result.failedAt).toEqual(new Date('2026-05-02T00:00:00Z'));
      expect(prisma.student_transfer.update).toHaveBeenCalledWith({
        where: { id: 'tr-1' },
        data: {
          status: 'FAILED',
          failed_at: expect.any(Date),
          error_reason: 'network down',
        },
      });
    });

    it('rejects empty/whitespace reason', async () => {
      await expect(failTransfer('tr-1', '   ')).rejects.toThrow('Failure reason required');
      expect(prisma.student_transfer.findUnique).not.toHaveBeenCalled();
    });

    it('rejects failing an already-completed transfer', async () => {
      vi.mocked(prisma.student_transfer.findUnique).mockResolvedValue({
        id: 'tr-1',
        from_device_id: deviceA,
        to_device_id: deviceB,
        status: 'COMPLETED',
        transferred_at: new Date(),
        failed_at: null,
        error_reason: null,
        student_ids: [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(failTransfer('tr-1', 'boom')).rejects.toThrow('Transfer already completed');
      expect(prisma.student_transfer.update).not.toHaveBeenCalled();
    });
  });
});
