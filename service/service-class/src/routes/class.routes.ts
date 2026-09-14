import { Router, Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '@verveai/error-types';
import { asyncHandler } from '@verveai/common-node';

import {
  listClasses,
  createClass,
  getClass,
  updateClass,
  deleteClass,
  getClassStats,
  getClassStudents,
  getClassStatsAdmin,
} from '../services/class.service.js';
import {
  createClassSchema,
  updateClassSchema,
  classIdSchema,
  paginationSchema
} from '../validators/class.validator.js';
import { extractInterServiceHeaders } from '../services/inter-service.js';

/**
 * Express middleware factory that validates a request section against a
 * Zod schema and replaces it with the parsed value (or sends 400). We
 * keep this local rather than reaching into @verveai/common-node because
 * the request signature differs slightly between services.
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
      // Express 5 typed query is read-only; cast through unknown.
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
 * GET /api/class/classes
 * List classes (optionally filtered by `teacherId` query param).
 */
router.get(
  '/',
  validate(paginationSchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as { teacherId?: string };
    const pagination = (req as Request & { query: unknown }).query as unknown as {
      skip: number;
      take: number;
    };
    const ctx = extractInterServiceHeaders(req);
    const page = await listClasses(query.teacherId, pagination, ctx);
    res.json({ success: true, data: page });
  })
);

/**
 * POST /api/class/classes
 * Create a new class for the authenticated teacher.
 * The teacherId is extracted from the JWT (x-user-id header) — never from the body.
 */
router.post(
  '/',
  validate(createClassSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string | undefined>;
    const actingUserId = headers['x-user-id'] ?? '';
    const ctx = extractInterServiceHeaders(req);
    const created = await createClass(req.body, actingUserId, ctx);
    res.status(201).json({ success: true, data: created });
  })
);

/* -------------------------------------------------------------------------- */
/*                                Single record                               */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/class/classes/:id
 */
router.get(
  '/:id',
  validate(classIdSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const detail = await getClass(req.params['id'] as string);
    res.json({ success: true, data: detail });
  })
);

/**
 * PUT /api/class/classes/:id
 */
router.put(
  '/:id',
  validate(classIdSchema, 'params'),
  validate(updateClassSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string | undefined>;
    const actingUserId = headers['x-user-id'] ?? '';
    const actingUserRole = headers['x-user-role'] ?? '';
    const ctx = extractInterServiceHeaders(req);
    const updated = await updateClass(
      req.params['id'] as string,
      req.body,
      actingUserId,
      actingUserRole,
      ctx
    );
    res.json({ success: true, data: updated });
  })
);

/**
 * DELETE /api/class/classes/:id
 */
router.delete(
  '/:id',
  validate(classIdSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string | undefined>;
    const actingUserId = headers['x-user-id'] ?? '';
    const actingUserRole = headers['x-user-role'] ?? '';
    await deleteClass(req.params['id'] as string, actingUserId, actingUserRole);
    res.status(204).send();
  })
);

/* -------------------------------------------------------------------------- */
/*                                  Stats                                     */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/class/classes/:id/stats
 */
router.get(
  '/:id/stats',
  validate(classIdSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const ctx = extractInterServiceHeaders(req);
    const stats = await getClassStats(req.params['id'] as string, ctx);
    res.json({ success: true, data: stats });
  })
);

/**
 * GET /api/class/classes/:id/students
 * Roster for the class — list of students currently enrolled.
 *
 * Ownership: only the owning teacher or an admin may list students.
 * Returns the `{ success, data: ClassStudentEntry[] }` envelope consumed
 * by the teacher UI's class detail page.
 */
router.get(
  '/:id/students',
  validate(classIdSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string | undefined>;
    const actingUserId = headers['x-user-id'] ?? '';
    const actingUserRole = headers['x-user-role'] ?? '';
    const roster = await getClassStudents(
      req.params['id'] as string,
      actingUserId,
      actingUserRole
    );
    res.json({ success: true, data: roster });
  })
);

/* -------------------------------------------------------------------------- */
/*                             Admin Stats                                      */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/class/admin/stats
 * Admin-only endpoint to get overall class statistics.
 */
router.get(
  '/admin/stats',
  asyncHandler(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string | undefined>;
    const actingUserRole = headers['x-user-role'] ?? '';

    if (actingUserRole !== 'ADMIN') {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      });
      return;
    }

    const stats = await getClassStatsAdmin();
    res.json({ success: true, data: stats });
  })
);

export default router;
