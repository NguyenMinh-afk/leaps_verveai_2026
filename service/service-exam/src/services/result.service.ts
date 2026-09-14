/**
 * Business logic for exam results and grading in service-exam.
 *
 * Responsibilities:
 *  - Get attempt results
 *  - Get student exam history
 *  - Get exam results summary
 *  - Grade attempts (manual grading)
 *  - List pending grading items
 */

import { prisma } from '../prisma/client.js';
import { NotFoundError, ValidationError } from '@verveai/error-types';
import { ForbiddenError } from '../errors.js';
import { logger } from '../utils/logger.js';
import { findActiveExamOrThrow } from './exam.service.js';

/* -------------------------------------------------------------------------- */
/*                              Public API                                    */
/* -------------------------------------------------------------------------- */

/**
 * Get result for a specific attempt.
 */
export async function getAttemptResult(
  attemptId: string,
  userId: string,
  userRole: string
) {
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: {
      exam: {
        select: {
          id: true,
          title: true,
          passing_score: true,
          max_score: true,
        },
      },
    },
  });

  if (!attempt) {
    throw new NotFoundError('ExamAttempt', attemptId);
  }

  // Authorization: students can only view their own, teachers can view theirs
  const isStudent = userRole === 'STUDENT';
  if (isStudent && attempt.student_id !== userId) {
    throw new ForbiddenError('FORBIDDEN', 'Students can only view their own results');
  }

  let passed: boolean | null = null;
  let percentage: number | null = null;
  if (attempt.status === 'GRADED' && attempt.score !== null) {
    percentage = attempt.exam.max_score
      ? (attempt.score / attempt.exam.max_score) * 100
      : null;
    passed =
      attempt.exam.passing_score
        ? attempt.score >= attempt.exam.passing_score
        : null;
  }

  return {
    id: attempt.id,
    examId: attempt.exam_id,
    examTitle: attempt.exam.title,
    studentId: attempt.student_id,
    status: attempt.status,
    score: attempt.score,
    maxScore: attempt.exam.max_score,
    passingScore: attempt.exam.passing_score,
    startedAt: attempt.started_at,
    submittedAt: attempt.submitted_at,
    passed,
    percentage,
    createdAt: attempt.created_at,
  };
}

/**
 * Get student's exam history.
 */
export async function getStudentExamHistory(
  studentId: string,
  pagination: { skip: number; take: number }
) {
  const where = {
    student_id: studentId,
    status: { in: ['SUBMITTED' as const, 'GRADED' as const] },
  };

  const [attempts, total] = await Promise.all([
    prisma.examAttempt.findMany({
      where,
      orderBy: { submitted_at: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            passing_score: true,
            max_score: true,
          },
        },
      },
    }),
    prisma.examAttempt.count({ where }),
  ]);

  const items = attempts.map((attempt) => {
    let passed: boolean | null = null;
    if (attempt.status === 'GRADED' && attempt.score !== null) {
      passed =
        attempt.exam.passing_score
          ? attempt.score >= attempt.exam.passing_score
          : null;
    }
    return {
      attemptId: attempt.id,
      examId: attempt.exam_id,
      examTitle: attempt.exam.title,
      score: attempt.score,
      maxScore: attempt.exam.max_score,
      passed,
      submittedAt: attempt.submitted_at,
    };
  });

  return { items, total, skip: pagination.skip, take: pagination.take };
}

/**
 * Get results for all attempts on an exam (teacher view).
 */
export async function getExamResults(
  examId: string,
  pagination: { skip: number; take: number }
) {
  await findActiveExamOrThrow(examId);

  const where = {
    exam_id: examId,
    status: { in: ['SUBMITTED' as const, 'GRADED' as const] },
  };

  const [attempts, total] = await Promise.all([
    prisma.examAttempt.findMany({
      where,
      orderBy: { submitted_at: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
      include: {
        exam: {
          select: {
            passing_score: true,
            max_score: true,
          },
        },
      },
    }),
    prisma.examAttempt.count({ where }),
  ]);

  const items = attempts.map((attempt) => {
    let passed: boolean | null = null;
    if (attempt.status === 'GRADED' && attempt.score !== null) {
      passed =
        attempt.exam.passing_score
          ? attempt.score >= attempt.exam.passing_score
          : null;
    }
    return {
      attemptId: attempt.id,
      studentId: attempt.student_id,
      status: attempt.status,
      score: attempt.score,
      maxScore: attempt.exam.max_score,
      passed,
      submittedAt: attempt.submitted_at,
    };
  });

  return { items, total, skip: pagination.skip, take: pagination.take };
}

/**
 * Get summary statistics for an exam.
 */
export async function getExamResultsSummary(examId: string) {
  const exam = await findActiveExamOrThrow(examId);

  const attempts = await prisma.examAttempt.findMany({
    where: {
      exam_id: examId,
      status: { in: ['SUBMITTED' as const, 'GRADED' as const] },
    },
  });

  const totalAttempts = attempts.length;
  const submittedAttempts = attempts.filter((a) => a.status === 'SUBMITTED').length;
  const gradedAttempts = attempts.filter((a) => a.status === 'GRADED').length;

  const gradedScores = attempts
    .filter((a) => a.status === 'GRADED' && a.score !== null)
    .map((a) => a.score as number);

  let averageScore: number | null = null;
  let highestScore: number | null = null;
  let lowestScore: number | null = null;
  let passRate: number | null = null;

  if (gradedScores.length > 0) {
    averageScore = gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length;
    highestScore = Math.max(...gradedScores);
    lowestScore = Math.min(...gradedScores);
    const passedCount = gradedScores.filter(
      (score) => score >= exam.passing_score
    ).length;
    passRate = (passedCount / gradedScores.length) * 100;
  }

  // Count unique students
  const uniqueStudents = new Set(attempts.map((a) => a.student_id)).size;

  return {
    examId,
    examTitle: exam.title,
    totalAttempts,
    submittedAttempts,
    gradedAttempts,
    averageScore,
    highestScore,
    lowestScore,
    passRate,
    totalStudents: uniqueStudents,
  };
}

/**
 * Grade an attempt (manual grading by teacher).
 */
export async function gradeAttempt(
  examId: string,
  attemptId: string,
  grades: Array<{
    questionId: string;
    isCorrect: boolean;
    pointsEarned: number;
  }>,
  totalScore: number,
  actingUserId: string,
  actingUserRole: string
) {
  // Verify exam exists and user has access
  const exam = await findActiveExamOrThrow(examId);

  const isAdmin = actingUserRole === 'ADMIN';
  if (!isAdmin && exam.teacher_id !== actingUserId) {
    throw new ForbiddenError('FORBIDDEN', 'Only the exam owner can grade attempts');
  }

  // Verify attempt exists and belongs to this exam
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
  });

  if (!attempt) {
    throw new NotFoundError('ExamAttempt', attemptId);
  }

  if (attempt.exam_id !== examId) {
    throw new ValidationError(
      [
        {
          path: ['attemptId'],
          message: 'Attempt does not belong to this exam',
          code: 'invalid_attempt',
        },
      ],
      'Invalid attempt'
    );
  }

  if (attempt.status === 'GRADED') {
    throw new ValidationError(
      [
        {
          path: ['attemptId'],
          message: 'Attempt is already graded',
          code: 'already_graded',
        },
      ],
      'Already graded'
    );
  }

  // Update answers with grading info
  await prisma.$transaction(async (tx) => {
    for (const grade of grades) {
      await tx.examAnswer.updateMany({
        where: {
          attempt_id: attemptId,
          question_id: grade.questionId,
        },
        data: {
          is_correct: grade.isCorrect,
          points_earned: grade.pointsEarned,
        },
      });
    }

    // Update attempt with total score and status
    await tx.examAttempt.update({
      where: { id: attemptId },
      data: {
        score: totalScore,
        status: 'GRADED',
      },
    });
  });

  logger.info('Attempt graded', {
    attemptId,
    examId,
    totalScore,
    gradedBy: actingUserId,
  });

  // Return the updated attempt
  return await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: {
      exam: {
        select: {
          id: true,
          title: true,
          passing_score: true,
          max_score: true,
        },
      },
    },
  });
}

/**
 * Get pending grading items for a teacher.
 */
export async function getPendingGrading(
  teacherId: string,
  pagination: { skip: number; take: number }
) {
  // Find all exams owned by this teacher
  const teacherExams = await prisma.exam.findMany({
    where: {
      teacher_id: teacherId,
      deleted_at: null,
    },
    select: { id: true, title: true },
  });

  const examIds = teacherExams.map((e) => e.id);
  const examTitles = new Map(teacherExams.map((e) => [e.id, e.title]));

  if (examIds.length === 0) {
    return { items: [], total: 0, skip: pagination.skip, take: pagination.take };
  }

  const where = {
    exam_id: { in: examIds },
    status: 'SUBMITTED' as const,
  };

  const [attempts, total] = await Promise.all([
    prisma.examAttempt.findMany({
      where,
      orderBy: { submitted_at: 'asc' },
      skip: pagination.skip,
      take: pagination.take,
      select: {
        id: true,
        exam_id: true,
        student_id: true,
        submitted_at: true,
      },
    }),
    prisma.examAttempt.count({ where }),
  ]);

  const items = attempts.map((attempt) => ({
    attemptId: attempt.id,
    examId: attempt.exam_id,
    examTitle: examTitles.get(attempt.exam_id) ?? 'Unknown',
    studentId: attempt.student_id,
    submittedAt: attempt.submitted_at,
  }));

  return { items, total, skip: pagination.skip, take: pagination.take };
}
