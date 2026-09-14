/**
 * Diagnosis Service (service-exam)
 * 
 * Handles diagnostic assessment sessions - lightweight assessments for
 * determining student mastery levels without being tied to full exams.
 * 
 * Flow:
 * 1. Start diagnosis session (creates session record)
 * 2. Get diagnosis questions (from content service via question IDs)
 * 3. Submit answer (records answer, triggers BKT evidence)
 * 4. Complete diagnosis (calculates final mastery, generates recommendations)
 */

import { prisma } from '../prisma/client.js';
import { NotFoundError, ValidationError } from '@verveai/error-types';
import { logger } from '../utils/logger.js';
import { recordAttemptEvidence } from './bkt-integration.service.js';

/* ─────────────────────────── Types ─────────────────────────── */

export type DiagnosisStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type MasteryLevel = 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';

export interface DiagnosisSessionRecord {
  id: string;
  studentId: string;
  skillId: string;
  skillName: string;
  status: DiagnosisStatus;
  questionsAnswered: number;
  totalQuestions: number;
  currentPKnown: number;
  result: DiagnosisResult | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiagnosisResult {
  pKnown: number;
  status: MasteryLevel;
  confidence: number;
  recommendations: string[];
}

export interface DiagnosisQuestion {
  id: string;
  content: string;
  options?: Array<{ id: string; text: string }>;
  correctAnswer?: string;
}

/* ─────────────────────────── Helpers ─────────────────────────── */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Thresholds aligned with service-bkt's BKT engine (bkt-engine.ts)
const MASTERY_THRESHOLD = 0.95;   // Must match BKT_PARAMS.MASTERY_THRESHOLD
const DIAGNOSED_THRESHOLD = 0.5;  // Must match BKT_PARAMS.DIAGNOSED_THRESHOLD
const STRUGGLING_MIN_ATTEMPTS = 5; // Must match STRUGGLING_MIN_ATTEMPTS

function toMasteryLevel(pKnown: number, evidenceCount: number): MasteryLevel {
  // Align with service-bkt's masteryStatus function
  if (evidenceCount === 0) return 'PENDING';
  if (pKnown >= MASTERY_THRESHOLD) return 'MASTERED';
  if (evidenceCount >= STRUGGLING_MIN_ATTEMPTS && pKnown < DIAGNOSED_THRESHOLD) return 'STRUGGLING';
  if (pKnown >= DIAGNOSED_THRESHOLD) return 'DIAGNOSED';
  return 'PENDING';
}

function calculateConfidence(pKnown: number, evidenceCount: number): number {
  // Align with service-bkt's diagnosisConfidence function
  // Returns a value in [0, 1] based on distance from 0.5
  const safeP = Math.max(0, Math.min(1, pKnown));
  const baseConfidence = Math.abs(safeP - 0.5) * 2; // Distance from indeterminate point
  // Increase confidence with more evidence
  const evidenceFactor = Math.min(evidenceCount / 10, 1);
  return Math.min(0.95, baseConfidence + (evidenceFactor * 0.15));
}

function generateRecommendations(pKnown: number, status: MasteryLevel): string[] {
  const recommendations: string[] = [];
  
  if (status === 'MASTERED') {
    recommendations.push('You have mastered this skill! Keep practicing to maintain your knowledge.');
    recommendations.push('Consider exploring more advanced topics.');
  } else if (status === 'DIAGNOSED') {
    if (pKnown >= 0.7) {
      recommendations.push('You are close to mastery. Keep practicing!');
    } else {
      recommendations.push('You are making progress. Focus on understanding the core concepts.');
    }
  } else if (status === 'STRUGGLING') {
    recommendations.push('Review the fundamental concepts before continuing.');
    recommendations.push('Consider requesting additional help from your teacher.');
    recommendations.push('Start with easier questions to build confidence.');
  }
  
  return recommendations;
}

/* ─────────────────────────── Server-Side Answer Validation ─────────────────────────── */

/**
 * Server-side answer validation.
 * 
 * SECURITY: The server MUST determine correctness, not the client.
 * The client should NEVER be trusted to determine if an answer is correct.
 */

interface QuestionMetadata {
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: Array<{ id: string; content: string }>;
  correctOptionIndex?: number;
  correctAnswer?: string;
}

/**
 * Get the authoritative correct answer for a question from the content database.
 * This is a server-side only operation - the client must never see the correct answer.
 */
async function getCorrectAnswer(questionId: string): Promise<{
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  correctOptionIndex?: number;
  correctAnswer?: string;
} | null> {
  const UUID_REGEX_CHECK = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!UUID_REGEX_CHECK.test(questionId)) {
    return null;
  }

  try {
    const contentItems = await prisma.$queryRaw<Array<{
      id: string;
      metadata: string | null;
    }>>`
      SELECT id, metadata FROM content.content_items WHERE id = ${questionId} LIMIT 1
    `;

    if (contentItems.length === 0 || !contentItems[0].metadata) {
      return null;
    }

    const metadata = JSON.parse(contentItems[0].metadata) as QuestionMetadata;
    
    return {
      type: metadata.type || 'short-answer',
      correctOptionIndex: metadata.correctOptionIndex,
      correctAnswer: metadata.correctAnswer,
    };
  } catch (err) {
    logger.error('Failed to get correct answer', { 
      questionId, 
      error: err instanceof Error ? err.message : String(err) 
    });
    return null;
  }
}

/**
 * Compare the student's answer with the authoritative correct answer.
 * Returns true if the answer is correct, false otherwise.
 * 
 * SECURITY: This function is called server-side only.
 */
function compareAnswer(
  type: 'multiple-choice' | 'true-false' | 'short-answer',
  submittedAnswer: string,
  correctOptionIndex?: number,
  correctAnswer?: string
): boolean {
  switch (type) {
    case 'multiple-choice': {
      // For multiple choice, the answer is the selected option index
      // Compare as strings since both are converted from user input
      const submittedIndex = parseInt(submittedAnswer, 10);
      if (isNaN(submittedIndex)) return false;
      return submittedIndex === correctOptionIndex;
    }
    
    case 'true-false': {
      // For true/false, the answer is "true" or "false" string
      const normalizedSubmitted = submittedAnswer.trim().toLowerCase();
      const correctValue = correctOptionIndex === 0 ? 'false' : 'true';
      return normalizedSubmitted === correctValue;
    }
    
    case 'short-answer':
    default: {
      // For short answer, do case-insensitive trimmed comparison
      const normalizedSubmitted = submittedAnswer.trim().toLowerCase();
      const normalizedCorrect = (correctAnswer || '').trim().toLowerCase();
      return normalizedSubmitted === normalizedCorrect;
    }
  }
}

/**
 * Server-side validation of a diagnosis answer.
 * Determines correctness by comparing with authoritative correct answer from content database.
 * 
 * SECURITY: This function must be called server-side only.
 * 
 * @returns The determined isCorrect value, or throws if validation fails
 */
export async function validateDiagnosisAnswerServerSide(
  questionId: string,
  submittedAnswer: string
): Promise<boolean> {
  if (!submittedAnswer || typeof submittedAnswer !== 'string') {
    throw new ValidationError(
      [{ path: ['answer'], message: 'Answer is required', code: 'invalid_input' }],
      'Invalid answer'
    );
  }

  const correctAnswerInfo = await getCorrectAnswer(questionId);
  
  if (!correctAnswerInfo) {
    throw new ValidationError(
      [{ path: ['questionId'], message: 'Question not found', code: 'not_found' }],
      'Question not found'
    );
  }

  const isCorrect = compareAnswer(
    correctAnswerInfo.type,
    submittedAnswer,
    correctAnswerInfo.correctOptionIndex,
    correctAnswerInfo.correctAnswer
  );

  logger.debug('Server-side answer validation', {
    questionId,
    type: correctAnswerInfo.type,
    isCorrect,
  });

  return isCorrect;
}

/* ─────────────────────────── Diagnosis Session Management ─────────────────────────── */

/**
 * Start a new diagnostic assessment session for a student on a specific skill.
 * Creates a session record and prepares questions for the diagnosis.
 */
export async function startDiagnosisSession(
  studentId: string,
  skillId: string,
  skillName: string,
  questionIds: string[],
  totalQuestions: number
): Promise<DiagnosisSessionRecord> {
  if (!UUID_REGEX.test(studentId)) {
    throw new ValidationError(
      [{ path: ['studentId'], message: 'studentId must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid student ID'
    );
  }
  
  if (!UUID_REGEX.test(skillId)) {
    throw new ValidationError(
      [{ path: ['skillId'], message: 'skillId must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid skill ID'
    );
  }
  
  if (questionIds.length === 0) {
    throw new ValidationError(
      [{ path: ['questionIds'], message: 'At least one question is required', code: 'too_small' }],
      'No questions provided'
    );
  }

  // Check for existing in-progress session for this student/skill
  const existing = await prisma.$queryRaw<Array<{
    id: string;
    student_id: string;
    skill_id: string;
    skill_name: string;
    status: DiagnosisStatus;
    questions_answered: number;
    total_questions: number;
    current_p_known: number;
    result: string | null;
    created_at: Date;
    updated_at: Date;
  }>>`
    SELECT * FROM exam.diagnosis_sessions 
    WHERE student_id = ${studentId} 
    AND skill_id = ${skillId} 
    AND status = 'IN_PROGRESS'
    LIMIT 1
  `;

  if (existing.length > 0) {
    const row = existing[0];
    return {
      id: row.id,
      studentId: row.student_id,
      skillId: row.skill_id,
      skillName: row.skill_name,
      status: row.status,
      questionsAnswered: row.questions_answered,
      totalQuestions: row.total_questions,
      currentPKnown: row.current_p_known,
      result: row.result ? JSON.parse(row.result) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Create new session
  await prisma.$executeRaw`
    INSERT INTO exam.diagnosis_sessions 
    (id, student_id, skill_id, skill_name, status, questions_answered, total_questions, current_p_known, result)
    VALUES (
      gen_random_uuid(),
      ${studentId},
      ${skillId},
      ${skillName},
      'IN_PROGRESS',
      0,
      ${totalQuestions},
      0.1,
      NULL
    )
  `;

  // Fetch the created session
  const created = await prisma.$queryRaw<Array<{
    id: string;
    student_id: string;
    skill_id: string;
    skill_name: string;
    status: DiagnosisStatus;
    questions_answered: number;
    total_questions: number;
    current_p_known: number;
    result: string | null;
    created_at: Date;
    updated_at: Date;
  }>>`
    SELECT * FROM exam.diagnosis_sessions 
    WHERE student_id = ${studentId} AND skill_id = ${skillId}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const row = created[0];
  logger.info('Diagnosis session started', { sessionId: row.id, studentId, skillId });

  return {
    id: row.id,
    studentId: row.student_id,
    skillId: row.skill_id,
    skillName: row.skill_name,
    status: row.status,
    questionsAnswered: row.questions_answered,
    totalQuestions: row.total_questions,
    currentPKnown: row.current_p_known,
    result: null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Get a diagnostic session by ID.
 */
export async function getDiagnosisSession(sessionId: string): Promise<DiagnosisSessionRecord | null> {
  const rows = await prisma.$queryRaw<Array<{
    id: string;
    student_id: string;
    skill_id: string;
    skill_name: string;
    status: DiagnosisStatus;
    questions_answered: number;
    total_questions: number;
    current_p_known: number;
    result: string | null;
    created_at: Date;
    updated_at: Date;
  }>>`
    SELECT * FROM exam.diagnosis_sessions WHERE id = ${sessionId} LIMIT 1
  `;

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    id: row.id,
    studentId: row.student_id,
    skillId: row.skill_id,
    skillName: row.skill_name,
    status: row.status,
    questionsAnswered: row.questions_answered,
    totalQuestions: row.total_questions,
    currentPKnown: row.current_p_known,
    result: row.result ? JSON.parse(row.result) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Get all diagnostic sessions for a student.
 */
export async function getStudentDiagnosisSessions(studentId: string): Promise<DiagnosisSessionRecord[]> {
  const rows = await prisma.$queryRaw<Array<{
    id: string;
    student_id: string;
    skill_id: string;
    skill_name: string;
    status: DiagnosisStatus;
    questions_answered: number;
    total_questions: number;
    current_p_known: number;
    result: string | null;
    created_at: Date;
    updated_at: Date;
  }>>`
    SELECT * FROM exam.diagnosis_sessions 
    WHERE student_id = ${studentId}
    ORDER BY updated_at DESC
  `;

  return rows.map(row => ({
    id: row.id,
    studentId: row.student_id,
    skillId: row.skill_id,
    skillName: row.skill_name,
    status: row.status,
    questionsAnswered: row.questions_answered,
    totalQuestions: row.total_questions,
    currentPKnown: row.current_p_known,
    result: row.result ? JSON.parse(row.result) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

/**
 * Submit an answer for a diagnosis session.
 * 
 * SECURITY: This function validates the answer server-side.
 * The client MUST NOT send isCorrect - it is determined by the server.
 */
export async function submitDiagnosisAnswer(
  sessionId: string,
  studentId: string,
  questionId: string,
  answer: string
): Promise<DiagnosisSessionRecord> {
  const session = await getDiagnosisSession(sessionId);
  
  if (!session) {
    throw new NotFoundError('DiagnosisSession', sessionId);
  }

  // Verify ownership
  if (session.studentId !== studentId) {
    throw new ValidationError(
      [{ path: ['sessionId'], message: 'Session does not belong to this student', code: 'forbidden' }],
      'Unauthorized access to diagnosis session'
    );
  }

  if (session.status === 'COMPLETED') {
    throw new ValidationError(
      [{ path: ['sessionId'], message: 'Session is already completed', code: 'invalid_state' }],
      'Cannot submit answers to completed session'
    );
  }

  // SECURITY: Server-side answer validation - client MUST NOT determine correctness
  const isCorrect = await validateDiagnosisAnswerServerSide(questionId, answer);

  // Record the answer
  await prisma.$executeRaw`
    INSERT INTO exam.diagnosis_answers 
    (id, session_id, question_id, answer, is_correct)
    VALUES (gen_random_uuid(), ${sessionId}, ${questionId}, ${answer}, ${isCorrect})
  `;

  // Get authoritative p_known from service-bkt
  // service-bkt is the AUTHORITATIVE source for BKT calculations
  let newPKnown = session.currentPKnown;
  
  try {
    // Call service-bkt to record evidence and get authoritative p_known
    const evidenceResult = await recordAttemptEvidence(
      sessionId,
      studentId,
      [{ questionId, isCorrect }]
    );
    
    if (evidenceResult && evidenceResult.length > 0 && evidenceResult[0].result) {
      // Use the authoritative p_known from service-bkt
      newPKnown = evidenceResult[0].result.diagnosis.pKnown;
    } else {
      // Fallback: If no skill mapping exists, use a neutral update
      // This maintains session state but doesn't affect BKT mastery
      logger.debug('No skill mapping found, using neutral BKT update', { questionId });
    }
  } catch (err) {
    logger.warn('Failed to record BKT evidence, maintaining session state', { 
      error: err instanceof Error ? err.message : String(err),
      sessionId
    });
    // Don't fail the answer submission if BKT fails
    // Just maintain the current p_known
  }

  // Update session
  const newQuestionsAnswered = session.questionsAnswered + 1;
  await prisma.$executeRaw`
    UPDATE exam.diagnosis_sessions 
    SET 
      questions_answered = ${newQuestionsAnswered},
      current_p_known = ${newPKnown},
      updated_at = NOW()
    WHERE id = ${sessionId}
  `;

  logger.info('Diagnosis answer submitted', { sessionId, questionId, isCorrect, newPKnown });

  // Return updated session
  const updated = await getDiagnosisSession(sessionId);
  return updated!;
}

/**
 * Complete a diagnostic session and generate final result.
 */
export async function completeDiagnosisSession(
  sessionId: string,
  studentId: string
): Promise<DiagnosisSessionRecord> {
  const session = await getDiagnosisSession(sessionId);
  
  if (!session) {
    throw new NotFoundError('DiagnosisSession', sessionId);
  }

  // Verify ownership
  if (session.studentId !== studentId) {
    throw new ValidationError(
      [{ path: ['sessionId'], message: 'Session does not belong to this student', code: 'forbidden' }],
      'Unauthorized access to diagnosis session'
    );
  }

  if (session.status === 'COMPLETED') {
    return session;
  }

  // Calculate final result
  const finalPKnown = session.currentPKnown;
  const confidence = calculateConfidence(finalPKnown, session.questionsAnswered);
  const status = toMasteryLevel(finalPKnown, session.questionsAnswered);
  const recommendations = generateRecommendations(finalPKnown, status);

  const result: DiagnosisResult = {
    pKnown: finalPKnown,
    status,
    confidence,
    recommendations,
  };

  // Update session to completed
  await prisma.$executeRaw`
    UPDATE exam.diagnosis_sessions 
    SET 
      status = 'COMPLETED',
      result = ${JSON.stringify(result)},
      updated_at = NOW()
    WHERE id = ${sessionId}
  `;

  logger.info('Diagnosis session completed', { 
    sessionId, 
    studentId, 
    finalPKnown, 
    status 
  });

  const completed = await getDiagnosisSession(sessionId);
  return completed!;
}

/**
 * Get diagnosis questions for a specific skill.
 * 
 * Questions are retrieved from the content service based on question-skill mappings.
 * Only approved questions are included in the diagnosis.
 * 
 * @param skillId - The skill ID to get questions for
 * @param count - Maximum number of questions to return (default 5)
 * @returns Array of diagnosis questions
 */
export async function getDiagnosisQuestions(
  skillId: string,
  count: number = 5
): Promise<DiagnosisQuestion[]> {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!UUID_REGEX.test(skillId)) {
    logger.warn('Invalid skillId format', { skillId });
    return [];
  }

  try {
    // Get question IDs mapped to this skill from question_skill_mappings table
    const mappings = await prisma.questionSkillMapping.findMany({
      where: { skill_id: skillId },
      select: { question_id: true },
      take: count * 2, // Fetch more to allow for filtering
    });

    if (mappings.length === 0) {
      logger.info('No questions mapped to skill', { skillId });
      return [];
    }

    const questionIds = mappings.map(m => m.question_id);

    // Fetch question details from content service via direct DB access
    // In production, this would be a proper service call, but for now
    // we query the content database directly to get question content
    const contentItems = await prisma.$queryRaw<Array<{
      id: string;
      body: string;
      body_vi: string | null;
      metadata: string | null;
    }>>`
      SELECT id, body, body_vi, metadata 
      FROM content.content_items 
      WHERE id = ANY(${questionIds})
      AND metadata->>'status' = 'APPROVED'
      LIMIT ${count}
    `;

    // Transform to DiagnosisQuestion format
    const questions: DiagnosisQuestion[] = contentItems.map(item => {
      let metadata: Record<string, unknown> = {};
      if (item.metadata) {
        try {
          metadata = JSON.parse(item.metadata);
        } catch {
          // Ignore parse errors
        }
      }

      const options = metadata.options as Array<{ id: string; content: string }> | undefined;
      
      return {
        id: item.id,
        content: item.body,
        options: options?.map(opt => ({
          id: opt.id || String(Math.random()),
          text: opt.content,
        })),
      };
    });

    logger.info('Retrieved diagnosis questions', { 
      skillId, 
      count: questions.length,
      requested: count 
    });

    return questions;

  } catch (err) {
    logger.error('Failed to get diagnosis questions', { 
      skillId, 
      error: err instanceof Error ? err.message : String(err) 
    });
    return [];
  }
}
