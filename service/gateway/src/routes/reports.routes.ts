/**
 * Admin Reports Routes (gateway)
 *
 * Aggregates statistics from all backend services for the admin reports dashboard.
 * Proxies to existing stats endpoints in each service.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

const router: Router = Router();

// Service URLs
const UPSTREAM = {
  auth: process.env['SVC_AUTH_URL'] ?? 'http://svc-auth:3001',
  class: process.env['SVC_CLASS_URL'] ?? 'http://svc-class:3003',
  content: process.env['SVC_CONTENT_URL'] ?? 'http://svc-content:3004',
  exam: process.env['SVC_EXAM_URL'] ?? 'http://svc-exam:3007',
  bkt: process.env['SVC_BKT_URL'] ?? 'http://svc-bkt:3002',
};

/* ─────────────────────────────────────────────────────────────────────────────
   Helper: async handler wrapper
   ───────────────────────────────────────────────────────────────────────────── */

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────────────────────── */

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
}

interface ClassStats {
  total: number;
  active: number;
  archived: number;
  totalStudents: number;
  totalTeachers: number;
}

interface QuestionStats {
  total: number;
  draft: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  byDifficulty: Record<string, number>;
  topicCount: number;
}

interface ExamStats {
  total: number;
  draft: number;
  published: number;
  archived: number;
  totalAttempts: number;
  completedAttempts: number;
}

interface DiagnosisStats {
  totalDiagnoses: number;
  mastered: number;
  diagnosed: number;
  struggling: number;
  pending: number;
  averagePKnown: number;
}

interface InterventionStats {
  total: number;
  active: number;
  resolved: number;
}

interface ReportStats {
  userStats: UserStats;
  classStats: ClassStats;
  questionStats: QuestionStats;
  examStats: ExamStats;
  diagnosisStats: DiagnosisStats;
  interventionStats: InterventionStats;
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/reports
   Aggregated system reports for admin dashboard
   ───────────────────────────────────────────────────────────────────────────── */

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    // Check admin role
    const userRole = req.headers['x-user-role'];
    if (userRole !== 'ADMIN') {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      });
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-User-Id': req.headers['x-user-id'] ?? '',
      'X-User-Role': userRole,
    };

    try {
      // Fetch all stats in parallel from each service
      const [userStatsRes, classStatsRes, questionStatsRes, examStatsRes] = await Promise.all([
        fetch(`${UPSTREAM.auth}/api/users/admin/stats`, { headers }),
        fetch(`${UPSTREAM.class}/api/class/admin/stats`, { headers }),
        fetch(`${UPSTREAM.content}/api/content/questions/admin/stats`, { headers }),
        fetch(`${UPSTREAM.exam}/api/exam/admin/stats`, { headers }),
      ]);

      // Parse responses with proper typing
      const userStatsData = userStatsRes.ok
        ? (await userStatsRes.json() as ServiceResponse<UserStats>)
        : { data: { total: 0, active: 0, inactive: 0, byRole: {} } };

      const classStatsData = classStatsRes.ok
        ? (await classStatsRes.json() as ServiceResponse<ClassStats>)
        : { data: { total: 0, active: 0, archived: 0, totalStudents: 0, totalTeachers: 0 } };

      const questionStatsData = questionStatsRes.ok
        ? (await questionStatsRes.json() as ServiceResponse<QuestionStats>)
        : { data: { total: 0, draft: 0, pendingReview: 0, approved: 0, rejected: 0, byDifficulty: {}, topicCount: 0 } };

      const examStatsData = examStatsRes.ok
        ? (await examStatsRes.json() as ServiceResponse<ExamStats>)
        : { data: { total: 0, draft: 0, published: 0, archived: 0, totalAttempts: 0, completedAttempts: 0 } };

      // Fetch BKT stats (diagnosis and intervention counts)
      const diagnosisStats: DiagnosisStats = {
        totalDiagnoses: 0,
        mastered: 0,
        diagnosed: 0,
        struggling: 0,
        pending: 0,
        averagePKnown: 0,
      };

      const interventionStats: InterventionStats = {
        total: 0,
        active: 0,
        resolved: 0,
      };

      // Try to get BKT diagnosis stats
      try {
        const diagnosesRes = await fetch(`${UPSTREAM.bkt}/api/bkt/diagnoses/stats`, { headers });
        if (diagnosesRes.ok) {
          const diagnosesData = await diagnosesRes.json() as ServiceResponse<DiagnosisStats>;
          if (diagnosesData.data) {
            diagnosisStats.totalDiagnoses = diagnosesData.data.totalDiagnoses || 0;
            diagnosisStats.mastered = diagnosesData.data.mastered || 0;
            diagnosisStats.diagnosed = diagnosesData.data.diagnosed || 0;
            diagnosisStats.struggling = diagnosesData.data.struggling || 0;
            diagnosisStats.pending = diagnosesData.data.pending || 0;
            diagnosisStats.averagePKnown = diagnosesData.data.averagePKnown || 0;
          }
        }
      } catch (err) {
        logger.warn('Failed to fetch BKT diagnosis stats', { error: err instanceof Error ? err.message : String(err) });
      }

      // Try to get BKT intervention stats
      try {
        const interventionsRes = await fetch(`${UPSTREAM.bkt}/api/bkt/interventions/stats`, { headers });
        if (interventionsRes.ok) {
          const interventionsData = await interventionsRes.json() as ServiceResponse<InterventionStats>;
          if (interventionsData.data) {
            interventionStats.total = interventionsData.data.total || 0;
            interventionStats.active = interventionsData.data.active || 0;
            interventionStats.resolved = interventionsData.data.resolved || 0;
          }
        }
      } catch (err) {
        logger.warn('Failed to fetch BKT intervention stats', { error: err instanceof Error ? err.message : String(err) });
      }

      const reportStats: ReportStats = {
        userStats: userStatsData.data ?? { total: 0, active: 0, inactive: 0, byRole: {} },
        classStats: classStatsData.data ?? { total: 0, active: 0, archived: 0, totalStudents: 0, totalTeachers: 0 },
        questionStats: questionStatsData.data ?? { total: 0, draft: 0, pendingReview: 0, approved: 0, rejected: 0, byDifficulty: {}, topicCount: 0 },
        examStats: examStatsData.data ?? { total: 0, draft: 0, published: 0, archived: 0, totalAttempts: 0, completedAttempts: 0 },
        diagnosisStats,
        interventionStats,
      };

      res.json({ success: true, data: reportStats });
    } catch (err) {
      logger.error('Failed to aggregate report stats', { error: err instanceof Error ? err.message : String(err) });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to aggregate report statistics' },
      });
    }
  })
);

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/reports/activity
   Recent activity trends (last 30 days)
   ───────────────────────────────────────────────────────────────────────────── */

router.get(
  '/activity',
  asyncHandler(async (req: Request, res: Response) => {
    const userRole = req.headers['x-user-role'];
    if (userRole !== 'ADMIN') {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      });
      return;
    }

    // For now, return empty activity data since detailed activity tracking
    // would require additional instrumentation in each service
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    res.json({
      success: true,
      data: {
        period: {
          start: thirtyDaysAgo.toISOString(),
          end: new Date().toISOString(),
        },
        activities: [],
        message: 'Activity tracking will be implemented with detailed event logging',
      },
    });
  })
);

export default router;
