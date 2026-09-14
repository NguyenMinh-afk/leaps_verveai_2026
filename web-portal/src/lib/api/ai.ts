/**
 * VERVEAI — AI Service API Client
 *
 * Provides real API integration for:
 * - AI Question Generation (service-ai → service-content)
 * - AI Diagnostic Interpretation (service-ai → service-bkt)
 * - AI Personalized Recommendations (service-ai → service-bkt → service-content)
 *
 * All calls go through Gateway → service-ai.
 */

import { api } from '../api/apiClient';

// ============================================
// Types
// ============================================

/**
 * Input DTO for AI question generation.
 */
export interface GenerateQuestionsInput {
  /** Topic name for question generation (e.g. "Algebra", "Quadratic Equations") */
  topic?: string;
  /** Display name for the topic (Vietnamese context) */
  topicName?: string;
  /** Difficulty level for the generated questions */
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  /** Type of questions to generate */
  questionType?: 'multiple-choice' | 'true-false' | 'short-answer' | 'mixed';
  /** Number of questions to generate (1-50) */
  questionCount?: number;
  /** Optional BKT skill ID to tag */
  skillId?: string;
  /** Language for generated questions (default: vi) */
  language?: 'vi' | 'en';
  /** Additional instructions for the AI */
  additionalInstructions?: string;
  /** Whether to automatically submit to content service */
  autoSubmit?: boolean;
}

/**
 * A single generated question draft from AI.
 */
export interface GeneratedQuestionDraft {
  title: string;
  body: string;
  difficulty: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  correctAnswer?: string;
  explanation: string;
  topic?: string;
  metadata?: {
    topicId?: string;
    skillId?: string;
    language?: string;
  };
}

/**
 * Response from AI question generation.
 */
export interface GenerateQuestionsResponse {
  questions: GeneratedQuestionDraft[];
  meta: {
    topic?: string;
    difficulty?: string;
    questionType?: string;
    requestedCount: number;
    generatedCount: number;
    provider: string;
    model: string;
    latencyMs: number;
  };
}

/**
 * AI Diagnostic Interpretation
 */
export interface DiagnosticInterpretation {
  dataStatus: 'HAS_DATA' | 'INSUFFICIENT_DATA' | 'ERROR';
  overallSummary: string;
  strengths: Array<{
    skillId: string;
    skillName: string;
    explanation: string;
  }>;
  weakAreas: Array<{
    skillId: string;
    skillName: string;
    masteryState: 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';
    pKnown?: number;
    explanation: string;
  }>;
  observations: string[];
  prioritySkills: string[];
  recommendedActions: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Response from AI diagnostic interpretation.
 */
export interface DiagnosticResponse {
  studentId: string;
  interpretation: DiagnosticInterpretation;
  meta: {
    diagnosisCount: number;
    evidenceCount: number;
    lastUpdated: string | null;
    provider: string;
    latencyMs: number;
  };
}

/**
 * Diagnostic query parameters.
 */
export interface DiagnosticQueryParams {
  includeEvidence?: boolean;
  includePrerequisites?: boolean;
  maxSkills?: number;
  language?: 'vi' | 'en';
}

/**
 * AI Recommendation
 */
export interface SuggestedContent {
  contentId: string;
  contentTitle: string;
  contentType: string;
  difficulty: number;
}

export interface Recommendation {
  skillId: string;
  skillName: string;
  priority: number;
  reason: string;
  aiExplanation?: string;
  suggestedContent?: SuggestedContent[];
  prerequisites?: string[];
}

export interface RecommendationsResponse {
  studentId: string;
  status: 'SUCCESS' | 'PARTIAL' | 'NO_RECOMMENDATION_AVAILABLE' | 'INSUFFICIENT_DATA';
  reason?: 'NO_WEAK_SKILLS' | 'NO_AVAILABLE_CONTENT' | 'INSUFFICIENT_DATA';
  recommendations: Recommendation[];
  generatedAt: string;
  aiPersonalization: boolean;
}

/**
 * Recommendation query parameters.
 */
export interface RecommendationQueryParams {
  limit?: number;
  includeContent?: boolean;
  language?: 'vi' | 'en';
}

// ============================================
// AI Generation API
// ============================================

/**
 * Generate questions using AI.
 * 
 * @param input - Generation parameters
 * @returns Generated questions ready for review
 * 
 * @throws {ApiError} On validation error (400), auth error (401), forbidden (403),
 *                    AI provider unavailable (503), or timeout (504)
 */
export async function generateQuestions(
  input: GenerateQuestionsInput
): Promise<GenerateQuestionsResponse> {
  const data = await api.post<{ success: boolean; data: GenerateQuestionsResponse }>(
    '/api/ai/generate/questions',
    input
  );
  return data.data;
}

/**
 * Generate questions and auto-submit to content service.
 * 
 * @param input - Generation parameters (autoSubmit will be set to true)
 * @returns Created questions with their IDs
 * 
 * @throws {ApiError} On validation error (400), auth error (401), forbidden (403),
 *                    AI provider unavailable (503), or timeout (504)
 */
export async function generateAndSubmitQuestions(
  input: GenerateQuestionsInput
): Promise<{
  questions: Array<{
    draft: GeneratedQuestionDraft;
    questionId: string;
    status: string;
  }>;
  meta: {
    totalCreated: number;
    provider: string;
    model: string;
    latencyMs: number;
  };
}> {
  const data = await api.post<{ success: boolean; data: {
    questions: Array<{
      draft: GeneratedQuestionDraft;
      questionId: string;
      status: string;
    }>;
    meta: {
      totalCreated: number;
      provider: string;
      model: string;
      latencyMs: number;
    };
  } }>(
    '/api/ai/generate/questions',
    { ...input, autoSubmit: true }
  );
  return data.data;
}

// ============================================
// AI Diagnostic API
// ============================================

/**
 * Get AI diagnostic interpretation for a student.
 * 
 * @param studentId - Student's ID
 * @param params - Query parameters
 * @returns AI-generated diagnostic interpretation
 * 
 * @throws {ApiError} On validation error (400), auth error (401), forbidden (403),
 *                    BKT service unavailable (503)
 */
export async function getStudentDiagnostic(
  studentId: string,
  params?: DiagnosticQueryParams
): Promise<DiagnosticResponse> {
  const searchParams = new URLSearchParams();
  if (params?.includeEvidence !== undefined) {
    searchParams.set('includeEvidence', String(params.includeEvidence));
  }
  if (params?.includePrerequisites !== undefined) {
    searchParams.set('includePrerequisites', String(params.includePrerequisites));
  }
  if (params?.maxSkills !== undefined) {
    searchParams.set('maxSkills', String(params.maxSkills));
  }
  if (params?.language !== undefined) {
    searchParams.set('language', params.language);
  }
  
  const query = searchParams.toString();
  const path = `/api/ai/diagnostic/student/${encodeURIComponent(studentId)}${query ? `?${query}` : ''}`;
  
  return api.get<DiagnosticResponse>(path);
}

// ============================================
// AI Recommendations API
// ============================================

/**
 * Get AI personalized recommendations for a student.
 * 
 * @param studentId - Student's ID
 * @param params - Query parameters
 * @returns Personalized skill recommendations
 * 
 * @throws {ApiError} On validation error (400), auth error (401), forbidden (403),
 *                    BKT service unavailable (503)
 */
export async function getStudentRecommendations(
  studentId: string,
  params?: RecommendationQueryParams
): Promise<RecommendationsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }
  if (params?.includeContent !== undefined) {
    searchParams.set('includeContent', String(params.includeContent));
  }
  if (params?.language !== undefined) {
    searchParams.set('language', params.language);
  }
  
  const query = searchParams.toString();
  const path = `/api/ai/recommendations/student/${encodeURIComponent(studentId)}${query ? `?${query}` : ''}`;
  
  return api.get<RecommendationsResponse>(path);
}
