/**
 * Diagnosis Routes (service-exam)
 * 
 * API endpoints for managing diagnostic assessment sessions.
 */

import { Router, Request } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as diagnosisService from '../services/diagnosis.service.js';

const router: Router = Router();

/* ─────────────────────────── Session Management ─────────────────────────── */

/**
 * POST /api/exam/diagnosis/start
 * Start a new diagnostic assessment session for a student.
 * 
 * Body:
 * - skillId: string (required)
 * - skillName: string (required)
 * - questionIds: string[] (required, at least 1)
 * - totalQuestions: number (default 5)
 */
router.post('/start', asyncHandler(async (req: Request, res) => {
  const studentId = req.headers['x-user-id'] as string;
  
  if (!studentId) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
    return;
  }

  const { skillId, skillName, questionIds, totalQuestions = 5 } = req.body;

  if (!skillId || !skillName || !questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'skillId, skillName, and questionIds are required' },
    });
    return;
  }

  const session = await diagnosisService.startDiagnosisSession(
    studentId,
    skillId,
    skillName,
    questionIds,
    totalQuestions
  );

  res.status(201).json({ success: true, data: session });
}));

/**
 * GET /api/exam/diagnosis/student
 * Get all diagnostic sessions for the current student.
 */
router.get('/student', asyncHandler(async (req: Request, res) => {
  const studentId = req.headers['x-user-id'] as string;
  
  if (!studentId) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
    return;
  }

  const sessions = await diagnosisService.getStudentDiagnosisSessions(studentId);
  res.json({ success: true, data: sessions });
}));

/**
 * GET /api/exam/diagnosis/:id
 * Get a specific diagnostic session by ID.
 */
router.get('/:id', asyncHandler(async (req: Request, res) => {
  const studentId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const { id } = req.params;

  const session = await diagnosisService.getDiagnosisSession(id);

  if (!session) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Diagnosis session not found' },
    });
    return;
  }

  // Allow access if user is the student or an admin/teacher
  if (session.studentId !== studentId && userRole !== 'ADMIN' && userRole !== 'TEACHER') {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Access denied' },
    });
    return;
  }

  res.json({ success: true, data: session });
}));

/* ─────────────────────────── Answer Submission ─────────────────────────── */

/**
 * POST /api/exam/diagnosis/:id/answer
 * Submit an answer for a diagnostic session.
 * 
 * SECURITY: The server determines correctness server-side.
 * The client MUST NOT send isCorrect - it will be ignored/rejected.
 * 
 * Body:
 * - questionId: string (required)
 * - answer: string (required)
 */
router.post('/:id/answer', asyncHandler(async (req: Request, res) => {
  const studentId = req.headers['x-user-id'] as string;
  
  if (!studentId) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
    return;
  }

  const { id } = req.params;
  const { questionId, answer } = req.body;

  // SECURITY: Do NOT accept isCorrect from client
  if ('isCorrect' in req.body) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'isCorrect must not be sent by client' },
    });
    return;
  }

  if (!questionId || answer === undefined) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'questionId and answer are required' },
    });
    return;
  }

  const session = await diagnosisService.submitDiagnosisAnswer(
    id,
    studentId,
    questionId,
    answer
  );

  res.json({ success: true, data: session });
}));

/* ─────────────────────────── Session Completion ─────────────────────────── */

/**
 * POST /api/exam/diagnosis/:id/complete
 * Complete a diagnostic session and generate final result.
 */
router.post('/:id/complete', asyncHandler(async (req: Request, res) => {
  const studentId = req.headers['x-user-id'] as string;
  
  if (!studentId) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
    return;
  }

  const { id } = req.params;

  const session = await diagnosisService.completeDiagnosisSession(id, studentId);
  res.json({ success: true, data: session });
}));

/* ─────────────────────────── Questions ─────────────────────────── */

/**
 * GET /api/exam/diagnosis/questions/:skillId
 * Get diagnosis questions for a specific skill.
 * This endpoint would call the content service in a real implementation.
 */
router.get('/questions/:skillId', asyncHandler(async (req: Request, res) => {
  const { skillId } = req.params;
  const count = parseInt(req.query.count as string) || 5;

  const questions = await diagnosisService.getDiagnosisQuestions(skillId, count);
  res.json({ success: true, data: questions });
}));

export default router;
