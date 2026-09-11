/**
 * Request validation middleware — wraps Zod schemas.
 *
 * Usage:
 *   router.post('/login', validateBody(LoginSchema), asyncHandler(handler));
 *   router.get('/:id', validateParams(IdSchema), asyncHandler(handler));
 */

import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '@verveai/error-types';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = (result.error as ZodError).issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
      }));
      next(new ValidationError(issues));
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const issues = (result.error as ZodError).issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
      }));
      next(new ValidationError(issues));
      return;
    }
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const issues = (result.error as ZodError).issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
      }));
      next(new ValidationError(issues));
      return;
    }
    req.query = result.data as typeof req.query;
    next();
  };
}
