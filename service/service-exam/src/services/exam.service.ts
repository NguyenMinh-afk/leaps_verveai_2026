/**
 * Exam Service for VERVE AI
 * 
 * Handles exam CRUD, attempt management, and result calculation.
 */

import { prisma } from '../prisma/client.js';
import { NotFoundError, ValidationError } from '@verveai/error-types';
import { ForbiddenError } from '../errors.js';
import { logger } from '../utils/logger.js';
import { recordAttemptEvidence } from './bkt-integration.service.js';

/* ─────────────────────────── Types ─────────────────────────── */

export interface ExamRecord {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  description: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  timeLimitMinutes: number | null;
  passingScore: number;
  maxScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamDetail extends ExamRecord {
  questions: ExamQuestionRecord[];
}

export interface ExamQuestionRecord {
  id: string;
  examId: string;
  questionId: string;
  points: number;
  orderIndex: number;
  required: boolean;
}

export interface ExamAttemptRecord {
  id: string;
  examId: string;
  studentId: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'MANUAL_REVIEW' | 'COMPLETED';
  score: number | null;
  maxScore: number | null;
  percentage: number | null;
  startedAt: Date;
  submittedAt: Date | null;
  gradedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamAnswerRecord {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOptions: string[];
  textAnswer: string | null;
  isCorrect: boolean | null;
  pointsEarned: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/* ─────────────────────────── Helpers ─────────────────────────── */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toExamRecord(row: {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  time_limit: number | null;
  passing_score: number;
  max_score: number;
  max_attempts: number;
  shuffle_questions: boolean;
  show_results_immediately: boolean;
  created_at: Date;
  updated_at: Date;
}): ExamRecord {
  return {
    id: row.id,
    classId: row.class_id,
    teacherId: row.teacher_id,
    title: row.title,
    description: row.description,
    status: row.status,
    timeLimitMinutes: row.time_limit,
    passingScore: row.passing_score,
    maxScore: row.max_score,
    maxAttempts: row.max_attempts,
    shuffleQuestions: row.shuffle_questions,
    showResultsImmediately: row.show_results_immediately,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toQuestionRecord(row: {
  id: string;
  exam_id: string;
  question_id: string;
  points: number;
  order_index: number;
  required: boolean;
}): ExamQuestionRecord {
  return {
    id: row.id,
    examId: row.exam_id,
    questionId: row.question_id,
    points: row.points,
    orderIndex: row.order_index,
    required: row.required,
  };
}

function toAttemptRecord(row: {
  id: string;
  exam_id: string;
  student_id: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'MANUAL_REVIEW' | 'COMPLETED';
  score: number | null;
  max_score: number | null;
  percentage: number | null;
  started_at: Date;
  submitted_at: Date | null;
  graded_at: Date | null;
  created_at: Date;
  updated_at: Date;
}): ExamAttemptRecord {
  return {
    id: row.id,
    examId: row.exam_id,
    studentId: row.student_id,
    status: row.status,
    score: row.score,
    maxScore: row.max_score,
    percentage: row.percentage,
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
    gradedAt: row.graded_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findActiveExamOrThrow(id: string) {
  if (!UUID_REGEX.test(id)) {
    throw new ValidationError(
      [{ path: ['id'], message: 'id must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid exam id'
    );
  }
  const row = await prisma.exam.findFirst({
    where: { id, deleted_at: null },
  });
  if (!row) {
    throw new NotFoundError('Exam', id);
  }
  return row;
}

/* ─────────────────────────── Exam CRUD ─────────────────────────── */

export async function createExam(input: {
  classId: string;
  title: string;
  description?: string;
  timeLimitMinutes?: number;
  passingScore?: number;
  maxScore?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  showResultsImmediately?: boolean;
}, teacherId: string): Promise<ExamDetail> {
  const exam = await prisma.exam.create({
    data: {
      class_id: input.classId,
      teacher_id: teacherId,
      title: input.title,
      description: input.description ?? null,
      time_limit: input.timeLimitMinutes ?? null,
      passing_score: input.passingScore ?? 60,
      max_score: input.maxScore ?? 100,
      max_attempts: input.maxAttempts ?? 1,
      shuffle_questions: input.shuffleQuestions ?? false,
      show_results_immediately: input.showResultsImmediately ?? true,
    },
    include: {
      questions: true,
    },
  });

  logger.info('Exam created', { examId: exam.id, teacherId });

  return {
    ...toExamRecord(exam),
    questions: exam.questions.map(toQuestionRecord),
  };
}

export async function getExam(id: string): Promise<ExamDetail> {
  const exam = await findActiveExamOrThrow(id);
  const questions = await prisma.examQuestion.findMany({
    where: { exam_id: id },
    orderBy: { order_index: 'asc' },
  });

  return {
    ...toExamRecord(exam),
    questions: questions.map(toQuestionRecord),
  };
}

export async function listExams(filters: {
  teacherId?: string;
  classId?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}, pagination: { skip: number; take: number }) {
  const where: Record<string, unknown> = { deleted_at: null };
  if (filters.teacherId) where.teacher_id = filters.teacherId;
  if (filters.classId) where.class_id = filters.classId;
  if (filters.status) where.status = filters.status;

  const [exams, total] = await Promise.all([
    prisma.exam.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.exam.count({ where }),
  ]);

  return {
    items: exams.map(toExamRecord),
    total,
    skip: pagination.skip,
    take: pagination.take,
  };
}

export async function updateExam(id: string, input: Partial<ExamRecord>, actingUserId: string, actingUserRole: string): Promise<ExamDetail> {
  const existing = await findActiveExamOrThrow(id);

  if (actingUserRole !== 'ADMIN' && existing.teacher_id !== actingUserId) {
    throw new ForbiddenError('FORBIDDEN', 'Only the owning teacher or admin can update this exam');
  }

  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.status !== undefined) data.status = input.status;
  if (input.timeLimitMinutes !== undefined) data.time_limit = input.timeLimitMinutes;
  if (input.passingScore !== undefined) data.passing_score = input.passingScore;
  if (input.maxAttempts !== undefined) data.max_attempts = input.maxAttempts;
  if (input.shuffleQuestions !== undefined) data.shuffle_questions = input.shuffleQuestions;
  if (input.showResultsImmediately !== undefined) data.show_results_immediately = input.showResultsImmediately;

  const exam = await prisma.exam.update({
    where: { id },
    data,
    include: { questions: true },
  });

  logger.info('Exam updated', { examId: id, fields: Object.keys(data) });

  return {
    ...toExamRecord(exam),
    questions: exam.questions.map(toQuestionRecord),
  };
}

export async function deleteExam(id: string, actingUserId: string, actingUserRole: string): Promise<void> {
  const existing = await findActiveExamOrThrow(id);

  if (actingUserRole !== 'ADMIN' && existing.teacher_id !== actingUserId) {
    throw new ForbiddenError('FORBIDDEN', 'Only the owning teacher or admin can delete this exam');
  }

  await prisma.exam.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  logger.info('Exam soft-deleted', { examId: id });
}

/* ─────────────────────────── Exam Questions ─────────────────────────── */

export async function addExamQuestions(examId: string, questionIds: string[], teacherId: string, actingUserRole: string): Promise<void> {
  const exam = await findActiveExamOrThrow(examId);

  if (actingUserRole !== 'ADMIN' && exam.teacher_id !== teacherId) {
    throw new ForbiddenError('FORBIDDEN', 'Only the owning teacher can modify questions');
  }

  await prisma.examQuestion.createMany({
    data: questionIds.map((question_id, index) => ({
      exam_id: examId,
      question_id,
      points: 1,
      order_index: index,
      required: true,
    })),
  });
}

export async function getExamQuestions(examId: string): Promise<ExamQuestionRecord[]> {
  await findActiveExamOrThrow(examId);
  const questions = await prisma.examQuestion.findMany({
    where: { exam_id: examId },
    orderBy: { order_index: 'asc' },
  });
  return questions.map(toQuestionRecord);
}

/* ─────────────────────────── Attempt Management ─────────────────────────── */

export async function startAttempt(examId: string, studentId: string): Promise<ExamAttemptRecord> {
  await findActiveExamOrThrow(examId);

  // Check for existing in-progress attempt
  const existing = await prisma.examAttempt.findFirst({
    where: { exam_id: examId, student_id: studentId, status: 'IN_PROGRESS' },
  });

  if (existing) {
    return toAttemptRecord(existing);
  }

  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  const attempt = await prisma.examAttempt.create({
    data: {
      exam_id: examId,
      student_id: studentId,
      status: 'IN_PROGRESS',
      started_at: new Date(),
      max_score: exam?.max_score ?? 100,
    },
  });

  logger.info('Exam attempt started', { attemptId: attempt.id, examId, studentId });
  return toAttemptRecord(attempt);
}

export async function getAttempt(attemptId: string, userId: string, userRole: string): Promise<ExamAttemptRecord> {
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
  });

  if (!attempt) {
    throw new NotFoundError('ExamAttempt', attemptId);
  }

  if (userRole === 'STUDENT' && attempt.student_id !== userId) {
    throw new ForbiddenError('FORBIDDEN', 'Students can only view their own attempts');
  }

  return toAttemptRecord(attempt);
}

export async function submitAttempt(attemptId: string, answers: Array<{
  questionId: string;
  selectedOptions?: string[];
  textAnswer?: string;
}>, studentId: string): Promise<ExamAttemptRecord> {
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
  });

  if (!attempt) {
    throw new NotFoundError('ExamAttempt', attemptId);
  }

  if (attempt.student_id !== studentId) {
    throw new ForbiddenError('FORBIDDEN', 'Students can only submit their own attempts');
  }

  if (attempt.status !== 'IN_PROGRESS') {
    throw new ValidationError(
      [{ path: ['status'], message: `Cannot submit attempt in ${attempt.status} status`, code: 'invalid_status' }],
      'Cannot submit attempt'
    );
  }

  const now = new Date();

  const updated = await prisma.$transaction(async (tx) => {
    // Save answers
    for (const answer of answers) {
      await tx.examAnswer.upsert({
        where: {
          attempt_id_question_id: { attempt_id: attemptId, question_id: answer.questionId },
        },
        create: {
          attempt_id: attemptId,
          question_id: answer.questionId,
          selected_options: answer.selectedOptions ?? [],
          text_answer: answer.textAnswer ?? null,
        },
        update: {
          selected_options: answer.selectedOptions ?? [],
          text_answer: answer.textAnswer ?? null,
        },
      });
    }

    // Update attempt status
    return tx.examAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'SUBMITTED',
        submitted_at: now,
      },
    });
  });

  logger.info('Exam attempt submitted', { attemptId, studentId, answerCount: answers.length });
  return toAttemptRecord(updated);
}

export async function getStudentAttempts(studentId: string, pagination: { skip: number; take: number }) {
  const [attempts, total] = await Promise.all([
    prisma.examAttempt.findMany({
      where: { student_id: studentId },
      orderBy: { created_at: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.examAttempt.count({ where: { student_id: studentId } }),
  ]);

  return {
    items: attempts.map(toAttemptRecord),
    total,
    skip: pagination.skip,
    take: pagination.take,
  };
}

/* ─────────────────────────── Results ─────────────────────────── */

export async function gradeAttempt(
  attemptId: string,
  gradingRules: Array<{
    questionId: string;
    correctAnswer: string | string[];
    points: number;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
  }>,
  _teacherId: string
): Promise<ExamAttemptRecord> {
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: { answers: true },
  });

  if (!attempt) {
    throw new NotFoundError('ExamAttempt', attemptId);
  }

  if (attempt.status !== 'SUBMITTED') {
    throw new ValidationError(
      [{ path: ['status'], message: 'Attempt must be SUBMITTED to grade', code: 'invalid_status' }],
      'Cannot grade attempt'
    );
  }

  let totalScore = 0;
  let totalMaxScore = 0;

  // Grade each answer
  for (const rule of gradingRules) {
    const answer = attempt.answers.find(a => a.question_id === rule.questionId);
    if (!answer) continue;

    let isCorrect = false;
    let pointsEarned = 0;

    if (rule.type === 'multiple_choice' || rule.type === 'true_false') {
      const correctArr = Array.isArray(rule.correctAnswer) ? rule.correctAnswer : [rule.correctAnswer];
      const studentArr = answer.selected_options;
      
      isCorrect = correctArr.length === studentArr.length &&
        correctArr.every(c => studentArr.includes(c));
      pointsEarned = isCorrect ? rule.points : 0;
    }

    totalScore += pointsEarned;
    totalMaxScore += rule.points;

    await prisma.examAnswer.update({
      where: { id: answer.id },
      data: { is_correct: isCorrect, points_earned: pointsEarned },
    });
  }

  const percentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
  const exam = await prisma.exam.findUnique({ where: { id: attempt.exam_id } });
  const passed = percentage >= (exam?.passing_score ?? 60);

  // Update the attempt with grading results
  const updated = await prisma.examAttempt.update({
    where: { id: attemptId },
    data: {
      score: totalScore,
      percentage,
      status: passed ? 'GRADED' : 'MANUAL_REVIEW',
      graded_at: new Date(),
    },
  });

  logger.info('Attempt graded', { attemptId, score: totalScore, percentage, passed });

  // ─────────────────────────────────────────────────────────────────────────────
  // BKT Integration: Record evidence asynchronously after grading
  // This is non-blocking: grading succeeds even if BKT processing fails.
  // The idempotency field prevents duplicate evidence on retry.
  // ─────────────────────────────────────────────────────────────────────────────
  processBKTEvidenceAsync(attemptId, attempt.student_id, attempt.answers).catch((err) => {
    logger.error('BKT evidence recording failed (non-blocking)', {
      attemptId,
      error: err instanceof Error ? err.message : String(err),
    });
  });

  return toAttemptRecord(updated);
}

/**
 * Process BKT evidence asynchronously after exam grading.
 * Uses idempotency to prevent duplicate evidence recording.
 */
async function processBKTEvidenceAsync(
  attemptId: string,
  studentId: string,
  answers: Array<{ question_id: string; is_correct: boolean | null }>
): Promise<void> {
  // Check idempotency: only process if evidence hasn't been sent yet
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    select: { bkt_evidence_sent_at: true },
  });

  if (attempt?.bkt_evidence_sent_at) {
    logger.debug('BKT evidence already sent for attempt', { attemptId });
    return;
  }

  // Prepare evidence data
  const evidenceData = answers
    .filter(a => a.is_correct !== null)
    .map(a => ({
      questionId: a.question_id,
      isCorrect: a.is_correct as boolean,
    }));

  if (evidenceData.length === 0) {
    logger.debug('No graded answers to send to BKT', { attemptId });
    // Mark as processed even with no evidence to prevent retries
    await prisma.examAttempt.update({
      where: { id: attemptId },
      data: { bkt_evidence_sent_at: new Date() },
    });
    return;
  }

  // Record evidence through BKT integration service
  const results = await recordAttemptEvidence(attemptId, studentId, evidenceData);

  const successCount = results.filter(r => r.result !== null).length;
  const failCount = results.filter(r => r.result === null).length;

  logger.info('BKT evidence processing completed', {
    attemptId,
    total: evidenceData.length,
    success: successCount,
    failed: failCount,
  });

  // Mark evidence as sent (even if some failed - those questions likely have no skill mapping)
  await prisma.examAttempt.update({
    where: { id: attemptId },
    data: { bkt_evidence_sent_at: new Date() },
  });
}

export async function getAttemptResults(attemptId: string, userId: string, userRole: string) {
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: { answers: true, exam: true },
  });

  if (!attempt) {
    throw new NotFoundError('ExamAttempt', attemptId);
  }

  if (userRole === 'STUDENT' && attempt.student_id !== userId) {
    throw new ForbiddenError('FORBIDDEN', 'Students can only view their own results');
  }

  return {
    attemptId: attempt.id,
    examId: attempt.exam_id,
    examTitle: attempt.exam.title,
    studentId: attempt.student_id,
    score: attempt.score ?? 0,
    maxScore: attempt.max_score ?? 0,
    percentage: attempt.percentage ?? 0,
    passed: (attempt.percentage ?? 0) >= attempt.exam.passing_score,
    status: attempt.status,
    startedAt: attempt.started_at,
    submittedAt: attempt.submitted_at,
    gradedAt: attempt.graded_at,
    answers: attempt.answers.map(a => ({
      questionId: a.question_id,
      selectedOptions: a.selected_options,
      textAnswer: a.text_answer,
      isCorrect: a.is_correct,
      pointsEarned: a.points_earned,
    })),
  };
}

export async function getExamResults(examId: string, teacherId: string) {
  const exam = await findActiveExamOrThrow(examId);

  if (exam.teacher_id !== teacherId) {
    throw new ForbiddenError('FORBIDDEN', 'Only the owning teacher can view results');
  }

  const attempts = await prisma.examAttempt.findMany({
    where: { exam_id: examId },
    orderBy: { submitted_at: 'desc' },
  });

  return attempts.map(a => ({
    attemptId: a.id,
    studentId: a.student_id,
    score: a.score ?? 0,
    maxScore: a.max_score ?? 0,
    percentage: a.percentage ?? 0,
    passed: (a.percentage ?? 0) >= exam.passing_score,
    status: a.status,
    submittedAt: a.submitted_at,
  }));
}

/* ─────────────────────────── Admin Stats ─────────────────────────── */

export async function getExamStatsAdmin() {
  const [total, draft, published, archived, totalAttempts, gradedAttempts] = await Promise.all([
    prisma.exam.count({ where: { deleted_at: null } }),
    prisma.exam.count({ where: { deleted_at: null, status: 'DRAFT' } }),
    prisma.exam.count({ where: { deleted_at: null, status: 'PUBLISHED' } }),
    prisma.exam.count({ where: { deleted_at: null, status: 'ARCHIVED' } }),
    prisma.examAttempt.count(),
    prisma.examAttempt.count({ where: { status: { in: ['GRADED', 'COMPLETED'] } } }),
  ]);

  return {
    total,
    draft,
    published,
    archived,
    totalAttempts,
    completedAttempts: gradedAttempts,
  };
}
