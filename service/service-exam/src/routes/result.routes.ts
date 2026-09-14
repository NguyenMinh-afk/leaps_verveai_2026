/**
 * Result Routes for service-exam
 * Handles exam results, grading, and statistics
 */

import { Router, Request } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as resultService from '../services/result.service.js';

const router: Router = Router();

/**
 * GET /results/:attemptId
 * Get result for a specific attempt (student or teacher)
 */
router.get(
  '/results/:attemptId',
  asyncHandler(async (req: Request, res) => {
    const userId = req.headers['x-user-id'] as string;
    const userRole = req.headers['x-user-role'] as string;
    const result = await resultService.getAttemptResult(
      req.params['attemptId'],
      userId,
      userRole
    );
    res.json({ success: true, data: result });
  })
);

/**
 * GET /history
 * Get student's exam history
 */
router.get(
  '/history',
  asyncHandler(async (req: Request, res) => {
    const studentId = req.headers['x-user-id'] as string;
    const { skip = 0, take = 20 } = req.query as Record<string, string>;
    const history = await resultService.getStudentExamHistory(studentId, {
      skip: Number(skip),
      take: Number(take),
    });
    res.json({ success: true, data: history });
  })
);

/**
 * GET /exams/:examId/results
 * Get all results for an exam (teacher view)
 */
router.get(
  '/exams/:examId/results',
  asyncHandler(async (req: Request, res) => {
    const { skip = 0, take = 20 } = req.query as Record<string, string>;
    const results = await resultService.getExamResults(req.params['examId'], {
      skip: Number(skip),
      take: Number(take),
    });
    res.json({ success: true, data: results });
  })
);

/**
 * GET /exams/:examId/results/summary
 * Get summary statistics for an exam
 */
router.get(
  '/exams/:examId/results/summary',
  asyncHandler(async (req: Request, res) => {
    const summary = await resultService.getExamResultsSummary(req.params['examId']);
    res.json({ success: true, data: summary });
  })
);

/**
 * POST /exams/:examId/results/:attemptId/grade
 * Grade an attempt (teacher)
 */
router.post(
  '/exams/:examId/results/:attemptId/grade',
  asyncHandler(async (req: Request, res) => {
    const teacherId = req.headers['x-user-id'] as string;
    const teacherRole = req.headers['x-user-role'] as string;
    const { grades, totalScore } = req.body;
    const result = await resultService.gradeAttempt(
      req.params['examId'],
      req.params['attemptId'],
      grades,
      totalScore,
      teacherId,
      teacherRole
    );
    res.json({ success: true, data: result });
  })
);

/**
 * GET /grading/pending
 * Get pending grading items for a teacher
 */
router.get(
  '/grading/pending',
  asyncHandler(async (req: Request, res) => {
    const teacherId = req.headers['x-user-id'] as string;
    const { skip = 0, take = 20 } = req.query as Record<string, string>;
    const pending = await resultService.getPendingGrading(teacherId, {
      skip: Number(skip),
      take: Number(take),
    });
    res.json({ success: true, data: pending });
  })
);

/**
 * POST /grading/manual
 * Manual grading endpoint (alias for gradeAttempt)
 */
router.post(
  '/grading/manual',
  asyncHandler(async (req: Request, res) => {
    const teacherId = req.headers['x-user-id'] as string;
    const teacherRole = req.headers['x-user-role'] as string;
    const { examId, attemptId, grades, totalScore } = req.body;
    const result = await resultService.gradeAttempt(
      examId,
      attemptId,
      grades,
      totalScore,
      teacherId,
      teacherRole
    );
    res.json({ success: true, data: result });
  })
);

export default router;
