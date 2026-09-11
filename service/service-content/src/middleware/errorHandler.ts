import { DomainError, ValidationError, NotFoundError, AuthError } from '@verveai/error-types';
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { metricsRegistry } from './metricsRegistry.js';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const labels = {
    method: req.method || 'UNKNOWN',
    route: req.path || 'UNKNOWN',
    status: '500'
  };

  // Always increment the 500 bucket first so the counter histogram reflects the
  // initial assumption; we'll bump the right status bucket below.
  metricsRegistry.httpRequestsTotal.inc({ ...labels, status: '500' });

  if (error instanceof ValidationError) {
    metricsRegistry.httpRequestsTotal.inc({ ...labels, status: '400' });
    res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: error.details
      }
    });
    return;
  }

  if (error instanceof NotFoundError) {
    metricsRegistry.httpRequestsTotal.inc({ ...labels, status: '404' });
    res.status(404).json({
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: error.message
      }
    });
    return;
  }

  if (error instanceof AuthError) {
    metricsRegistry.httpRequestsTotal.inc({ ...labels, status: '401' });
    res.status(401).json({
      success: false,
      data: null,
      error: {
        code: 'UNAUTHORIZED',
        message: error.message
      }
    });
    return;
  }

  if (error instanceof DomainError) {
    const status = String(error.httpStatus ?? 400);
    metricsRegistry.httpRequestsTotal.inc({ ...labels, status });
    res.status(error.httpStatus ?? 400).json({
      success: false,
      data: null,
      error: {
        code: error.code,
        message: error.message
      }
    });
    return;
  }

  logger.error('Unhandled error', { error });
  res.status(500).json({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}
