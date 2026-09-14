/**
 * Tests for the review service.
 *
 * Verifies that approveReview transitions content → APPROVED and rejectReview
 * transitions content → DRAFT, plus basic stats aggregation.
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
        groupBy: vi.fn(),
        updateMany: vi.fn(),
      },
      review: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        groupBy: vi.fn(),
      },
      bundle: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        groupBy: vi.fn(),
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

import * as reviewService from '../../src/services/review.service';
import { prisma } from '../../src/prisma/client';

const mockPrisma = prisma as unknown as {
  content_item: {
    update: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  review: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    groupBy: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('approveReview', () => {
  it('transitions review → APPROVED and content → APPROVED', async () => {
    mockPrisma.review.findUnique.mockResolvedValueOnce({
      id: 'r-1',
      content_id: 'c-1',
      reviewer_id: 'unknown',
      status: 'PENDING',
      comment: null,
      created_at: new Date(),
      updated_at: new Date(),
      content: {
        id: 'c-1',
        title: 'Foo',
        type: 'ITEM_QUESTION',
        status: 'PENDING_REVIEW',
        author_id: 'u-1',
        body: 'body',
        difficulty: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    });

    mockPrisma.$transaction.mockImplementationOnce(async (ops: Array<Promise<unknown>>) => {
      const [reviewOp, contentOp] = ops as unknown as [Promise<unknown>, Promise<unknown>];
      const reviewResult = await reviewOp;
      await contentOp;
      return [reviewResult];
    });

    mockPrisma.review.update.mockResolvedValueOnce({
      id: 'r-1',
      content_id: 'c-1',
      reviewer_id: 'u-2',
      status: 'APPROVED',
      comment: 'Looks good',
      created_at: new Date(),
      updated_at: new Date(),
      content: {
        id: 'c-1',
        title: 'Foo',
        type: 'ITEM_QUESTION',
        status: 'APPROVED',
        author_id: 'u-1',
        body: 'body',
        difficulty: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    });

    const result = await reviewService.approveReview('r-1', 'u-2', { comment: 'Looks good to me' });
    expect(result.status).toBe('APPROVED');
    expect(mockPrisma.content_item.update).toHaveBeenCalledWith({
      where: { id: 'c-1' },
      data: { status: 'APPROVED' },
    });
  });

  it('rejects when review is already resolved', async () => {
    mockPrisma.review.findUnique.mockResolvedValueOnce({
      id: 'r-1',
      content_id: 'c-1',
      reviewer_id: 'u-2',
      status: 'APPROVED',
      comment: null,
      created_at: new Date(),
      updated_at: new Date(),
      content: {
        id: 'c-1',
        title: 'Foo',
        type: 'ITEM_QUESTION',
        status: 'APPROVED',
        author_id: 'u-1',
        body: 'body',
        difficulty: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    });

    await expect(
      reviewService.approveReview('r-1', 'u-2', { comment: 'Looks good to me' }),
    ).rejects.toThrow(/cannot be approved/);
  });

  it('rejects when review not found', async () => {
    mockPrisma.review.findUnique.mockResolvedValueOnce(null);
    await expect(
      reviewService.approveReview('missing', 'u-2', { comment: 'Looks good' }),
    ).rejects.toThrow(/Review.*not found/);
  });

  it('requires comment (validated by zod)', async () => {
    await expect(
      reviewService.approveReview('r-1', 'u-2', { comment: 'no' }),
    ).rejects.toThrow();
  });
});

describe('rejectReview', () => {
  it('transitions review → REJECTED and content → DRAFT', async () => {
    mockPrisma.review.findUnique.mockResolvedValueOnce({
      id: 'r-1',
      content_id: 'c-1',
      reviewer_id: 'unknown',
      status: 'PENDING',
      comment: null,
      created_at: new Date(),
      updated_at: new Date(),
      content: {
        id: 'c-1',
        title: 'Foo',
        type: 'ITEM_QUESTION',
        status: 'PENDING_REVIEW',
        author_id: 'u-1',
        body: 'body',
        difficulty: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    });

    mockPrisma.$transaction.mockImplementationOnce(async (ops: Array<Promise<unknown>>) => {
      const [reviewOp, contentOp] = ops as unknown as [Promise<unknown>, Promise<unknown>];
      const reviewResult = await reviewOp;
      await contentOp;
      return [reviewResult];
    });

    mockPrisma.review.update.mockResolvedValueOnce({
      id: 'r-1',
      content_id: 'c-1',
      reviewer_id: 'u-2',
      status: 'REJECTED',
      comment: 'Needs work',
      created_at: new Date(),
      updated_at: new Date(),
      content: {
        id: 'c-1',
        title: 'Foo',
        type: 'ITEM_QUESTION',
        status: 'DRAFT',
        author_id: 'u-1',
        body: 'body',
        difficulty: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    });

    const result = await reviewService.rejectReview('r-1', 'u-2', { comment: 'Needs more work here' });
    expect(result.status).toBe('REJECTED');
    expect(mockPrisma.content_item.update).toHaveBeenCalledWith({
      where: { id: 'c-1' },
      data: { status: 'DRAFT' },
    });
  });

  it('rejects when review missing', async () => {
    mockPrisma.review.findUnique.mockResolvedValueOnce(null);
    await expect(
      reviewService.rejectReview('missing', 'u-2', { comment: 'No comment really' }),
    ).rejects.toThrow();
  });

  it('rejects when already resolved', async () => {
    mockPrisma.review.findUnique.mockResolvedValueOnce({
      id: 'r-1',
      content_id: 'c-1',
      reviewer_id: 'u-2',
      status: 'APPROVED',
      comment: null,
      created_at: new Date(),
      updated_at: new Date(),
      content: {
        id: 'c-1',
        title: 'Foo',
        type: 'ITEM_QUESTION',
        status: 'APPROVED',
        author_id: 'u-1',
        body: 'body',
        difficulty: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    });
    await expect(
      reviewService.rejectReview('r-1', 'u-2', { comment: 'Comment is long enough' }),
    ).rejects.toThrow(/cannot be rejected/);
  });
});

describe('getReviewStats', () => {
  it('aggregates counts and reviewer workload', async () => {
    mockPrisma.review.groupBy
      .mockResolvedValueOnce([
        { status: 'PENDING', _count: { _all: 3 } },
        { status: 'APPROVED', _count: { _all: 5 } },
        { status: 'REJECTED', _count: { _all: 2 } },
      ])
      .mockResolvedValueOnce([
        { status: 'PENDING', reviewer_id: 'u-1', _count: { _all: 2 } },
        { status: 'PENDING', reviewer_id: 'u-2', _count: { _all: 1 } },
        { status: 'APPROVED', reviewer_id: 'u-1', _count: { _all: 3 } },
        { status: 'APPROVED', reviewer_id: 'u-2', _count: { _all: 2 } },
        { status: 'REJECTED', reviewer_id: 'u-2', _count: { _all: 2 } },
      ]);

    const stats = await reviewService.getReviewStats();
    expect(stats.total).toBe(10);
    expect(stats.pending).toBe(3);
    expect(stats.approved).toBe(5);
    expect(stats.rejected).toBe(2);
    expect(stats.reviewerWorkload).toHaveLength(2);
    expect(stats.reviewerWorkload[0]?.reviewerId).toBe('u-1');
    expect(stats.reviewerWorkload[0]?.pendingCount).toBe(2);
    expect(stats.reviewerWorkload[0]?.totalCount).toBe(5);
  });

  it('returns zeros for empty dataset', async () => {
    mockPrisma.review.groupBy.mockResolvedValue([]);
    const stats = await reviewService.getReviewStats();
    expect(stats.total).toBe(0);
    expect(stats.pending).toBe(0);
    expect(stats.approved).toBe(0);
    expect(stats.rejected).toBe(0);
    expect(stats.reviewerWorkload).toHaveLength(0);
  });
});

describe('listReviewQueue', () => {
  it('returns pending reviews with pagination meta', async () => {
    mockPrisma.review.findMany.mockResolvedValueOnce([
      {
        id: 'r-1',
        content_id: 'c-1',
        reviewer_id: 'u-3',
        status: 'PENDING',
        comment: null,
        created_at: new Date(),
        updated_at: new Date(),
        content: {
          id: 'c-1',
          title: 'Foo',
          type: 'ITEM_QUESTION',
          status: 'PENDING_REVIEW',
          author_id: 'u-1',
          body: 'b',
          difficulty: 1,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      },
    ]);
    mockPrisma.review.count.mockResolvedValueOnce(1);

    const result = await reviewService.listReviewQueue({});
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.content.title).toBe('Foo');
    expect(result.pagination.total).toBe(1);
  });

  it('filters by status PENDING', async () => {
    mockPrisma.review.findMany.mockResolvedValueOnce([]);
    mockPrisma.review.count.mockResolvedValueOnce(0);
    await reviewService.listReviewQueue({});
    expect(mockPrisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'PENDING' } }),
    );
  });
});
