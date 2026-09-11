/**
 * Simple async handler wrapper for Express route handlers.
 *
 * Wraps an async route handler so that any rejected promise is forwarded
 * to Express's error middleware (next(err)) instead of being swallowed.
 *
 * This is a local copy to avoid version-compatibility issues between
 * the shared common-node package and the @types/express version in use.
 */
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export function asyncHandler<T extends RequestHandler>(fn: T): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
