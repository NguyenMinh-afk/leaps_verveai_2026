import { Router, Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '@verveai/error-types';
import { asyncHandler } from '../middleware/asyncHandler.js';

import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignment,
  listAssignments,
  listStudentAssignments
} from '../services/assignment.service.js';
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  assignmentIdSchema,
  paginationSchema,
  listAssignmentsQuerySchema
} from '../validators/assignment.validator.js';

/**
 * Express middleware factory that validates a request section against a
 * Zod schema and replaces it with the parsed value (or sends 400).
 */
function validate<T>(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const raw = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
    const result = schema.safeParse(raw);
    if (!result.success) {
      const issues = result.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
        code: issue.code
      }));
      next(new ValidationError(issues));
      return;
    }
    if (source === 'body') {
      req.body = result.data;
    } else if (source === 'query') {
      (req as Request & { query: unknown }).query = result.data;
    } else {
      (req as Request & { params: unknown }).params = result.data;
    }
    next();
  };
}

const router: Router = Router();

/* -------------------------------------------------------------------------- */
/*                                 List / Create                              */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/assignment
 * List assignments with optional filters.
 */
router.get(
  '/',
  validate(listAssignmentsQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string | undefined>;
    const actingUserId = headers['x-user-id'] ?? '';
    const actingUserRole = headers['x-user-role'] ?? '';
    
    const query = (req as Request & { query: unknown }).query as unknown as {
      skip: number;
      take: number;
      teacherId?: string;
      classId?: string;
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    };
    
    const pagination = { skip: query.skip, take: query.take };
    const filters = {
      teacherId: query.teacherId,
      classId: query.classId,
      status: query.status
    };

    const page = await listAssignments(filters, pagination, actingUserId, actingUserRole);
    res.json({ success: true, data: page });
  })
);

/**
 * POST /api/assignment
 * Create a new assignment.
 */
router.post(
  '/',
  validate(createAssignmentSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string | undefined>;
    const actingUserId = headers['x-user-id'] ?? '';
    const actingUserRole = headers['x-user-role'] ?? '';

    const created = await createAssignment(req.body, actingUserId, actingUserRole);
    res.status(201).json({ success: true, data: created });
  })
);

/* -------------------------------------------------------------------------- */
/*                                Single record                               */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/assignment/:id
 */
router.get(
  '/:id',
  validate(assignmentIdSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string | undefined>;
    const actingUserId = headers['x-user-id'] ?? '';
    const actingUserRole = headers['x-user-role'] ?? '';

    const assignment = await getAssignment(req.params['id'] as string, actingUserId, actingUserRole);
    res.json({ success: true, data: assignment });
  })
);

/**
 * PUT /api/assignment/:id
 */
router.put(
  '/:id',
  validate(assignmentIdSchema, 'params'),
  validate(updateAssignmentSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string | undefined>;
    const actingUserId = headers['x-user-id'] ?? '';
    const actingUserRole = headers['x-user-role'] ?? '';

    const updated = await updateAssignment(
      req.params['id'] as string,
      req.body,
      actingUserId,
      actingUserRole
    );
    res.json({ success: true, data: updated });
  })
);

/**
 * DELETE /api/assignment/:id
 */
router.delete(
  '/:id',
  validate(assignmentIdSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string | undefined>;
    const actingUserId = headers['x-user-id'] ?? '';
    const actingUserRole = headers['x-user-role'] ?? '';

    await deleteAssignment(req.params['id'] as string, actingUserId, actingUserRole);
    res.status(204).send();
  })
);

/* -------------------------------------------------------------------------- */
/*                             Student routes                                 */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/assignment/student
 * List assignments for the current student based on enrollments.
 */
router.get(
  '/student',
  validate(paginationSchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string | undefined>;
    const actingUserId = headers['x-user-id'] ?? '';
    const actingUserRole = headers['x-user-role'] ?? '';

    // Only students can use this endpoint
    if (actingUserRole !== 'STUDENT') {
      res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN_ROLE',
          message: 'Only students can list their assignments'
        }
      });
      return;
    }

    const query = (req as Request & { query: unknown }).query as unknown as {
      skip: number;
      take: number;
    };

    const page = await listStudentAssignments(actingUserId, query);
    res.json({ success: true, data: page });
  })
);

export default router;
