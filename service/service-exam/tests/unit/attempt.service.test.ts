/**
 * Unit tests for attempt.service.
 *
 * All tests use a fully-mocked Prisma client so they are deterministic and
 * run without a database.
 */

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

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
  },
  exam_question: {
    findMany: vi.fn<() => Promise<unknown>>(),
  },
  exam_attempt: {
    findFirst: vi.fn<() => Promise<unknown>>(),
    findUnique: vi.fn<() => Promise<unknown>>(),
    findMany: vi.fn<() => Promise<unknown>>(),
    create: vi.fn<() => Promise<unknown>>(),
    update: vi.fn<() => Promise<unknown>>(),
    count: vi.fn<() => Promise<number>>(),
  },
  exam_answer: {
    findMany: vi.fn<() => Promise<unknown>>(),
    upsert: vi.fn<() => Promise<unknown>>(),
  },
};

vi.mock('../../src/prisma/client.js', () => ({
  prisma: mockPrisma,
}));

// ── Import service AFTER all mocks are in place ────────────────────────────────

const {
  startAttempt,
  getAttempt,
  submitAttempt,
  getStudentAttempts,
  getStudentAllAttempts
} = await import('../../src/services/attempt.service.js');

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
  status: 'IN_PROGRESS' as const,
  started_at: FIXTURE_NOW,
  submitted_at: null,
  score: null,
  max_score: 100,
  created_at: FIXTURE_NOW,
  updated_at: FIXTURE_NOW,
};

const FIXTURE_QUESTIONS = [
  { question_id: 'c1111111-1111-4111-8111-111111111111' },
  { question_id: 'c2222222-2222-4222-8222-222222222222' },
];

const FIXTURE_ANSWERS = [
  { id: 'ans1', attempt_id: FIXTURE_ATTEMPT.id, question_id: 'c1111111-1111-4111-8111-111111111111', answer: 'Answer 1', selected_options: [], is_correct: null, points_earned: null, answered_at: null, created_at: FIXTURE_NOW, updated_at: FIXTURE_NOW },
  { id: 'ans2', attempt_id: FIXTURE_ATTEMPT.id, question_id: 'c2222222-2222-4222-8222-222222222222', answer: 'Answer 2', selected_options: [], is_correct: null, points_earned: null, answered_at: null, created_at: FIXTURE_NOW, updated_at: FIXTURE_NOW },
];

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
// startAttempt
// ══════════════════════════════════════════════════════════════════════════════

describe('startAttempt', () => {
  const examId = 'e1111111-1111-4111-8111-111111111111';
  const studentId = 's1111111-1111-4111-8111-111111111111';

  it('creates a new attempt for published exam', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam_attempt.findFirst.mockResolvedValue(null); // No existing attempt
    mockPrisma.exam_attempt.create.mockResolvedValue(FIXTURE_ATTEMPT);

    const result = await startAttempt(examId, studentId);

    expect(result.status).toBe('IN_PROGRESS');
    expect(result.examId).toBe(examId);
    expect(result.studentId).toBe(studentId);
    expect(mockPrisma.exam_attempt.create).toHaveBeenCalled();
  });

  it('returns existing in-progress attempt if one exists', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam_attempt.findFirst.mockResolvedValue(FIXTURE_ATTEMPT);

    const result = await startAttempt(examId, studentId);

    expect(result.id).toBe(FIXTURE_ATTEMPT.id);
    expect(mockPrisma.exam_attempt.create).not.toHaveBeenCalled();
  });

  it('throws ValidationError when exam is not published', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue({ ...FIXTURE_EXAM, status: 'DRAFT' });

    await expect(startAttempt(examId, studentId)).rejects.toThrow('not available for attempts');
  });

  it('throws ConflictError for recent submission', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam_attempt.findFirst
      .mockResolvedValueOnce(null) // No in-progress
      .mockResolvedValueOnce({ ...FIXTURE_ATTEMPT, status: 'SUBMITTED', submitted_at: new Date() }); // Recent submission

    await expect(startAttempt(examId, studentId)).rejects.toThrow('Please wait before starting another attempt');
  });

  it('throws ValidationError for invalid exam ID', async () => {
    await expect(startAttempt('not-a-uuid', studentId)).rejects.toThrow('Invalid exam id');
  });

  it('throws ValidationError for invalid student ID', async () => {
    await expect(startAttempt(examId, 'not-a-uuid')).rejects.toThrow('Invalid student id');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getAttempt
// ══════════════════════════════════════════════════════════════════════════════

describe('getAttempt', () => {
  const attemptId = 'a1111111-1111-4111-8111-111111111111';
  const studentId = 's1111111-1111-4111-8111-111111111111';
  const teacherId = '91111111-1111-4111-8111-111111111111';

  it('returns attempt with answers for owner student', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue(FIXTURE_ATTEMPT);
    mockPrisma.exam_answer.findMany.mockResolvedValue(FIXTURE_ANSWERS);

    const result = await getAttempt(attemptId, studentId, 'STUDENT');

    expect(result.id).toBe(attemptId);
    expect(result.answers).toHaveLength(2);
  });

  it('allows teacher to view attempt for their exam', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue(FIXTURE_ATTEMPT);
    mockPrisma.exam.findUnique.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam_answer.findMany.mockResolvedValue(FIXTURE_ANSWERS);

    const result = await getAttempt(attemptId, teacherId, 'TEACHER', teacherId);

    expect(result.id).toBe(attemptId);
  });

  it('throws ForbiddenError when student tries to view others attempt', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue(FIXTURE_ATTEMPT);

    await expect(getAttempt(attemptId, 'other-student-id', 'STUDENT')).rejects.toThrow(
      'Students can only view their own attempts'
    );
  });

  it('allows admin to view any attempt', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue(FIXTURE_ATTEMPT);
    mockPrisma.exam_answer.findMany.mockResolvedValue(FIXTURE_ANSWERS);

    const result = await getAttempt(attemptId, 'any-user-id', 'ADMIN');

    expect(result.id).toBe(attemptId);
  });

  it('throws NotFoundError for non-existent attempt', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue(null);

    await expect(getAttempt('non-existent-id', studentId, 'STUDENT')).rejects.toThrow('not found');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// submitAttempt
// ══════════════════════════════════════════════════════════════════════════════

describe('submitAttempt', () => {
  const attemptId = 'a1111111-1111-4111-8111-111111111111';
  const studentId = 's1111111-1111-4111-8111-111111111111';

  const validAnswers = [
    { questionId: 'c1111111-1111-4111-8111-111111111111', answer: 'Answer 1' },
    { questionId: 'c2222222-2222-4222-8222-222222222222', answer: 'Answer 2' }
  ];

  it('submits attempt and updates status to SUBMITTED', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue(FIXTURE_ATTEMPT);
    mockPrisma.exam_question.findMany.mockResolvedValue(FIXTURE_QUESTIONS);
    mockPrisma.exam_attempt.update.mockResolvedValue({
      ...FIXTURE_ATTEMPT,
      status: 'SUBMITTED',
      submitted_at: FIXTURE_NOW
    });

    const result = await submitAttempt(attemptId, validAnswers, studentId);

    expect(result.status).toBe('SUBMITTED');
    expect(mockPrisma.exam_answer.upsert).toHaveBeenCalledTimes(2);
  });

  it('throws ForbiddenError when student tries to submit others attempt', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue(FIXTURE_ATTEMPT);

    await expect(submitAttempt(attemptId, validAnswers, 'other-student-id')).rejects.toThrow(
      'Students can only submit their own attempts'
    );
  });

  it('throws ConflictError when attempt already submitted', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue({
      ...FIXTURE_ATTEMPT,
      status: 'SUBMITTED'
    });

    await expect(submitAttempt(attemptId, validAnswers, studentId)).rejects.toThrow(
      'already been submitted'
    );
  });

  it('throws ValidationError for question not in exam', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue(FIXTURE_ATTEMPT);
    mockPrisma.exam_question.findMany.mockResolvedValue(FIXTURE_QUESTIONS);

    const invalidAnswers = [
      { questionId: 'c1111111-1111-4111-8111-111111111111', answer: 'Answer 1' },
      { questionId: 'invalid-question-id', answer: 'Invalid' }
    ];

    await expect(submitAttempt(attemptId, invalidAnswers, studentId)).rejects.toThrow(
      'does not belong to this exam'
    );
  });

  it('throws ValidationError for invalid UUID in answers', async () => {
    mockPrisma.exam_attempt.findUnique.mockResolvedValue(FIXTURE_ATTEMPT);
    mockPrisma.exam_question.findMany.mockResolvedValue(FIXTURE_QUESTIONS);

    const invalidAnswers = [
      { questionId: 'not-a-uuid', answer: 'Invalid' }
    ];

    await expect(submitAttempt(attemptId, invalidAnswers, studentId)).rejects.toThrow('Invalid UUID');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getStudentAttempts
// ══════════════════════════════════════════════════════════════════════════════

describe('getStudentAttempts', () => {
  const examId = 'e1111111-1111-4111-8111-111111111111';
  const studentId = 's1111111-1111-4111-8111-111111111111';

  it('returns paginated list of attempts for exam', async () => {
    mockPrisma.exam_attempt.findMany.mockResolvedValue([FIXTURE_ATTEMPT]);
    mockPrisma.exam_attempt.count.mockResolvedValue(1);

    const result = await getStudentAttempts(examId, studentId, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('throws ValidationError for invalid exam ID', async () => {
    await expect(getStudentAttempts('not-a-uuid', studentId, { skip: 0, take: 20 })).rejects.toThrow(
      'Invalid exam id'
    );
  });

  it('throws ValidationError for invalid student ID', async () => {
    await expect(getStudentAttempts(examId, 'not-a-uuid', { skip: 0, take: 20 })).rejects.toThrow(
      'Invalid student id'
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getStudentAllAttempts
// ══════════════════════════════════════════════════════════════════════════════

describe('getStudentAllAttempts', () => {
  const studentId = 's1111111-1111-4111-8111-111111111111';

  it('returns paginated list of all attempts for student', async () => {
    mockPrisma.exam_attempt.findMany.mockResolvedValue([FIXTURE_ATTEMPT]);
    mockPrisma.exam_attempt.count.mockResolvedValue(1);

    const result = await getStudentAllAttempts(studentId, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('throws ValidationError for invalid student ID', async () => {
    await expect(getStudentAllAttempts('not-a-uuid', { skip: 0, take: 20 })).rejects.toThrow(
      'Invalid student id'
    );
  });
});
