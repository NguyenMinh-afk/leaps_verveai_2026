/**
 * Common Express middleware — error-handler, validate, async-handler, request-id, not-found.
 *
 * Usage:
 *   import {
 *     errorHandler,
 *     validateMiddleware,
 *     asyncHandler,
 *     requestIdMiddleware,
 *     notFoundHandler,
 *   } from '@verveai/common-node';
 *
 *   router.post('/login', validateMiddleware(LoginSchema), asyncHandler(authController.login));
 *   app.use(requestIdMiddleware);
 *   app.use(errorHandler);
 *
 * @module middleware
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { errorToResponse, DomainError, ErrorCode } from '../error';
import { logger } from '../logger';

// ─── Error Handler ─────────────────────────────────────────────────────────────

/**
 * Global error handler — MUST be registered LAST (after all routes).
 * Converts DomainError, ZodError, generic Error → JSON API response.
 * Logs all errors with trace info.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/noUnused-vars
  _next: NextFunction,
): void {
  const requestId = req.headers['x-request-id'] as string | undefined;

  // DomainError → already logged, just respond
  if (err instanceof DomainError) {
    res.status(err.httpStatus ?? 500).json(errorToResponse(err));
    return;
  }

  // Unexpected — log error
  const msg = err instanceof Error ? err.message : String(err);
  logger.error({ err, requestId, path: req.path, method: req.method }, msg);

  res.status(500).json(
    errorToResponse(
      process.env['NODE_ENV'] === 'production'
        ? new Error('Internal server error')
        : new Error(msg),
    ),
  );
}

// ─── Validate Middleware ───────────────────────────────────────────────────────

/**
 * Validate request body/query/params against a Zod schema.
 * Throws ValidationError (400) on failure.
 */
export function validateMiddleware<T extends ZodType>(
  schema: T,
  source: 'body' | 'query' | 'params' = 'body',
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;

    // Lazy import to avoid circular
    const { validate } = require('../validation');
    const result = validate(schema, data);

    if (!result.ok) {
      const { ValidationError } = require('../error');
      next(new ValidationError(result.error.issues));
      return;
    }

    // Replace with parsed & typed data
    if (source === 'body') req.body = result.data;
    else if (source === 'query') (req as Request & { query: unknown }).query = result.data;

    next();
  };
}

// ─── Async Handler ─────────────────────────────────────────────────────────────

/**
 * Wrap an async route handler to forward errors to errorHandler.
 * Without this, async errors are swallowed by Express.
 */
export function asyncHandler<T extends RequestHandler>(fn: T): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// ─── Request ID ────────────────────────────────────────────────────────────────

/**
 * Middleware that reads or generates a x-request-id header.
 * Attaches to req.requestId for logging correlation.
 */
export function requestIdMiddleware(
  req: Request & { requestId?: string },
  res: Response,
  next: NextFunction,
): void {
  const id = (req.headers['x-request-id'] as string | undefined) ?? generateId();
  req.requestId = id;
  res.setHeader('x-request-id', id);
  next();
}

// ─── Not Found ────────────────────────────────────────────────────────────────

/**
 * Handler for unmatched routes — returns 404.
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/noUnused-vars
  _next: NextFunction,
): void {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      code: ErrorCode.NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

/**
 * Middleware that logs every request (access log).
 * Attach after requestIdMiddleware.
 */
export function auditMiddleware(
  req: Request & { requestId?: string },
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'error' : 'info';
    logger[level]({
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
    });
  });

  next();
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
