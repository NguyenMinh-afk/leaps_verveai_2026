/**
 * Content management service (svc-content).
 *
 * Handles CRUD operations for content items with soft-delete and
 * status-based workflow (DRAFT → PENDING_REVIEW → APPROVED/REJECTED).
 */

import { Prisma } from '../generated/prisma/index.js';
import { NotFoundError, ConflictError, ValidationError } from '@verveai/error-types';
import { validate } from '@verveai/common-node';
import { prisma } from '../prisma/client.js';
import { logger } from '../utils/logger.js';
import {
  type CreateContentInput,
  type UpdateContentInput,
  type ContentFilterInput,
  createContentSchema,
  updateContentSchema,
  contentFilterSchema,
} from '../validators/content.validator.js';
import type { PaginationResult } from '@verveai/common-node';

// ─── Prisma model type (avoids importing the generated client type here) ────────

type ContentItemModel = Prisma.content_itemGetPayload<Record<string, never>>;

// ─── Result types ──────────────────────────────────────────────────────────────

export interface ContentItem {
  id: string;
  type: 'ITEM_QUESTION' | 'ITEM_EXPLANATION' | 'ITEM_MEDIA';
  title: string;
  body: string;
  difficulty: number;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentListResult {
  items: ContentItem[];
  pagination: PaginationResult;
}

function toContentItem(m: ContentItemModel): ContentItem {
  return {
    id: m.id,
    type: m.type,
    title: m.title,
    body: m.body,
    difficulty: m.difficulty,
    status: m.status,
    authorId: m.author_id,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  };
}

// ─── List / filter ─────────────────────────────────────────────────────────────

/**
 * List content items with optional filters and pagination.
 *
 * - Excludes soft-deleted items (deleted_at IS NULL)
 * - Supports filter by type, status, authorId
 * - Pagination via skip/take
 */
export async function listContent(filters: unknown): Promise<ContentListResult> {
  const parsed = validate(contentFilterSchema, filters);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid filter parameters');
  }

  const { type, status, authorId, skip, take } = parsed.data as ContentFilterInput;

  const where: Prisma.content_itemWhereInput = {
    deleted_at: null,
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
    ...(authorId ? { author_id: authorId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.content_item.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: 'desc' },
    }),
    prisma.content_item.count({ where }),
  ]);

  const pagination: PaginationResult = {
    page: Math.floor(skip / take) + 1,
    pageSize: take,
    total,
    totalPages: Math.max(1, Math.ceil(total / take)),
    hasNext: skip + items.length < total,
    hasPrev: skip > 0,
  };

  return { items: items.map(toContentItem), pagination };
}

// ─── Create ────────────────────────────────────────────────────────────────────

/**
 * Create a new content item in DRAFT status.
 *
 * @param data  Validated create input (type, title, body, difficulty)
 * @param authorId  UUID of the authenticated user creating the item
 */
export async function createContent(data: unknown, authorId: string): Promise<ContentItem> {
  const parsed = validate(createContentSchema, data);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid content data');
  }

  if (!authorId || typeof authorId !== 'string') {
    throw new ValidationError([{ path: ['authorId'], message: 'authorId is required', code: 'invalid_type' }], 'Invalid author');
  }

  const input = parsed.data as CreateContentInput;

  const item = await prisma.content_item.create({
    data: {
      type: input.type,
      title: input.title,
      body: input.body,
      difficulty: input.difficulty ?? 1,
      author_id: authorId,
      status: 'DRAFT',
    },
  });

  logger.info('Content item created', { contentId: item.id, authorId });
  return toContentItem(item);
}

// ─── Get one ───────────────────────────────────────────────────────────────────

/**
 * Get a single content item by ID, including its review history.
 * Returns null if not found or soft-deleted.
 */
export async function getContent(id: string): Promise<ContentItem | null> {
  const item = await prisma.content_item.findFirst({
    where: { id, deleted_at: null },
    include: {
      reviews: {
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          reviewer_id: true,
          status: true,
          comment: true,
          created_at: true,
          updated_at: true,
        },
      },
    },
  });

  if (!item) {
    return null;
  }

  return toContentItem(item);
}

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Update a content item.
 *
 * - Only DRAFT or REJECTED items can be edited.
 * - Updating automatically resets status to DRAFT and clears any pending review.
 */
export async function updateContent(id: string, data: unknown): Promise<ContentItem> {
  const parsed = validate(updateContentSchema, data);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid update data');
  }

  const existing = await prisma.content_item.findFirst({
    where: { id, deleted_at: null },
  });

  if (!existing) {
    throw new NotFoundError('Content item', id);
  }

  if (existing.status !== 'DRAFT' && existing.status !== 'REJECTED') {
    throw new ConflictError(
      `Content item ${id} is ${existing.status} and cannot be edited. Only DRAFT or REJECTED items can be updated.`,
    );
  }

  const input = parsed.data as UpdateContentInput;

  const updated = await prisma.content_item.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.body !== undefined ? { body: input.body } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.difficulty !== undefined ? { difficulty: input.difficulty } : {}),
      // Reset to DRAFT on any edit
      status: 'DRAFT',
    },
  });

  logger.info('Content item updated', { contentId: id });

  return toContentItem(updated);
}

// ─── Delete (soft) ────────────────────────────────────────────────────────────

/**
 * Soft-delete a content item.
 * Only items in DRAFT status can be deleted.
 */
export async function deleteContent(id: string): Promise<void> {
  const existing = await prisma.content_item.findFirst({
    where: { id, deleted_at: null },
  });

  if (!existing) {
    throw new NotFoundError('Content item', id);
  }

  if (existing.status !== 'DRAFT') {
    throw new ConflictError(
      `Content item ${id} is ${existing.status} and cannot be deleted. Only DRAFT items can be deleted.`,
    );
  }

  await prisma.content_item.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  logger.info('Content item soft-deleted', { contentId: id });
}

// ─── Submit for review ─────────────────────────────────────────────────────────

/**
 * Submit a content item for review.
 * Transitions status from DRAFT/REJECTED → PENDING_REVIEW.
 */
export async function submitForReview(id: string, authorId: string): Promise<ContentItem> {
  const existing = await prisma.content_item.findFirst({
    where: { id, deleted_at: null },
  });

  if (!existing) {
    throw new NotFoundError('Content item', id);
  }

  if (existing.status !== 'DRAFT' && existing.status !== 'REJECTED') {
    throw new ConflictError(
      `Content item ${id} is ${existing.status} and cannot be submitted for review.`,
    );
  }

  const [updated] = await prisma.$transaction([
    prisma.content_item.update({
      where: { id },
      data: { status: 'PENDING_REVIEW' },
    }),
    prisma.review.create({
      data: {
        content_id: id,
        reviewer_id: authorId,
        status: 'PENDING',
      },
    }),
  ]);

  logger.info('Content submitted for review', { contentId: id, authorId });

  return toContentItem(updated);
}
