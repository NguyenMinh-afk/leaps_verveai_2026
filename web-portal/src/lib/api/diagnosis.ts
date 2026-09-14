/**
 * VERVEAI — Diagnosis API Client
 * 
 * API calls for managing diagnostic assessment sessions.
 * Routes through the gateway to service-exam.
 */

import { api } from './apiClient';

// ============================================
// Types
// ============================================

export type DiagnosisStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type MasteryLevel = 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';

export interface DiagnosisResult {
  pKnown: number;
  status: MasteryLevel;
  confidence: number;
  recommendations: string[];
}

export interface DiagnosisSession {
  id: string;
  studentId: string;
  skillId: string;
  skillName: string;
  status: DiagnosisStatus;
  questionsAnswered: number;
  totalQuestions: number;
  currentPKnown: number;
  result: DiagnosisResult | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosisQuestion {
  id: string;
  content: string;
  options?: Array<{ id: string; text: string }>;
  // SECURITY: correctAnswer is intentionally NOT exposed to client
}

export interface StartDiagnosisRequest {
  skillId: string;
  skillName: string;
  questionIds: string[];
  totalQuestions?: number;
}

/**
 * Submit answer request.
 * 
 * SECURITY: The client MUST NOT send isCorrect.
 * Correctness is determined server-side by comparing with the authoritative answer.
 */
export interface SubmitAnswerRequest {
  questionId: string;
  answer: string;
  // SECURITY: isCorrect is NOT included - server determines correctness
}

// ============================================
// Diagnosis API
// ============================================

/**
 * Start a new diagnostic assessment session.
 * POST /api/exam/diagnosis/start
 */
export async function startDiagnosisSession(
  request: StartDiagnosisRequest
): Promise<DiagnosisSession> {
  const response = await api.post<{ success: boolean; data: DiagnosisSession }>(
    '/api/exam/diagnosis/start',
    request
  );
  return response.data;
}

/**
 * Get all diagnostic sessions for the current student.
 * GET /api/exam/diagnosis/student
 */
export async function getStudentDiagnosisSessions(): Promise<DiagnosisSession[]> {
  const response = await api.get<{ success: boolean; data: DiagnosisSession[] }>(
    '/api/exam/diagnosis/student'
  );
  return response.data;
}

/**
 * Get a specific diagnostic session by ID.
 * GET /api/exam/diagnosis/:id
 */
export async function getDiagnosisSession(
  sessionId: string
): Promise<DiagnosisSession> {
  const response = await api.get<{ success: boolean; data: DiagnosisSession }>(
    `/api/exam/diagnosis/${encodeURIComponent(sessionId)}`
  );
  return response.data;
}

/**
 * Submit an answer for a diagnostic session.
 * POST /api/exam/diagnosis/:id/answer
 */
export async function submitDiagnosisAnswer(
  sessionId: string,
  request: SubmitAnswerRequest
): Promise<DiagnosisSession> {
  const response = await api.post<{ success: boolean; data: DiagnosisSession }>(
    `/api/exam/diagnosis/${encodeURIComponent(sessionId)}/answer`,
    request
  );
  return response.data;
}

/**
 * Complete a diagnostic session and get final results.
 * POST /api/exam/diagnosis/:id/complete
 */
export async function completeDiagnosisSession(
  sessionId: string
): Promise<DiagnosisSession> {
  const response = await api.post<{ success: boolean; data: DiagnosisSession }>(
    `/api/exam/diagnosis/${encodeURIComponent(sessionId)}/complete`
  );
  return response.data;
}

/**
 * Get diagnosis questions for a specific skill.
 * GET /api/exam/diagnosis/questions/:skillId
 */
export async function getDiagnosisQuestions(
  skillId: string,
  count: number = 5
): Promise<DiagnosisQuestion[]> {
  const response = await api.get<{ success: boolean; data: DiagnosisQuestion[] }>(
    `/api/exam/diagnosis/questions/${encodeURIComponent(skillId)}?count=${count}`
  );
  return response.data;
}
