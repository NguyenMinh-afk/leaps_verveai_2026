import { Router, Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '@verveai/error-types';
import { asyncHandler } from '@verveai/common-node';

import {
  getStudentProgress,
  getProgressHistory,
  getStudentSkills,
  updateProgress
} from '../services/progress.service.js';
import {
  studentIdParamSchema,
  updateProgressSchema,
  progressHistorySchema,
  progressPaginationSchema
} from '../validators/progress.validator.js';

/**
 * Local Zod validator middleware — same pattern as the class routes.
 */
function validate<T>(
  schema: ZodSchema,
  source: 'body' | 'query' | 'params'
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const raw =
      source === 'body' ? req.body : source === 'query' ? req.query : req.params;
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
/*                     More-specific routes first (order matters!)               */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/class/progress/:studentId/history?skillId=&days=
 * Synthetic time-series for a specific skill.
 * MUST be registered BEFORE /:studentId otherwise "history" gets matched as
 * a studentId value.
 */
router.get(
  '/:studentId/history',
  validate(studentIdParamSchema, 'params'),
  validate(progressHistorySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.params as unknown as { studentId: string };
    const query = req.query as unknown as { skillId: string; days: number };
    const history = await getProgressHistory(
      params.studentId,
      query.skillId,
      query.days
    );
    res.json({ success: true, data: history });
  })
);

/**
 * GET /api/class/progress/:studentId/skills
 * All skills for a student with derived mastery status.
 */
router.get(
  '/:studentId/skills',
  validate(studentIdParamSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.params as unknown as { studentId: string };
    const skills = await getStudentSkills(params.studentId);
    res.json({ success: true, data: skills });
  })
);

/* -------------------------------------------------------------------------- */
/*                              Progress CRUD                                   */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/class/progress/:studentId?skip=&take=
 * Paginated skill progress list for a student.
 */
router.get(
  '/:studentId',
  validate(studentIdParamSchema, 'params'),
  validate(progressPaginationSchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.params as unknown as { studentId: string };
    const query = req.query as unknown as { skip: number; take: number };
    const page = await getStudentProgress(params.studentId, query);
    res.json({ success: true, data: page });
  })
);

/**
 * POST /api/class/progress/:studentId
 * Upsert a skill progress row for a student.
 */
router.post(
  '/:studentId',
  validate(studentIdParamSchema, 'params'),
  validate(updateProgressSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.params as unknown as { studentId: string };
    const body = req.body as { skillId: string; pKnown: number };
    const updated = await updateProgress(params.studentId, body.skillId, body.pKnown);
    res.json({ success: true, data: updated });
  })
);

export default router;
