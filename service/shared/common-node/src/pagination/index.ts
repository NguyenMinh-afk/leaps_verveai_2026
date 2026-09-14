/**
 * Pagination — Prisma-compatible cursor & offset pagination helpers.
 *
 * Usage:
 *   import { paginate, parsePagination, buildPrismaCursor, buildPrismaOffset } from '@verveai/common-node';
 *
 *   const { page, pageSize } = parsePagination(req.query);
 *   const skip = buildPrismaOffset(page, pageSize);
 *
 *   const [items, total] = await Promise.all([
 *     prisma.user.findMany({ skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
 *     prisma.user.count(),
 *   ]);
 *
 *   return paginate(items, page, pageSize, total);
 *
 * @module pagination
 */

/**
 * Build Prisma `skip` value from page (1-based) and pageSize.
 */
export function buildPrismaOffset(page: number, pageSize: number): number {
  return (Math.max(1, page) - 1) * Math.min(Math.max(1, pageSize), 100);
}

/**
 * Build Prisma `take` value from pageSize, capped at MAX_PAGE_SIZE.
 */
export function buildPrismaTake(pageSize: number, maxPageSize = 100): number {
  return Math.min(Math.max(1, pageSize), maxPageSize);
}

/**
 * Build a cursor string from a record's primary key value.
 * Use for cursor-based pagination.
 */
export function buildCursor(id: string): string {
  return Buffer.from(String(id)).toString('base64url');
}

/**
 * Parse a cursor string back to the original ID.
 */
export function parseCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64url').toString('utf-8');
}

/**
 * Build Prisma `cursor` and `skip` for cursor-based pagination.
 * @param cursor  The cursor string from the previous page's last item.
 * @param pageSize
 */
export function buildPrismaCursor(
  cursor: string | undefined,
  _pageSize: number,
): { cursor?: { id: string }; skip?: number } {
  if (!cursor) return { skip: 0 };
  return { cursor: { id: parseCursor(cursor) }, skip: 1 };
}

/**
 * Pagination metadata for list responses.
 */
export interface PaginationResult {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

/**
 * Compute pagination metadata from raw values.
 */
export function computePagination(
  page: number,
  pageSize: number,
  total: number,
  lastItemId?: string,
): PaginationResult {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    nextCursor: lastItemId && page < totalPages ? buildCursor(lastItemId) : undefined,
    prevCursor: lastItemId && page > 1 ? buildCursor(lastItemId) : undefined,
  };
}
