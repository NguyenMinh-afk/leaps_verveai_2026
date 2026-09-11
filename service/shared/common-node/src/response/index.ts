/**
 * Response helpers — standardized API response shape.
 *
 * All responses follow:
 *   { success: true, data: T, error: null }
 *   { success: false, data: null, error: { code, message, details? } }
 *
 * Usage:
 *   import { success, error, paginate } from '@verveai/common-node';
 *   res.json(success({ user }));
 *   res.status(201).json(success({ id: '123' }));
 *   res.status(400).json(error('VALIDATION_FAILED', 'Email is required'));
 *
 * @module response
 */

export interface ErrorDetail {
  path?: string;
  message: string;
  code?: string;
}

export interface ErrorPayload {
  code: string;
  message: string;
  details?: ErrorDetail[];
}

export interface ResponseSuccess<T = unknown> {
  success: true;
  data: T;
  error: null;
}

export interface ResponseError {
  success: false;
  data: null;
  error: ErrorPayload;
}

export type ApiResponse<T = unknown> = ResponseSuccess<T> | ResponseError;

/**
 * Build a successful response.
 */
export function success<T>(data: T): ResponseSuccess<T> {
  return { success: true, data, error: null };
}

/**
 * Build an error response.
 */
export function error(
  code: string,
  message: string,
  details?: ErrorDetail[],
): ResponseError {
  return {
    success: false,
    data: null,
    error: { code, message, details },
  };
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ResponseSuccess<T[]> {
  meta: PaginationMeta;
}

/**
 * Build a paginated response.
 * @param items   Current page items.
 * @param page    1-based page number.
 * @param pageSize Items per page.
 * @param total   Total item count.
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
  total: number,
): PaginatedResponse<T> {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    success: true,
    data: items,
    error: null,
    meta: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext,
      hasPrev,
    },
  };
}

/**
 * Parse pagination params from Express query string.
 * Defaults: page=1, pageSize=20, maxPageSize=100.
 */
export function parsePagination(query: Record<string, unknown>): {
  page: number;
  pageSize: number;
} {
  const rawPage = parseInt(String(query['page'] ?? '1'), 10);
  const rawSize = parseInt(String(query['pageSize'] ?? '20'), 10);

  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const pageSize = isNaN(rawSize) || rawSize < 1 ? 20 : Math.min(rawSize, 100);

  return { page, pageSize };
}
