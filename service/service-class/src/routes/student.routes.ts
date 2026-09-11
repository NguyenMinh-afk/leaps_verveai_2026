import { Router, Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '@verveai/error-types';
import { asyncHandler } from '@verveai/common-node';

import {
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentEvidence,
  getStudentDiagnosis
} from '../services/student.service.js';
import {
  createStudentSchema,
  updateStudentSchema,
  studentIdSchema
} from '../validators/student.validator.js';
import { extractInterServiceHeaders } from '../services/inter-service.js';

/**
 * Local Zod validator middleware. Mirrors the one in `class.routes.ts`
 * because keeping each route self-contained makes the bundle easier to
 * reason about and avoids a circular import through the shared package.
 */
function validate(schema: ZodSchema, source: 'body' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const raw = source === 'body' ? req.body : req.params;
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
    } else {
      (req as Request & { params: unknown }).params = result.data;
    }
    next();
  };
}

const router: Router = Router();

/**
 * POST /api/class/students
 * Create a new student row.
 */
router.post(
  '/',
  validate(createStudentSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const created = await createStudent(req.body);
    res.status(201).json({ success: true, data: created });
  })
);

/**
 * GET /api/class/students/:id
 */
router.get(
  '/:id',
  validate(studentIdSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const detail = await getStudent(req.params['id'] as string);
    res.json({ success: true, data: detail });
  })
);

/**
 * PUT /api/class/students/:id
 */
router.put(
  '/:id',
  validate(studentIdSchema, 'params'),
  validate(updateStudentSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await updateStudent(req.params['id'] as string, req.body);
    res.json({ success: true, data: updated });
  })
);

/**
 * DELETE /api/class/students/:id
 */
router.delete(
  '/:id',
  validate(studentIdSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    await deleteStudent(req.params['id'] as string);
    res.status(204).send();
  })
);

/**
 * GET /api/class/students/:id/evidence
 * Cross-service proxy through svc-bkt.
 */
router.get(
  '/:id/evidence',
  validate(studentIdSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const ctx = extractInterServiceHeaders(req);
    const evidence = await getStudentEvidence(
      req.params['id'] as string,
      ctx
    );
    res.json({ success: true, data: evidence });
  })
);

/**
 * GET /api/class/students/:id/diagnosis
 */
router.get(
  '/:id/diagnosis',
  validate(studentIdSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const ctx = extractInterServiceHeaders(req);
    const diagnosis = await getStudentDiagnosis(
      req.params['id'] as string,
      ctx
    );
    res.json({ success: true, data: diagnosis });
  })
);

export default router;
