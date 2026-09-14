/**
 * Question management service (svc-content).
 *
 * Handles CRUD operations for question content items with question-specific
 * metadata (options, answers, explanations, topics).
 *
 * Workflow: DRAFT → PENDING_REVIEW → APPROVED/REJECTED
 */

import { Prisma } from '../generated/prisma/index.js';
import { NotFoundError, ConflictError, ValidationError } from '@verveai/error-types';
import { validate } from '@verveai/common-node';
import { prisma } from '../prisma/client.js';
import { logger } from '../utils/logger.js';
import {
  type CreateQuestionInput,
  type UpdateQuestionInput,
  type QuestionFilterInput,
  type QuestionMetadataInput,
  createQuestionSchema,
  updateQuestionSchema,
  questionFilterSchema,
  difficultyToDbValue,
  questionMetadataSchema,
} from '../validators/question.validator.js';
import type { PaginationResult } from '@verveai/common-node';

// ─── Type Definitions ─────────────────────────────────────────────────────────

export interface QuestionOption {
  id?: string;
  content: string;
  contentVi?: string;
}

export interface QuestionMetadata {
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: QuestionOption[];
  correctOptionIndex?: number;
  correctAnswer?: string;
  explanation?: string;
  explanationVi?: string;
  topicId?: string;
  topicName?: string;
  topicNameVi?: string;
  tags?: string[];
  contentVi?: string;
}

export interface Question {
  id: string;
  title: string;
  body: string;
  bodyVi?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  difficultyLabel: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  authorId: string;
  topic?: string;
  chapter?: string;
  metadata: QuestionMetadata;
  createdAt: Date;
  updatedAt: Date;
  // Review info (when included)
  reviews?: ReviewSummary[];
}

export interface ReviewSummary {
  id: string;
  reviewerId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comment?: string;
  createdAt: Date;
}

export interface QuestionListResult {
  items: Question[];
  pagination: PaginationResult;
}

// ─── Database Type ────────────────────────────────────────────────────────────

type ContentItemModel = Prisma.content_itemGetPayload<Record<string, never>>;

// ─── Helper Functions ─────────────────────────────────────────────────────────

function dbDifficultyToLabel(difficulty: number): 'easy' | 'medium' | 'hard' {
  if (difficulty <= 2) return 'easy';
  if (difficulty <= 4) return 'medium';
  return 'hard';
}

function parseMetadata(metadata: unknown): QuestionMetadata {
  if (!metadata || typeof metadata !== 'object') {
    return { type: 'short-answer' };
  }
  const m = metadata as Record<string, unknown>;
  return {
    type: (m.type as QuestionMetadata['type']) || 'short-answer',
    options: m.options as QuestionMetadata['options'],
    correctOptionIndex: m.correctOptionIndex as number | undefined,
    correctAnswer: m.correctAnswer as string | undefined,
    explanation: m.explanation as string | undefined,
    explanationVi: m.explanationVi as string | undefined,
    topicId: m.topicId as string | undefined,
    topicName: m.topicName as string | undefined,
    topicNameVi: m.topicNameVi as string | undefined,
    tags: m.tags as string[] | undefined,
    contentVi: m.contentVi as string | undefined,
  };
}

function toQuestion(m: ContentItemModel, includeReviews = false): Question {
  const metadata = parseMetadata(m.metadata);

  const question: Question = {
    id: m.id,
    title: m.title,
    body: m.body,
    bodyVi: metadata.contentVi,
    difficulty: m.difficulty as 1 | 2 | 3 | 4 | 5,
    difficultyLabel: dbDifficultyToLabel(m.difficulty),
    type: metadata.type,
    status: m.status,
    authorId: m.author_id,
    topic: m.topic || metadata.topicName,
    chapter: m.chapter,
    metadata,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  };

  if (includeReviews && m.reviews) {
    question.reviews = m.reviews.map((r) => ({
      id: r.id,
      reviewerId: r.reviewer_id,
      status: r.status,
      comment: r.comment || undefined,
      createdAt: r.created_at,
    }));
  }

  return question;
}

// ─── Search helper ────────────────────────────────────────────────────────────

function buildSearchWhere(search: string): Prisma.content_itemWhereInput {
  const searchLower = search.toLowerCase();
  return {
    OR: [
      { title: { contains: searchLower, mode: 'insensitive' } },
      { body: { contains: searchLower, mode: 'insensitive' } },
      { topic: { contains: searchLower, mode: 'insensitive' } },
      { chapter: { contains: searchLower, mode: 'insensitive' } },
    ],
  };
}

// ─── List Questions ───────────────────────────────────────────────────────────

/**
 * List question content items with optional filters and pagination.
 *
 * - Only returns ITEM_QUESTION type
 * - Excludes soft-deleted items
 * - Supports search, difficulty, type, status, topic, author filters
 */
export async function listQuestions(filters: unknown): Promise<QuestionListResult> {
  const parsed = validate(questionFilterSchema, filters);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid filter parameters');
  }

  const { search, difficulty, type, status, topic, authorId, skip, take } = parsed.data as QuestionFilterInput;

  // Build metadata filter for type
  let metadataFilter: Prisma.JsonFilter | undefined;
  if (type) {
    metadataFilter = { equals: { type } };
  }

  // Build difficulty filter
  let difficultyFilter: number | undefined;
  if (difficulty) {
    if (difficulty === 'easy') {
      difficultyFilter = { lte: 2 };
    } else if (difficulty === 'medium') {
      difficultyFilter = { gte: 2, lte: 4 };
    } else {
      difficultyFilter = { gte: 4 };
    }
  }

  const where: Prisma.content_itemWhereInput = {
    deleted_at: null,
    type: 'ITEM_QUESTION',
    ...(search ? buildSearchWhere(search) : {}),
    ...(status ? { status } : {}),
    ...(topic ? { topic: { contains: topic, mode: 'insensitive' } } : {}),
    ...(authorId ? { author_id: authorId } : {}),
    ...(difficultyFilter ? { difficulty: difficultyFilter } : {}),
    ...(metadataFilter ? { metadata: metadataFilter } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.content_item.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: 'desc' },
      include: {
        reviews: {
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            reviewer_id: true,
            status: true,
            comment: true,
            created_at: true,
          },
        },
      },
    }),
    prisma.content_item.count({ where }),
  ]);

  const page = Math.floor(skip / take) + 1;
  const pagination: PaginationResult = {
    page,
    pageSize: take,
    total,
    totalPages: Math.max(1, Math.ceil(total / take)),
    hasNext: skip + items.length < total,
    hasPrev: skip > 0,
  };

  return { items: items.map((m) => toQuestion(m, false)), pagination };
}

// ─── Get Question ─────────────────────────────────────────────────────────────

/**
 * Get a single question by ID, including review history.
 */
export async function getQuestion(id: string): Promise<Question | null> {
  const item = await prisma.content_item.findFirst({
    where: { id, deleted_at: null, type: 'ITEM_QUESTION' },
    include: {
      reviews: {
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          reviewer_id: true,
          status: true,
          comment: true,
          created_at: true,
        },
      },
    },
  });

  if (!item) {
    return null;
  }

  return toQuestion(item, true);
}

// ─── Create Question ─────────────────────────────────────────────────────────

/**
 * Create a new question in DRAFT status.
 *
 * @param data Validated create input (title, body, difficulty, metadata)
 * @param authorId UUID of the authenticated user creating the question
 */
export async function createQuestion(data: unknown, authorId: string): Promise<Question> {
  const parsed = validate(createQuestionSchema, data);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid question data');
  }

  if (!authorId || typeof authorId !== 'string') {
    throw new ValidationError([{ path: ['authorId'], message: 'authorId is required', code: 'invalid_type' }], 'Invalid author');
  }

  const input = parsed.data as CreateQuestionInput;

  // Validate question-specific metadata
  const metadataParsed = validate(questionMetadataSchema, input.metadata);
  if (!metadataParsed.ok) {
    throw new ValidationError(metadataParsed.error.issues, 'Invalid question metadata');
  }

  // Validate options for multiple-choice
  const metadata = metadataParsed.data as QuestionMetadataInput;
  if (metadata.type === 'multiple-choice') {
    if (!metadata.options || metadata.options.length < 2) {
      throw new ValidationError([{ path: ['metadata.options'], message: 'Multiple choice requires at least 2 options', code: 'invalid_type' }], 'Invalid question options');
    }
    if (metadata.correctOptionIndex === undefined || metadata.correctOptionIndex < 0 || metadata.correctOptionIndex >= metadata.options.length) {
      throw new ValidationError([{ path: ['metadata.correctOptionIndex'], message: 'Invalid correct option index', code: 'invalid_type' }], 'Invalid correct answer');
    }
  }

  // Build metadata with generated option IDs
  const questionMetadata: QuestionMetadata = {
    ...metadata,
    options: metadata.options?.map((opt, idx) => ({
      ...opt,
      id: opt.id || `opt-${Date.now()}-${idx}`,
    })),
  };

  const item = await prisma.content_item.create({
    data: {
      type: 'ITEM_QUESTION',
      title: input.title,
      body: input.body,
      difficulty: difficultyToDbValue(input.difficulty),
      author_id: authorId,
      status: 'DRAFT',
      topic: input.topic || metadata.topicName || '',
      chapter: input.chapter || '',
      metadata: questionMetadata,
    },
  });

  logger.info('Question created', { questionId: item.id, authorId, type: questionMetadata.type });

  return toQuestion(item);
}

// ─── Update Question ──────────────────────────────────────────────────────────

/**
 * Update a question.
 *
 * - Only DRAFT or REJECTED questions can be edited.
 * - Updating resets status to DRAFT.
 */
export async function updateQuestion(id: string, data: unknown): Promise<Question> {
  const parsed = validate(updateQuestionSchema, data);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid update data');
  }

  const existing = await prisma.content_item.findFirst({
    where: { id, deleted_at: null, type: 'ITEM_QUESTION' },
  });

  if (!existing) {
    throw new NotFoundError('Question', id);
  }

  if (existing.status !== 'DRAFT' && existing.status !== 'REJECTED') {
    throw new ConflictError(
      `Question ${id} is ${existing.status} and cannot be edited. Only DRAFT or REJECTED questions can be updated.`,
    );
  }

  const input = parsed.data as UpdateQuestionInput;

  // Build update data
  const updateData: Prisma.content_itemUpdateInput = {};

  if (input.title !== undefined) {
    updateData.title = input.title;
  }
  if (input.body !== undefined) {
    updateData.body = input.body;
  }
  if (input.difficulty !== undefined) {
    updateData.difficulty = difficultyToDbValue(input.difficulty);
  }
  if (input.topic !== undefined) {
    updateData.topic = input.topic;
  }
  if (input.chapter !== undefined) {
    updateData.chapter = input.chapter;
  }

  // Merge metadata if provided
  if (input.metadata !== undefined) {
    const existingMetadata = parseMetadata(existing.metadata);
    const newMetadata = input.metadata as Partial<QuestionMetadata>;
    updateData.metadata = { ...existingMetadata, ...newMetadata };
  }

  // Always reset to DRAFT on edit
  updateData.status = 'DRAFT';

  const updated = await prisma.content_item.update({
    where: { id },
    data: updateData,
  });

  logger.info('Question updated', { questionId: id });

  return toQuestion(updated);
}

// ─── Delete Question ─────────────────────────────────────────────────────────

/**
 * Soft-delete a question.
 * Only questions in DRAFT status can be deleted.
 */
export async function deleteQuestion(id: string): Promise<void> {
  const existing = await prisma.content_item.findFirst({
    where: { id, deleted_at: null, type: 'ITEM_QUESTION' },
  });

  if (!existing) {
    throw new NotFoundError('Question', id);
  }

  if (existing.status !== 'DRAFT') {
    throw new ConflictError(
      `Question ${id} is ${existing.status} and cannot be deleted. Only DRAFT questions can be deleted.`,
    );
  }

  await prisma.content_item.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  logger.info('Question deleted', { questionId: id });
}

// ─── Submit for Review ────────────────────────────────────────────────────────

/**
 * Submit a question for review.
 * Transitions status from DRAFT/REJECTED → PENDING_REVIEW.
 */
export async function submitQuestionForReview(id: string, authorId: string): Promise<Question> {
  const existing = await prisma.content_item.findFirst({
    where: { id, deleted_at: null, type: 'ITEM_QUESTION' },
  });

  if (!existing) {
    throw new NotFoundError('Question', id);
  }

  if (existing.status !== 'DRAFT' && existing.status !== 'REJECTED') {
    throw new ConflictError(
      `Question ${id} is ${existing.status} and cannot be submitted for review.`,
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

  logger.info('Question submitted for review', { questionId: id, authorId });

  return toQuestion(updated);
}

// ─── Approve Question ────────────────────────────────────────────────────────

/**
 * Approve a question in review.
 */
export async function approveQuestion(id: string, reviewerId: string, comment?: string): Promise<Question> {
  const existing = await prisma.content_item.findFirst({
    where: { id, deleted_at: null, type: 'ITEM_QUESTION' },
  });

  if (!existing) {
    throw new NotFoundError('Question', id);
  }

  if (existing.status !== 'PENDING_REVIEW') {
    throw new ConflictError(
      `Question ${id} is ${existing.status} and cannot be approved. Only PENDING_REVIEW questions can be approved.`,
    );
  }

  const [updated] = await prisma.$transaction([
    prisma.content_item.update({
      where: { id },
      data: { status: 'APPROVED' },
    }),
    prisma.review.updateMany({
      where: { content_id: id, status: 'PENDING' },
      data: {
        status: 'APPROVED',
        reviewer_id: reviewerId,
        comment,
      },
    }),
  ]);

  logger.info('Question approved', { questionId: id, reviewerId });

  return toQuestion(updated);
}

// ─── Reject Question ─────────────────────────────────────────────────────────

/**
 * Reject a question in review.
 */
export async function rejectQuestion(id: string, reviewerId: string, reason: string): Promise<Question> {
  const existing = await prisma.content_item.findFirst({
    where: { id, deleted_at: null, type: 'ITEM_QUESTION' },
  });

  if (!existing) {
    throw new NotFoundError('Question', id);
  }

  if (existing.status !== 'PENDING_REVIEW') {
    throw new ConflictError(
      `Question ${id} is ${existing.status} and cannot be rejected. Only PENDING_REVIEW questions can be rejected.`,
    );
  }

  if (!reason || reason.trim().length < 5) {
    throw new ValidationError([{ path: ['reason'], message: 'Rejection reason must be at least 5 characters', code: 'invalid_type' }], 'Invalid rejection reason');
  }

  const [updated] = await prisma.$transaction([
    prisma.content_item.update({
      where: { id },
      data: { status: 'REJECTED' },
    }),
    prisma.review.updateMany({
      where: { content_id: id, status: 'PENDING' },
      data: {
        status: 'REJECTED',
        reviewer_id: reviewerId,
        comment: reason,
      },
    }),
  ]);

  logger.info('Question rejected', { questionId: id, reviewerId, reason });

  return toQuestion(updated);
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

/**
 * Get question statistics for admin dashboard
 */
export async function getQuestionStats() {
  const [total, draft, pending, approved, rejected, byDifficulty, byTopic] = await Promise.all([
    prisma.content_item.count({ where: { type: 'ITEM_QUESTION', deleted_at: null } }),
    prisma.content_item.count({ where: { type: 'ITEM_QUESTION', deleted_at: null, status: 'DRAFT' } }),
    prisma.content_item.count({ where: { type: 'ITEM_QUESTION', deleted_at: null, status: 'PENDING_REVIEW' } }),
    prisma.content_item.count({ where: { type: 'ITEM_QUESTION', deleted_at: null, status: 'APPROVED' } }),
    prisma.content_item.count({ where: { type: 'ITEM_QUESTION', deleted_at: null, status: 'REJECTED' } }),
    prisma.content_item.groupBy({
      by: ['difficulty'],
      where: { type: 'ITEM_QUESTION', deleted_at: null },
      _count: true,
    }),
    // Get unique topics count
    prisma.content_item.findMany({
      where: { type: 'ITEM_QUESTION', deleted_at: null, topic: { not: '' } },
      select: { topic: true },
      distinct: ['topic'],
    }),
  ]);

  const difficultyMap: Record<string, number> = {};
  for (const d of byDifficulty) {
    difficultyMap[dbDifficultyToLabel(d.difficulty)] = d._count;
  }

  return {
    total,
    draft,
    pendingReview: pending,
    approved,
    rejected,
    byDifficulty: difficultyMap,
    topicCount: byTopic.length,
    published: approved, // Published = approved in current model
  };
}
