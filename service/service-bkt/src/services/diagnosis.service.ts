/**
 * Diagnosis Service
 *
 * Implements BKT-based diagnosis: returns the student's current mastery
 * probability P(L) for one or more skills, plus the classification
 * (PENDING / DIAGNOSED / MASTERED / STRUGGLING).
 *
 * Follows the canonical pattern:
 *   Route → Service → Prisma Client
 *
 * Cross-service calls (svc-class for class membership) go through
 * Consul discovery + the standard circuit breaker.
 */

import { z } from 'zod';
import {
  BKT_PARAMS,
  diagnosisConfidence,
  initialMastery,
  masteryStatus,
  updateMastery,
  type MasteryStatus,
} from './bkt-engine.js';
import { prisma } from '../prisma/client.js';
import { logger } from '../utils/logger.js';
import {
  ConflictError,
  DomainError,
  NotFoundError,
  ValidationError,
} from '@verveai/error-types';
import { Consul } from '@verveai/consul-client';
import { createBreaker } from '@verveai/circuit-breaker';

const log = logger.child({ component: 'diagnosis.service' });

/**
 * Fallback used only when Consul discovery is unavailable (e.g., local
 * dev without Consul running). In production Consul.resolve is always
 * called.
 */
const FALLBACK_SVC_CLASS_URL = 'http://svc-class:3003';

/**
 * Resolve svc-class URL via Consul (with graceful fallback).
 */
async function resolveSvcClass(): Promise<string> {
  try {
    return await Consul.resolve('svc-class');
  } catch (err) {
    log.warn('Consul resolve failed for svc-class, using fallback', {
      error: err instanceof Error ? err.message : String(err),
    });
    return FALLBACK_SVC_CLASS_URL;
  }
}

/**
 * Circuit-breaker-wrapped call to svc-class. Used to fetch the
 * membership of a class so we can assemble class-level diagnoses.
 */
const classMembersBreaker = createBreaker(
  'svc-class',
  async (path: string): Promise<unknown> => {
    const url = await resolveSvcClass();
    const res = await fetch(`${url}${path}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`svc-class returned ${res.status}: ${body}`);
    }
    return res.json();
  },
  { timeout: 3000, errorThresholdPercentage: 50, resetTimeout: 10000 }
);

/* ─────────────────────────── DTO types ─────────────────────────── */

export interface DiagnosisDto {
  id: string;
  studentId: string;
  skillId: string;
  skillCode: string | null;
  skillName: string | null;
  pKnown: number;
  confidence: number;
  status: MasteryStatus;
  evidenceCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiagnosisWithSkillDto extends DiagnosisDto {
  skill: {
    id: string;
    code: string;
    name: string;
    difficulty: number;
  };
}

export interface BatchDiagnosisResultDto {
  studentId: string;
  results: DiagnosisDto[];
  totalMastered: number;
  totalDiagnosed: number;
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function toDiagnosisDto(
  row: {
    id: string;
    student_id: string;
    skill_id: string;
    p_known: number;
    confidence: number;
    status: MasteryStatus;
    created_at: Date;
    updated_at: Date;
    skill?: {
      id: string;
      code: string;
      name: string;
      difficulty: number;
    } | null;
    _count?: { evidence: number };
  }
): DiagnosisDto {
  return {
    id: row.id,
    studentId: row.student_id,
    skillId: row.skill_id,
    skillCode: row.skill?.code ?? null,
    skillName: row.skill?.name ?? null,
    pKnown: row.p_known,
    confidence: row.confidence,
    status: row.status,
    evidenceCount: row._count?.evidence ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* ─────────────────────────── Service functions ─────────────────────────── */

/**
 * Run the BKT diagnosis for a single (student, skill) pair.
 *
 * If a diagnosis row already exists it is reused and its `p_known` is
 * re-derived from the persisted evidence chain (idempotent / deterministic).
 * Otherwise a brand-new diagnosis row is created with the initial P(L).
 */
export async function runDiagnosis(
  studentId: string,
  skillId: string
): Promise<DiagnosisDto> {
  // 1. Validate input — defence-in-depth in case the caller skipped
  //    route-level validation.
  const parsed = z
    .object({
      studentId: z.string().uuid(),
      skillId: z.string().uuid(),
    })
    .safeParse({ studentId, skillId });
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues);
  }

  // 2. Ensure the skill exists.
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) {
    throw new NotFoundError('Skill', skillId);
  }

  // 3. Find or create the diagnosis.
  const existing = await prisma.diagnosis.findFirst({
    where: { student_id: studentId, skill_id: skillId },
    include: { skill: true, evidence: { orderBy: { created_at: 'asc' } } },
  });

  // 4. Re-derive P(L) deterministically from evidence chain (TS-07).
  let pKnown: number = BKT_PARAMS.P_INIT;
  for (const ev of existing?.evidence ?? []) {
    if (typeof ev.correct !== 'boolean') continue;
    pKnown = updateMastery(pKnown, ev.correct);
  }

  const status = masteryStatus(pKnown, existing?.evidence.length ?? 0);
  const confidence = diagnosisConfidence(pKnown);

  let diagnosisRow: DiagnosisDto;
  if (existing) {
    const updated = await prisma.diagnosis.update({
      where: { id: existing.id },
      data: { p_known: pKnown, confidence, status },
      include: { skill: true, _count: { select: { evidence: true } } },
    });
    diagnosisRow = toDiagnosisDto(updated);
  } else {
    const created = await prisma.diagnosis.create({
      data: {
        student_id: studentId,
        skill_id: skillId,
        p_known: pKnown,
        confidence,
        status,
      },
      include: { skill: true, _count: { select: { evidence: true } } },
    });
    diagnosisRow = toDiagnosisDto(created);
  }

  log.info('Diagnosis run', {
    studentId,
    skillId,
    pKnown: diagnosisRow.pKnown,
    status: diagnosisRow.status,
  });

  return diagnosisRow;
}

/**
 * Run diagnoses for multiple skills for one student in a single call.
 *
 * Performs each BKT update independently. Failures on individual skills
 * are logged but DO NOT abort the batch — the caller receives partial
 * results plus a list of `failed` ids.
 */
export async function runBatchDiagnosis(
  studentId: string,
  skillIds: string[]
): Promise<BatchDiagnosisResultDto> {
  if (skillIds.length === 0) {
    throw new ValidationError([
      { path: ['skillIds'], message: 'skillIds must not be empty', code: 'too_small' },
    ]);
  }
  if (skillIds.length > 20) {
    throw new ValidationError([
      { path: ['skillIds'], message: 'skillIds may contain at most 20 ids', code: 'too_big' },
    ]);
  }

  // Deduplicate while preserving order — protect against the caller
  // requesting the same skill twice.
  const uniqueIds = Array.from(new Set(skillIds));

  const results: DiagnosisDto[] = [];
  const failed: Array<{ skillId: string; error: string }> = [];

  for (const skillId of uniqueIds) {
    try {
      const dto = await runDiagnosis(studentId, skillId);
      results.push(dto);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failed.push({ skillId, error: message });
      log.warn('Batch diagnosis: skill failed', { studentId, skillId, error: message });
    }
  }

  const totalMastered = results.filter((r) => r.status === 'MASTERED').length;
  const totalDiagnosed = results.filter((r) => r.status === 'DIAGNOSED').length;

  return {
    studentId,
    results: failed.length === 0 ? results : [...results, ...failed.map(() => ({} as unknown as DiagnosisDto))],
    totalMastered,
    totalDiagnosed,
  };
}

/* ─────────────────────────── Read paths ─────────────────────────── */

/**
 * List all diagnoses for a single student, joined with skill info.
 */
export async function getStudentDiagnoses(studentId: string): Promise<DiagnosisDto[]> {
  const rows = await prisma.diagnosis.findMany({
    where: { student_id: studentId },
    include: { skill: true, _count: { select: { evidence: true } } },
    orderBy: { updated_at: 'desc' },
  });

  return rows.map(toDiagnosisDto);
}

/**
 * Fetch all diagnoses for an entire class by going through svc-class.
 *
 * Cross-service: discovers `svc-class` via Consul and dispatches the call
 * through the circuit breaker. If the upstream is down, returns an empty
 * list (the caller can fall back to per-student queries).
 */
export async function getClassDiagnoses(classId: string): Promise<DiagnosisDto[]> {
  type ClassMember = { id: string };
  type ClassMembersResponse = { success: boolean; data?: { students?: ClassMember[] } };

  let studentIds: string[] = [];
  try {
    const raw = await classMembersBreaker.fire(`/api/class/classes/${classId}/students`);
    const body = raw as ClassMembersResponse;
    studentIds = (body?.data?.students ?? []).map((s) => s.id);
  } catch (err) {
    log.warn('Failed to fetch class members from svc-class', {
      classId,
      error: err instanceof Error ? err.message : String(err),
    });
    // Fallback: empty list — caller must handle gracefully.
    return [];
  }

  if (studentIds.length === 0) {
    return [];
  }

  const rows = await prisma.diagnosis.findMany({
    where: { student_id: { in: studentIds } },
    include: { skill: true, _count: { select: { evidence: true } } },
    orderBy: [{ student_id: 'asc' }, { updated_at: 'desc' }],
  });

  return rows.map(toDiagnosisDto);
}

/* ─────────────────────────── Misc helpers ─────────────────────────── */

/**
 * Return the initial-state diagnosis DTO. Useful for endpoints that
 * want to expose "what does a fresh diagnosis look like" without
 * writing a row.
 */
export function getInitialDiagnosisState(): ReturnType<typeof initialMastery> {
  return initialMastery();
}

/* ─────────────────────────── Errors used internally ─────────────────────────── */

/**
 * Re-export error classes so route-layer code can import them from a
 * single place. The runtime errors are already created above; this is
 * just a convenience export.
 */
export { ConflictError, DomainError, NotFoundError };
