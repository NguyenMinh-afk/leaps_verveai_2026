/**
 * Express error handler middleware for service-ai.
 * Maps domain errors to HTTP responses and logs safely.
 */

import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { AIError, AIErrorCode } from '../types/errors.js';
import { DomainError } from '@verveai/error-types';

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error safely (never log sensitive data)
  const requestId = _req.headers['x-request-id'] ?? 'unknown';

  if (err instanceof AIError) {
    const status = aiErrorToHttpStatus(err.code);
    logger.warn(`AI Error: ${err.code}`, {
      requestId,
      code: err.code,
      message: err.message,
    });

    const response: ErrorResponse = {
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    res.status(status).json(response);
    return;
  }

  if (err instanceof DomainError) {
    const status = domainErrorToHttpStatus(err);
    logger.warn(`Domain Error: ${err.name}`, {
      requestId,
      name: err.name,
      message: err.message,
    });

    const response: ErrorResponse = {
      error: {
        code: err.name,
        message: err.message,
        details: err.details,
      },
    };
    res.status(status).json(response);
    return;
  }

  // Unknown error — log full detail for debugging but return safe response
  logger.error('Unhandled error', {
    requestId,
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });

  const response: ErrorResponse = {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  };
  res.status(500).json(response);
}

function aiErrorToHttpStatus(code: AIErrorCode): number {
  switch (code) {
    case AIErrorCode.AI_INVALID_INPUT:
    case AIErrorCode.AI_REQUEST_TOO_LARGE:
    case AIErrorCode.AI_INVALID_RESPONSE:
      return 400;
    case AIErrorCode.AI_PROVIDER_NOT_CONFIGURED:
    case AIErrorCode.AI_CONFIGURATION_ERROR:
      return 500;
    case AIErrorCode.AI_PROVIDER_UNAVAILABLE:
      return 503;
    case AIErrorCode.AI_TIMEOUT:
      return 504;
    case AIErrorCode.AI_RATE_LIMITED:
      return 429;
    case AIErrorCode.AI_CONTENT_FILTERED:
      return 422;
    default:
      return 500;
  }
}

function domainErrorToHttpStatus(err: DomainError): number {
  if ('status' in err && typeof (err as unknown as { status: number }).status === 'number') {
    return (err as unknown as { status: number }).status;
  }
  if (err.name === 'ValidationError') return 400;
  if (err.name === 'NotFoundError') return 404;
  if (err.name === 'ConflictError') return 409;
  if (err.name === 'AuthError') return 401;
  if (err.name === 'ForbiddenError') return 403;
  return 500;
}
