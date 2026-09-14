import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wrap an async route handler to forward errors to errorHandler.
 * Without this, async errors are swallowed by Express.
 */
export function asyncHandler<T extends RequestHandler>(fn: T): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
