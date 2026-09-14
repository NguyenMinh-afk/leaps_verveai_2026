/**
 * Diagnostic Interpretation Routes
 * 
 * GET /api/ai/diagnostic/student/:studentId
 * 
 * Provides AI-generated human-readable diagnostic interpretations for students.
 * 
 * Authorization:
 * - Students can view their own diagnostic
 * - Teachers can view their students' diagnostics
 * - Admins can view any diagnostic
 */

import { Router, type Request, type Response, type NextFunction, type Router as ExpressRouter } from 'express';
import { logger } from '../utils/logger.js';
import { generateDiagnostic } from '../services/diagnostic.service.js';
import { diagnosticQuerySchema, diagnosticRequestSchema } from '../validators/diagnostic.validator.js';
import { AIError, AIErrorCode } from '../types/errors.js';
import { ValidationError } from '@verveai/error-types';

const router: ExpressRouter = Router();
const log = logger.child({ component: 'diagnostic-routes' });

/* ─────────────────────────── Auth Headers ─────────────────────────── */

interface AuthHeaders {
  'x-user-id'?: string;
  'x-user-role'?: string;
  'x-student-ids'?: string; // comma-separated list of student IDs for teachers
}

/* ─────────────────────────── Authorization Helper ─────────────────────────── */

function checkAuthorization(
  userId: string | undefined,
  userRole: string | undefined,
  studentId: string,
  studentIds?: string
): { authorized: boolean; reason?: string } {
  if (!userId || !userRole) {
    return { authorized: false, reason: 'Missing authentication headers' };
  }

  // Admin can view any student
  if (userRole === 'admin') {
    return { authorized: true };
  }

  // Student can only view their own diagnostic
  if (userRole === 'student') {
    if (userId !== studentId) {
      return { authorized: false, reason: 'Students can only view their own diagnostic' };
    }
    return { authorized: true };
  }

  // Teacher can view their students' diagnostics
  if (userRole === 'teacher') {
    if (!studentIds) {
      return { authorized: false, reason: 'Teacher missing student IDs' };
    }
    const allowedStudents = studentIds.split(',').map(s => s.trim());
    if (!allowedStudents.includes(studentId)) {
      return { authorized: false, reason: 'Teacher not authorized for this student' };
    }
    return { authorized: true };
  }

  return { authorized: false, reason: 'Unknown user role' };
}

/* ─────────────────────────── Route Handler ─────────────────────────── */

router.get('/api/ai/diagnostic/student/:studentId', async (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] ?? 'unknown';
  const { studentId } = req.params;
  const authHeaders = req.headers as unknown as AuthHeaders;

  log.info('Diagnostic request received', {
    requestId,
    studentId,
    method: req.method,
    path: req.path,
  });

  // Parse and validate query parameters
  const queryResult = diagnosticQuerySchema.safeParse(req.query);
  if (!queryResult.success) {
    // Convert Zod issues to ValidationIssue format
    const issues = queryResult.error.issues.map(i => ({
      path: i.path.map(p => String(p)),
      message: i.message,
      code: i.code,
    }));
    throw new ValidationError(issues);
  }

  const query = queryResult.data;

  // Check authorization
  const auth = checkAuthorization(
    authHeaders['x-user-id'],
    authHeaders['x-user-role'],
    studentId,
    authHeaders['x-student-ids']
  );

  if (!auth.authorized) {
    log.warn('Diagnostic authorization failed', {
      requestId,
      studentId,
      reason: auth.reason,
    });
    res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: auth.reason ?? 'Access denied',
      },
    });
    return;
  }

  // Build request options
  const requestOptions = diagnosticRequestSchema.parse({
    studentId,
    includeEvidence: query.includeEvidence,
    includePrerequisites: query.includePrerequisites,
    maxSkills: query.maxSkills,
    language: query.language,
  });

  // Generate diagnostic
  const result = await generateDiagnostic(requestOptions);

  // Return response
  res.json({
    studentId: result.studentId,
    interpretation: result.interpretation,
    meta: {
      diagnosisCount: result.diagnosisCount,
      evidenceCount: result.evidenceCount,
      lastUpdated: result.lastUpdated,
      provider: result.provider,
      latencyMs: result.latencyMs,
    },
  });
});

/* ─────────────────────────── Error Handler ─────────────────────────── */

router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AIError) {
    const status = aiErrorToHttpStatus(err.code);
    log.warn(`AI Error in diagnostic route: ${err.code}`, {
      code: err.code,
      message: err.message,
    });

    res.status(status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  if (err instanceof ValidationError) {
    log.warn('Validation error in diagnostic route', {
      message: err.message,
      details: err.details,
    });

    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Unknown error
  log.error('Unhandled error in diagnostic route', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
});

function aiErrorToHttpStatus(code: AIErrorCode): number {
  switch (code) {
    case AIErrorCode.AI_INVALID_INPUT:
    case AIErrorCode.AI_REQUEST_TOO_LARGE:
    case AIErrorCode.AI_INVALID_RESPONSE:
      return 400;
    case AIErrorCode.AI_PROVIDER_NOT_CONFIGURED:
    case AIErrorCode.AI_CONFIGURATION_ERROR:
      return 500;
    case AIErrorCode.AI_PROVIDER_UNAVAILABLE:
      return 503;
    case AIErrorCode.AI_TIMEOUT:
      return 504;
    case AIErrorCode.AI_RATE_LIMITED:
      return 429;
    case AIErrorCode.AI_CONTENT_FILTERED:
      return 422;
    default:
      return 500;
  }
}

export default router;
