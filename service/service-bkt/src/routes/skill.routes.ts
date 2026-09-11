import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateParams } from '../middleware/validate.js';
import {
  listSkillsQuerySchema,
  skillIdParamSchema,
} from '../validators/skill.validator.js';
import * as skillService from '../services/skill.service.js';

const router: Router = Router();

/**
 * GET /api/bkt/skills
 * Paginated list of all skills in the catalogue.
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = Number(req.query['page'] ?? 1);
    const pageSize = Number(req.query['pageSize'] ?? 20);
    const result = await skillService.listSkills(page, pageSize);
    res.json({ success: true, ...result });
  })
);

/**
 * GET /api/bkt/skills/tree
 * Hierarchical skill dependency tree.
 * NOTE: registered BEFORE /:id so Express matches this path first.
 */
router.get(
  '/tree',
  asyncHandler(async (req, res) => {
    const data = await skillService.getSkillTree();
    res.json({ success: true, data });
  })
);

/**
 * GET /api/bkt/skills/:id
 * Fetch a single skill with aggregate stats.
 */
router.get(
  '/:id',
  validateParams(skillIdParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const data = await skillService.getSkillById(id);
    res.json({ success: true, data });
  })
);

/**
 * GET /api/bkt/skills/:id/prerequisites
 * Walk the prerequisite graph recursively.
 */
router.get(
  '/:id/prerequisites',
  validateParams(skillIdParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const data = await skillService.getPrerequisites(id);
    res.json({ success: true, data });
  })
);

export default router;
