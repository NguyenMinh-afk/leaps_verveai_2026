/**
 * BKT Integration Service
 * 
 * Handles communication between the Exam Service and BKT Service.
 * 
 * This service:
 * 1. Records evidence for exam answers
 * 2. Triggers BKT diagnosis updates
 * 3. Manages question-skill mappings
 * 
 * Uses direct HTTP calls with circuit breaker pattern (similar to BKT service's svc-class calls).
 */

import { createBreaker } from '@verveai/circuit-breaker';
import { logger } from '../utils/logger.js';
import { ValidationError } from '@verveai/error-types';
import { prisma } from '../prisma/client.js';

const log = logger.child({ component: 'bkt-integration' });

/**
 * Fallback URL for BKT service when SVC_BKT_URL is not configured
 */
const FALLBACK_SVC_BKT_URL = 'http://svc-bkt:3002';

/**
 * Circuit-breaker wrapped call to BKT service.
 */
const bktBreaker = createBreaker(
  'svc-bkt',
  async (path: string, options?: RequestInit): Promise<unknown> => {
    const baseUrl = process.env['SVC_BKT_URL'] ?? FALLBACK_SVC_BKT_URL;
    const url = `${baseUrl}${path}`;
    
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`BKT service returned ${res.status}: ${body}`);
    }

    return res.json();
  },
  { timeout: 5000, errorThresholdPercentage: 50, resetTimeout: 30000 }
);

/* ─────────────────────────── Types ─────────────────────────── */

export interface QuestionSkillMapping {
  id: string;
  questionId: string;
  skillId: string;
  createdAt: Date;
  createdBy: string | null;
}

export interface BKTDiagnosisResult {
  id: string;
  studentId: string;
  skillId: string;
  pKnown: number;
  confidence: number;
  status: 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';
  evidenceCount: number;
}

export interface BKTEvidenceResult {
  evidence: {
    id: string;
    diagnosisId: string;
    itemId: string;
    correct: boolean | null;
  };
  diagnosis: BKTDiagnosisResult;
}

export interface AssessmentEvidence {
  attemptId: string;
  studentId: string;
  questionId: string;
  skillId: string;
  correct: boolean;
  itemId: string; // Can be the questionId or a specific answer item ID
}

/* ─────────────────────────── Question-Skill Mapping ─────────────────────────── */

/**
 * Create a mapping between a question and a skill.
 */
export async function createQuestionSkillMapping(
  questionId: string,
  skillId: string,
  createdBy?: string
): Promise<QuestionSkillMapping> {
  // Validate UUIDs
  if (!isValidUUID(questionId)) {
    throw new ValidationError(
      [{ path: ['questionId'], message: 'questionId must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid questionId'
    );
  }
  if (!isValidUUID(skillId)) {
    throw new ValidationError(
      [{ path: ['skillId'], message: 'skillId must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid skillId'
    );
  }

  const mapping = await prisma.questionSkillMapping.create({
    data: {
      question_id: questionId,
      skill_id: skillId,
      created_by: createdBy ?? null,
    },
  });

  log.info('Question-skill mapping created', { questionId, skillId, mappingId: mapping.id });

  return {
    id: mapping.id,
    questionId: mapping.question_id,
    skillId: mapping.skill_id,
    createdAt: mapping.created_at,
    createdBy: mapping.created_by,
  };
}

/**
 * Get the skill ID(s) mapped to a question.
 */
export async function getSkillsForQuestion(questionId: string): Promise<string[]> {
  if (!isValidUUID(questionId)) {
    throw new ValidationError(
      [{ path: ['questionId'], message: 'questionId must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid questionId'
    );
  }

  const mappings = await prisma.questionSkillMapping.findMany({
    where: { question_id: questionId },
    select: { skill_id: true },
  });

  return mappings.map(m => m.skill_id);
}

/**
 * Get all question IDs mapped to a skill.
 */
export async function getQuestionsForSkill(skillId: string): Promise<string[]> {
  if (!isValidUUID(skillId)) {
    throw new ValidationError(
      [{ path: ['skillId'], message: 'skillId must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid skillId'
    );
  }

  const mappings = await prisma.questionSkillMapping.findMany({
    where: { skill_id: skillId },
    select: { question_id: true },
  });

  return mappings.map(m => m.question_id);
}

/**
 * Delete a question-skill mapping.
 */
export async function deleteQuestionSkillMapping(mappingId: string): Promise<void> {
  if (!isValidUUID(mappingId)) {
    throw new ValidationError(
      [{ path: ['mappingId'], message: 'mappingId must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid mappingId'
    );
  }

  await prisma.questionSkillMapping.delete({
    where: { id: mappingId },
  });

  log.info('Question-skill mapping deleted', { mappingId });
}

/**
 * Delete all mappings for a question.
 */
export async function deleteMappingsForQuestion(questionId: string): Promise<number> {
  if (!isValidUUID(questionId)) {
    throw new ValidationError(
      [{ path: ['questionId'], message: 'questionId must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid questionId'
    );
  }

  const result = await prisma.questionSkillMapping.deleteMany({
    where: { question_id: questionId },
  });

  return result.count;
}

/* ─────────────────────────── BKT Evidence Recording ─────────────────────────── */

/**
 * Record BKT evidence for an exam answer.
 * 
 * This function:
 * 1. Looks up the question-skill mapping
 * 2. Runs/ensures diagnosis exists for student-skill pair
 * 3. Records evidence through BKT service
 * 
 * Returns the evidence result or null if no skill mapping exists.
 */
export async function recordExamAnswerEvidence(
  studentId: string,
  attemptId: string,
  questionId: string,
  correct: boolean,
  itemId?: string
): Promise<BKTEvidenceResult | null> {
  // Validate inputs
  if (!isValidUUID(studentId)) {
    throw new ValidationError(
      [{ path: ['studentId'], message: 'studentId must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid studentId'
    );
  }
  if (!isValidUUID(questionId)) {
    throw new ValidationError(
      [{ path: ['questionId'], message: 'questionId must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid questionId'
    );
  }

  // Get skill mapping for this question
  const skillIds = await getSkillsForQuestion(questionId);
  
  if (skillIds.length === 0) {
    log.debug('No skill mapping found for question', { questionId });
    return null; // No skill mapping - skip BKT update
  }

  const results: BKTEvidenceResult[] = [];

  // Process each mapped skill
  for (const skillId of skillIds) {
    try {
      const result = await recordEvidenceForSkill(
        studentId,
        attemptId,
        questionId,
        skillId,
        correct,
        itemId
      );
      if (result) {
        results.push(result);
      }
    } catch (error) {
      log.error('Failed to record evidence for skill', {
        studentId,
        questionId,
        skillId,
        error: error instanceof Error ? error.message : String(error),
      });
      // Continue with other skills - don't fail the whole operation
    }
  }

  // Return the first result if any, or null
  return results.length > 0 ? results[0] : null;
}

/**
 * Record evidence for a specific skill.
 * This creates or updates the diagnosis and records the evidence.
 */
async function recordEvidenceForSkill(
  studentId: string,
  _attemptId: string,  // Reserved for future use (e.g., idempotency)
  questionId: string,
  skillId: string,
  correct: boolean,
  itemId?: string
): Promise<BKTEvidenceResult | null> {
  try {
    // Step 1: Run diagnosis to ensure it exists
    // This will create the diagnosis if it doesn't exist
    const diagnosisResult = await runDiagnosis(studentId, skillId);
    
    if (!diagnosisResult) {
      log.warn('Failed to run diagnosis', { studentId, skillId });
      return null;
    }

    // Step 2: Record evidence
    const evidenceResult = await recordEvidence(
      diagnosisResult.id,
      itemId ?? questionId,
      correct
    );

    if (!evidenceResult) {
      log.warn('Failed to record evidence', { diagnosisId: diagnosisResult.id, itemId: itemId ?? questionId });
      return null;
    }

    log.info('BKT evidence recorded', {
      studentId,
      skillId,
      questionId,
      correct,
      pKnown: diagnosisResult.pKnown,
      status: diagnosisResult.status,
    });

    return {
      evidence: {
        id: evidenceResult.id,
        diagnosisId: diagnosisResult.id,
        itemId: itemId ?? questionId,
        correct,
      },
      diagnosis: diagnosisResult,
    };
  } catch (error) {
    log.error('BKT integration failed', {
      studentId,
      skillId,
      questionId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Run diagnosis for a student-skill pair.
 * Uses the BKT service's runDiagnosis endpoint.
 */
async function runDiagnosis(studentId: string, skillId: string): Promise<BKTDiagnosisResult | null> {
  try {
    const raw = await bktBreaker.fire('/api/bkt/diagnosis/run', {
      method: 'POST',
      body: JSON.stringify({ studentId, skillId }),
    }) as { success: boolean; data: BKTDiagnosisResult };

    if (!raw.success || !raw.data) {
      log.warn('BKT diagnosis failed', { studentId, skillId });
      return null;
    }

    return raw.data;
  } catch (error) {
    log.error('BKT diagnosis call failed', {
      studentId,
      skillId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Record evidence through the BKT service.
 */
async function recordEvidence(
  diagnosisId: string,
  itemId: string,
  correct: boolean
): Promise<{ id: string; diagnosisId: string; itemId: string; correct: boolean | null } | null> {
  try {
    const raw = await bktBreaker.fire('/api/bkt/evidence', {
      method: 'POST',
      body: JSON.stringify({
        diagnosisId,
        itemId,
        correct,
        confidence: 1.0, // Exam answers have high confidence
        quality: 'HIGH',
      }),
    }) as { success: boolean; data: { evidence: { id: string; diagnosisId: string; itemId: string; correct: boolean | null } } };

    if (!raw.success || !raw.data?.evidence) {
      log.warn('BKT evidence recording failed');
      return null;
    }

    return raw.data.evidence;
  } catch (error) {
    log.error('BKT evidence call failed', {
      diagnosisId,
      itemId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/* ─────────────────────────── Batch Processing ─────────────────────────── */

/**
 * Record BKT evidence for all answers in an exam attempt.
 * This is called after grading to update all related skills.
 * 
 * @param attemptId - The exam attempt ID
 * @param studentId - The student's ID
 * @param answers - Array of { questionId, isCorrect }
 * @returns Array of results (null for unmapped questions)
 */
export async function recordAttemptEvidence(
  attemptId: string,
  studentId: string,
  answers: Array<{ questionId: string; isCorrect: boolean }>
): Promise<Array<{ questionId: string; result: BKTEvidenceResult | null }>> {
  const results: Array<{ questionId: string; result: BKTEvidenceResult | null }> = [];

  log.info('Recording evidence for attempt', {
    attemptId,
    studentId,
    answerCount: answers.length,
  });

  // Process answers sequentially to avoid overwhelming the BKT service
  for (const answer of answers) {
    try {
      const result = await recordExamAnswerEvidence(
        studentId,
        attemptId,
        answer.questionId,
        answer.isCorrect
      );
      results.push({ questionId: answer.questionId, result });
    } catch (error) {
      log.error('Failed to record evidence for answer', {
        attemptId,
        questionId: answer.questionId,
        error: error instanceof Error ? error.message : String(error),
      });
      results.push({ questionId: answer.questionId, result: null });
    }
  }

  const successCount = results.filter(r => r.result !== null).length;
  log.info('Evidence recording completed', {
    attemptId,
    total: answers.length,
    success: successCount,
    skipped: answers.length - successCount,
  });

  return results;
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
