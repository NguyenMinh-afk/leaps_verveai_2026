/**
 * Unit tests for result.service.
 *
 * All tests use a fully-mocked Prisma client so they are deterministic and
 * run without a database.
 */

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

// ── Mock ALL external dependencies before importing anything else ─────────────

vi.mock('../../src/config/env.js', () => ({
  validateEnv: () => ({
    NODE_ENV: 'test',
    PORT: 3007,
    SERVICE_NAME: 'svc-exam',
    SERVICE_PORT: 3007,
    LOG_LEVEL: 'silent',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    CONSUL_HOST: 'localhost',
    CONSUL_PORT: 8500,
    OTEL_SERVICE_NAME: 'svc-exam',
  }),
}));

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

// ── Prisma mock ─────────────────────────────────────────────────────────────

const mockPrisma = {
  $transaction: vi.fn(async (fn: (tx: unknown) => Promise<unknown>) => {
    return fn(mockPrisma);
  }),
  exam: {
    findFirst: vi.fn<() => Promise<unknown>>(),
    findUnique: vi.fn<() => Promise<unknown>>(),
    findMany: vi.fn<() => Promise<unknown>>(),
  },
  exam_attempt: {
    findUnique: vi.fn<() => Promise<unknown>>(),
    findMany: vi.fn<() => Promise<unknown>>(),
    update: vi.fn<() => Promise<unknown>>(),
    count: vi.fn<() => Promise<number>>(),
  },
  exam_answer: {
    findMany: vi.fn<() => Promise<unknown>>(),
    updateMany: vi.fn<() => Promise<unknown>>(),
  },
};

vi.mock('../../src/prisma/client.js', () => ({
  prisma: mockPrisma,
}));

// ── Import service AFTER all mocks are in place ────────────────────────────────

const {
  getAttemptResult,
  getStudentExamHistory,
  getExamResultsSummary,
  gradeAttempt,
  getPendingGrading
} = await import('../../src/services/result.service.js');

// ── Fixtures ──────────────────────────────────────────────────────────────────

const FIXTURE_NOW = new Date('2025-01-15T12:00:00Z');

const FIXTURE_EXAM = {
  id: 'e1111111-1111-4111-8111-111111111111',
  assignment_id: null,
  title: 'Midterm Exam',
  description: 'A comprehensive midterm test',
  teacher_id: '91111111-1111-4111-8111-111111111111',
  status: 'PUBLISHED' as const,
  time_limit_minutes: 60,
  max_score: 100,
  passing_score: 60,
  shuffle_questions: false,
  show_results_immediately: true,
  created_at: FIXTURE_NOW,
  updated_at: FIXTURE_NOW,
  deleted_at: null,
};

const FIXTURE_ATTEMPT = {
  id: 'a1111111-1111-4111-8111-111111111111',
  exam_id: FIXTURE_EXAM.id,
  student_id: 's1111111-1111-4111-8111-111111111111',
  status: 'GRADED' as const,
  started_at: FIXTURE_NOW,
  submitted_at: FIXTURE_NOW,
  score: 85,
  max_score: 100,
  created_at: FIXTURE_NOW,
  updated_at: FIXTURE_NOW,
};

const FIXTURE_ATTEMPT_SUBMITTED = {
  ...FIXTURE_ATTEMPT,
  id: 'a2222222-2222-4222-8222-222222222222',
  status: 'SUBMITTED' as const,
  score: null,
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
// getAttemptResult
// ══════════════════════════════════════════════════════════════════════════════

describe('getAttemptResult', () => {
  const attemptId = 'a1111111-1111-4111-8111-111111111111';
  const studentId = 's1111111-1111-4111-8111-111111111111';

  it('returns result with passed status for graded attempt', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue({
      ...FIXTURE_ATTEMPT,
      exam: {
        id: FIXTURE_EXAM.id,
        title: FIXTURE_EXAM.title,
        passing_score: FIXTURE_EXAM.passing_score,
        max_score: FIXTURE_EXAM.max_score
      }
    });

    const result = await getAttemptResult(attemptId, studentId, 'STUDENT');

    expect(result.id).toBe(attemptId);
    expect(result.score).toBe(85);
    expect(result.passed).toBe(true); // 85 >= 60
    expect(result.percentage).toBe(85);
  });

  it('throws NotFoundError for non-existent attempt', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue(null);

    await expect(getAttemptResult('non-existent', studentId, 'STUDENT')).rejects.toThrow('not found');
  });

  it('throws ValidationError when student tries to view others result', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue({
      ...FIXTURE_ATTEMPT,
      student_id: studentId,
      exam: {
        id: FIXTURE_EXAM.id,
        title: FIXTURE_EXAM.title,
        passing_score: FIXTURE_EXAM.passing_score,
        max_score: FIXTURE_EXAM.max_score
      }
    });

    await expect(getAttemptResult(attemptId, 'other-student', 'STUDENT')).rejects.toThrow('Forbidden');
  });

  it('allows admin to view any result', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue({
      ...FIXTURE_ATTEMPT,
      exam: {
        id: FIXTURE_EXAM.id,
        title: FIXTURE_EXAM.title,
        passing_score: FIXTURE_EXAM.passing_score,
        max_score: FIXTURE_EXAM.max_score
      }
    });

    const result = await getAttemptResult(attemptId, 'any-user', 'ADMIN');

    expect(result.id).toBe(attemptId);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getStudentExamHistory
// ══════════════════════════════════════════════════════════════════════════════

describe('getStudentExamHistory', () => {
  const studentId = 's1111111-1111-4111-8111-111111111111';

  it('returns paginated exam history', async () => {
    mockPrisma.exam_attempt.findMany.mockResolvedValue([{
      ...FIXTURE_ATTEMPT,
      exam: {
        id: FIXTURE_EXAM.id,
        title: FIXTURE_EXAM.title,
        passing_score: FIXTURE_EXAM.passing_score,
        max_score: FIXTURE_EXAM.max_score
      }
    }]);
    mockPrisma.exam_attempt.count.mockResolvedValue(1);

    const result = await getStudentExamHistory(studentId, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.items[0]?.examTitle).toBe('Midterm Exam');
    expect(result.items[0]?.passed).toBe(true);
  });

  it('returns empty list when no history exists', async () => {
    mockPrisma.exam_attempt.findMany.mockResolvedValue([]);
    mockPrisma.exam_attempt.count.mockResolvedValue(0);

    const result = await getStudentExamHistory(studentId, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getExamResultsSummary
// ══════════════════════════════════════════════════════════════════════════════

describe('getExamResultsSummary', () => {
  const examId = 'e1111111-1111-4111-8111-111111111111';

  it('calculates summary statistics correctly', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam_attempt.findMany.mockResolvedValue([
      { ...FIXTURE_ATTEMPT, score: 85, status: 'GRADED' },
      { ...FIXTURE_ATTEMPT, id: 'a2222222-2222-4222-8222-222222222222', score: 70, status: 'GRADED' },
      { ...FIXTURE_ATTEMPT, id: 'a3333333-3333-4333-8333-333333333333', status: 'SUBMITTED' }
    ]);

    const result = await getExamResultsSummary(examId);

    expect(result.totalAttempts).toBe(3);
    expect(result.submittedAttempts).toBe(1);
    expect(result.gradedAttempts).toBe(2);
    expect(result.averageScore).toBe(77.5); // (85 + 70) / 2
    expect(result.highestScore).toBe(85);
    expect(result.lowestScore).toBe(70);
    expect(result.passRate).toBe(100); // Both >= 60
  });

  it('returns null for statistics when no graded attempts', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam_attempt.findMany.mockResolvedValue([
      { ...FIXTURE_ATTEMPT_SUBMITTED }
    ]);

    const result = await getExamResultsSummary(examId);

    expect(result.gradedAttempts).toBe(0);
    expect(result.averageScore).toBeNull();
    expect(result.passRate).toBeNull();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// gradeAttempt
// ══════════════════════════════════════════════════════════════════════════════

describe('gradeAttempt', () => {
  const examId = 'e1111111-1111-4111-8111-111111111111';
  const attemptId = 'a1111111-1111-4111-8111-111111111111';
  const teacherId = '91111111-1111-4111-8111-111111111111';

  const grades = [
    { questionId: 'q1111111-1111-4111-8111-111111111111', isCorrect: true, pointsEarned: 10 },
    { questionId: 'q2222222-2222-4222-8222-222222222222', isCorrect: false, pointsEarned: 0 }
  ];

  it('grades an attempt successfully', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam_attempt.findUnique.mockResolvedValue({
      ...FIXTURE_ATTEMPT_SUBMITTED,
      exam_id: examId
    });
    mockPrisma.$transaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
      return fn(mockPrisma);
    });

    await gradeAttempt(examId, attemptId, grades, 10, teacherId, 'TEACHER');

    expect(mockPrisma.exam_answer.updateMany).toHaveBeenCalled();
    expect(mockPrisma.exam_attempt.update).toHaveBeenCalled();
  });

  it('throws error when non-owner tries to grade', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);

    await expect(
      gradeAttempt(examId, attemptId, grades, 10, 'other-teacher', 'TEACHER')
    ).rejects.toThrow('Only the exam owner');
  });

  it('throws NotFoundError for non-existent attempt', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam_attempt.findUnique.mockResolvedValue(null);

    await expect(
      gradeAttempt(examId, 'non-existent', grades, 10, teacherId, 'TEACHER')
    ).rejects.toThrow('not found');
  });

  it('throws error when attempt does not belong to exam', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam_attempt.findUnique.mockResolvedValue({
      ...FIXTURE_ATTEMPT_SUBMITTED,
      exam_id: 'different-exam-id'
    });

    await expect(
      gradeAttempt(examId, attemptId, grades, 10, teacherId, 'TEACHER')
    ).rejects.toThrow('does not belong to this exam');
  });

  it('throws error when attempt is already graded', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam_attempt.findUnique.mockResolvedValue({
      ...FIXTURE_ATTEMPT,
      exam_id: examId
    });

    await expect(
      gradeAttempt(examId, attemptId, grades, 10, teacherId, 'TEACHER')
    ).rejects.toThrow('already graded');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getPendingGrading
// ══════════════════════════════════════════════════════════════════════════════

describe('getPendingGrading', () => {
  const teacherId = '91111111-1111-4111-8111-111111111111';

  it('returns pending grading items for teacher', async () => {
    mockPrisma.exam.findMany.mockResolvedValue([{
      id: FIXTURE_EXAM.id,
      title: FIXTURE_EXAM.title,
      teacher_id: teacherId
    }]);
    mockPrisma.exam_attempt.findMany.mockResolvedValue([{
      id: 'a2222222-2222-4222-8222-222222222222',
      exam_id: FIXTURE_EXAM.id,
      student_id: 's1111111-1111-4111-8111-111111111111',
      submitted_at: FIXTURE_NOW
    }]);
    mockPrisma.exam_attempt.count.mockResolvedValue(1);

    const result = await getPendingGrading(teacherId, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.items[0]?.examTitle).toBe('Midterm Exam');
  });

  it('returns empty when teacher has no exams', async () => {
    mockPrisma.exam.findMany.mockResolvedValue([]);

    const result = await getPendingGrading(teacherId, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
