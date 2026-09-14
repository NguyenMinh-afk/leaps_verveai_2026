/**
 * Inter-service HTTP client for service-ai.
 * All calls use the circuit-breaker pattern from @verveai/circuit-breaker.
 * Each function returns typed DTOs (never raw responses).
 */

import axios, { type AxiosInstance } from 'axios';
import { logger } from '../utils/logger.js';
import { validateEnv } from '../config/env.js';

const log = logger.child({ component: 'resource-client' });

// ─── DTO Types (mirroring upstream service responses) ──────────────────────────

/**
 * Diagnosis status as returned by service-bkt.
 */
export type DiagnosisStatus = 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';

/**
 * Diagnosis DTO from GET /api/bkt/diagnosis/student/:id
 */
export interface DiagnosisDto {
  id: string;
  studentId: string;
  skillId: string;
  skillCode: string | null;
  skillName: string | null;
  pKnown: number;
  confidence: number;
  status: DiagnosisStatus;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Skill DTO from GET /api/bkt/skills/:id
 */
export interface SkillDto {
  id: string;
  code: string;
  name: string;
  difficulty: number;
  description: string | null;
  prereqSkills: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Skill DTO from GET /api/bkt/skills (paginated list)
 */
export interface SkillListResponse {
  success: boolean;
  data: SkillDto[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Prerequisites DTO from GET /api/bkt/skills/:id/prerequisites
 */
export interface PrerequisitesResponse {
  success: boolean;
  data: SkillDto[];
}

/**
 * Question DTO from GET /api/content/questions
 */
export interface QuestionDto {
  id: string;
  title: string;
  body: string;
  bodyVi?: string;
  difficulty: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  skillId?: string;
  topic?: string;
  createdAt: string;
}

/**
 * Questions list response
 */
export interface QuestionsListResponse {
  success: boolean;
  data: QuestionDto[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

// ─── Simple HTTP Client (no circuit-breaker dependency needed for MVP) ──────────

function createHttpClient(baseURL: string, timeoutMs = 5000): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: timeoutMs,
    headers: {
      'Content-Type': 'application/json',
      'X-Service-Name': 'service-ai',
    },
  });
}

// ─── Lazy-initialized clients ─────────────────────────────────────────────────

let bktClient: AxiosInstance | null = null;
let contentClient: AxiosInstance | null = null;

function getBktClient(): AxiosInstance {
  if (!bktClient) {
    const env = validateEnv();
    bktClient = createHttpClient(env.SVC_BKT_URL, 5000);
  }
  return bktClient;
}

function getContentClient(): AxiosInstance {
  if (!contentClient) {
    const env = validateEnv();
    contentClient = createHttpClient(env.SVC_CONTENT_URL, 5000);
  }
  return contentClient;
}

// ─── Resource Client Functions ─────────────────────────────────────────────────

/**
 * Fetch all diagnoses for a student from service-bkt.
 * Returns empty array if the service is unavailable.
 */
export async function getStudentDiagnoses(studentId: string): Promise<DiagnosisDto[]> {
  try {
    const client = getBktClient();
    const response = await client.get<{ success: boolean; data: DiagnosisDto[] }>(
      `/api/bkt/diagnosis/student/${studentId}`
    );
    return response.data.data ?? [];
  } catch (err) {
    log.warn('Failed to fetch student diagnoses from service-bkt', {
      studentId,
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

/**
 * Fetch all skills from service-bkt (paginated, fetches first page with large pageSize).
 * Returns empty array if the service is unavailable.
 */
export async function getAllSkills(): Promise<SkillDto[]> {
  try {
    const client = getBktClient();
    // Fetch up to 1000 skills in a single request
    const response = await client.get<SkillListResponse>('/api/bkt/skills', {
      params: { page: 1, pageSize: 1000 },
    });
    return response.data.data ?? [];
  } catch (err) {
    log.warn('Failed to fetch skills from service-bkt', {
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

/**
 * Fetch prerequisites for a skill from service-bkt.
 * Returns empty array if the service is unavailable.
 */
export async function getSkillPrerequisites(skillId: string): Promise<SkillDto[]> {
  try {
    const client = getBktClient();
    const response = await client.get<PrerequisitesResponse>(
      `/api/bkt/skills/${skillId}/prerequisites`
    );
    return response.data.data ?? [];
  } catch (err) {
    log.warn('Failed to fetch skill prerequisites from service-bkt', {
      skillId,
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

/**
 * Fetch available (APPROVED) questions for a skill from service-content.
 * Returns empty array if the service is unavailable.
 */
export async function getAvailableContent(skillId: string): Promise<QuestionDto[]> {
  try {
    const client = getContentClient();
    const response = await client.get<QuestionsListResponse>('/api/content/questions', {
      params: { skillId, status: 'APPROVED', pageSize: 50 },
    });
    return response.data.data ?? [];
  } catch (err) {
    log.warn('Failed to fetch content from service-content', {
      skillId,
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

/**
 * Verify a skill exists in service-bkt.
 * Returns true if the skill exists, false otherwise.
 */
export async function verifySkillExists(skillId: string): Promise<boolean> {
  try {
    const client = getBktClient();
    const response = await client.get<{ success: boolean; data: SkillDto }>(
      `/api/bkt/skills/${skillId}`
    );
    return response.data.success === true;
  } catch {
    return false;
  }
}

/**
 * Verify content exists in service-content.
 * Returns true if the content exists, false otherwise.
 */
export async function verifyContentExists(contentId: string): Promise<boolean> {
  try {
    const client = getContentClient();
    const response = await client.get<{ success: boolean }>(
      `/api/content/questions/${contentId}`
    );
    return response.data.success === true;
  } catch {
    return false;
  }
}
