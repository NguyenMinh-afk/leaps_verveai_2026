/**
 * Unit tests for student.service.
 *
 * All tests run with a fully-mocked Prisma client. Cross-service calls to
 * svc-bkt are mocked at the inter-service layer so we can verify graceful
 * degradation behaviour.
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
  Student: {
    findFirst: vi.fn<() => Promise<unknown>>(),
    findUnique: vi.fn<() => Promise<unknown>>(),
    create: vi.fn<() => Promise<unknown>>(),
    update: vi.fn<() => Promise<unknown>>(),
  },
  Enrollment: {
    findMany: vi.fn<() => Promise<unknown>>(),
    updateMany: vi.fn<() => Promise<unknown>>(),
  },
  Progress: {
    findMany: vi.fn<() => Promise<unknown>>(),
  },
};

vi.mock('../../src/prisma/client.js', () => ({
  prisma: mockPrisma,
}));

vi.mock('../../src/services/inter-service.js', () => ({
  callSvcBkt: vi.fn<() => Promise<unknown>>(),
  extractInterServiceHeaders: vi.fn(() => ({})),
}));

// ── Import service AFTER all mocks are in place ───────────────────────────────

const {
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentEvidence,
  getStudentDiagnosis,
} = await import('../../src/services/student.service.js');

// ── Fixtures ──────────────────────────────────────────────────────────────────

const FIXTURE_NOW = new Date('2025-01-15T12:00:00Z');

const FIXTURE_STUDENT = {
  id: 's1111111-1111-4111-8111-111111111111',
  name: 'Alice Nguyen',
  email: 'alice@school.vn',
  created_at: FIXTURE_NOW,
  updated_at: FIXTURE_NOW,
  deleted_at: null,
};

const FIXTURE_ENROLLMENTS = [
  {
    enrolled_at: FIXTURE_NOW,
    dropped_at: null,
    deleted_at: null,
    class: {
      id: 'c1111111-1111-4111-8111-111111111111',
      name: 'Math 101',
      subject: 'Mathematics',
    },
  },
  {
    enrolled_at: new Date('2025-01-10T00:00:00Z'),
    dropped_at: null,
    deleted_at: null,
    class: {
      id: 'c2222222-2222-4222-8222-222222222222',
      name: 'Science 201',
      subject: 'Science',
    },
  },
];

const FIXTURE_PROGRESS = [
  { id: 'p1', student_id: FIXTURE_STUDENT.id, skill_id: 'sk1', p_known: 0.9, last_p_known: 0.7, attempt_count: 5, updated_at: FIXTURE_NOW },
  { id: 'p2', student_id: FIXTURE_STUDENT.id, skill_id: 'sk2', p_known: 0.3, last_p_known: 0.2, attempt_count: 2, updated_at: FIXTURE_NOW },
  { id: 'p3', student_id: FIXTURE_STUDENT.id, skill_id: 'sk3', p_known: 0.6, last_p_known: 0.5, attempt_count: 1, updated_at: FIXTURE_NOW },
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
// getStudent
// ══════════════════════════════════════════════════════════════════════════════

describe('getStudent', () => {
  it('returns student detail with classes and progress summary', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);
    mockPrisma.Enrollment.findMany.mockResolvedValue(FIXTURE_ENROLLMENTS);
    mockPrisma.Progress.findMany.mockResolvedValue(FIXTURE_PROGRESS);

    const result = await getStudent(FIXTURE_STUDENT.id);

    expect(result.id).toBe(FIXTURE_STUDENT.id);
    expect(result.name).toBe('Alice Nguyen');
    expect(result.classes).toHaveLength(2);
    expect(result.classes[0]?.className).toBe('Math 101');
    expect(result.progressSummary.totalSkills).toBe(3);
    // (0.9 + 0.3 + 0.6) / 3 = 0.6
    expect(result.progressSummary.averagePKnown).toBeCloseTo(0.6);
    // Only sk1 (0.9) >= 0.8 → 1 mastered
    expect(result.progressSummary.masteredSkills).toBe(1);
    // 5 + 2 + 1 = 8 attempts
    expect(result.progressSummary.totalAttempts).toBe(8);
  });

  it('returns zero summary when student has no progress records', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);
    mockPrisma.Enrollment.findMany.mockResolvedValue([]);
    mockPrisma.Progress.findMany.mockResolvedValue([]);

    const result = await getStudent(FIXTURE_STUDENT.id);

    expect(result.progressSummary.totalSkills).toBe(0);
    expect(result.progressSummary.averagePKnown).toBe(0);
    expect(result.progressSummary.masteredSkills).toBe(0);
    expect(result.progressSummary.totalAttempts).toBe(0);
  });

  it('throws ValidationError for malformed UUID', async () => {
    await expect(getStudent('not-a-uuid')).rejects.toThrow('Invalid student id');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// createStudent
// ══════════════════════════════════════════════════════════════════════════════

describe('createStudent', () => {
  it('creates a student with name and email', async () => {
    mockPrisma.Student.findUnique.mockResolvedValue(null);
    mockPrisma.Student.create.mockResolvedValue(FIXTURE_STUDENT);

    const result = await createStudent({ name: 'Alice Nguyen', email: 'alice@school.vn' });

    expect(result.name).toBe('Alice Nguyen');
    expect(result.email).toBe('alice@school.vn');
    expect(mockPrisma.Student.create).toHaveBeenCalledWith({
      data: { name: 'Alice Nguyen', email: 'alice@school.vn' },
    });
  });

  it('creates a student without email', async () => {
    mockPrisma.Student.create.mockResolvedValue({ ...FIXTURE_STUDENT, email: null });

    const result = await createStudent({ name: 'Bob' });

    expect(result.email).toBeNull();
  });

  it('throws ConflictError when email already belongs to active student', async () => {
    mockPrisma.Student.findUnique.mockResolvedValue(FIXTURE_STUDENT);

    await expect(
      createStudent({ name: 'Bob', email: 'alice@school.vn' })
    ).rejects.toThrow('already exists');
  });

  it('throws ConflictError when email belongs to a soft-deleted student', async () => {
    mockPrisma.Student.findUnique.mockResolvedValue({
      ...FIXTURE_STUDENT,
      deleted_at: new Date('2025-01-01'),
    });

    await expect(
      createStudent({ name: 'Bob', email: 'alice@school.vn' })
    ).rejects.toThrow('deleted student');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// updateStudent
// ══════════════════════════════════════════════════════════════════════════════

describe('updateStudent', () => {
  it('updates name and returns the updated record', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);
    mockPrisma.Student.update.mockResolvedValue({
      ...FIXTURE_STUDENT,
      name: 'Alice Smith',
    });

    const result = await updateStudent(FIXTURE_STUDENT.id, { name: 'Alice Smith' });

    expect(result.name).toBe('Alice Smith');
  });

  it('throws ConflictError when new email belongs to another student', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);
    mockPrisma.Student.findUnique.mockResolvedValue({
      id: 'other-id',
      name: 'Other',
      email: 'taken@school.vn',
      created_at: FIXTURE_NOW,
      updated_at: FIXTURE_NOW,
      deleted_at: null,
    });

    await expect(
      updateStudent(FIXTURE_STUDENT.id, { email: 'taken@school.vn' })
    ).rejects.toThrow('already used by another student');
  });

  it('returns unchanged record when payload is empty', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);

    const result = await updateStudent(FIXTURE_STUDENT.id, {});

    expect(mockPrisma.Student.update).not.toHaveBeenCalled();
    expect(result.name).toBe(FIXTURE_STUDENT.name);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// deleteStudent
// ══════════════════════════════════════════════════════════════════════════════

describe('deleteStudent', () => {
  it('soft-deletes the student record', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);
    mockPrisma.Student.update.mockResolvedValue({
      ...FIXTURE_STUDENT,
      deleted_at: FIXTURE_NOW,
    });

    await deleteStudent(FIXTURE_STUDENT.id);

    expect(mockPrisma.Student.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: FIXTURE_STUDENT.id },
        data: { deleted_at: FIXTURE_NOW },
      })
    );
  });

  it('also drops active enrollments when dropEnrollments=true', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);
    mockPrisma.Student.update.mockResolvedValue({
      ...FIXTURE_STUDENT,
      deleted_at: FIXTURE_NOW,
    });
    mockPrisma.Enrollment.updateMany.mockResolvedValue({ count: 2 });

    await deleteStudent(FIXTURE_STUDENT.id, { dropEnrollments: true });

    expect(mockPrisma.Enrollment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { student_id: FIXTURE_STUDENT.id, deleted_at: null },
        data: { deleted_at: FIXTURE_NOW, dropped_at: FIXTURE_NOW },
      })
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getStudentEvidence (cross-service graceful degradation)
// ══════════════════════════════════════════════════════════════════════════════

describe('getStudentEvidence', () => {
  const evidenceData = [
    { id: 'e1', studentId: FIXTURE_STUDENT.id, itemId: 'i1', correct: true, quality: 'HIGH', createdAt: FIXTURE_NOW.toISOString() },
    { id: 'e2', studentId: FIXTURE_STUDENT.id, itemId: 'i2', correct: false, quality: 'MEDIUM', createdAt: FIXTURE_NOW.toISOString() },
  ];

  it('returns evidence when svc-bkt responds successfully', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);
    const { callSvcBkt } = await import('../../src/services/inter-service.js');
    vi.mocked(callSvcBkt).mockResolvedValue({ data: evidenceData });

    const result = await getStudentEvidence(FIXTURE_STUDENT.id);

    expect(result).toHaveLength(2);
    expect(result[0]?.correct).toBe(true);
  });

  it('returns empty array when circuit breaker is open', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);
    const { callSvcBkt } = await import('../../src/services/inter-service.js');
    vi.mocked(callSvcBkt).mockResolvedValue(null);

    const result = await getStudentEvidence(FIXTURE_STUDENT.id);

    expect(result).toEqual([]);
  });

  it('returns empty array when response data is not an array', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);
    const { callSvcBkt } = await import('../../src/services/inter-service.js');
    vi.mocked(callSvcBkt).mockResolvedValue({ data: null });

    const result = await getStudentEvidence(FIXTURE_STUDENT.id);

    expect(result).toEqual([]);
  });

  it('throws ValidationError for malformed student UUID', async () => {
    await expect(getStudentEvidence('bad-uuid')).rejects.toThrow('Invalid student id');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getStudentDiagnosis (cross-service graceful degradation)
// ══════════════════════════════════════════════════════════════════════════════

describe('getStudentDiagnosis', () => {
  const diagnosisData = [
    { id: 'd1', studentId: FIXTURE_STUDENT.id, skillId: 'sk1', pKnown: 0.85, status: 'MASTERED', createdAt: FIXTURE_NOW.toISOString() },
  ];

  it('returns diagnoses when svc-bkt responds', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);
    const { callSvcBkt } = await import('../../src/services/inter-service.js');
    vi.mocked(callSvcBkt).mockResolvedValue({ data: diagnosisData });

    const result = await getStudentDiagnosis(FIXTURE_STUDENT.id);

    expect(result).toHaveLength(1);
    expect(result[0]?.pKnown).toBe(0.85);
  });

  it('returns empty array when svc-bkt is unavailable', async () => {
    mockPrisma.Student.findFirst.mockResolvedValue(FIXTURE_STUDENT);
    const { callSvcBkt } = await import('../../src/services/inter-service.js');
    vi.mocked(callSvcBkt).mockResolvedValue(null);

    const result = await getStudentDiagnosis(FIXTURE_STUDENT.id);

    expect(result).toEqual([]);
  });
});
