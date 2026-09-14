/**
 * Recommendation routes for service-ai.
 *
 * GET /api/ai/recommendations/student/:studentId
 *   Returns personalized skill recommendations for a student.
 *
 * Authorization:
 *   - Student: can view their own recommendations (X-User-Id must match studentId)
 *   - Teacher: can view their students' recommendations
 *   - Admin: can view any student's recommendations
 */

import { Router } from 'express';
import { recommendationQuerySchema } from '../validators/recommendation.validator.js';
import { getRecommendations } from '../services/recommendation.service.js';
import { logger } from '../utils/logger.js';

const router: Router = Router();

const log = logger.child({ component: 'recommendation.routes' });

/**
 * GET /recommendations/student/:studentId
 *
 * Query params:
 *   - limit: number (1-20, default: 5)
 *   - includeContent: boolean (default: true)
 *   - language: 'vi' | 'en' (default: 'vi')
 *
 * Headers (required):
 *   - X-User-Id: string — authenticated user ID
 *   - X-User-Role: string — role ('student' | 'teacher' | 'admin')
 */
router.get('/api/ai/recommendations/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.headers['x-user-id'] as string | undefined;
    const userRole = req.headers['x-user-role'] as string | undefined;

    // Validate required headers
    if (!userId) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing X-User-Id header',
        },
      });
      return;
    }

    if (!userRole) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing X-User-Role header',
        },
      });
      return;
    }

    // Authorization check
    const isAuthorized = checkAuthorization(userRole, userId, studentId);
    if (!isAuthorized) {
      log.warn('Unauthorized recommendation access attempt', {
        userId,
        userRole,
        requestedStudentId: studentId,
      });
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to view this student\'s recommendations',
        },
      });
      return;
    }

    // Validate query parameters
    const queryResult = recommendationQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: queryResult.error.issues,
        },
      });
      return;
    }

    const { limit, includeContent, language } = queryResult.data;

    // Generate recommendations
    const response = await getRecommendations({
      studentId,
      limit,
      includeContent,
      language,
    });

    // Map status to HTTP status code
    let httpStatus = 200;
    if (response.status === 'INSUFFICIENT_DATA') {
      httpStatus = 503; // Service unavailable - BKT is down
    } else if (response.status === 'NO_RECOMMENDATION_AVAILABLE') {
      httpStatus = 200; // Valid response, just no recommendations
    }

    res.status(httpStatus).json(response);
  } catch (err) {
    log.error('Error generating recommendations', {
      studentId: req.params.studentId,
      error: err instanceof Error ? err.message : String(err),
    });
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
});

/**
 * Check if the user is authorized to view the student's recommendations.
 *
 * Rules:
 *   - Student: can only view their own recommendations
 *   - Teacher: can view any student's recommendations (assumes teacher has access to all students)
 *   - Admin: can view any student's recommendations
 */
function checkAuthorization(
  userRole: string,
  userId: string,
  targetStudentId: string
): boolean {
  const role = userRole.toLowerCase();

  switch (role) {
    case 'admin':
      // Admin can view any student's recommendations
      return true;

    case 'teacher':
      // Teacher can view any student's recommendations
      // In a real implementation, you'd check if the teacher is assigned to this student
      return true;

    case 'student':
      // Student can only view their own recommendations
      return userId === targetStudentId;

    default:
      return false;
  }
}

export default router;
