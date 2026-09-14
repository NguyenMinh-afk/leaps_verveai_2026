/**
 * BKT Service Client
 * 
 * Inter-service communication with service-bkt using circuit breaker pattern.
 */

import { createBreaker } from '@verveai/circuit-breaker';
import { logger } from '../utils/logger.js';
import { validateEnv } from '../config/env.js';

const log = logger.child({ component: 'bkt-client' });

/* ─────────────────────────── Types ─────────────────────────── */

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

export type DiagnosisStatus = 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';

export interface EvidenceDto {
  id: string;
  diagnosisId: string;
  itemId: string;
  extractedAnswer: string | null;
  correct: boolean | null;
  confidence: number;
  quality: string | null;
  createdAt: string;
}

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

/* ─────────────────────────── Circuit Breaker ─────────────────────────── */

const FALLBACK_SVC_BKT_URL = 'http://svc-bkt:3002';

const bktBreaker = createBreaker(
  'svc-bkt',
  async (path: string, options?: RequestInit): Promise<unknown> => {
    const env = validateEnv();
    const baseUrl = env.SVC_BKT_URL ?? FALLBACK_SVC_BKT_URL;
    const url = `${baseUrl}${path}`;

    log.debug('Calling BKT service', { url, method: options?.method ?? 'GET' });

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

/* ─────────────────────────── API Functions ─────────────────────────── */

/**
 * Get all diagnoses for a student from the BKT service.
 */
export async function getStudentDiagnoses(studentId: string): Promise<DiagnosisDto[]> {
  const data = await bktBreaker.fire(`/api/bkt/diagnosis/student/${studentId}`);
  return data as DiagnosisDto[];
}

/**
 * Get evidence items for a student from the BKT service.
 */
export async function getStudentEvidence(studentId: string): Promise<EvidenceDto[]> {
  const data = await bktBreaker.fire(`/api/bkt/evidence/student/${studentId}`);
  return data as EvidenceDto[];
}

/**
 * Get prerequisites for a skill from the BKT service.
 * Returns full SkillDto objects from the BKT service.
 */
export async function getSkillPrerequisites(skillId: string): Promise<SkillDto[]> {
  const data = await bktBreaker.fire(`/api/bkt/skills/${skillId}/prerequisites`) as { success: boolean; data: SkillDto[] };
  return data?.data ?? [];
}
