import type { Request, Response, NextFunction } from 'express';
import { DomainError, ValidationError, NotFoundError, AuthError } from '@verveai/error-types';
import { logger } from '../utils/logger.js';
import { metricsRegistry } from './metricsRegistry.js';
import { ForbiddenError } from '../errors.js';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const labels = {
    method: req.method || 'UNKNOWN',
    route: req.route?.path || req.path || 'UNKNOWN',
    status: '500'
  };

  metricsRegistry.httpRequestsTotal.inc({ ...labels, status: '500' });

  if (error instanceof ValidationError) {
    labels.status = '400';
    metricsRegistry.httpRequestsTotal.inc(labels);
    res.status(400).json({
      success: false,
      data: null,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
    return;
  }

  if (error instanceof NotFoundError) {
    labels.status = '404';
    metricsRegistry.httpRequestsTotal.inc(labels);
    res.status(404).json({
      success: false,
      data: null,
      error: {
        code: error.code,
        message: error.message
      }
    });
    return;
  }

  if (error instanceof AuthError) {
    labels.status = '401';
    metricsRegistry.httpRequestsTotal.inc(labels);
    res.status(401).json({
      success: false,
      data: null,
      error: {
        code: error.code,
        message: error.message
      }
    });
    return;
  }

  if (error instanceof ForbiddenError) {
    labels.status = '403';
    metricsRegistry.httpRequestsTotal.inc(labels);
    res.status(403).json({
      success: false,
      data: null,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
    return;
  }

  if (error instanceof DomainError) {
    const status = error.httpStatus ?? 400;
    labels.status = String(status);
    metricsRegistry.httpRequestsTotal.inc(labels);
    res.status(status).json({
      success: false,
      data: null,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
    return;
  }

  logger.error('Unhandled error', { error, path: req.path, method: req.method });
  res.status(500).json({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}
