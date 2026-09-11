/**
 * Express error handler middleware for svc-bkt.
 *
 * Converts DomainError subclasses → appropriate HTTP status + JSON body.
 * Logs unexpected errors and always returns a structured error response.
 */

import type { Request, Response, NextFunction } from 'express';
import {
  DomainError,
  ValidationError,
  NotFoundError,
  AuthError,
  ConflictError,
} from '@verveai/error-types';
import { logger } from '../utils/logger.js';
import { metricsRegistry } from './metricsRegistry.js';

/**
 * Express error handler for svc-bkt.
 * Converts DomainError subclasses → appropriate HTTP status + JSON body.
 * Logs unexpected errors and always returns a structured error response.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const labels = {
    method: req.method ?? 'UNKNOWN',
    route: req.route?.path ?? req.path ?? 'UNKNOWN',
    status: '500',
  };

  if (err instanceof ValidationError) {
    labels.status = '400';
    metricsRegistry.httpRequestsTotal.inc({ ...labels });
    res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.issues,
      },
    });
    return;
  }

  if (err instanceof NotFoundError) {
    labels.status = '404';
    metricsRegistry.httpRequestsTotal.inc({ ...labels });
    res.status(404).json({
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: err.message,
      },
    });
    return;
  }

  if (err instanceof AuthError) {
    labels.status = '401';
    metricsRegistry.httpRequestsTotal.inc({ ...labels });
    res.status(401).json({
      success: false,
      data: null,
      error: {
        code: 'UNAUTHORIZED',
        message: err.message,
      },
    });
    return;
  }

  if (err instanceof ConflictError) {
    labels.status = '409';
    metricsRegistry.httpRequestsTotal.inc({ ...labels });
    res.status(409).json({
      success: false,
      data: null,
      error: {
        code: 'CONFLICT',
        message: err.message,
      },
    });
    return;
  }

  if (err instanceof DomainError) {
    labels.status = String(err.httpStatus ?? 400);
    metricsRegistry.httpRequestsTotal.inc({ ...labels });
    res.status(err.httpStatus ?? 400).json({
      success: false,
      data: null,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Unexpected — log full stack
  logger.error('Unhandled error', { err, path: req.path, method: req.method });
  res.status(500).json({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
