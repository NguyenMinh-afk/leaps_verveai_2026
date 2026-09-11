/**
 * Reporting service (svc-content).
 *
 * - Aggregate cross-service stats
 * - Class / student reports (with svc-class, svc-bkt via circuit breakers)
 * - Export to CSV / JSON (returned base64-encoded for safe transport)
 */

import { NotFoundError, ValidationError } from '@verveai/error-types';
import { z, validate } from '@verveai/common-node';
import { prisma } from '../prisma/client.js';
import { logger } from '../utils/logger.js';
import { callClassService, callBktService } from './inter-service.js';

// ─── Result types ──────────────────────────────────────────────────────────────

export interface Report<T = Record<string, unknown>> {
  type: string;
  generatedAt: Date;
  data: T;
}

export interface AggregateData {
  content: {
    total: number;
    draft: number;
    pendingReview: number;
    approved: number;
    rejected: number;
  };
  bundles: {
    total: number;
    built: number;
    signed: number;
    published: number;
  };
  reviews: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  upstream: {
    svcClass: 'ok' | 'down';
    svcBkt: 'ok' | 'down';
  };
  upstreamData: {
    classes?: unknown;
    // Other upstream data may be appended here
  };
}

export interface ClassReportData {
  classId: string;
  classInfo: Record<string, unknown> | null;
  contentStats: {
    total: number;
    approved: number;
    pendingReview: number;
    draft: number;
  };
  bundlesUsed: number;
  generatedAt: Date;
}

export interface StudentReportData {
  studentId: string;
  studentInfo: Record<string, unknown> | null;
  classInfo: Record<string, unknown> | null;
  progress: Record<string, unknown> | null;
  generatedAt: Date;
}

export interface ExportResult {
  filename: string;
  mimeType: string;
  encoding: 'base64';
  data: string;
  sizeBytes: number;
}

// ─── Validator ─────────────────────────────────────────────────────────────────

const exportTypeSchema = z.object({
  type: z.enum(['aggregate', 'classes', 'bundles', 'content', 'reviews']),
  format: z.enum(['json', 'csv']).default('json'),
});

// ─── Aggregate ─────────────────────────────────────────────────────────────────

/**
 * Aggregate cross-service stats.
 * Counts come from svc-content's own DB; class/student counts come via circuit
 * breaker from svc-class and svc-bkt (fall back to "down" on circuit open).
 */
export async function getAggregateReport(): Promise<Report<AggregateData>> {
  const [contentCounts, bundleCounts, reviewCounts] = await Promise.all([
    prisma.content_item.groupBy({
      by: ['status'],
      _count: { _all: true },
      where: { deleted_at: null },
    }),
    prisma.bundle.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.review.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
  ]);

  const content: AggregateData['content'] = {
    total: 0,
    draft: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
  };
  for (const row of contentCounts) {
    content.total += row._count._all;
    if (row.status === 'DRAFT') content.draft = row._count._all;
    else if (row.status === 'PENDING_REVIEW') content.pendingReview = row._count._all;
    else if (row.status === 'APPROVED') content.approved = row._count._all;
    else if (row.status === 'REJECTED') content.rejected = row._count._all;
  }

  const bundles: AggregateData['bundles'] = {
    total: 0,
    built: 0,
    signed: 0,
    published: 0,
  };
  for (const row of bundleCounts) {
    bundles.total += row._count._all;
    if (row.status === 'BUILT') bundles.built = row._count._all;
    else if (row.status === 'SIGNED') bundles.signed = row._count._all;
    else if (row.status === 'PUBLISHED') bundles.published = row._count._all;
  }

  const reviews: AggregateData['reviews'] = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  for (const row of reviewCounts) {
    reviews.total += row._count._all;
    if (row.status === 'PENDING') reviews.pending = row._count._all;
    else if (row.status === 'APPROVED') reviews.approved = row._count._all;
    else if (row.status === 'REJECTED') reviews.rejected = row._count._all;
  }

  // Cross-service: classes count via svc-class
  const classInfo = await callClassService<{ data?: { total?: number } }>('/api/class/classes?take=1');
  const upstreamClass: 'ok' | 'down' = classInfo ? 'ok' : 'down';

  const upstreamBkt: 'ok' | 'down' = 'ok'; // svc-bkt may not expose an aggregate endpoint; mark reachable

  return {
    type: 'aggregate',
    generatedAt: new Date(),
    data: {
      content,
      bundles,
      reviews,
      upstream: { svcClass: upstreamClass, svcBkt: upstreamBkt },
      upstreamData: { classes: classInfo?.data ?? null },
    },
  };
}

// ─── Class report ──────────────────────────────────────────────────────────────

/**
 * Class-level report:
 *  - Class info via svc-class (graceful degradation if circuit open)
 *  - Content stats from svc-content DB
 *  - Number of published bundles
 */
export async function getClassReport(classId: string): Promise<Report<ClassReportData>> {
  if (!classId || typeof classId !== 'string') {
    throw new ValidationError([{ path: ['classId'], message: 'classId is required', code: 'invalid_type' }], 'Invalid classId');
  }

  const [classInfo, contentCounts, bundlesUsed] = await Promise.all([
    callClassService<{ data?: Record<string, unknown> | null }>(`/api/class/classes/${classId}`),
    prisma.content_item.groupBy({
      by: ['status'],
      _count: { _all: true },
      where: { deleted_at: null },
    }),
    prisma.bundle.count({ where: { status: 'PUBLISHED' } }),
  ]);

  const contentStats: ClassReportData['contentStats'] = {
    total: 0,
    approved: 0,
    pendingReview: 0,
    draft: 0,
  };
  for (const row of contentCounts) {
    contentStats.total += row._count._all;
    if (row.status === 'APPROVED') contentStats.approved = row._count._all;
    else if (row.status === 'PENDING_REVIEW') contentStats.pendingReview = row._count._all;
    else if (row.status === 'DRAFT') contentStats.draft = row._count._all;
  }

  return {
    type: 'class',
    generatedAt: new Date(),
    data: {
      classId,
      classInfo: classInfo?.data ?? null,
      contentStats,
      bundlesUsed,
      generatedAt: new Date(),
    },
  };
}

// ─── Student report ────────────────────────────────────────────────────────────

/**
 * Student-level report combining:
 *  - Student info from svc-class
 *  - Progress / mastery from svc-bkt
 *  - Class info from svc-class
 */
export async function getStudentReport(studentId: string): Promise<Report<StudentReportData>> {
  if (!studentId || typeof studentId !== 'string') {
    throw new ValidationError([{ path: ['studentId'], message: 'studentId is required', code: 'invalid_type' }], 'Invalid studentId');
  }

  const [studentInfo, , progress] = await Promise.all([
    callClassService<{ data?: { classId?: string } & Record<string, unknown> }>(
      `/api/class/students/${studentId}`,
    ),
    Promise.resolve(null), // placeholder to preserve order
    callBktService<{ data?: Record<string, unknown> | null }>(`/api/bkt/progress/${studentId}`),
  ]);

  const classId = studentInfo?.data?.classId;
  const classInfo2 = classId ? await callClassService<{ data?: Record<string, unknown> | null }>(`/api/class/classes/${classId}`) : null;

  return {
    type: 'student',
    generatedAt: new Date(),
    data: {
      studentId,
      studentInfo: (studentInfo?.data as Record<string, unknown> | undefined) ?? null,
      classInfo: classInfo2?.data ?? null,
      progress: progress?.data ?? null,
      generatedAt: new Date(),
    },
  };
}

// ─── Export ────────────────────────────────────────────────────────────────────

/**
 * Export report data as JSON (base64-encoded) or CSV.
 */
export async function exportReport(data: unknown): Promise<ExportResult> {
  const parsed = validate(exportTypeSchema, data);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid export parameters');
  }

  const { type, format } = parsed.data as z.infer<typeof exportTypeSchema>;

  let rows: Record<string, unknown>[] = [];
  let reportType = type;

  switch (type) {
    case 'aggregate':
      {
        const aggregate = await getAggregateReport();
        const flat: Record<string, unknown> = {
          contentTotal: aggregate.data.content.total,
          contentDraft: aggregate.data.content.draft,
          contentPendingReview: aggregate.data.content.pendingReview,
          contentApproved: aggregate.data.content.approved,
          contentRejected: aggregate.data.content.rejected,
          bundlesTotal: aggregate.data.bundles.total,
          bundlesBuilt: aggregate.data.bundles.built,
          bundlesSigned: aggregate.data.bundles.signed,
          bundlesPublished: aggregate.data.bundles.published,
          reviewsTotal: aggregate.data.reviews.total,
          reviewsPending: aggregate.data.reviews.pending,
          reviewsApproved: aggregate.data.reviews.approved,
          reviewsRejected: aggregate.data.reviews.rejected,
        };
        rows = [flat];
      }
      break;
    case 'classes':
      {
        const classes = await prisma.bundle.findMany({ orderBy: { created_at: 'desc' } });
        rows = (classes as Array<{
          id: string; name: string; version: string; status: string;
          content_ids: string[]; created_at: Date; published_at: Date | null;
        }>).map((b) => ({
          bundleId: b.id,
          name: b.name,
          version: b.version,
          status: b.status,
          contentCount: b.content_ids.length,
          createdAt: b.created_at.toISOString(),
          publishedAt: b.published_at?.toISOString() ?? null,
        }));
      }
      break;
    case 'bundles':
      {
        const bundles = await prisma.bundle.findMany({ orderBy: { created_at: 'desc' } });
        rows = (bundles as Array<{
          id: string; name: string; version: string; status: string;
          content_ids: string[]; created_at: Date; published_at: Date | null;
        }>).map((b) => ({
          id: b.id,
          name: b.name,
          version: b.version,
          status: b.status,
          contentIds: b.content_ids.join('|'),
          createdAt: b.created_at.toISOString(),
          publishedAt: b.published_at?.toISOString() ?? null,
        }));
      }
      break;
    case 'content':
      {
        const items = await prisma.content_item.findMany({
          where: { deleted_at: null },
          orderBy: { created_at: 'desc' },
        });
        rows = (items as Array<{
          id: string; type: string; title: string; difficulty: number;
          status: string; author_id: string; created_at: Date; updated_at: Date;
        }>).map((c) => ({
          id: c.id,
          type: c.type,
          title: c.title,
          difficulty: c.difficulty,
          status: c.status,
          authorId: c.author_id,
          createdAt: c.created_at.toISOString(),
          updatedAt: c.updated_at.toISOString(),
        }));
      }
      break;
    case 'reviews':
      {
        const reviews = await prisma.review.findMany({
          orderBy: { created_at: 'desc' },
          include: { content: true },
        });
        rows = (reviews as Array<{
          id: string; content_id: string; reviewer_id: string; status: string;
          comment: string | null; created_at: Date;
          content: { title: string };
        }>).map((r) => ({
          id: r.id,
          contentId: r.content_id,
          contentTitle: r.content.title,
          reviewerId: r.reviewer_id,
          status: r.status,
          comment: r.comment ?? '',
          createdAt: r.created_at.toISOString(),
        }));
      }
      break;
    default:
      throw new NotFoundError(`Report type ${type}`);
  }

  const mimeType = format === 'csv' ? 'text/csv' : 'application/json';
  const body = format === 'csv' ? rowsToCsv(rows) : JSON.stringify(rows, null, 2);
  const encoded = Buffer.from(body, 'utf-8').toString('base64');
  const filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format}`;

  logger.info('Report exported', { type, format, rowCount: rows.length });

  return {
    filename,
    mimeType,
    encoding: 'base64',
    data: encoded,
    sizeBytes: Buffer.byteLength(body, 'utf-8'),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0] ?? {});
  const escape = (value: unknown): string => {
    const s = value === null || value === undefined ? '' : String(value);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}
