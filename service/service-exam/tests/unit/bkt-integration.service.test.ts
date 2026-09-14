/**
 * Unit tests for bkt-integration.service.
 *
 * Tests the Question-Skill mapping and BKT evidence recording functionality.
 */

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

// ── Mock ALL external dependencies before importing anything else ─────────────────

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
    SVC_BKT_URL: 'http://localhost:3002',
  }),
}));

vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    child: vi.fn(() => ({
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    })),
  },
  createChildLogger: vi.fn(),
}));

// Mock circuit breaker
vi.mock('@verveai/circuit-breaker', () => ({
  createBreaker: vi.fn(() => ({
    fire: vi.fn(),
  })),
}));

// ── Prisma mock ─────────────────────────────────────────────────────────────

const mockPrisma = {
  questionSkillMapping: {
    create: vi.fn<() => Promise<unknown>>(),
    findMany: vi.fn<() => Promise<unknown>>(),
    delete: vi.fn<() => Promise<unknown>>(),
    deleteMany: vi.fn<() => Promise<unknown>>(),
    findFirst: vi.fn<() => Promise<unknown>>(),
  },
  examAttempt: {
    findUnique: vi.fn<() => Promise<unknown>>(),
    update: vi.fn<() => Promise<unknown>>(),
  },
};

vi.mock('../../src/prisma/client.js', () => ({
  prisma: mockPrisma,
}));

// ── Import service AFTER all mocks are in place ────────────────────────────────

const {
  createQuestionSkillMapping,
  getSkillsForQuestion,
  getQuestionsForSkill,
  deleteQuestionSkillMapping,
  deleteMappingsForQuestion,
  recordAttemptEvidence,
  recordExamAnswerEvidence,
} = await import('../../src/services/bkt-integration.service.js');

// ── Fixtures ──────────────────────────────────────────────────────────────────

const FIXTURE_UUID_1 = '11111111-1111-4111-8111-111111111111';
const FIXTURE_UUID_2 = '22222222-2222-4222-8222-222222222222';
const FIXTURE_UUID_3 = '33333333-3333-4333-8333-333333333333';

const FIXTURE_MAPPING = {
  id: FIXTURE_UUID_1,
  question_id: FIXTURE_UUID_2,
  skill_id: FIXTURE_UUID_3,
  created_at: new Date('2025-01-15T12:00:00Z'),
  created_by: 'teacher-123',
};

// ── Setup / Teardown ─────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

// ══════════════════════════════════════════════════════════════════════════════
// createQuestionSkillMapping
// ══════════════════════════════════════════════════════════════════════════════

describe('createQuestionSkillMapping', () => {
  it('creates a mapping with valid UUIDs', async () => {
    mockPrisma.questionSkillMapping.create.mockResolvedValue(FIXTURE_MAPPING);

    const result = await createQuestionSkillMapping(FIXTURE_UUID_2, FIXTURE_UUID_3, 'teacher-123');

    expect(result.questionId).toBe(FIXTURE_UUID_2);
    expect(result.skillId).toBe(FIXTURE_UUID_3);
    expect(result.createdBy).toBe('teacher-123');
    expect(mockPrisma.questionSkillMapping.create).toHaveBeenCalledOnce();
  });

  it('throws ValidationError for invalid questionId', async () => {
    await expect(
      createQuestionSkillMapping('not-a-uuid', FIXTURE_UUID_3)
    ).rejects.toThrow('Invalid questionId');
  });

  it('throws ValidationError for invalid skillId', async () => {
    await expect(
      createQuestionSkillMapping(FIXTURE_UUID_2, 'not-a-uuid')
    ).rejects.toThrow('Invalid skillId');
  });

  it('creates mapping without createdBy when not provided', async () => {
    mockPrisma.questionSkillMapping.create.mockResolvedValue({
      ...FIXTURE_MAPPING,
      created_by: null,
    });

    const result = await createQuestionSkillMapping(FIXTURE_UUID_2, FIXTURE_UUID_3);

    expect(result.createdBy).toBeNull();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getSkillsForQuestion
// ══════════════════════════════════════════════════════════════════════════════

describe('getSkillsForQuestion', () => {
  it('returns skill IDs for a question with mappings', async () => {
    mockPrisma.questionSkillMapping.findMany.mockResolvedValue([
      { skill_id: FIXTURE_UUID_1 },
      { skill_id: FIXTURE_UUID_2 },
    ]);

    const result = await getSkillsForQuestion(FIXTURE_UUID_1);

    expect(result).toHaveLength(2);
    expect(result).toContain(FIXTURE_UUID_1);
    expect(result).toContain(FIXTURE_UUID_2);
  });

  it('returns empty array for question with no mappings', async () => {
    mockPrisma.questionSkillMapping.findMany.mockResolvedValue([]);

    const result = await getSkillsForQuestion(FIXTURE_UUID_1);

    expect(result).toHaveLength(0);
  });

  it('throws ValidationError for invalid questionId', async () => {
    await expect(getSkillsForQuestion('not-a-uuid')).rejects.toThrow('Invalid questionId');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// getQuestionsForSkill
// ══════════════════════════════════════════════════════════════════════════════

describe('getQuestionsForSkill', () => {
  it('returns question IDs for a skill with mappings', async () => {
    mockPrisma.questionSkillMapping.findMany.mockResolvedValue([
      { question_id: FIXTURE_UUID_1 },
      { question_id: FIXTURE_UUID_2 },
    ]);

    const result = await getQuestionsForSkill(FIXTURE_UUID_3);

    expect(result).toHaveLength(2);
    expect(result).toContain(FIXTURE_UUID_1);
    expect(result).toContain(FIXTURE_UUID_2);
  });

  it('returns empty array for skill with no mappings', async () => {
    mockPrisma.questionSkillMapping.findMany.mockResolvedValue([]);

    const result = await getQuestionsForSkill(FIXTURE_UUID_3);

    expect(result).toHaveLength(0);
  });

  it('throws ValidationError for invalid skillId', async () => {
    await expect(getQuestionsForSkill('not-a-uuid')).rejects.toThrow('Invalid skillId');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// deleteQuestionSkillMapping
// ══════════════════════════════════════════════════════════════════════════════

describe('deleteQuestionSkillMapping', () => {
  it('deletes a mapping by ID', async () => {
    mockPrisma.questionSkillMapping.delete.mockResolvedValue(FIXTURE_MAPPING);

    await expect(deleteQuestionSkillMapping(FIXTURE_UUID_1)).resolves.toBeUndefined();
    expect(mockPrisma.questionSkillMapping.delete).toHaveBeenCalledWith({
      where: { id: FIXTURE_UUID_1 },
    });
  });

  it('throws ValidationError for invalid mappingId', async () => {
    await expect(deleteQuestionSkillMapping('not-a-uuid')).rejects.toThrow('Invalid mappingId');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// deleteMappingsForQuestion
// ══════════════════════════════════════════════════════════════════════════════

describe('deleteMappingsForQuestion', () => {
  it('deletes all mappings for a question', async () => {
    mockPrisma.questionSkillMapping.deleteMany.mockResolvedValue({ count: 3 });

    const result = await deleteMappingsForQuestion(FIXTURE_UUID_1);

    expect(result).toBe(3);
    expect(mockPrisma.questionSkillMapping.deleteMany).toHaveBeenCalledWith({
      where: { question_id: FIXTURE_UUID_1 },
    });
  });

  it('returns 0 when no mappings exist', async () => {
    mockPrisma.questionSkillMapping.deleteMany.mockResolvedValue({ count: 0 });

    const result = await deleteMappingsForQuestion(FIXTURE_UUID_1);

    expect(result).toBe(0);
  });

  it('throws ValidationError for invalid questionId', async () => {
    await expect(deleteMappingsForQuestion('not-a-uuid')).rejects.toThrow('Invalid questionId');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// recordExamAnswerEvidence
// ══════════════════════════════════════════════════════════════════════════════

describe('recordExamAnswerEvidence', () => {
  it('returns null when question has no skill mapping', async () => {
    mockPrisma.questionSkillMapping.findMany.mockResolvedValue([]);

    const result = await recordExamAnswerEvidence(
      FIXTURE_UUID_1,
      FIXTURE_UUID_2,
      FIXTURE_UUID_3,
      true
    );

    expect(result).toBeNull();
  });

  it('throws ValidationError for invalid studentId', async () => {
    await expect(
      recordExamAnswerEvidence('not-a-uuid', FIXTURE_UUID_2, FIXTURE_UUID_3, true)
    ).rejects.toThrow('Invalid studentId');
  });

  it('throws ValidationError for invalid questionId', async () => {
    await expect(
      recordExamAnswerEvidence(FIXTURE_UUID_1, FIXTURE_UUID_2, 'not-a-uuid', true)
    ).rejects.toThrow('Invalid questionId');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Idempotency behavior
// ══════════════════════════════════════════════════════════════════════════════

describe('Idempotency behavior', () => {
  it('getSkillsForQuestion returns consistent results for same question', async () => {
    mockPrisma.questionSkillMapping.findMany.mockResolvedValue([
      { skill_id: FIXTURE_UUID_1 },
    ]);

    const result1 = await getSkillsForQuestion(FIXTURE_UUID_1);
    const result2 = await getSkillsForQuestion(FIXTURE_UUID_1);

    expect(result1).toEqual(result2);
    expect(mockPrisma.questionSkillMapping.findMany).toHaveBeenCalledTimes(2);
  });

  it('getQuestionsForSkill returns consistent results for same skill', async () => {
    mockPrisma.questionSkillMapping.findMany.mockResolvedValue([
      { question_id: FIXTURE_UUID_1 },
    ]);

    const result1 = await getQuestionsForSkill(FIXTURE_UUID_3);
    const result2 = await getQuestionsForSkill(FIXTURE_UUID_3);

    expect(result1).toEqual(result2);
    expect(mockPrisma.questionSkillMapping.findMany).toHaveBeenCalledTimes(2);
  });
});
