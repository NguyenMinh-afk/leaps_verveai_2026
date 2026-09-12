/**
 * Review queue service (svc-content).
 *
 * Handles the content review workflow:
 *   - List pending reviews
 *   - Approve content (sets content status = APPROVED)
 *   - Reject content (sets content status = DRAFT)
 *   - Review statistics
 */

import { Prisma } from '../generated/prisma/index.js';
import { NotFoundError, ConflictError, ValidationError } from '@verveai/error-types';
import { validate } from '@verveai/common-node';
import { prisma } from '../prisma/client.js';
import { logger } from '../utils/logger.js';
import {
  type ReviewActionInput,
  type ReviewPaginationInput,
  reviewActionSchema,
  reviewPaginationSchema,
} from '../validators/review.validator.js';
import type { PaginationResult } from '@verveai/common-node';

// ─── Result types ──────────────────────────────────────────────────────────────

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Review {
  id: string;
  contentId: string;
  reviewerId: string;
  status: ReviewStatus;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithContent extends Review {
  content: {
    id: string;
    title: string;
    type: string;
    status: string;
    authorId: string;
  };
}

export interface ReviewListResult {
  items: ReviewWithContent[];
  pagination: PaginationResult;
}

export interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  reviewerWorkload: Array<{ reviewerId: string; pendingCount: number; totalCount: number }>;
}

function toReview(
  m: Prisma.reviewGetPayload<{ include: { content: true } }> & {
    content: {
      id: string;
      title: string;
      type: string;
      status: string;
      author_id: string;
    };
  },
): ReviewWithContent {
  return {
    id: m.id,
    contentId: m.content_id,
    reviewerId: m.reviewer_id,
    status: m.status,
    comment: m.comment ?? undefined,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
    content: {
      id: m.content.id,
      title: m.content.title,
      type: m.content.type,
      status: m.content.status,
      authorId: m.content.author_id,
    },
  };
}

// ─── List pending reviews ──────────────────────────────────────────────────────

/**
 * List reviews (paginated). Defaults to PENDING status when no filter is provided.
 */
export async function listReviewQueue(params: unknown): Promise<ReviewListResult> {
  const parsed = validate(reviewPaginationSchema, params);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid pagination parameters');
  }

  const { skip, take } = parsed.data as ReviewPaginationInput;

  const where: Prisma.reviewWhereInput = { status: 'PENDING' };

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: 'asc' }, // FIFO
      include: { content: true },
    }),
    prisma.review.count({ where }),
  ]);

  const pagination: PaginationResult = {
    page: Math.floor(skip / take) + 1,
    pageSize: take,
    total,
    totalPages: Math.max(1, Math.ceil(total / take)),
    hasNext: skip + items.length < total,
    hasPrev: skip > 0,
  };

  return {
    items: items.map(toReview),
    pagination,
  };
}

// ─── Approve ───────────────────────────────────────────────────────────────────

/**
 * Approve a review.
 *
 * - Updates the review status to APPROVED
 * - Updates the linked content item's status to APPROVED
 * - All wrapped in a transaction
 */
export async function approveReview(
  reviewId: string,
  reviewerId: string,
  data: unknown,
): Promise<ReviewWithContent> {
  const parsed = validate(reviewActionSchema, data);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid review action data');
  }

  if (!reviewerId || typeof reviewerId !== 'string') {
    throw new ValidationError([{ path: ['reviewerId'], message: 'reviewerId is required', code: 'invalid_type' }], 'Invalid reviewer');
  }

  const { comment } = parsed.data as ReviewActionInput;

  const existing = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { content: true },
  });

  if (!existing) {
    throw new NotFoundError('Review', reviewId);
  }

  if (existing.status !== 'PENDING') {
    throw new ConflictError(`Review ${reviewId} is ${existing.status} and cannot be approved.`);
  }

  // If the content was already soft-deleted, refuse
  if (existing.content.deleted_at !== null) {
    throw new ConflictError(`Cannot approve a review for deleted content.`);
  }

  const [updatedReview] = await prisma.$transaction([
    prisma.review.update({
      where: { id: reviewId },
      data: {
        status: 'APPROVED',
        reviewer_id: reviewerId,
        comment,
      },
      include: { content: true },
    }),
    prisma.content_item.update({
      where: { id: existing.content_id },
      data: { status: 'APPROVED' },
    }),
  ]);

  logger.info('Review approved', { reviewId, contentId: existing.content_id, reviewerId });

  return toReview(updatedReview);
}

// ─── Reject ────────────────────────────────────────────────────────────────────

/**
 * Reject a review.
 *
 * - Updates the review status to REJECTED
 * - Sets the content item back to DRAFT so author can revise
 */
export async function rejectReview(
  reviewId: string,
  reviewerId: string,
  data: unknown,
): Promise<ReviewWithContent> {
  const parsed = validate(reviewActionSchema, data);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid review action data');
  }

  if (!reviewerId || typeof reviewerId !== 'string') {
    throw new ValidationError([{ path: ['reviewerId'], message: 'reviewerId is required', code: 'invalid_type' }], 'Invalid reviewer');
  }

  const { comment } = parsed.data as ReviewActionInput;

  const existing = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { content: true },
  });

  if (!existing) {
    throw new NotFoundError('Review', reviewId);
  }

  if (existing.status !== 'PENDING') {
    throw new ConflictError(`Review ${reviewId} is ${existing.status} and cannot be rejected.`);
  }

  const [updatedReview] = await prisma.$transaction([
    prisma.review.update({
      where: { id: reviewId },
      data: {
        status: 'REJECTED',
        reviewer_id: reviewerId,
        comment,
      },
      include: { content: true },
    }),
    prisma.content_item.update({
      where: { id: existing.content_id },
      data: { status: 'DRAFT' },
    }),
  ]);

  logger.info('Review rejected', { reviewId, contentId: existing.content_id, reviewerId });

  return toReview(updatedReview);
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

/**
 * Aggregate review statistics.
 *
 * - Total + counts per status
 * - Per-reviewer pending/total workload
 */
export async function getReviewStats(): Promise<ReviewStats> {
  const [byStatus, reviewerRaw] = await Promise.all([
    prisma.review.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.review.groupBy({
      by: ['reviewer_id'],
      _count: { _all: true },
    }),
  ]);

  let total = 0;
  let pending = 0;
  let approved = 0;
  let rejected = 0;

  type GroupRow = { status: string; _count: { _all: number } };
  type ReviewerRow = { status: string; reviewer_id: string; _count: { _all: number } };

  for (const row of byStatus as Array<GroupRow>) {
    const count = row._count._all;
    total += count;
    if (row.status === 'PENDING') pending = count;
    if (row.status === 'APPROVED') approved = count;
    if (row.status === 'REJECTED') rejected = count;
  }

  // Build per-reviewer map with pending/total breakdown
  const pendingByReviewer = new Map<string, number>();
  for (const row of reviewerRaw as Array<ReviewerRow>) {
    if (row.status === 'PENDING') {
      pendingByReviewer.set(row.reviewer_id, (pendingByReviewer.get(row.reviewer_id) ?? 0) + row._count._all);
    }
  }

  // Collapse the raw groupBy rows (one per status) into one row per reviewer
  // by summing the counts across statuses.
  const totalByReviewer = new Map<string, number>();
  for (const row of reviewerRaw as Array<ReviewerRow>) {
    totalByReviewer.set(
      row.reviewer_id,
      (totalByReviewer.get(row.reviewer_id) ?? 0) + row._count._all,
    );
  }

  const reviewerWorkload = Array.from(totalByReviewer.entries())
    .map(([reviewerId, totalCount]) => ({
      reviewerId,
      pendingCount: pendingByReviewer.get(reviewerId) ?? 0,
      totalCount,
    }))
    .sort((a: { pendingCount: number }, b: { pendingCount: number }) => b.pendingCount - a.pendingCount);

  return {
    total,
    pending,
    approved,
    rejected,
    reviewerWorkload,
  };
}
