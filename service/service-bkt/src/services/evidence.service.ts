/**
 * Evidence Service
 *
 * Persistence + reasoning-chain logic for evidence items that drive
 * BKT diagnoses. Every evidence item belongs to exactly one diagnosis;
 * recording an item appends to the chain AND recomputes the diagnosis'
 * P(L) using the BKT update rule.
 *
 * The chain is append-only by design — deletion is not exposed.
 * Re-computation is always deterministic.
 */

import { z } from 'zod';
import { prisma } from '../prisma/client.js';
import { logger } from '../utils/logger.js';
import { NotFoundError, ValidationError } from '@verveai/error-types';
import {
  BKT_PARAMS,
  diagnosisConfidence,
  masteryStatus,
  updateMastery,
  type MasteryStatus,
} from './bkt-engine.js';

const log = logger.child({ component: 'evidence.service' });

export type EvidenceQuality = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export interface EvidenceDto {
  id: string;
  diagnosisId: string;
  itemId: string;
  extractedAnswer: string | null;
  correct: boolean | null;
  confidence: number;
  quality: EvidenceQuality;
  createdAt: Date;
}

export interface EvidenceChainStepDto {
  evidenceId: string;
  itemId: string;
  correct: boolean | null;
  pKnownBefore: number;
  pKnownAfter: number;
  confidenceBefore: number;
  confidenceAfter: number;
  quality: EvidenceQuality;
  createdAt: Date;
}

export interface EvidenceChainDto {
  diagnosisId: string;
  studentId: string;
  skillId: string;
  currentPKnown: number;
  currentStatus: MasteryStatus;
  steps: EvidenceChainStepDto[];
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function toEvidenceDto(row: {
  id: string;
  diagnosis_id: string;
  item_id: string;
  extracted_answer: string | null;
  correct: boolean | null;
  confidence: number;
  quality: EvidenceQuality;
  created_at: Date;
}): EvidenceDto {
  return {
    id: row.id,
    diagnosisId: row.diagnosis_id,
    itemId: row.item_id,
    extractedAnswer: row.extracted_answer,
    correct: row.correct,
    confidence: row.confidence,
    quality: row.quality,
    createdAt: row.created_at,
  };
}

/* ─────────────────────────── Service functions ─────────────────────────── */

export interface RecordEvidenceInput {
  diagnosisId: string;
  itemId: string;
  extractedAnswer?: string;
  correct: boolean;
  confidence?: number;
  quality?: EvidenceQuality;
}

/**
 * Append a new evidence item to a diagnosis and re-derive the diagnosis'
 * P(L) from the full chain.
 *
 * Returns the new evidence item alongside the updated diagnosis summary.
 */
export async function recordEvidence(input: RecordEvidenceInput): Promise<{
  evidence: EvidenceDto;
  diagnosis: {
    id: string;
    studentId: string;
    skillId: string;
    pKnown: number;
    confidence: number;
    status: MasteryStatus;
    attempts: number;
  };
}> {
  // 1. Schema validation.
  const parsed = z
    .object({
      diagnosisId: z.string().uuid(),
      itemId: z.string().uuid(),
      extractedAnswer: z.string().max(2000).optional(),
      correct: z.boolean(),
      confidence: z.number().min(0).max(1).optional(),
      quality: z.enum(['HIGH', 'MEDIUM', 'LOW', 'UNKNOWN']).optional(),
    })
    .safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues);
  }
  const data = parsed.data;
  const confidenceVal = data.confidence ?? 0;
  const qualityVal: EvidenceQuality = data.quality ?? 'UNKNOWN';

  // 2. Ensure the diagnosis exists.
  const diagnosis = await prisma.diagnosis.findUnique({
    where: { id: data.diagnosisId },
  });
  if (!diagnosis) {
    throw new NotFoundError('Diagnosis', data.diagnosisId);
  }

  // 3. Persist evidence + recompute chain in a single transaction so
  //    the diagnosis row's `p_known` is always consistent with the
  //    evidence chain.
  const result = await prisma.$transaction(async (tx) => {
    const evidence = await tx.evidence.create({
      data: {
        diagnosis_id: data.diagnosisId,
        item_id: data.itemId,
        extracted_answer: data.extractedAnswer ?? null,
        correct: data.correct,
        confidence: confidenceVal,
        quality: qualityVal,
      },
    });

    // Replay the chain deterministically.
    const allEvidence = await tx.evidence.findMany({
      where: { diagnosis_id: data.diagnosisId },
      orderBy: { created_at: 'asc' },
    });

    let pKnown: number = BKT_PARAMS.P_INIT;
    for (const ev of allEvidence) {
      if (typeof ev.correct === 'boolean') {
        pKnown = updateMastery(pKnown, ev.correct);
      }
    }

    const status = masteryStatus(pKnown, allEvidence.length);
    const confidence = diagnosisConfidence(pKnown);

    const updatedDiagnosis = await tx.diagnosis.update({
      where: { id: data.diagnosisId },
      data: { p_known: pKnown, confidence, status },
    });

    return { evidence, updatedDiagnosis, attempts: allEvidence.length };
  });

  log.info('Evidence recorded', {
    diagnosisId: data.diagnosisId,
    itemId: data.itemId,
    correct: data.correct,
    pKnown: result.updatedDiagnosis.p_known,
    status: result.updatedDiagnosis.status,
  });

  return {
    evidence: toEvidenceDto(result.evidence),
    diagnosis: {
      id: result.updatedDiagnosis.id,
      studentId: result.updatedDiagnosis.student_id,
      skillId: result.updatedDiagnosis.skill_id,
      pKnown: result.updatedDiagnosis.p_known,
      confidence: result.updatedDiagnosis.confidence,
      status: result.updatedDiagnosis.status,
      attempts: result.attempts,
    },
  };
}

/**
 * Fetch a single evidence item by id.
 */
export async function getEvidenceById(id: string): Promise<EvidenceDto | null> {
  if (!z.string().uuid().safeParse(id).success) {
    throw new ValidationError([
      { path: ['id'], message: 'id must be a UUID', code: 'invalid_uuid' },
    ]);
  }
  const row = await prisma.evidence.findUnique({ where: { id } });
  return row ? toEvidenceDto(row) : null;
}

/**
 * Return the full evidence chain for a diagnosis, together with the
 * running P(L) AFTER each step. This is the "reasoning chain" the
 * system exposes so a teacher can audit how the conclusion was reached.
 */
export async function getEvidenceChain(diagnosisId: string): Promise<EvidenceChainDto> {
  if (!z.string().uuid().safeParse(diagnosisId).success) {
    throw new ValidationError([
      { path: ['diagnosisId'], message: 'diagnosisId must be a UUID', code: 'invalid_uuid' },
    ]);
  }

  const diagnosis = await prisma.diagnosis.findUnique({
    where: { id: diagnosisId },
    include: {
      evidence: { orderBy: { created_at: 'asc' } },
    },
  });
  if (!diagnosis) {
    throw new NotFoundError('Diagnosis', diagnosisId);
  }

  // Replay deterministically.
  let pKnown: number = BKT_PARAMS.P_INIT;
  const steps: EvidenceChainStepDto[] = diagnosis.evidence.map((ev) => {
    const pKnownBefore = pKnown;
    const confidenceBefore = diagnosisConfidence(pKnownBefore);
    if (typeof ev.correct === 'boolean') {
      pKnown = updateMastery(pKnown, ev.correct);
    }
    return {
      evidenceId: ev.id,
      itemId: ev.item_id,
      correct: ev.correct,
      pKnownBefore,
      pKnownAfter: pKnown,
      confidenceBefore,
      confidenceAfter: diagnosisConfidence(pKnown),
      quality: ev.quality,
      createdAt: ev.created_at,
    };
  });

  return {
    diagnosisId: diagnosis.id,
    studentId: diagnosis.student_id,
    skillId: diagnosis.skill_id,
    currentPKnown: diagnosis.p_known,
    currentStatus: diagnosis.status,
    steps,
  };
}

/**
 * List every evidence item belonging to any diagnosis of a student.
 *
 * Returned in chronological order — useful for student timelines and
 * audit tooling.
 */
export async function getStudentEvidence(studentId: string): Promise<EvidenceDto[]> {
  if (!z.string().uuid().safeParse(studentId).success) {
    throw new ValidationError([
      { path: ['studentId'], message: 'studentId must be a UUID', code: 'invalid_uuid' },
    ]);
  }

  const rows = await prisma.evidence.findMany({
    where: {
      diagnosis: {
        student_id: studentId,
      },
    },
    orderBy: { created_at: 'desc' },
  });

  return rows.map(toEvidenceDto);
}
