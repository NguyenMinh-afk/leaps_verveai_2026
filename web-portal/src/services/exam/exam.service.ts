// ============================================
// VERVE AI - Exam Service
// Integrated with real backend API
// ============================================

import {
  listExams as apiListExams,
  getExam as apiGetExam,
  getExamQuestions as apiGetExamQuestions,
  startExamAttempt as apiStartExamAttempt,
  getAttempt as apiGetAttempt,
  submitExamAttempt,
  getStudentAttempts as apiGetStudentAttempts,
  getAttemptResults as apiGetAttemptResults,
  type ExamRecord,
  type ExamDetail,
  type ExamAttemptRecord,
  type ExamQuestionRecord,
  type ExamResultDetail,
  type ExamAnswerInput,
  type QuestionType,
} from '@/lib/api/exam';

import {
  getQuestions,
  type Question,
  type QuestionOption,
} from '@/lib/api/content';

import type { StudentExam, ExamResult } from '@/types';

/**
 * Question types supported
 */
export type ExamQuestionType = QuestionType; // 'multiple-choice' | 'true-false' | 'short-answer'

/**
 * Unified exam question for frontend
 * Combines exam question metadata with full content from content service
 */
export interface ExamQuestion {
  id: string;              // ExamQuestion record ID
  examId: string;
  questionId: string;      // Content service question ID
  points: number;
  orderIndex: number;
  required: boolean;
  
  // Full question content from content service
  content: {
    id: string;
    title: string;
    body: string;
    bodyVi?: string;
    type: ExamQuestionType;
    difficulty: 'easy' | 'medium' | 'hard';
    topic?: string;
    topicVi?: string;
    options?: QuestionOption[];      // For multiple-choice
    correctOptionIndex?: number;      // For multiple-choice (hidden from student)
    correctAnswer?: string;           // For true-false, short-answer (hidden from student)
    explanation?: string;
    explanationVi?: string;
  };
}

/**
 * Student answer for submission
 * Handles all question types
 */
export interface StudentAnswer {
  questionId: string;
  selectedOptions?: string[];  // For multiple-choice and true-false
  textAnswer?: string;         // For short-answer
}

/**
 * Exam session state
 */
export interface ExamSession {
  examId: string;
  attemptId: string;
  exam: StudentExam;
  questions: ExamQuestion[];
  answers: Record<string, StudentAnswer>; // questionId -> answer
  startedAt: Date;
  timeLimit?: number; // minutes
  isSubmitted: boolean;
  submittedAt?: Date;
}

// ============================================
// Mappers
// ============================================

/**
 * Convert backend ExamRecord to StudentExam
 */
function toStudentExam(record: ExamRecord): StudentExam {
  return {
    id: record.id,
    title: record.title,
    titleVi: record.title,
    description: record.description || '',
    descriptionVi: record.description || '',
    classId: record.classId,
    className: 'Class', // Will be populated from class service if needed
    teacherName: 'Teacher', // Will be populated from user service if needed
    status: record.status === 'PUBLISHED' ? 'available' : 'upcoming',
    durationMinutes: record.timeLimitMinutes || 30,
    questionCount: 0, // Will be updated when loading exam detail
    attempts: 0,
    maxAttempts: record.maxAttempts,
  };
}

/**
 * Convert backend ExamDetail to StudentExam
 */
function toStudentExamFromDetail(detail: ExamDetail): StudentExam {
  return {
    id: detail.id,
    title: detail.title,
    titleVi: detail.title,
    description: detail.description || '',
    descriptionVi: detail.description || '',
    classId: detail.classId,
    className: 'Class',
    teacherName: 'Teacher',
    status: detail.status === 'PUBLISHED' ? 'available' : 'upcoming',
    durationMinutes: detail.timeLimitMinutes || 30,
    questionCount: detail.questions.length,
    attempts: 0,
    maxAttempts: detail.maxAttempts,
  };
}

/**
 * Convert content service Question to ExamQuestion content
 */
function toQuestionContent(question: Question): ExamQuestion['content'] {
  return {
    id: question.id,
    title: question.title,
    body: question.body,
    bodyVi: question.bodyVi || question.metadata.contentVi,
    type: question.metadata.type,
    difficulty: question.difficultyLabel,
    topic: question.topic || question.metadata.topicName,
    topicVi: question.metadata.topicNameVi,
    options: question.metadata.options?.map((opt, idx) => ({
      id: opt.id || `opt-${idx}`,
      content: opt.content,
      contentVi: opt.contentVi,
    })),
    // CORRECT ANSWERS ARE NOT EXPOSED TO STUDENTS
    // These will be populated server-side after grading
    correctOptionIndex: question.metadata.correctOptionIndex,
    correctAnswer: question.metadata.correctAnswer,
    explanation: question.metadata.explanation,
    explanationVi: question.metadata.explanationVi,
  };
}

/**
 * Convert ExamQuestionRecord + Question content to ExamQuestion
 */
function toExamQuestion(
  record: ExamQuestionRecord,
  content: Question
): ExamQuestion {
  return {
    id: record.id,
    examId: record.examId,
    questionId: record.questionId,
    points: record.points,
    orderIndex: record.orderIndex,
    required: record.required,
    content: toQuestionContent(content),
  };
}

/**
 * Convert backend ExamAttemptRecord to ExamResult
 */
function toExamResult(
  attempt: ExamAttemptRecord,
  examTitle: string,
  classId: string,
  className: string
): ExamResult {
  return {
    id: attempt.id,
    examId: attempt.examId,
    examTitle: examTitle,
    examTitleVi: examTitle,
    classId: classId,
    className: className,
    status: 'completed',
    score: attempt.score ?? 0,
    maxScore: attempt.maxScore ?? 0,
    percentage: attempt.percentage ?? 0,
    timeSpentMinutes: 0,
    completedAt: attempt.submittedAt ? new Date(attempt.submittedAt) : new Date(),
    masteryImpact: 0,
    strengths: [],
    strengthsVi: [],
    areasForImprovement: [],
    areasForImprovementVi: [],
  };
}

/**
 * Convert backend ExamResultDetail to frontend ExamResult
 */
function toExamResultDetail(result: ExamResultDetail): ExamResult {
  return {
    id: result.attemptId,
    examId: result.examId,
    examTitle: result.examTitle,
    examTitleVi: result.examTitle,
    classId: '',
    className: 'Class',
    status: 'completed',
    score: result.score,
    maxScore: result.maxScore,
    percentage: result.percentage,
    timeSpentMinutes: 0,
    completedAt: result.submittedAt ? new Date(result.submittedAt) : new Date(),
    masteryImpact: 0,
    strengths: [],
    strengthsVi: [],
    areasForImprovement: [],
    areasForImprovementVi: [],
  };
}

// ============================================
// Service State
// ============================================

let activeSession: ExamSession | null = null;

// ============================================
// Service Functions
// ============================================

export const examService = {
  /**
   * Get list of exams
   */
  async getExams(params?: {
    skip?: number;
    take?: number;
    status?: 'available' | 'upcoming' | 'completed';
  }): Promise<{ exams: StudentExam[]; total: number }> {
    try {
      let status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | undefined;
      if (params?.status === 'available') status = 'PUBLISHED';
      else if (params?.status === 'upcoming') status = 'DRAFT';

      const result = await apiListExams({
        skip: params?.skip,
        take: params?.take,
        status,
      });

      return {
        exams: result.items.map(toStudentExam),
        total: result.total,
      };
    } catch {
      return { exams: [], total: 0 };
    }
  },

  /**
   * Get exam by ID
   */
  async getExamById(id: string): Promise<StudentExam | null> {
    try {
      const detail = await apiGetExam(id);
      return toStudentExamFromDetail(detail);
    } catch {
      return null;
    }
  },

  /**
   * Fetch full question content from content service
   */
  async getExamQuestionsWithContent(examId: string): Promise<ExamQuestion[]> {
    // Get question references from exam service
    const questionsResponse = await apiGetExamQuestions(examId);
    const questionRecords = questionsResponse.questions;

    if (questionRecords.length === 0) {
      return [];
    }

    // Extract question IDs
    const questionIds = questionRecords.map((q) => q.questionId);

    // Fetch full question content from content service
    const questions = await getQuestions(questionIds);

    // Create a map for quick lookup
    const questionMap = new Map<string, Question>();
    for (const q of questions) {
      questionMap.set(q.id, q);
    }

    // Combine records with content, maintaining order
    const result: ExamQuestion[] = [];
    for (const record of questionRecords) {
      const content = questionMap.get(record.questionId);
      if (content) {
        result.push(toExamQuestion(record, content));
      } else {
        console.warn(`Question not found: ${record.questionId}`);
      }
    }

    return result;
  },

  /**
   * Start exam session
   * Flow: Start Attempt → Get Questions → Load Content → Create Session
   */
  async startExam(examId: string): Promise<{ success: boolean; session?: ExamSession; error?: string }> {
    try {
      // 1. Start attempt on backend
      const attempt = await apiStartExamAttempt(examId);

      // 2. Get exam details
      const examDetail = await apiGetExam(examId);

      // 3. Fetch full question content from content service
      const questions = await this.getExamQuestionsWithContent(examId);

      // 4. Create session
      activeSession = {
        examId,
        attemptId: attempt.id,
        exam: toStudentExamFromDetail(examDetail),
        questions,
        answers: {},
        startedAt: new Date(attempt.startedAt),
        timeLimit: examDetail.timeLimitMinutes || undefined,
        isSubmitted: false,
      };

      return { success: true, session: activeSession };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start exam';
      return { success: false, error: message };
    }
  },

  /**
   * Get current exam session
   */
  getSession(): ExamSession | null {
    return activeSession;
  },

  /**
   * Set session (for restoring from existing attempt)
   */
  setSession(session: ExamSession): void {
    activeSession = session;
  },

  /**
   * Select answer for multiple-choice question
   */
  selectAnswer(questionId: string, optionIndex: number): void {
    if (activeSession && !activeSession.isSubmitted) {
      activeSession.answers[questionId] = {
        questionId,
        selectedOptions: [String(optionIndex)],
      };
    }
  },

  /**
   * Select answer for true-false question
   */
  selectTrueFalse(questionId: string, isTrue: boolean): void {
    if (activeSession && !activeSession.isSubmitted) {
      activeSession.answers[questionId] = {
        questionId,
        selectedOptions: [isTrue ? 'true' : 'false'],
      };
    }
  },

  /**
   * Enter text answer for short-answer question
   */
  setTextAnswer(questionId: string, text: string): void {
    if (activeSession && !activeSession.isSubmitted) {
      activeSession.answers[questionId] = {
        questionId,
        textAnswer: text,
      };
    }
  },

  /**
   * Clear answer for a question
   */
  clearAnswer(questionId: string): void {
    if (activeSession && !activeSession.isSubmitted) {
      delete activeSession.answers[questionId];
    }
  },

  /**
   * Submit exam
   * Converts all answers to backend format and submits
   */
  async submitExam(): Promise<{ success: boolean; result?: ExamResult; error?: string }> {
    if (!activeSession) {
      return { success: false, error: 'No active exam session' };
    }

    if (activeSession.isSubmitted) {
      return { success: false, error: 'Exam already submitted' };
    }

    try {
      // Convert answers to backend format
      const answers: ExamAnswerInput[] = Object.values(activeSession.answers).map((answer) => ({
        questionId: answer.questionId,
        selectedOptions: answer.selectedOptions,
        textAnswer: answer.textAnswer,
      }));

      // Submit to backend
      const attempt = await submitExamAttempt(activeSession.attemptId, answers);

      activeSession.isSubmitted = true;
      activeSession.submittedAt = new Date();

      // Build result
      const result: ExamResult = {
        id: attempt.id,
        examId: activeSession.examId,
        examTitle: activeSession.exam.title,
        examTitleVi: activeSession.exam.titleVi,
        classId: activeSession.exam.classId,
        className: activeSession.exam.className || 'Class',
        status: 'completed',
        score: attempt.score ?? 0,
        maxScore: attempt.maxScore ?? activeSession.questions.length,
        percentage: attempt.percentage ?? 0,
        timeSpentMinutes: Math.round(
          (Date.now() - activeSession.startedAt.getTime()) / 60000
        ),
        completedAt: new Date(),
        masteryImpact: (attempt.percentage ?? 0) >= 80 ? 0.05 : (attempt.percentage ?? 0) >= 60 ? 0.02 : 0,
        strengths: (attempt.percentage ?? 0) >= 60 ? ['Completed exam'] : [],
        strengthsVi: (attempt.percentage ?? 0) >= 60 ? ['Hoàn thành bài kiểm tra'] : [],
        areasForImprovement: (attempt.percentage ?? 0) < 60 ? ['Need more practice'] : [],
        areasForImprovementVi: (attempt.percentage ?? 0) < 60 ? ['Cần luyện thêm'] : [],
      };

      return { success: true, result };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit exam';
      return { success: false, error: message };
    }
  },

  /**
   * Get completed result for an attempt
   */
  async getResult(attemptId: string): Promise<ExamResult | null> {
    try {
      const result = await apiGetAttemptResults(attemptId);
      return toExamResultDetail(result);
    } catch {
      return null;
    }
  },

  /**
   * Get student's attempt history
   */
  async getStudentAttempts(params?: {
    skip?: number;
    take?: number;
  }): Promise<ExamResult[]> {
    try {
      const result = await apiGetStudentAttempts(params);
      return result.items.map((attempt) =>
        toExamResult(attempt, 'Exam', '', 'Class')
      );
    } catch {
      return [];
    }
  },

  /**
   * Clear session
   */
  clearSession(): void {
    activeSession = null;
  },

  /**
   * Get attempt details
   */
  async getAttempt(attemptId: string): Promise<ExamAttemptRecord | null> {
    try {
      return await apiGetAttempt(attemptId);
    } catch {
      return null;
    }
  },

  /**
   * Check if current session has an answer for a question
   */
  hasAnswer(questionId: string): boolean {
    if (!activeSession) return false;
    return questionId in activeSession.answers;
  },

  /**
   * Get current answer for a question
   */
  getAnswer(questionId: string): StudentAnswer | undefined {
    if (!activeSession) return undefined;
    return activeSession.answers[questionId];
  },
};

export default examService;
