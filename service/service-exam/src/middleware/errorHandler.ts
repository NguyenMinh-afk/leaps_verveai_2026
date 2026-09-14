/**
 * Error handler middleware for service-exam.
 */

import type { Request, Response, NextFunction } from 'express';
import { DomainError } from '@verveai/error-types';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof DomainError) {
    res.status(err.httpStatus).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  const errorMessage = err instanceof Error ? err.message : 'Internal server error';
  console.error('Request error:', errorMessage, { path: req.path, method: req.method });
  logger.error('Request error: %s', errorMessage, { path: req.path, method: req.method, err });

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL',
      message: process.env['NODE_ENV'] === 'production' ? 'Internal server error' : errorMessage,
    },
  });
}
