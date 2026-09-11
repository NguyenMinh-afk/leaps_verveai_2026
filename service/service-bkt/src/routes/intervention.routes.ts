import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { Consul } from '@verveai/consul-client';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.js';
import {
  addNoteSchema,
  classIdParamSchema,
  interventionIdParamSchema,
  listInterventionsQuerySchema,
  overrideInterventionSchema,
  updateInterventionSchema,
} from '../validators/intervention.validator.js';
import * as interventionService from '../services/intervention.service.js';

const router: Router = Router();

/**
 * GET /api/bkt/interventions
 * Paginated list of interventions with optional filters.
 */
router.get(
  '/',
  validateQuery(listInterventionsQuerySchema),
  asyncHandler(async (req, res) => {
    const q = req.query as unknown as {
      status?: interventionService.InterventionStatus;
      minPriority?: number;
      maxPriority?: number;
      classId?: string;
      studentId?: string;
      skillId?: string;
      page: number;
      pageSize: number;
    };
    const result = await interventionService.listInterventions({
      status: q.status,
      minPriority: q.minPriority,
      maxPriority: q.maxPriority,
      classId: q.classId,
      studentId: q.studentId,
      skillId: q.skillId,
      page: q.page,
      pageSize: q.pageSize,
    });
    res.json({ success: true, ...result });
  })
);

/**
 * GET /api/bkt/interventions/class/:id
 * List interventions for every student in a class.
 * NOTE: registered BEFORE /:id so Express matches this path first.
 */
router.get(
  '/class/:id',
  validateParams(classIdParamSchema),
  asyncHandler(async (req, res) => {
    const { id: classId } = req.params as { id: string };

    // Cross-service: resolve class members from svc-class via Consul.
    type ClassMember = { id: string };
    type ClassStudentsResponse = { success: boolean; data?: { students?: ClassMember[] } };

    let studentIds: string[] = [];
    try {
      let baseUrl: string;
      try {
        baseUrl = await Consul.resolve('svc-class');
      } catch {
        // Fallback for local dev without Consul.
        baseUrl = 'http://svc-class:3003';
      }
      const response = await fetch(`${baseUrl}/api/class/classes/${classId}/students`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const body = (await response.json()) as ClassStudentsResponse;
        studentIds = (body?.data?.students ?? []).map((s) => s.id);
      }
    } catch {
      // svc-class unavailable — return empty list so the caller degrades gracefully.
    }

    if (studentIds.length === 0) {
      res.json({
        success: true,
        data: [],
        meta: { page: 1, pageSize: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
      });
      return;
    }

    const page = Number(req.query['page'] ?? 1);
    const pageSize = Number(req.query['pageSize'] ?? 20);
    const data = await interventionService.listInterventions({
      page,
      pageSize,
    });

    // Re-filter by resolved studentIds (service doesn't support IN-list by classId).
    const filtered = data.data.filter((iv) => studentIds.includes(iv.studentId));
    const meta = {
      ...data.meta,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };

    res.json({ success: true, data: filtered, meta });
  })
);

/**
 * GET /api/bkt/interventions/:id
 * Fetch a single intervention with its notes.
 */
router.get(
  '/:id',
  validateParams(interventionIdParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const data = await interventionService.getIntervention(id);
    res.json({ success: true, data });
  })
);

/**
 * PUT /api/bkt/interventions/:id
 * Update priority, status, or notes of an intervention.
 */
router.put(
  '/:id',
  validateParams(interventionIdParamSchema),
  validateBody(updateInterventionSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const data = await interventionService.updateIntervention(id, req.body);
    res.json({ success: true, data });
  })
);

/**
 * PUT /api/bkt/interventions/:id/override
 * FR-17 — Teacher override of an automated intervention.
 */
router.put(
  '/:id/override',
  validateParams(interventionIdParamSchema),
  validateBody(overrideInterventionSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const { reason, newStatus } = req.body as {
      reason: string;
      newStatus: interventionService.InterventionStatus;
    };
    // teacherId comes from the X-User-Id header set by the Gateway
    // after JWT verification. We trust the gateway (FR-01 / SR-01).
    const teacherId = (req.headers['x-user-id'] as string | undefined) ?? '';
    const data = await interventionService.overrideIntervention(id, teacherId, reason, newStatus);
    res.json({ success: true, data });
  })
);

/**
 * POST /api/bkt/interventions/:id/note
 * Add a note to an intervention timeline.
 */
router.post(
  '/:id/note',
  validateParams(interventionIdParamSchema),
  validateBody(addNoteSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const { content } = req.body as { content: string };
    const teacherId = (req.headers['x-user-id'] as string | undefined) ?? '';
    const data = await interventionService.addNote(id, teacherId, content);
    res.status(201).json({ success: true, data });
  })
);

/**
 * POST /api/bkt/interventions/:id/resolve
 * Mark an intervention as RESOLVED (idempotent).
 */
router.post(
  '/:id/resolve',
  validateParams(interventionIdParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const data = await interventionService.resolveIntervention(id);
    res.json({ success: true, data });
  })
);

export default router;
