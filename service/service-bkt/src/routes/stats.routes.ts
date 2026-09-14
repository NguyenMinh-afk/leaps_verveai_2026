/**
 * BKT Stats Routes (service-bkt)
 *
 * Aggregated statistics for admin dashboard reporting.
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { prisma } from '../prisma/client.js';

const router: Router = Router();

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/bkt/diagnoses/stats
   Diagnosis statistics for admin reports
   ───────────────────────────────────────────────────────────────────────────── */

router.get(
  '/diagnoses/stats',
  asyncHandler(async (req, res) => {
    const [total, mastered, diagnosed, struggling, pending, pKnownSum] = await Promise.all([
      prisma.diagnosis.count(),
      prisma.diagnosis.count({ where: { status: 'MASTERED' } }),
      prisma.diagnosis.count({ where: { status: 'DIAGNOSED' } }),
      prisma.diagnosis.count({ where: { status: 'STRUGGLING' } }),
      prisma.diagnosis.count({ where: { status: 'PENDING' } }),
      prisma.diagnosis.aggregate({
        _avg: { p_known: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        mastered,
        diagnosed,
        struggling,
        pending,
        averagePKnown: pKnownSum._avg.p_known ?? 0,
      },
    });
  })
);

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/bkt/interventions/stats
   Intervention statistics for admin reports
   ───────────────────────────────────────────────────────────────────────────── */

router.get(
  '/interventions/stats',
  asyncHandler(async (req, res) => {
    const [total, active, resolved] = await Promise.all([
      prisma.intervention.count(),
      prisma.intervention.count({ where: { status: 'ACTIVE' } }),
      prisma.intervention.count({ where: { status: { in: ['RESOLVED', 'CANCELLED'] } } }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        active,
        resolved,
      },
    });
  })
);

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/bkt/skills/stats
   Skills statistics for admin reports
   ───────────────────────────────────────────────────────────────────────────── */

router.get(
  '/skills/stats',
  asyncHandler(async (req, res) => {
    const [total, avgDifficulty] = await Promise.all([
      prisma.skill.count(),
      prisma.skill.aggregate({
        _avg: { difficulty: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        averageDifficulty: avgDifficulty._avg.difficulty ?? 0,
      },
    });
  })
);

export default router;
