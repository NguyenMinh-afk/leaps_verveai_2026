/**
 * Unit tests for class.service.
 *
 * All tests use a fully-mocked Prisma client so they are deterministic and
 * run without a database. Cross-service calls (svc-auth, svc-bkt) are mocked
 * through the inter-service module.
 */

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

// ── Mock ALL external dependencies before importing anything else ─────────────

vi.mock('../../src/config/env.js', () => ({
  validateEnv: () => ({
    NODE_ENV: 'test',
    PORT: 3003,
    SERVICE_NAME: 'svc-class',
    SERVICE_PORT: 3003,
    LOG_LEVEL: 'silent',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    CONSUL_HOST: 'localhost',
    CONSUL_PORT: 8500,
    OTEL_SERVICE_NAME: 'svc-class',
  }),
}));

vi.mock('../../src/tracing.js', () => ({}));

vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    child: vi.fn(() => this),
  },
  createChildLogger: vi.fn(),
}));

// ── Prisma mock — must be declared before importing the service ─────────────

const mockPrisma = {
  $transaction: vi.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
  class: {
    findFirst: vi.fn<() => Promise<unknown>>(),
    findMany: vi.fn<() => Promise<unknown>>(),
    create: vi.fn<() => Promise<unknown>>(),
    update: vi.fn<() => Promise<unknown>>(),
    count: vi.fn<() => Promise<number>>(),
  },
  enrollment: {
    findMany: vi.fn<() => Promise<unknown>>(),
    updateMany: vi.fn<() => Promise<unknown>>(),
  },
};

vi.mock('../../src/prisma/client.js', () => ({
  prisma: mockPrisma,
}));

vi.mock('../../src/services/inter-service.js', () => ({
  callSvcAuth: vi.fn<() => Promise<unknown>>(),
  callSvcBkt: vi.fn<() => Promise<unknown>>(),
  extractInterServiceHeaders: vi.fn(() => ({})),
}));

// ── Import service AFTER all mocks are in place ────────────────────────────────

const { listClasses, createClass, updateClass, deleteClass, getClassStats } =
  await import('../../src/services/class.service.js');

// ── Fixtures ──────────────────────────────────────────────────────────────────

const FIXTURE_NOW = new Date('2025-01-15T12:00:00Z');

const FIXTURE_CLASS = {
  id: 'c1111111-1111-4111-8111-111111111111',
  name: 'Math 101',
  subject: 'Mathematics',
  teacher_id: '91111111-1111-4111-8111-111111111111',
  created_at: FIXTURE_NOW,
  updated_at: FIXTURE_NOW,
  deleted_at: null,
};

// ── Setup / Teardown ─────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(FIXTURE_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

// ══════════════════════════════════════════════════════════════════════════════
// listClasses
// ══════════════════════════════════════════════════════════════════════════════

describe('listClasses', () => {
  it('returns empty list when no classes exist', async () => {
    mockPrisma.class.findMany.mockResolvedValue([]);
    mockPrisma.class.count.mockResolvedValue(0);

    const result = await listClasses(undefined, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(mockPrisma.class.findMany).toHaveBeenCalledOnce();
  });

  it('returns classes with studentCount and averageProgress', async () => {
    mockPrisma.class.findMany.mockResolvedValue([
      {
        ...FIXTURE_CLASS,
        enrollments: [
          { student: { id: 's1', progress: [{ p_known: 0.8 }] } },
          { student: { id: 's2', progress: [{ p_known: 0.4 }] } },
        ],
      },
    ]);
    mockPrisma.class.count.mockResolvedValue(1);

    const result = await listClasses(undefined, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.studentCount).toBe(2);
    // (0.8 + 0.4) / 2 = 0.6
    expect(result.items[0]?.averageProgress).toBeCloseTo(0.6);
  });

  it('filters by teacherId when provided', async () => {
    mockPrisma.class.findMany.mockResolvedValue([]);
    mockPrisma.class.count.mockResolvedValue(0);

    const teacherId = '92222222-2222-4222-8222-222222222222';
    await listClasses(teacherId, { skip: 0, take: 20 });

    expect(mockPrisma.class.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ teacher_id: teacherId, deleted_at: null }),
      })
    );
  });

  it('returns 0 averageProgress when student has no progress records', async () => {
    mockPrisma.class.findMany.mockResolvedValue([
      { ...FIXTURE_CLASS, enrollments: [{ student: { id: 's1', progress: [] } }] },
    ]);
    mockPrisma.class.count.mockResolvedValue(1);

    const result = await listClasses(undefined, { skip: 0, take: 20 });

    expect(result.items[0]?.averageProgress).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// createClass
// ══════════════════════════════════════════════════════════════════════════════

describe('createClass', () => {
  const validInput = {
    name: 'Math 101',
    subject: 'Mathematics',
    teacherId: '91111111-1111-4111-8111-111111111111',
  };

  it('creates a class after verifying teacher via svc-auth', async () => {
    const { callSvcAuth } = await import('../../src/services/inter-service.js');
    vi.mocked(callSvcAuth).mockResolvedValue({ data: { id: validInput.teacherId, isActive: true } });
    mockPrisma.class.findFirst.mockResolvedValue(null);
    mockPrisma.class.create.mockResolvedValue(FIXTURE_CLASS);

    const result = await createClass(validInput);

    expect(callSvcAuth).toHaveBeenCalledWith(
      `/api/users/${validInput.teacherId}`,
      expect.any(Object)
    );
    expect(result.name).toBe('Math 101');
    expect(result.teacherId).toBe(validInput.teacherId);
  });

  it('throws ValidationError when svc-auth says teacher is unknown', async () => {
    const { callSvcAuth } = await import('../../src/services/inter-service.js');
    // Production treats `null` as "service unreachable" (fail-open);
    // "teacher doesn't exist" is `{ data: null }`.
    vi.mocked(callSvcAuth).mockResolvedValue({ data: null });

    await expect(createClass(validInput)).rejects.toThrow('Unknown teacher');
  });

  it('throws ConflictError when class with same name/teacher already exists', async () => {
    const { callSvcAuth } = await import('../../src/services/inter-service.js');
    vi.mocked(callSvcAuth).mockResolvedValue({ data: { id: validInput.teacherId, isActive: true } });
    mockPrisma.class.findFirst.mockResolvedValue(FIXTURE_CLASS);

    await expect(createClass(validInput)).rejects.toThrow('already exists for this teacher');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// updateClass
// ══════════════════════════════════════════════════════════════════════════════

describe('updateClass', () => {
  const ownerId = '91111111-1111-4111-8111-111111111111';
  const otherId = '92222222-2222-4222-8222-222222222222';

  it('allows owner teacher to update the class name', async () => {
    mockPrisma.class.findFirst.mockResolvedValue(FIXTURE_CLASS);
    mockPrisma.class.update.mockResolvedValue({ ...FIXTURE_CLASS, name: 'Math 102' });

    const result = await updateClass(FIXTURE_CLASS.id, { name: 'Math 102' }, ownerId, 'TEACHER');

    expect(result.name).toBe('Math 102');
  });

  it('allows admin to update any class regardless of ownership', async () => {
    mockPrisma.class.findFirst.mockResolvedValue(FIXTURE_CLASS);
    mockPrisma.class.update.mockResolvedValue({ ...FIXTURE_CLASS, name: 'Admin Math' });

    const result = await updateClass(FIXTURE_CLASS.id, { name: 'Admin Math' }, otherId, 'ADMIN');

    expect(result.name).toBe('Admin Math');
  });

  it('throws ForbiddenError when non-owner non-admin tries to update', async () => {
    mockPrisma.class.findFirst.mockResolvedValue(FIXTURE_CLASS);

    await expect(
      updateClass(FIXTURE_CLASS.id, { name: 'Hacked' }, otherId, 'TEACHER')
    ).rejects.toThrow('Only the owning teacher');
  });

  it('returns existing record when payload is empty', async () => {
    mockPrisma.class.findFirst.mockResolvedValue(FIXTURE_CLASS);

    const result = await updateClass(FIXTURE_CLASS.id, {}, ownerId, 'TEACHER');

    expect(mockPrisma.class.update).not.toHaveBeenCalled();
    expect(result.name).toBe(FIXTURE_CLASS.name);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// deleteClass
// ══════════════════════════════════════════════════════════════════════════════

describe('deleteClass', () => {
  const ownerId = '91111111-1111-4111-8111-111111111111';
  const otherId = '92222222-2222-4222-8222-222222222222';

  it('soft-deletes class and cascades deleted_at to enrollments', async () => {
    mockPrisma.class.findFirst.mockResolvedValue(FIXTURE_CLASS);
    mockPrisma.class.update.mockResolvedValue({ ...FIXTURE_CLASS, deleted_at: FIXTURE_NOW });
    mockPrisma.enrollment.updateMany.mockResolvedValue({ count: 2 });

    await deleteClass(FIXTURE_CLASS.id, ownerId, 'TEACHER');

    // Class soft-deleted
    expect(mockPrisma.class.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: FIXTURE_CLASS.id },
        data: { deleted_at: FIXTURE_NOW },
      })
    );
    // Enrollments cascade-deleted
    expect(mockPrisma.enrollment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { class_id: FIXTURE_CLASS.id, deleted_at: null },
        data: { deleted_at: FIXTURE_NOW, dropped_at: FIXTURE_NOW },
      })
    );
  });

  it('throws ForbiddenError when non-owner non-admin tries to delete', async () => {
    mockPrisma.class.findFirst.mockResolvedValue(FIXTURE_CLASS);

    await expect(deleteClass(FIXTURE_CLASS.id, otherId, 'TEACHER')).rejects.toThrow(
      'Only the owning teacher'
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getClassStats
// ══════════════════════════════════════════════════════════════════════════════

describe('getClassStats', () => {
  it('computes studentCount and averageMastery from progress rows', async () => {
    mockPrisma.class.findFirst.mockResolvedValue(FIXTURE_CLASS);
    mockPrisma.enrollment.findMany.mockResolvedValue([
      {
        student: {
          id: 's1',
          progress: [{ p_known: 0.9 }, { p_known: 0.5 }],
        },
      },
      {
        student: {
          id: 's2',
          progress: [{ p_known: 0.2 }],
        },
      },
    ]);
    const { callSvcBkt } = await import('../../src/services/inter-service.js');
    vi.mocked(callSvcBkt).mockResolvedValue({ count: 3 });

    const stats = await getClassStats(FIXTURE_CLASS.id);

    expect(stats.studentCount).toBe(2);
    // (0.9 + 0.5 + 0.2) / 3 ≈ 0.533
    expect(stats.averageMastery).toBeCloseTo(0.533, 2);
    // 1 of 3 skills mastered (0.9 >= 0.8)
    expect(stats.masteryRate).toBeCloseTo(0.333, 2);
    expect(stats.interventionCount).toBe(3);
    expect(stats.interventionAvailable).toBe(true);
  });

  it('sets interventionAvailable=false when svc-bkt call fails', async () => {
    mockPrisma.class.findFirst.mockResolvedValue(FIXTURE_CLASS);
    mockPrisma.enrollment.findMany.mockResolvedValue([
      { student: { id: 's1', progress: [] } },
    ]);
    const { callSvcBkt } = await import('../../src/services/inter-service.js');
    vi.mocked(callSvcBkt).mockResolvedValue(null);

    const stats = await getClassStats(FIXTURE_CLASS.id);

    expect(stats.interventionAvailable).toBe(false);
    expect(stats.interventionCount).toBe(0);
  });

  it('returns 0 when class has no enrollments', async () => {
    mockPrisma.class.findFirst.mockResolvedValue(FIXTURE_CLASS);
    mockPrisma.enrollment.findMany.mockResolvedValue([]);

    const stats = await getClassStats(FIXTURE_CLASS.id);

    expect(stats.studentCount).toBe(0);
    expect(stats.averageMastery).toBe(0);
    expect(stats.masteryRate).toBe(0);
  });
});
