import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import {
  diagnosisIdParamSchema,
  evidenceIdParamSchema,
  recordEvidenceSchema,
} from '../validators/evidence.validator.js';
import * as evidenceService from '../services/evidence.service.js';

const router: Router = Router();

/**
 * POST /api/bkt/evidence
 * Record a new evidence item and trigger BKT re-computation.
 */
router.post(
  '/',
  validateBody(recordEvidenceSchema),
  asyncHandler(async (req, res) => {
    const data = await evidenceService.recordEvidence(req.body);
    res.status(201).json({ success: true, data });
  })
);

/**
 * GET /api/bkt/evidence/student/:id
 * Get all evidence for a student.
 * NOTE: registered BEFORE /:id to avoid "student" being captured as an id param.
 */
router.get(
  '/student/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const evidence = await evidenceService.getStudentEvidence(id);
    res.json({ success: true, data: evidence });
  })
);

/**
 * GET /api/bkt/evidence/:id
 * Fetch a single evidence item.
 */
router.get(
  '/:id',
  validateParams(evidenceIdParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const evidence = await evidenceService.getEvidenceById(id);
    if (!evidence) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: `Evidence ${id} not found` },
      });
      return;
    }
    res.json({ success: true, data: evidence });
  })
);

/**
 * GET /api/bkt/evidence/:id/chain
 * Get the full reasoning chain for a diagnosis (running P(L) after each step).
 */
router.get(
  '/:id/chain',
  validateParams(diagnosisIdParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const chain = await evidenceService.getEvidenceChain(id);
    res.json({ success: true, data: chain });
  })
);

export default router;
