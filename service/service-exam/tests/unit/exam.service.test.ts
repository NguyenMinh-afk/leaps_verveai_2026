/**
 * Unit tests for exam.service.
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
    findMany: vi.fn<() => Promise<unknown>>(),
    create: vi.fn<() => Promise<unknown>>(),
    update: vi.fn<() => Promise<unknown>>(),
    count: vi.fn<() => Promise<number>>(),
  },
  exam_question: {
    findMany: vi.fn<() => Promise<unknown>>(),
    deleteMany: vi.fn<() => Promise<unknown>>(),
    createMany: vi.fn<() => Promise<unknown>>(),
  },
};

vi.mock('../../src/prisma/client.js', () => ({
  prisma: mockPrisma,
}));

// ── Import service AFTER all mocks are in place ────────────────────────────────

const { createExam, updateExam, deleteExam, getExam, listExams, listStudentExams } =
  await import('../../src/services/exam.service.js');

// ── Fixtures ──────────────────────────────────────────────────────────────────

const FIXTURE_NOW = new Date('2025-01-15T12:00:00Z');

const FIXTURE_EXAM = {
  id: 'e1111111-1111-4111-8111-111111111111',
  assignment_id: null,
  title: 'Midterm Exam',
  description: 'A comprehensive midterm test',
  teacher_id: '91111111-1111-4111-8111-111111111111',
  status: 'DRAFT' as const,
  time_limit_minutes: 60,
  max_score: 100,
  passing_score: 60,
  shuffle_questions: false,
  show_results_immediately: true,
  created_at: FIXTURE_NOW,
  updated_at: FIXTURE_NOW,
  deleted_at: null,
};

const FIXTURE_QUESTIONS = [
  { id: 'q1111111-1111-4111-8111-111111111111', exam_id: FIXTURE_EXAM.id, question_id: 'c1111111-1111-4111-8111-111111111111', points: 1, order_index: 0, created_at: FIXTURE_NOW },
  { id: 'q2222222-2222-4222-8222-222222222222', exam_id: FIXTURE_EXAM.id, question_id: 'c2222222-2222-4222-8222-222222222222', points: 1, order_index: 1, created_at: FIXTURE_NOW },
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
// createExam
// ══════════════════════════════════════════════════════════════════════════════

describe('createExam', () => {
  const validInput = {
    title: 'Midterm Exam',
    description: 'A comprehensive midterm test',
    questionIds: [
      'c1111111-1111-4111-8111-111111111111',
      'c2222222-2222-4222-8222-222222222222'
    ],
    timeLimitMinutes: 60,
    maxScore: 100,
    passingScore: 60,
    shuffleQuestions: false,
    showResultsImmediately: true
  };
  const teacherId = '91111111-1111-4111-8111-111111111111';

  it('creates an exam with questions', async () => {
    mockPrisma.exam.create.mockResolvedValue({
      ...FIXTURE_EXAM,
      exam_questions: FIXTURE_QUESTIONS
    });

    const result = await createExam(validInput, teacherId);

    expect(result.title).toBe('Midterm Exam');
    expect(result.teacherId).toBe(teacherId);
    expect(result.questions).toHaveLength(2);
    expect(mockPrisma.exam.create).toHaveBeenCalledOnce();
  });

  it('creates exam with assignment_id when provided', async () => {
    const inputWithAssignment = {
      ...validInput,
      assignmentId: 'a1111111-1111-4111-8111-111111111111'
    };
    mockPrisma.exam.create.mockResolvedValue({
      ...FIXTURE_EXAM,
      assignment_id: 'a1111111-1111-4111-8111-111111111111',
      exam_questions: FIXTURE_QUESTIONS
    });

    const result = await createExam(inputWithAssignment, teacherId);

    expect(result.assignmentId).toBe('a1111111-1111-4111-8111-111111111111');
  });

  it('throws ValidationError for invalid question ID', async () => {
    const invalidInput = {
      ...validInput,
      questionIds: ['not-a-uuid']
    };

    await expect(createExam(invalidInput, teacherId)).rejects.toThrow('Invalid question ID');
  });

  it('throws ValidationError for invalid teacher ID', async () => {
    await expect(createExam(validInput, 'not-a-uuid')).rejects.toThrow('Invalid teacher id');
  });

  it('throws ValidationError for empty questionIds array', async () => {
    const emptyQuestions = {
      ...validInput,
      questionIds: []
    };

    await expect(createExam(emptyQuestions, teacherId)).rejects.toThrow('At least one question');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// updateExam
// ══════════════════════════════════════════════════════════════════════════════

describe('updateExam', () => {
  const ownerId = '91111111-1111-4111-8111-111111111111';
  const otherId = '92222222-2222-4222-8222-222222222222';

  it('allows owner teacher to update exam title', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.$transaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
      return fn(mockPrisma);
    });
    mockPrisma.exam.update.mockResolvedValue({ ...FIXTURE_EXAM, title: 'Updated Title' });
    mockPrisma.exam.findUnique.mockResolvedValue({
      ...FIXTURE_EXAM,
      title: 'Updated Title',
      exam_questions: FIXTURE_QUESTIONS
    });

    const result = await updateExam(FIXTURE_EXAM.id, { title: 'Updated Title' }, ownerId, 'TEACHER');

    expect(result.title).toBe('Updated Title');
  });

  it('allows admin to update any exam regardless of ownership', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.$transaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
      return fn(mockPrisma);
    });
    mockPrisma.exam.update.mockResolvedValue({ ...FIXTURE_EXAM, title: 'Admin Update' });
    mockPrisma.exam.findUnique.mockResolvedValue({
      ...FIXTURE_EXAM,
      title: 'Admin Update',
      exam_questions: FIXTURE_QUESTIONS
    });

    const result = await updateExam(FIXTURE_EXAM.id, { title: 'Admin Update' }, otherId, 'ADMIN');

    expect(result.title).toBe('Admin Update');
  });

  it('throws ForbiddenError when non-owner non-admin tries to update', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);

    await expect(
      updateExam(FIXTURE_EXAM.id, { title: 'Hacked' }, otherId, 'TEACHER')
    ).rejects.toThrow('Only the owning teacher');
  });

  it('allows updating exam status to PUBLISHED', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.$transaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
      return fn(mockPrisma);
    });
    mockPrisma.exam.update.mockResolvedValue({ ...FIXTURE_EXAM, status: 'PUBLISHED' });
    mockPrisma.exam.findUnique.mockResolvedValue({
      ...FIXTURE_EXAM,
      status: 'PUBLISHED',
      exam_questions: FIXTURE_QUESTIONS
    });

    const result = await updateExam(FIXTURE_EXAM.id, { status: 'PUBLISHED' }, ownerId, 'TEACHER');

    expect(result.status).toBe('PUBLISHED');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// deleteExam
// ══════════════════════════════════════════════════════════════════════════════

describe('deleteExam', () => {
  const ownerId = '91111111-1111-4111-8111-111111111111';
  const otherId = '92222222-2222-4222-8222-222222222222';

  it('soft-deletes exam when called by owner', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam.update.mockResolvedValue({ ...FIXTURE_EXAM, deleted_at: FIXTURE_NOW });

    await deleteExam(FIXTURE_EXAM.id, ownerId, 'TEACHER');

    expect(mockPrisma.exam.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: FIXTURE_EXAM.id },
        data: { deleted_at: FIXTURE_NOW },
      })
    );
  });

  it('throws ForbiddenError when non-owner tries to delete', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);

    await expect(deleteExam(FIXTURE_EXAM.id, otherId, 'TEACHER')).rejects.toThrow(
      'Only the owning teacher'
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getExam
// ══════════════════════════════════════════════════════════════════════════════

describe('getExam', () => {
  it('returns exam with questions', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(FIXTURE_EXAM);
    mockPrisma.exam_question.findMany.mockResolvedValue(FIXTURE_QUESTIONS);

    const result = await getExam(FIXTURE_EXAM.id);

    expect(result.id).toBe(FIXTURE_EXAM.id);
    expect(result.questions).toHaveLength(2);
  });

  it('throws NotFoundError for non-existent exam', async () => {
    mockPrisma.exam.findFirst.mockResolvedValue(null);

    await expect(getExam('non-existent-id')).rejects.toThrow('not found');
  });

  it('throws ValidationError for invalid UUID', async () => {
    await expect(getExam('not-a-uuid')).rejects.toThrow('Invalid exam id');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// listExams
// ══════════════════════════════════════════════════════════════════════════════

describe('listExams', () => {
  it('returns paginated list of exams', async () => {
    mockPrisma.exam.findMany.mockResolvedValue([FIXTURE_EXAM]);
    mockPrisma.exam.count.mockResolvedValue(1);

    const result = await listExams({}, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.skip).toBe(0);
    expect(result.take).toBe(20);
  });

  it('filters by teacherId', async () => {
    mockPrisma.exam.findMany.mockResolvedValue([]);
    mockPrisma.exam.count.mockResolvedValue(0);

    const teacherId = '91111111-1111-4111-8111-111111111111';
    await listExams({ teacherId }, { skip: 0, take: 20 });

    expect(mockPrisma.exam.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ teacher_id: teacherId, deleted_at: null }),
      })
    );
  });

  it('filters by status', async () => {
    mockPrisma.exam.findMany.mockResolvedValue([]);
    mockPrisma.exam.count.mockResolvedValue(0);

    await listExams({ status: 'PUBLISHED' }, { skip: 0, take: 20 });

    expect(mockPrisma.exam.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'PUBLISHED', deleted_at: null }),
      })
    );
  });

  it('returns empty list when no exams exist', async () => {
    mockPrisma.exam.findMany.mockResolvedValue([]);
    mockPrisma.exam.count.mockResolvedValue(0);

    const result = await listExams({}, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// listStudentExams
// ══════════════════════════════════════════════════════════════════════════════

describe('listStudentExams', () => {
  const studentId = 's1111111-1111-4111-8111-111111111111';

  it('returns only PUBLISHED exams for students', async () => {
    mockPrisma.exam.findMany.mockResolvedValue([
      { ...FIXTURE_EXAM, status: 'PUBLISHED', _count: { exam_questions: 2 } }
    ]);
    mockPrisma.exam.count.mockResolvedValue(1);

    const result = await listStudentExams(studentId, {}, { skip: 0, take: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.questionCount).toBe(2);
    expect(mockPrisma.exam.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'PUBLISHED', deleted_at: null }),
      })
    );
  });

  it('throws ValidationError for invalid student ID', async () => {
    await expect(listStudentExams('not-a-uuid', {}, { skip: 0, take: 20 })).rejects.toThrow(
      'Invalid student id'
    );
  });
});
