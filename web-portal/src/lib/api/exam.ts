/**
 * VERVEAI — Exam API surface (through Gateway → svc-exam).
 *
 * Backend endpoints:
 * - GET    /api/exams                     - List exams
 * - POST   /api/exams                     - Create exam
 * - GET    /api/exams/:id                 - Get exam
 * - PUT    /api/exams/:id                 - Update exam
 * - DELETE /api/exams/:id                 - Delete exam
 * - GET    /api/exams/:id/questions      - Get exam questions (questionId references)
 * - POST   /api/exams/:id/questions      - Add exam questions
 * - POST   /api/exams/:id/start          - Start exam attempt
 * - GET    /api/exams/attempt/:attemptId - Get attempt
 * - POST   /api/exams/attempt/:attemptId/submit - Submit attempt with answers
 * - GET    /api/exams/student/attempts   - Get student attempts
 * - POST   /api/exams/:id/grade/:attemptId - Grade attempt
 * - GET    /api/exams/:id/results        - Get exam results (teacher)
 * - GET    /api/exams/attempt/:attemptId/results - Get attempt results (student)
 * 
 * For full question content, use content service:
 * - GET /api/content/questions/:id - Get question details
 */

import { api } from './apiClient';

// ============================================
// Types
// ============================================

export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'MANUAL_REVIEW' | 'COMPLETED';
export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

/**
 * Basic exam record from exam service
 */
export interface ExamRecord {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  description: string | null;
  status: ExamStatus;
  timeLimitMinutes: number | null;
  passingScore: number;
  maxScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Question reference in exam (from exam service)
 * Contains only metadata about the question's position in the exam
 * Use questionId to fetch full content from content service
 */
export interface ExamQuestionRecord {
  id: string;          // ExamQuestion record ID
  examId: string;
  questionId: string;  // Reference to content service question
  points: number;
  orderIndex: number;
  required: boolean;
}

/**
 * Exam with question references (from GET /api/exams/:id)
 */
export interface ExamDetail extends ExamRecord {
  questions: ExamQuestionRecord[];
}

/**
 * Student-facing exam status
 */
export type StudentExamStatus = 'available' | 'upcoming' | 'in-progress' | 'completed' | 'expired';

/**
 * Student-facing exam item (combined from exam records)
 */
export interface StudentExamRecord {
  id: string;
  title: string;
  titleVi: string;
  description: string;
  descriptionVi: string;
  classId: string;
  className: string;
  teacherName: string;
  status: StudentExamStatus;
  durationMinutes: number | null;
  questionCount: number;
  attempts: number;
  maxAttempts: number;
  bestScore?: number;
  lastScore?: number;
  availableFrom?: string;
  availableUntil?: string;
  completedAt?: string;
}

/**
 * Attempt record from backend
 */
export interface ExamAttemptRecord {
  id: string;
  examId: string;
  studentId: string;
  status: AttemptStatus;
  score: number | null;
  maxScore: number | null;
  percentage: number | null;
  startedAt: string;
  submittedAt: string | null;
  gradedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Answer record (from attempt results)
 */
export interface ExamAnswerRecord {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOptions: string[];
  textAnswer: string | null;
  isCorrect: boolean | null;
  pointsEarned: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExamListPage {
  items: ExamRecord[];
  total: number;
  skip: number;
  take: number;
}

export interface AttemptListPage {
  items: ExamAttemptRecord[];
  total: number;
  skip: number;
  take: number;
}

/**
 * Detailed attempt results (from GET /api/exams/attempt/:attemptId/results)
 * Includes student answers and correctness
 */
export interface ExamResultDetail {
  attemptId: string;
  examId: string;
  examTitle: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  status: AttemptStatus;
  startedAt: string;
  submittedAt: string | null;
  gradedAt: string | null;
  answers: Array<{
    questionId: string;
    selectedOptions: string[];
    textAnswer: string | null;
    isCorrect: boolean | null;
    pointsEarned: number | null;
  }>;
}

/**
 * Summary of attempt results (for teacher view)
 */
export interface ExamResultSummary {
  attemptId: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  status: AttemptStatus;
  submittedAt: string | null;
}

// ============================================
// API Functions
// ============================================

/**
 * List exams
 */
export async function listExams(params: {
  skip?: number;
  take?: number;
  teacherId?: string;
  classId?: string;
  status?: ExamStatus;
} = {}): Promise<ExamListPage> {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params.take !== undefined) searchParams.set('take', String(params.take));
  if (params.teacherId) searchParams.set('teacherId', params.teacherId);
  if (params.classId) searchParams.set('classId', params.classId);
  if (params.status) searchParams.set('status', params.status);

  const query = searchParams.toString();
  const path = query ? `/api/exams?${query}` : '/api/exams';
  return api.get<ExamListPage>(path);
}

/**
 * Create a new exam
 */
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
}): Promise<ExamDetail> {
  return api.post<ExamDetail>('/api/exams', input);
}

/**
 * Get a single exam by ID
 */
export async function getExam(id: string): Promise<ExamDetail> {
  return api.get<ExamDetail>(`/api/exams/${encodeURIComponent(id)}`);
}

/**
 * Update an exam
 */
export async function updateExam(id: string, input: Partial<ExamRecord>): Promise<ExamDetail> {
  return api.put<ExamDetail>(`/api/exams/${encodeURIComponent(id)}`, input);
}

/**
 * Delete an exam (soft delete)
 */
export async function deleteExam(id: string): Promise<void> {
  return api.delete(`/api/exams/${encodeURIComponent(id)}`);
}

/**
 * Get exam questions
 */
export async function getExamQuestions(examId: string): Promise<{ questions: ExamQuestionRecord[] }> {
  return api.get<{ questions: ExamQuestionRecord[] }>(
    `/api/exams/${encodeURIComponent(examId)}/questions`
  );
}

/**
 * Add questions to an exam
 */
export async function addExamQuestions(examId: string, questionIds: string[]): Promise<{ message: string }> {
  return api.post<{ message: string }>(
    `/api/exams/${encodeURIComponent(examId)}/questions`,
    { questionIds }
  );
}

/**
 * Start an exam attempt (student)
 */
export async function startExamAttempt(examId: string): Promise<ExamAttemptRecord> {
  return api.post<ExamAttemptRecord>(`/api/exams/${encodeURIComponent(examId)}/start`);
}

/**
 * Get an attempt by ID
 */
export async function getAttempt(attemptId: string): Promise<ExamAttemptRecord> {
  return api.get<ExamAttemptRecord>(`/api/exams/attempt/${encodeURIComponent(attemptId)}`);
}

/**
 * Submit an exam attempt with answers
 */
export interface ExamAnswerInput {
  questionId: string;
  selectedOptions?: string[];
  textAnswer?: string;
}

export async function submitExamAttempt(
  attemptId: string,
  answers: ExamAnswerInput[]
): Promise<ExamAttemptRecord> {
  return api.post<ExamAttemptRecord>(
    `/api/exams/attempt/${encodeURIComponent(attemptId)}/submit`,
    { answers }
  );
}

/**
 * Get student attempts
 */
export async function getStudentAttempts(params: {
  skip?: number;
  take?: number;
} = {}): Promise<AttemptListPage> {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params.take !== undefined) searchParams.set('take', String(params.take));

  const query = searchParams.toString();
  const path = query ? `/api/exams/student/attempts?${query}` : '/api/exams/student/attempts';
  return api.get<AttemptListPage>(path);
}

/**
 * Grade an attempt (teacher)
 */
export async function gradeAttempt(
  examId: string,
  attemptId: string,
  gradingRules: Array<{
    questionId: string;
    correctAnswer: string | string[];
    points: number;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
  }>
): Promise<ExamAttemptRecord> {
  return api.post<ExamAttemptRecord>(
    `/api/exams/${encodeURIComponent(examId)}/grade/${encodeURIComponent(attemptId)}`,
    { gradingRules }
  );
}

/**
 * Get exam results (teacher)
 */
export async function getExamResults(examId: string): Promise<ExamResultSummary[]> {
  return api.get<ExamResultSummary[]>(`/api/exams/${encodeURIComponent(examId)}/results`);
}

/**
 * Get attempt results (student/teacher)
 */
export async function getAttemptResults(attemptId: string): Promise<ExamResultDetail> {
  return api.get<ExamResultDetail>(`/api/exams/attempt/${encodeURIComponent(attemptId)}/results`);
}
