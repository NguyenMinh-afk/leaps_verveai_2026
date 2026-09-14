/**
 * Unit tests for progress.service.
 *
 * All tests run with a fully-mocked Prisma client. No external services
 * are called.
 */

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

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
    child: vi.fn(function child() { return this; }),
  },
  createChildLogger: vi.fn(),
}));

// ── Prisma mock — declared before vi.mock() so the same ref is used ─────────

const mockPrisma = {
  $transaction: vi.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
  student: {
    findFirst: vi.fn<() => Promise<unknown>>(),
  },
  progress: {
    findMany: vi.fn<() => Promise<unknown>>(),
    findUnique: vi.fn<() => Promise<unknown>>(),
    create: vi.fn<() => Promise<unknown>>(),
    update: vi.fn<() => Promise<unknown>>(),
    count: vi.fn<() => Promise<number>>(),
  },
    $transaction: vi.fn(),
};

vi.mock('../../src/prisma/client.js', () => ({
  prisma: mockPrisma,
}));

// ── Import service AFTER all mocks are in place ───────────────────────────────

const {
  getStudentProgress,
  getProgressHistory,
  getStudentSkills,
  updateProgress,
} = await import('../../src/services/progress.service.js');

// ── Fixtures ──────────────────────────────────────────────────────────────────

const FIXTURE_NOW = new Date('2025-01-15T12:00:00Z');

const FIXTURE_STUDENT_ID = '51111111-1111-4111-8111-111111111111';
const FIXTURE_SKILL_ID = '51111111-1111-4111-8111-111111111111';

const FIXTURE_PROGRESS_ROWS = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    student_id: FIXTURE_STUDENT_ID,
    skill_id: '51111111-1111-4111-8111-111111111111',
    p_known: 0.9,
    last_p_known: 0.7,
    attempt_count: 5,
    updated_at: new Date('2025-01-15T10:00:00Z'),
  },
  {
    id: 'p2222222-2222-2222-2222-222222222222',
    student_id: FIXTURE_STUDENT_ID,
    skill_id: '52222222-2222-4222-8222-222222222222',
    p_known: 0.2,
    last_p_known: 0.1,
    attempt_count: 2,
    updated_at: new Date('2025-01-14T08:00:00Z'),
  },
  {
    id: 'p3333333-3333-3333-3333-333333333333',
    student_id: FIXTURE_STUDENT_ID,
    skill_id: '53333333-3333-4333-8333-333333333333',
    p_known: 0.6,
    last_p_known: 0.5,
    attempt_count: 1,
    updated_at: new Date('2025-01-13T14:00:00Z'),
  },
];

// ── Setup / Teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(FIXTURE_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

// ══════════════════════════════════════════════════════════════════════════════
// getStudentProgress — pagination
// ══════════════════════════════════════════════════════════════════════════════

describe('getStudentProgress', () => {
  it('returns paginated progress rows', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });
    mockPrisma.progress.findMany.mockResolvedValue(FIXTURE_PROGRESS_ROWS);
    mockPrisma.progress.count.mockResolvedValue(3);

    const result = await getStudentProgress(FIXTURE_STUDENT_ID, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(3);
    expect(result.total).toBe(3);
    expect(result.skip).toBe(0);
    expect(result.take).toBe(20);
  });

  it('translates p_known / last_p_known / attempt_count to camelCase', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });
    mockPrisma.progress.findMany.mockResolvedValue([FIXTURE_PROGRESS_ROWS[0]!]);
    mockPrisma.progress.count.mockResolvedValue(1);

    const result = await getStudentProgress(FIXTURE_STUDENT_ID, { skip: 0, take: 20 });

    expect(result.items[0]).toMatchObject({
      pKnown: 0.9,
      lastPKnown: 0.7,
      attemptCount: 5,
      studentId: FIXTURE_STUDENT_ID,
    });
  });

  it('throws ValidationError for malformed student UUID', async () => {
    await expect(
      getStudentProgress('not-a-uuid', { skip: 0, take: 20 })
    ).rejects.toThrow('Invalid student id');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// updateProgress — upsert logic
// ══════════════════════════════════════════════════════════════════════════════

describe('updateProgress', () => {
  it('creates a new progress row when none exists (insert path)', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });
    mockPrisma.progress.findUnique.mockResolvedValue(null);
    mockPrisma.progress.create.mockResolvedValue({
      id: 'new-id',
      student_id: FIXTURE_STUDENT_ID,
      skill_id: FIXTURE_SKILL_ID,
      p_known: 0.5,
      last_p_known: 0,
      attempt_count: 1,
      updated_at: FIXTURE_NOW,
    });

    const result = await updateProgress(FIXTURE_STUDENT_ID, FIXTURE_SKILL_ID, 0.5);

    expect(mockPrisma.progress.create).toHaveBeenCalledOnce();
    expect(result.pKnown).toBe(0.5);
    expect(result.lastPKnown).toBe(0);
    expect(result.attemptCount).toBe(1);
  });

  it('updates existing row and advances last_p_known (update path)', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });
    mockPrisma.progress.findUnique.mockResolvedValue({
      id: 'existing-id',
      student_id: FIXTURE_STUDENT_ID,
      skill_id: FIXTURE_SKILL_ID,
      p_known: 0.7,
      last_p_known: 0.4,
      attempt_count: 3,
      updated_at: FIXTURE_NOW,
    });
    mockPrisma.progress.update.mockResolvedValue({
      id: 'existing-id',
      student_id: FIXTURE_STUDENT_ID,
      skill_id: FIXTURE_SKILL_ID,
      p_known: 0.85,
      last_p_known: 0.7,
      attempt_count: 4,
      updated_at: FIXTURE_NOW,
    });

    const result = await updateProgress(FIXTURE_STUDENT_ID, FIXTURE_SKILL_ID, 0.85);

    expect(mockPrisma.progress.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          p_known: 0.85,
          last_p_known: 0.7,
          attempt_count: { increment: 1 },
        },
      })
    );
    expect(result.lastPKnown).toBe(0.7); // previous p_known
    expect(result.attemptCount).toBe(4); // incremented
  });

it('clamps p_known to [0, 1] range', async () => {
  mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });
  mockPrisma.progress.findUnique.mockResolvedValue(null);

  mockPrisma.progress.create.mockImplementation(async (args: unknown) => {
    const a = args as { data: { p_known: number } };

    return {
      id: 'new-id',
      student_id: FIXTURE_STUDENT_ID,
      skill_id: FIXTURE_SKILL_ID,
      p_known: a.data.p_known,
      last_p_known: 0,
      attempt_count: 1,
      updated_at: FIXTURE_NOW,
    };
  });

  await updateProgress(FIXTURE_STUDENT_ID, FIXTURE_SKILL_ID, 1.5);

  expect(mockPrisma.progress.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        p_known: 1,
      }),
    })
  );

  mockPrisma.progress.create.mockClear();

  await updateProgress(FIXTURE_STUDENT_ID, FIXTURE_SKILL_ID, -0.3);

  expect(mockPrisma.progress.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        p_known: 0,
      }),
    })
  );
});

it('throws ValidationError for malformed skill UUID', async () => {
  await expect(
    updateProgress(FIXTURE_STUDENT_ID, 'bad-uuid', 0.5)
  ).rejects.toThrow('Invalid skill id');
});
    ).rejects.toThrow('Invalid pKnown');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getProgressHistory — time-window filter
// ══════════════════════════════════════════════════════════════════════════════

describe('getProgressHistory', () => {
  it('returns current and previous points when skill row exists and in window', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });
    // Last update was 2 hours ago — well within 365-day window
    const recentUpdate = new Date(FIXTURE_NOW.getTime() - 2 * 60 * 60 * 1000);
    mockPrisma.progress.findUnique.mockResolvedValue({
      ...FIXTURE_PROGRESS_ROWS[0]!,
      updated_at: recentUpdate,
    });

    const result = await getProgressHistory(FIXTURE_STUDENT_ID, FIXTURE_SKILL_ID, 30);

    expect(result.skillId).toBe(FIXTURE_SKILL_ID);
    expect(result.current.pKnown).toBe(0.9);
    expect(result.previous).not.toBeNull();
    expect(result.previous?.pKnown).toBe(0.7);
    expect(result.delta).toBeCloseTo(0.2);
    expect(result.windowDays).toBe(30);
  });

  it('returns null previous point when last_p_known === p_known (no change)', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });
    mockPrisma.progress.findUnique.mockResolvedValue({
      ...FIXTURE_PROGRESS_ROWS[0]!,
      p_known: 0.9,
      last_p_known: 0.9,
      updated_at: new Date(FIXTURE_NOW.getTime() - 60 * 60 * 1000),
    });

    const result = await getProgressHistory(FIXTURE_STUDENT_ID, FIXTURE_SKILL_ID, 30);

    expect(result.previous).toBeNull();
    expect(result.delta).toBe(0);
  });

  it('throws NotFoundError when skill row does not exist', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });
    mockPrisma.progress.findUnique.mockResolvedValue(null);

    await expect(
      getProgressHistory(FIXTURE_STUDENT_ID, FIXTURE_SKILL_ID, 30)
    ).rejects.toThrow('Progress');
  });

  it('throws ValidationError when days is out of range', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });

    await expect(
      getProgressHistory(FIXTURE_STUDENT_ID, FIXTURE_SKILL_ID, 0)
    ).rejects.toThrow('Invalid days parameter');

    await expect(
      getProgressHistory(FIXTURE_STUDENT_ID, FIXTURE_SKILL_ID, 400)
    ).rejects.toThrow('Invalid days parameter');
  });

  it('throws ValidationError for malformed student or skill UUID', async () => {
    await expect(
      getProgressHistory('bad-student', FIXTURE_SKILL_ID, 30)
    ).rejects.toThrow('Invalid student id');

    await expect(
      getProgressHistory(FIXTURE_STUDENT_ID, 'bad-skill', 30)
    ).rejects.toThrow('Invalid skill id');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getStudentSkills — mastery status derivation
// ══════════════════════════════════════════════════════════════════════════════

describe('getStudentSkills', () => {
  it('derives correct mastery statuses', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });
    mockPrisma.progress.findMany.mockResolvedValue(FIXTURE_PROGRESS_ROWS);

    const result = await getStudentSkills(FIXTURE_STUDENT_ID);

    // sk1: p_known=0.9, count=5 → MASTERED (p>=0.8)
    expect(
      result.find((s) => s.skillId === '51111111-1111-4111-8111-111111111111')?.masteryStatus
    ).toBe('MASTERED');
    // sk2: p_known=0.3, count=2 → STRUGGLING (p<0.3)
    expect(
      result.find((s) => s.skillId === '52222222-2222-4222-8222-222222222222')?.masteryStatus
    ).toBe('STRUGGLING');
    // sk3: p_known=0.6, count=1 → DIAGNOSED (0.3 <= p < 0.8)
    expect(
      result.find((s) => s.skillId === '53333333-3333-4333-8333-333333333333')?.masteryStatus
    ).toBe('DIAGNOSED');
  });

  it('marks 0-attempt skills as PENDING', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });
    mockPrisma.progress.findMany.mockResolvedValue([
      { ...FIXTURE_PROGRESS_ROWS[0]!, attempt_count: 0, p_known: 0.9 },
    ]);

    const result = await getStudentSkills(FIXTURE_STUDENT_ID);

    expect(result[0]?.masteryStatus).toBe('PENDING');
  });

  it('returns empty array when student has no progress', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: FIXTURE_STUDENT_ID });
    mockPrisma.progress.findMany.mockResolvedValue([]);

    const result = await getStudentSkills(FIXTURE_STUDENT_ID);

    expect(result).toEqual([]);
  });

  it('throws ValidationError for malformed student UUID', async () => {
    await expect(getStudentSkills('not-a-uuid')).rejects.toThrow('Invalid student id');
  });
});
