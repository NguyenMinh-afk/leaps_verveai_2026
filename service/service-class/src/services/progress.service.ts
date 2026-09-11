/**
 * Business logic for skill-progress tracking in service-class.
 *
 * The schema keeps a single row per (student, skill) and mutates
 * `p_known` / `last_p_known` / `attempt_count` in place. We expose:
 *
 *  - `getStudentProgress` — paginated list of the student's progress rows.
 *  - `getProgressHistory`  — synthetic time-series anchored on the most
 *                            recent transition captured in `last_p_known`.
 *  - `getStudentSkills`    — per-skill summary with a derived mastery
 *                            status (PENDING / DIAGNOSED / MASTERED /
 *                            STRUGGLING).
 *  - `updateProgress`      — upsert of the current `p_known` value.
 *
 * History is a single transition rather than a full audit log because the
 * progress table is the source of truth — full audit logging would belong
 * in a downstream pipeline.
 */

import { prisma } from '../prisma/client.js';
import {
  NotFoundError,
  ValidationError
} from '@verveai/error-types';
import { logger } from '../utils/logger.js';
import type { ProgressPaginationInput } from '../validators/progress.validator.js';

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

/** Public progress record returned to API consumers. */
export interface ProgressRecord {
  id: string;
  studentId: string;
  skillId: string;
  pKnown: number;
  lastPKnown: number;
  attemptCount: number;
  updatedAt: Date;
}

/** Paginated page of progress rows. */
export interface ProgressPage {
  items: ProgressRecord[];
  total: number;
  skip: number;
  take: number;
}

/** A single snapshot in the synthetic time-series. */
export interface ProgressPoint {
  pKnown: number;
  attemptCount: number;
  timestamp: Date;
}

/** Time-series returned by `getProgressHistory`. */
export interface ProgressHistory {
  studentId: string;
  skillId: string;
  windowDays: number;
  current: ProgressPoint;
  previous: ProgressPoint | null;
  delta: number;
}

/** Per-skill summary returned by `getStudentSkills`. */
export interface SkillSummary {
  skillId: string;
  pKnown: number;
  attemptCount: number;
  updatedAt: Date;
  masteryStatus: 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';
}

/* -------------------------------------------------------------------------- */
/*                              Internal helpers                             */
/* -------------------------------------------------------------------------- */

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MASTERY_THRESHOLD = 0.8;
const STRUGGLING_THRESHOLD = 0.3;

async function ensureStudentExists(studentId: string): Promise<void> {
  if (!UUID_REGEX.test(studentId)) {
    throw new ValidationError(
      [
        {
          path: ['studentId'],
          message: 'studentId must be a valid UUID',
          code: 'invalid_uuid'
        }
      ],
      'Invalid student id'
    );
  }
  const student = await prisma.student.findFirst({
    where: { id: studentId, deleted_at: null },
    select: { id: true }
  });
  if (!student) {
    throw new NotFoundError('Student', studentId);
  }
}

function toProgressRecord(row: {
  id: string;
  student_id: string;
  skill_id: string;
  p_known: number;
  last_p_known: number;
  attempt_count: number;
  updated_at: Date;
}): ProgressRecord {
  return {
    id: row.id,
    studentId: row.student_id,
    skillId: row.skill_id,
    pKnown: row.p_known,
    lastPKnown: row.last_p_known,
    attemptCount: row.attempt_count,
    updatedAt: row.updated_at
  };
}

/**
 * Derive a mastery status from the current `p_known`. Mirrors the thresholds
 * used by the BKT engine in svc-bkt (`calculateMasteryStatus`).
 */
function deriveMasteryStatus(
  pKnown: number,
  attemptCount: number
): SkillSummary['masteryStatus'] {
  if (attemptCount === 0) return 'PENDING';
  if (pKnown >= MASTERY_THRESHOLD) return 'MASTERED';
  if (pKnown < STRUGGLING_THRESHOLD) return 'STRUGGLING';
  return 'DIAGNOSED';
}

/**
 * Clamp a value into the [0, 1] interval. Used to defensively bound the
 * BKT probability written by callers.
 */
function clampProbability(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/* -------------------------------------------------------------------------- */
/*                              Public API                                    */
/* -------------------------------------------------------------------------- */

/**
 * Paginated list of progress rows for a single student.
 */
export async function getStudentProgress(
  studentId: string,
  pagination: ProgressPaginationInput
): Promise<ProgressPage> {
  await ensureStudentExists(studentId);

  const where = { student_id: studentId };
  const [rows, total] = await Promise.all([
    prisma.progress.findMany({
      where,
      orderBy: { updated_at: 'desc' },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.progress.count({ where })
  ]);

  return {
    items: rows.map(toProgressRecord),
    total,
    skip: pagination.skip,
    take: pagination.take
  };
}

/**
 * Synthetic history for a `(studentId, skillId)` pair over the last
 * `days` window.
 *
 * Because the progress table mutates in place we cannot reconstruct a full
 * time-series without an audit log. We do, however, have `last_p_known`
 * (the value BEFORE the most recent update) and `p_known` (the CURRENT
 * value), so we synthesize two points:
 *
 *   previous  — `last_p_known` at `(updated_at - deltaMs)`
 *   current   — `p_known`     at `updated_at`
 *
 * When the row has never been updated the previous point is omitted.
 */
export async function getProgressHistory(
  studentId: string,
  skillId: string,
  days: number
): Promise<ProgressHistory> {
  if (!UUID_REGEX.test(studentId)) {
    throw new ValidationError(
      [
        {
          path: ['studentId'],
          message: 'studentId must be a valid UUID',
          code: 'invalid_uuid'
        }
      ],
      'Invalid student id'
    );
  }
  if (!UUID_REGEX.test(skillId)) {
    throw new ValidationError(
      [
        {
          path: ['skillId'],
          message: 'skillId must be a valid UUID',
          code: 'invalid_uuid'
        }
      ],
      'Invalid skill id'
    );
  }
  if (!Number.isInteger(days) || days < 1 || days > 365) {
    throw new ValidationError(
      [
        {
          path: ['days'],
          message: 'days must be an integer between 1 and 365',
          code: 'out_of_range'
        }
      ],
      'Invalid days parameter'
    );
  }

  await ensureStudentExists(studentId);

  const row = await prisma.progress.findUnique({
    where: { student_id_skill_id: { student_id: studentId, skill_id: skillId } }
  });
  if (!row) {
    throw new NotFoundError('Progress', `${studentId}/${skillId}`);
  }

  // Time-window filter: if the last update is older than `days`, report
  // an empty history. We keep the current point only if it's in-window.
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const inWindow = row.updated_at >= cutoff;

  const current: ProgressPoint = {
    pKnown: row.p_known,
    attemptCount: row.attempt_count,
    timestamp: row.updated_at
  };

  let previous: ProgressPoint | null = null;
  if (inWindow && row.last_p_known !== row.p_known) {
    // Stamp the previous point at `updated_at` minus an arbitrary offset
    // proportional to `days`, capped at one day. The exact offset is
    // indicative — callers should treat it as "some time before the latest
    // update".
    const offsetMs = Math.min(24 * 60 * 60 * 1000, days * 60 * 60 * 1000);
    previous = {
      pKnown: row.last_p_known,
      attemptCount: Math.max(0, row.attempt_count - 1),
      timestamp: new Date(row.updated_at.getTime() - offsetMs)
    };
  }

  return {
    studentId,
    skillId,
    windowDays: days,
    current: inWindow ? current : { ...current, timestamp: cutoff },
    previous,
    delta: previous === null ? 0 : row.p_known - row.last_p_known
  };
}

/**
 * All skills currently tracked for a student, with derived mastery status.
 * Unlike `getStudentProgress` this returns the FULL set (no pagination)
 * because per-skill mastery is the dashboard's primary view.
 */
export async function getStudentSkills(studentId: string): Promise<SkillSummary[]> {
  await ensureStudentExists(studentId);
  const rows = await prisma.progress.findMany({
    where: { student_id: studentId },
    orderBy: { updated_at: 'desc' }
  });

  return rows.map((row) => ({
    skillId: row.skill_id,
    pKnown: row.p_known,
    attemptCount: row.attempt_count,
    updatedAt: row.updated_at,
    masteryStatus: deriveMasteryStatus(row.p_known, row.attempt_count)
  }));
}

/**
 * Upsert a progress row for `(studentId, skillId)`.
 *
 * On insert: `last_p_known` defaults to 0 and `attempt_count` to 1.
 * On update: `last_p_known` becomes the previous `p_known`,
 * `attempt_count` increments by one, and `p_known` becomes the new value
 * (clamped to [0, 1]).
 */
export async function updateProgress(
  studentId: string,
  skillId: string,
  pKnown: number
): Promise<ProgressRecord> {
  if (!UUID_REGEX.test(skillId)) {
    throw new ValidationError(
      [
        {
          path: ['skillId'],
          message: 'skillId must be a valid UUID',
          code: 'invalid_uuid'
        }
      ],
      'Invalid skill id'
    );
  }
  if (typeof pKnown !== 'number' || pKnown < 0 || pKnown > 1) {
    throw new ValidationError(
      [
        {
          path: ['pKnown'],
          message: 'pKnown must be a number between 0 and 1',
          code: 'out_of_range'
        }
      ],
      'Invalid pKnown'
    );
  }
  await ensureStudentExists(studentId);

  const clamped = clampProbability(pKnown);
  const existing = await prisma.progress.findUnique({
    where: { student_id_skill_id: { student_id: studentId, skill_id: skillId } }
  });

  let updated;
  if (existing === null) {
    updated = await prisma.progress.create({
      data: {
        student_id: studentId,
        skill_id: skillId,
        p_known: clamped,
        last_p_known: 0,
        attempt_count: 1
      }
    });
    logger.info('Progress created', { studentId, skillId, pKnown: clamped });
  } else {
    updated = await prisma.progress.update({
      where: {
        student_id_skill_id: { student_id: studentId, skill_id: skillId }
      },
      data: {
        p_known: clamped,
        last_p_known: existing.p_known,
        attempt_count: { increment: 1 }
      }
    });
    logger.info('Progress updated', {
      studentId,
      skillId,
      from: existing.p_known,
      to: clamped
    });
  }

  return toProgressRecord(updated);
}
