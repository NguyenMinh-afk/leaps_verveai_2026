/**
 * Tests for the question service.
 *
 * Verifies:
 * - Question CRUD operations
 * - Question state transitions (DRAFT → PENDING_REVIEW → APPROVED/REJECTED)
 * - Validation rules
 * - Soft delete behavior
 * - Permission-based state transitions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/prisma/client', () => {
  return {
    prisma: {
      content_item: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      review: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      bundle: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      bundle_signature: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
      $transaction: vi.fn(),
      $queryRaw: vi.fn(),
      $connect: vi.fn(),
      $disconnect: vi.fn(),
    },
    disconnectPrisma: vi.fn(),
  };
});

vi.mock('../../src/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    child: vi.fn().mockReturnThis(),
  },
  createChildLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

import * as questionService from '../../src/services/question.service';
import { prisma } from '../../src/prisma/client';

const mockPrisma = prisma as unknown as {
  content_item: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
  };
  review: {
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

const baseQuestion = {
  id: 'q-1',
  title: 'Test Question',
  body: 'What is 2 + 2?',
  type: 'ITEM_QUESTION',
  difficulty: 2,
  status: 'DRAFT',
  author_id: 'u-1',
  topic: 'math',
  chapter: 'chapter-1',
  metadata: {
    type: 'multiple-choice',
    options: [
      { id: 'opt-1', content: '3' },
      { id: 'opt-2', content: '4' },
      { id: 'opt-3', content: '5' },
      { id: 'opt-4', content: '6' },
    ],
    correctOptionIndex: 1,
    explanation: '2 + 2 = 4',
  },
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  reviews: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('listQuestions', () => {
  it('returns paginated list of questions', async () => {
    mockPrisma.content_item.findMany.mockResolvedValueOnce([baseQuestion]);
    mockPrisma.content_item.count.mockResolvedValueOnce(1);

    const result = await questionService.listQuestions({});

    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe('Test Question');
    expect(result.pagination.total).toBe(1);
    expect(result.pagination.page).toBe(1);
  });

  it('filters by status', async () => {
    mockPrisma.content_item.findMany.mockResolvedValueOnce([]);
    mockPrisma.content_item.count.mockResolvedValueOnce(0);

    await questionService.listQuestions({ status: 'DRAFT' });

    expect(mockPrisma.content_item.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'DRAFT' }),
      }),
    );
  });

  it('filters by difficulty', async () => {
    mockPrisma.content_item.findMany.mockResolvedValueOnce([]);
    mockPrisma.content_item.count.mockResolvedValueOnce(0);

    await questionService.listQuestions({ difficulty: 'easy' });

    expect(mockPrisma.content_item.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ difficulty: { lte: 2 } }),
      }),
    );
  });

  it('filters by authorId', async () => {
    mockPrisma.content_item.findMany.mockResolvedValueOnce([]);
    mockPrisma.content_item.count.mockResolvedValueOnce(0);

    await questionService.listQuestions({ authorId: '550e8400-e29b-41d4-a716-446655440000' });

    expect(mockPrisma.content_item.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ author_id: '550e8400-e29b-41d4-a716-446655440000' }),
      }),
    );
  });

  it('excludes soft-deleted items', async () => {
    mockPrisma.content_item.findMany.mockResolvedValueOnce([]);
    mockPrisma.content_item.count.mockResolvedValueOnce(0);

    await questionService.listQuestions({});

    expect(mockPrisma.content_item.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deleted_at: null }),
      }),
    );
  });

  it('only returns ITEM_QUESTION type', async () => {
    mockPrisma.content_item.findMany.mockResolvedValueOnce([]);
    mockPrisma.content_item.count.mockResolvedValueOnce(0);

    await questionService.listQuestions({});

    expect(mockPrisma.content_item.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ type: 'ITEM_QUESTION' }),
      }),
    );
  });
});

describe('getQuestion', () => {
  it('returns question by id with reviews', async () => {
    const questionWithReviews = {
      ...baseQuestion,
      reviews: [
        {
          id: 'r-1',
          reviewer_id: 'u-2',
          status: 'PENDING',
          comment: null,
          created_at: new Date(),
        },
      ],
    };
    mockPrisma.content_item.findFirst.mockResolvedValueOnce(questionWithReviews);

    const result = await questionService.getQuestion('q-1');

    expect(result).not.toBeNull();
    expect(result?.title).toBe('Test Question');
    expect(result?.reviews).toHaveLength(1);
  });

  it('returns null for non-existent question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce(null);

    const result = await questionService.getQuestion('non-existent');

    expect(result).toBeNull();
  });
});

describe('createQuestion', () => {
  it('creates question in DRAFT status', async () => {
    const createdQuestion = {
      id: 'q-new',
      title: 'New Question',
      body: 'What is 3 + 3?',
      type: 'ITEM_QUESTION' as const,
      difficulty: 1,
      status: 'DRAFT' as const,
      author_id: 'u-1',
      topic: null,
      chapter: null,
      metadata: {
        type: 'multiple-choice',
        options: [
          { id: 'opt-1', content: '5' },
          { id: 'opt-2', content: '6' },
        ],
        correctOptionIndex: 1,
      },
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      reviews: [],
    };
    mockPrisma.content_item.create.mockResolvedValueOnce(createdQuestion);

    const result = await questionService.createQuestion(
      {
        title: 'New Question',
        body: 'What is 3 + 3?',
        difficulty: 'easy',
        metadata: {
          type: 'multiple-choice',
          options: [
            { content: '5' },
            { content: '6' },
          ],
          correctOptionIndex: 1,
        },
      },
      'u-1',
    );

    expect(result.title).toBe('New Question');
    expect(result.status).toBe('DRAFT');
    expect(mockPrisma.content_item.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: 'ITEM_QUESTION',
        status: 'DRAFT',
        author_id: 'u-1',
      }),
    });
  });

  it('rejects multiple-choice without at least 2 options', async () => {
    await expect(
      questionService.createQuestion(
        {
          title: 'Invalid Question',
          body: 'Test',
          difficulty: 'easy',
          metadata: {
            type: 'multiple-choice',
            options: [{ content: 'Only one' }],
            correctOptionIndex: 0,
          },
        },
        'u-1',
      ),
    ).rejects.toThrow(/Invalid question data/);
  });

  it('rejects multiple-choice with invalid correctOptionIndex', async () => {
    await expect(
      questionService.createQuestion(
        {
          title: 'Invalid Question',
          body: 'Test',
          difficulty: 'easy',
          metadata: {
            type: 'multiple-choice',
            options: [
              { content: 'A' },
              { content: 'B' },
            ],
            correctOptionIndex: 5, // Out of bounds
          },
        },
        'u-1',
      ),
    ).rejects.toThrow(/Invalid correct answer/);
  });

  it('requires authorId', async () => {
    await expect(
      questionService.createQuestion(
        {
          title: 'Test',
          body: 'Test',
          difficulty: 'easy',
          metadata: { type: 'short-answer' },
        },
        '',
      ),
    ).rejects.toThrow(/Invalid author/);
  });
});

describe('updateQuestion', () => {
  it('updates DRAFT question and resets status to DRAFT', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce(baseQuestion);
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      title: 'Updated Title',
      status: 'DRAFT',
    });

    const result = await questionService.updateQuestion('q-1', { title: 'Updated Title' });

    expect(result.title).toBe('Updated Title');
    expect(mockPrisma.content_item.update).toHaveBeenCalledWith({
      where: { id: 'q-1' },
      data: expect.objectContaining({ title: 'Updated Title', status: 'DRAFT' }),
    });
  });

  it('allows editing REJECTED question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'REJECTED',
    });
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'DRAFT',
    });

    const result = await questionService.updateQuestion('q-1', { title: 'Revised Title' });

    expect(mockPrisma.content_item.update).toHaveBeenCalled();
  });

  it('rejects editing PENDING_REVIEW question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'PENDING_REVIEW',
    });

    await expect(
      questionService.updateQuestion('q-1', { title: 'Try Update' }),
    ).rejects.toThrow(/cannot be edited/);
  });

  it('rejects editing APPROVED question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'APPROVED',
    });

    await expect(
      questionService.updateQuestion('q-1', { title: 'Try Update' }),
    ).rejects.toThrow(/cannot be edited/);
  });

  it('throws NotFoundError for non-existent question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce(null);

    await expect(
      questionService.updateQuestion('non-existent', { title: 'Test' }),
    ).rejects.toThrow(/not found/);
  });
});

describe('deleteQuestion', () => {
  it('soft-deletes DRAFT question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce(baseQuestion);
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      deleted_at: new Date(),
    });

    await questionService.deleteQuestion('q-1');

    expect(mockPrisma.content_item.update).toHaveBeenCalledWith({
      where: { id: 'q-1' },
      data: { deleted_at: expect.any(Date) },
    });
  });

  it('rejects deleting PENDING_REVIEW question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'PENDING_REVIEW',
    });

    await expect(questionService.deleteQuestion('q-1')).rejects.toThrow(
      /cannot be deleted/,
    );
  });

  it('rejects deleting APPROVED question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'APPROVED',
    });

    await expect(questionService.deleteQuestion('q-1')).rejects.toThrow(
      /cannot be deleted/,
    );
  });

  it('throws NotFoundError for non-existent question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce(null);

    await expect(questionService.deleteQuestion('non-existent')).rejects.toThrow(
      /not found/,
    );
  });
});

describe('submitQuestionForReview', () => {
  it('transitions DRAFT → PENDING_REVIEW and creates review record', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce(baseQuestion);
    mockPrisma.$transaction.mockImplementationOnce(async (ops) => {
      const results = await Promise.all(ops as unknown as Array<Promise<unknown>>);
      return results;
    });
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'PENDING_REVIEW',
    });
    mockPrisma.review.create.mockResolvedValueOnce({
      id: 'r-new',
      content_id: 'q-1',
      reviewer_id: 'u-1',
      status: 'PENDING',
      comment: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await questionService.submitQuestionForReview('q-1', 'u-1');

    expect(result.status).toBe('PENDING_REVIEW');
    expect(mockPrisma.review.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        content_id: 'q-1',
        reviewer_id: 'u-1',
        status: 'PENDING',
      }),
    });
  });

  it('allows submitting REJECTED question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'REJECTED',
    });
    mockPrisma.$transaction.mockImplementation(async (ops) => {
      const results = await Promise.all(ops as unknown as Array<Promise<unknown>>);
      return results;
    });
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'PENDING_REVIEW',
    });
    mockPrisma.review.create.mockResolvedValueOnce({
      id: 'r-new',
      content_id: 'q-1',
      reviewer_id: 'u-1',
      status: 'PENDING',
      comment: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await questionService.submitQuestionForReview('q-1', 'u-1');

    expect(result.status).toBe('PENDING_REVIEW');
  });

  it('rejects submitting already PENDING_REVIEW question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'PENDING_REVIEW',
    });

    await expect(
      questionService.submitQuestionForReview('q-1', 'u-1'),
    ).rejects.toThrow(/cannot be submitted/);
  });

  it('rejects submitting APPROVED question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'APPROVED',
    });

    await expect(
      questionService.submitQuestionForReview('q-1', 'u-1'),
    ).rejects.toThrow(/cannot be submitted/);
  });
});

describe('approveQuestion', () => {
  it('transitions PENDING_REVIEW → APPROVED', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'PENDING_REVIEW',
    });
    mockPrisma.$transaction.mockImplementationOnce(async (ops) => {
      const results = await Promise.all(ops as unknown as Array<Promise<unknown>>);
      return results;
    });
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'APPROVED',
    });
    mockPrisma.review.updateMany.mockResolvedValueOnce({ count: 1 });

    const result = await questionService.approveQuestion('q-1', 'u-2', 'Approved!');

    expect(result.status).toBe('APPROVED');
    expect(mockPrisma.content_item.update).toHaveBeenCalledWith({
      where: { id: 'q-1' },
      data: { status: 'APPROVED' },
    });
  });

  it('rejects approving non-pending question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce(baseQuestion);

    await expect(
      questionService.approveQuestion('q-1', 'u-2', 'Try'),
    ).rejects.toThrow(/cannot be approved/);
  });

  it('rejects approving already approved question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'APPROVED',
    });

    await expect(
      questionService.approveQuestion('q-1', 'u-2', 'Try'),
    ).rejects.toThrow(/cannot be approved/);
  });
});

describe('rejectQuestion', () => {
  it('transitions PENDING_REVIEW → REJECTED with reason', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'PENDING_REVIEW',
    });
    mockPrisma.$transaction.mockImplementationOnce(async (ops) => {
      const results = await Promise.all(ops as unknown as Array<Promise<unknown>>);
      return results;
    });
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'REJECTED',
    });
    mockPrisma.review.updateMany.mockResolvedValueOnce({ count: 1 });

    const result = await questionService.rejectQuestion(
      'q-1',
      'u-2',
      'This question has errors',
    );

    expect(result.status).toBe('REJECTED');
    expect(mockPrisma.review.updateMany).toHaveBeenCalledWith({
      where: { content_id: 'q-1', status: 'PENDING' },
      data: expect.objectContaining({
        status: 'REJECTED',
        reviewer_id: 'u-2',
        comment: 'This question has errors',
      }),
    });
  });

  it('rejects short reason (less than 5 characters)', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'PENDING_REVIEW',
    });

    await expect(
      questionService.rejectQuestion('q-1', 'u-2', 'no'),
    ).rejects.toThrow(/Invalid rejection reason/);
  });

  it('rejects rejecting non-pending question', async () => {
    mockPrisma.content_item.findFirst.mockResolvedValueOnce(baseQuestion);

    await expect(
      questionService.rejectQuestion('q-1', 'u-2', 'Valid reason'),
    ).rejects.toThrow(/cannot be rejected/);
  });
});

describe('status workflow', () => {
  it('full lifecycle: DRAFT → PENDING_REVIEW → APPROVED', async () => {
    // Step 1: Create
    mockPrisma.content_item.create.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'DRAFT',
    });

    const created = await questionService.createQuestion(
      {
        title: 'Lifecycle Test',
        body: 'Test',
        difficulty: 'easy',
        metadata: { type: 'short-answer' },
      },
      'u-1',
    );
    expect(created.status).toBe('DRAFT');

    // Step 2: Submit
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      id: created.id,
      status: 'DRAFT',
    });
    mockPrisma.$transaction.mockImplementationOnce(async (ops) => {
      const results = await Promise.all(ops as unknown as Array<Promise<unknown>>);
      return results;
    });
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      id: created.id,
      status: 'PENDING_REVIEW',
    });
    mockPrisma.review.create.mockResolvedValueOnce({
      id: 'r-1',
      content_id: created.id,
      reviewer_id: 'u-1',
      status: 'PENDING',
      comment: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const submitted = await questionService.submitQuestionForReview(created.id, 'u-1');
    expect(submitted.status).toBe('PENDING_REVIEW');

    // Step 3: Approve
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      id: created.id,
      status: 'PENDING_REVIEW',
    });
    mockPrisma.$transaction.mockImplementationOnce(async (ops) => {
      const results = await Promise.all(ops as unknown as Array<Promise<unknown>>);
      return results;
    });
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      id: created.id,
      status: 'APPROVED',
    });
    mockPrisma.review.updateMany.mockResolvedValueOnce({ count: 1 });

    const approved = await questionService.approveQuestion(created.id, 'u-2', 'Looks good');
    expect(approved.status).toBe('APPROVED');
  });

  it('full lifecycle: DRAFT → PENDING_REVIEW → REJECTED → DRAFT', async () => {
    // Step 1: Create
    mockPrisma.content_item.create.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'DRAFT',
    });

    await questionService.createQuestion(
      {
        title: 'Reject Test',
        body: 'Test',
        difficulty: 'easy',
        metadata: { type: 'short-answer' },
      },
      'u-1',
    );

    // Step 2: Submit
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'DRAFT',
    });
    mockPrisma.$transaction.mockImplementationOnce(async (ops) => {
      const results = await Promise.all(ops as unknown as Array<Promise<unknown>>);
      return results;
    });
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'PENDING_REVIEW',
    });
    mockPrisma.review.create.mockResolvedValueOnce({
      id: 'r-1',
      content_id: 'q-1',
      reviewer_id: 'u-1',
      status: 'PENDING',
      comment: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await questionService.submitQuestionForReview('q-1', 'u-1');

    // Step 3: Reject
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'PENDING_REVIEW',
    });
    mockPrisma.$transaction.mockImplementationOnce(async (ops) => {
      const results = await Promise.all(ops as unknown as Array<Promise<unknown>>);
      return results;
    });
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'REJECTED',
    });
    mockPrisma.review.updateMany.mockResolvedValueOnce({ count: 1 });

    const rejected = await questionService.rejectQuestion(
      'q-1',
      'u-2',
      'Needs revision',
    );
    expect(rejected.status).toBe('REJECTED');

    // Step 4: Resubmit (REJECTED → PENDING_REVIEW)
    mockPrisma.content_item.findFirst.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'REJECTED',
    });
    mockPrisma.$transaction.mockImplementationOnce(async (ops) => {
      const results = await Promise.all(ops as unknown as Array<Promise<unknown>>);
      return results;
    });
    mockPrisma.content_item.update.mockResolvedValueOnce({
      ...baseQuestion,
      status: 'PENDING_REVIEW',
    });
    mockPrisma.review.create.mockResolvedValueOnce({
      id: 'r-2',
      content_id: 'q-1',
      reviewer_id: 'u-1',
      status: 'PENDING',
      comment: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const resubmitted = await questionService.submitQuestionForReview('q-1', 'u-1');
    expect(resubmitted.status).toBe('PENDING_REVIEW');
  });
});
