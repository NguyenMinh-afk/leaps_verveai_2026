/**
 * Question-Skill Mapping Routes
 *
 * Endpoints for managing the relationship between exam questions and BKT skills.
 * This enables exam answers to generate BKT evidence for skill mastery tracking.
 */

import { Router, Request } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { z } from 'zod';
import {
  createQuestionSkillMapping,
  getSkillsForQuestion,
  getQuestionsForSkill,
  deleteQuestionSkillMapping,
  deleteMappingsForQuestion,
} from '../services/bkt-integration.service.js';

const router: Router = Router();

/* ─────────────────────────── Validation Schemas ─────────────────────────── */

const createMappingBodySchema = z.object({
  skillId: z.string().uuid('skillId must be a valid UUID'),
});

/* ─────────────────────────── Routes ─────────────────────────── */

/**
 * GET /api/exams/questions/:id/skills
 * Get all skills mapped to a question.
 */
router.get(
  '/questions/:id/skills',
  asyncHandler(async (req: Request, res) => {
    const { id } = req.params as { id: string };
    const skillIds = await getSkillsForQuestion(id);
    res.json({ success: true, data: { skillIds } });
  })
);

/**
 * GET /api/exams/skills/:skillId/questions
 * Get all questions mapped to a skill.
 */
router.get(
  '/skills/:skillId/questions',
  asyncHandler(async (req: Request, res) => {
    const { skillId } = req.params as { skillId: string };
    const questionIds = await getQuestionsForSkill(skillId);
    res.json({ success: true, data: { questionIds } });
  })
);

/**
 * POST /api/exams/questions/:id/skills
 * Map a question to a skill.
 */
router.post(
  '/questions/:id/skills',
  asyncHandler(async (req: Request, res) => {
    const { id } = req.params as { id: string };

    // Validate body
    const parsed = createMappingBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.message },
      });
      return;
    }

    const { skillId } = parsed.data;
    const teacherId = req.headers['x-user-id'] as string | undefined;

    const mapping = await createQuestionSkillMapping(id, skillId, teacherId);
    res.status(201).json({ success: true, data: mapping });
  })
);

/**
 * DELETE /api/exams/questions/:id/skills
 * Remove all skill mappings for a question.
 */
router.delete(
  '/questions/:id/skills',
  asyncHandler(async (req: Request, res) => {
    const { id } = req.params as { id: string };
    const count = await deleteMappingsForQuestion(id);
    res.json({ success: true, data: { deletedCount: count } });
  })
);

/**
 * DELETE /api/exams/questions/:questionId/skills/:skillId
 * Remove a specific question-skill mapping.
 */
router.delete(
  '/questions/:questionId/skills/:skillId',
  asyncHandler(async (req: Request, res) => {
    const { questionId, skillId } = req.params as { questionId: string; skillId: string };

    // Get all mappings for this question and find the one matching the skill
    const mappings = await getSkillsForQuestion(questionId);
    if (!mappings.includes(skillId)) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Mapping not found' },
      });
      return;
    }

    // Find the mapping ID by querying the database directly
    const { prisma } = await import('../prisma/client.js');
    const mapping = await prisma.questionSkillMapping.findFirst({
      where: {
        question_id: questionId,
        skill_id: skillId,
      },
    });

    if (mapping) {
      await deleteQuestionSkillMapping(mapping.id);
    }

    res.json({ success: true, data: { message: 'Mapping deleted' } });
  })
);

export default router;
