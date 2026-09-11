import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import {
  batchDiagnosisSchema,
  runDiagnosisSchema,
  studentIdParamSchema,
} from '../validators/diagnosis.validator.js';
import { classIdParamSchema } from '../validators/intervention.validator.js';
import * as diagnosisService from '../services/diagnosis.service.js';

const router: Router = Router();

/**
 * POST /api/bkt/diagnosis/run
 * Run BKT diagnosis for a single (student, skill) pair.
 */
router.post(
  '/run',
  validateBody(runDiagnosisSchema),
  asyncHandler(async (req, res) => {
    const { studentId, skillId } = req.body as { studentId: string; skillId: string };
    const data = await diagnosisService.runDiagnosis(studentId, skillId);
    res.json({ success: true, data });
  })
);

/**
 * POST /api/bkt/diagnosis/batch
 * Run BKT diagnosis for multiple skills for one student.
 */
router.post(
  '/batch',
  validateBody(batchDiagnosisSchema),
  asyncHandler(async (req, res) => {
    const { studentId, skillIds } = req.body as {
      studentId: string;
      skillIds: string[];
    };
    const data = await diagnosisService.runBatchDiagnosis(studentId, skillIds);
    res.json({ success: true, data });
  })
);

/**
 * GET /api/bkt/diagnosis/student/:id
 * List all diagnoses for a single student.
 */
router.get(
  '/student/:id',
  validateParams(studentIdParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const data = await diagnosisService.getStudentDiagnoses(id);
    res.json({ success: true, data });
  })
);

/**
 * GET /api/bkt/diagnosis/class/:id
 * List all diagnoses for every student in a class (cross-service).
 */
router.get(
  '/class/:id',
  validateParams(classIdParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const data = await diagnosisService.getClassDiagnoses(id);
    res.json({ success: true, data });
  })
);

export default router;
