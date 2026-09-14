/**
 * Exam Routes for service-exam
 */

import { Router, Request } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as examService from '../services/exam.service.js';

const router: Router = Router();

/* ─────────────────────────── Exam CRUD ─────────────────────────── */

router.get('/', asyncHandler(async (req: Request, res) => {
  const { teacherId, classId, status, skip = 0, take = 20 } = req.query as Record<string, string>;
  const page = await examService.listExams(
    { teacherId, classId, status: status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | undefined },
    { skip: Number(skip), take: Number(take) }
  );
  res.json({ success: true, data: page });
}));

router.post('/', asyncHandler(async (req: Request, res) => {
  const teacherId = req.headers['x-user-id'] as string;
  const exam = await examService.createExam(req.body, teacherId);
  res.status(201).json({ success: true, data: exam });
}));

router.get('/:id', asyncHandler(async (req: Request, res) => {
  const exam = await examService.getExam(req.params['id']);
  res.json({ success: true, data: exam });
}));

router.put('/:id', asyncHandler(async (req: Request, res) => {
  const teacherId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const exam = await examService.updateExam(req.params['id'], req.body, teacherId, userRole);
  res.json({ success: true, data: exam });
}));

router.delete('/:id', asyncHandler(async (req: Request, res) => {
  const teacherId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  await examService.deleteExam(req.params['id'], teacherId, userRole);
  res.status(204).send();
}));

/* ─────────────────────────── Questions ─────────────────────────── */

router.get('/:id/questions', asyncHandler(async (req: Request, res) => {
  const questions = await examService.getExamQuestions(req.params['id']);
  res.json({ success: true, data: { questions } });
}));

router.post('/:id/questions', asyncHandler(async (req: Request, res) => {
  const teacherId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const { questionIds } = req.body;
  await examService.addExamQuestions(req.params['id'], questionIds, teacherId, userRole);
  res.status(201).json({ success: true, data: { message: 'Questions added' } });
}));

/* ─────────────────────────── Attempts ─────────────────────────── */

router.post('/:id/start', asyncHandler(async (req: Request, res) => {
  const studentId = req.headers['x-user-id'] as string;
  const attempt = await examService.startAttempt(req.params['id'], studentId);
  res.status(201).json({ success: true, data: attempt });
}));

router.get('/attempt/:attemptId', asyncHandler(async (req: Request, res) => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const attempt = await examService.getAttempt(req.params['attemptId'], userId, userRole);
  res.json({ success: true, data: attempt });
}));

router.post('/attempt/:attemptId/submit', asyncHandler(async (req: Request, res) => {
  const studentId = req.headers['x-user-id'] as string;
  const { answers } = req.body;
  const attempt = await examService.submitAttempt(req.params['attemptId'], answers, studentId);
  res.json({ success: true, data: attempt });
}));

router.get('/student/attempts', asyncHandler(async (req: Request, res) => {
  const studentId = req.headers['x-user-id'] as string;
  const { skip = 0, take = 20 } = req.query as Record<string, string>;
  const page = await examService.getStudentAttempts(studentId, { skip: Number(skip), take: Number(take) });
  res.json({ success: true, data: page });
}));

/* ─────────────────────────── Results ─────────────────────────── */

router.post('/:id/grade/:attemptId', asyncHandler(async (req: Request, res) => {
  const teacherId = req.headers['x-user-id'] as string;
  const { gradingRules } = req.body;
  const attempt = await examService.gradeAttempt(req.params['attemptId'], gradingRules, teacherId);
  res.json({ success: true, data: attempt });
}));

router.get('/:id/results', asyncHandler(async (req: Request, res) => {
  const teacherId = req.headers['x-user-id'] as string;
  const results = await examService.getExamResults(req.params['id'], teacherId);
  res.json({ success: true, data: results });
}));

router.get('/attempt/:attemptId/results', asyncHandler(async (req: Request, res) => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const results = await examService.getAttemptResults(req.params['attemptId'], userId, userRole);
  res.json({ success: true, data: results });
}));

/* ─────────────────────────── Admin Stats ─────────────────────────── */

router.get('/admin/stats', asyncHandler(async (req: Request, res) => {
  const userRole = req.headers['x-user-role'] as string;
  if (userRole !== 'ADMIN') {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    });
    return;
  }
  const stats = await examService.getExamStatsAdmin();
  res.json({ success: true, data: stats });
}));

export default router;
