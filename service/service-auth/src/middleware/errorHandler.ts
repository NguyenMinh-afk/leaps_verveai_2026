import type { Request, Response, NextFunction } from 'express';
import { DomainError } from '@verveai/error-types';
import { logger } from '../utils/logger';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof DomainError) {
    logger.warn('Domain error', { code: err.code, message: err.message, path: req.path });
    res.status(err.httpStatus).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  logger.error('Unhandled error', { error: err.message, stack: err.stack, path: req.path });
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL',
      message: process.env['NODE_ENV'] === 'production' ? 'Internal server error' : err.message,
    },
  });
}
