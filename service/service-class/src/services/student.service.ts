/**
 * Business logic for student management in service-class.
 *
 * Responsibilities:
 *  - CRUD on `student` rows, with soft-delete semantics.
 *  - Aggregate per-student summaries (classes enrolled, progress counts).
 *  - Proxy evidence and diagnosis payloads from svc-bkt.
 *
 * All cross-service calls go through the helpers in `inter-service.ts`
 * which wrap them in an opossum circuit breaker (ADR-0004 / ADR-0005).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import {
  NotFoundError,
  ValidationError,
  ConflictError
} from '@verveai/error-types';
import { logger } from '../utils/logger.js';
import { callSvcBkt, type InterServiceHeaders } from './inter-service.js';

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

/**
 * Public student record (camelCase) returned by this service.
 */
export interface StudentRecord {
  id: string;
  name: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * `getStudent` adds the list of classes the student is currently enrolled
 * in plus an aggregate progress summary.
 */
export interface StudentDetail extends StudentRecord {
  classes: Array<{
    classId: string;
    className: string;
    subject: string;
    enrolledAt: Date;
  }>;
  progressSummary: {
    totalSkills: number;
    averagePKnown: number;
    masteredSkills: number;
    totalAttempts: number;
  };
}

/**
 * Generic envelope returned by svc-bkt endpoints. We intentionally accept
 * both `{ data: ... }` and a bare payload so the helper is forgiving when
 * the upstream response shape evolves.
 */
interface RemoteEnvelope<T> {
  data?: T;
  success?: boolean;
  error?: unknown;
}

/** A single evidence entry as returned by svc-bkt. */
interface EvidenceRecord {
  id: string;
  studentId: string;
  itemId: string;
  correct: boolean;
  quality?: string;
  createdAt: string | Date;
}

/** A single diagnosis as returned by svc-bkt. */
interface DiagnosisRecord {
  id: string;
  studentId: string;
  skillId: string;
  pKnown: number;
  status: string;
  createdAt: string | Date;
}

/* -------------------------------------------------------------------------- */
/*                              Internal helpers                             */
/* -------------------------------------------------------------------------- */

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function findActiveStudentOrThrow(id: string) {
  if (!UUID_REGEX.test(id)) {
    throw new ValidationError(
      [{ path: ['id'], message: 'id must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid student id'
    );
  }
  const row = await prisma.student.findFirst({
    where: { id, deleted_at: null }
  });
  if (!row) {
    throw new NotFoundError('Student', id);
  }
  return row;
}

function toStudentRecord(row: {
  id: string;
  name: string;
  email: string | null;
  created_at: Date;
  updated_at: Date;
}): StudentRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/* -------------------------------------------------------------------------- */
/*                              Public API                                    */
/* -------------------------------------------------------------------------- */

/**
 * Fetch a student along with their active classes and a progress summary.
 *
 * Progress summary aggregates the student's `progress` rows: total skills
 * observed, average mastery, count of mastered skills (p_known >= 0.8) and
 * total attempts.
 */
export async function getStudent(id: string): Promise<StudentDetail> {
  const row = await findActiveStudentOrThrow(id);

  const [enrollments, progress] = await Promise.all([
    prisma.enrollment.findMany({
      where: { student_id: id, deleted_at: null, dropped_at: null },
      orderBy: { enrolled_at: 'asc' },
      include: {
        class: {
          select: { id: true, name: true, subject: true }
        }
      }
    }),
    prisma.progress.findMany({
      where: { student_id: id }
    })
  ]);

  let pKnownSum = 0;
  let mastered = 0;
  let totalAttempts = 0;
  for (const p of progress) {
    pKnownSum += p.p_known;
    if (p.p_known >= 0.8) mastered += 1;
    totalAttempts += p.attempt_count;
  }
  const totalSkills = progress.length;
  const averagePKnown = totalSkills > 0 ? pKnownSum / totalSkills : 0;

  return {
    ...toStudentRecord(row),
    classes: enrollments.map((e) => ({
      classId: e.class.id,
      className: e.class.name,
      subject: e.class.subject,
      enrolledAt: e.enrolled_at
    })),
    progressSummary: {
      totalSkills,
      averagePKnown,
      masteredSkills: mastered,
      totalAttempts
    }
  };
}

/**
 * Insert a new student row. Email is optional but unique when present.
 */
export async function createStudent(input: {
  name: string;
  email?: string | null;
}): Promise<StudentRecord> {
  const email = input.email === undefined ? null : input.email;
  if (email !== null) {
    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing && existing.deleted_at === null) {
      throw new ConflictError(`A student with email ${email} already exists`);
    }
    // If a soft-deleted row has this email, prefer a hard-create collision
    // surface so callers can react instead of silently overwriting history.
    if (existing && existing.deleted_at !== null) {
      throw new ConflictError(
        `Email ${email} belongs to a deleted student; restore or pick another email`
      );
    }
  }

  const created = await prisma.student.create({
    data: { name: input.name, email }
  });
  logger.info('Student created', { studentId: created.id });
  return toStudentRecord(created);
}

/**
 * Mutate the mutable subset of fields on a student (currently just name +
 * email). Other columns (created_at, etc.) are intentionally not writable.
 */
export async function updateStudent(
  id: string,
  input: { name?: string; email?: string | null }
): Promise<StudentRecord> {
  const existing = await findActiveStudentOrThrow(id);

  if (input.email !== undefined && input.email !== null) {
    const collision = await prisma.student.findUnique({
      where: { email: input.email }
    });
    if (collision && collision.id !== id) {
      throw new ConflictError(
        `Email ${input.email} is already used by another student`
      );
    }
  }

  const data: Record<string, string | null> = {};
  if (input.name !== undefined) data['name'] = input.name;
  if (input.email !== undefined) data['email'] = input.email;

  if (Object.keys(data).length === 0) {
    return toStudentRecord(existing);
  }

  const updated = await prisma.student.update({ where: { id }, data });
  logger.info('Student updated', { studentId: id, fields: Object.keys(data) });
  return toStudentRecord(updated);
}

/**
 * Soft-delete a student. Enrollment rows are left alone — they remain
 * visible to the class for historical reporting but the student record
 * itself becomes invisible to read endpoints.
 *
 * If `dropEnrollments` is true we ALSO mark the student's active
 * enrollments as dropped, which is the typical "leaves school" flow.
 */
export async function deleteStudent(
  id: string,
  options: { dropEnrollments?: boolean } = {}
): Promise<void> {
  const existing = await findActiveStudentOrThrow(id);
  const now = new Date();
  const operations: Prisma.PrismaPromise<unknown>[] = [
    prisma.student.update({
      where: { id },
      data: { deleted_at: now }
    })
  ];
  if (options.dropEnrollments === true) {
    operations.push(
      prisma.enrollment.updateMany({
        where: { student_id: id, deleted_at: null },
        data: { deleted_at: now, dropped_at: now }
      })
    );
  }
  await prisma.$transaction(operations);
  logger.info('Student soft-deleted', { studentId: existing.id });
}

/**
 * Fetch evidence items for a student from svc-bkt.
 *
 * Returns an empty array when svc-bkt is unavailable so the dashboard can
 * still render the student card — circuit breaker failures are expected
 * during outages and must not bubble up as 500s.
 */
export async function getStudentEvidence(
  studentId: string,
  ctx: InterServiceHeaders = {}
): Promise<EvidenceRecord[]> {
  await findActiveStudentOrThrow(studentId);

  const response = await callSvcBkt<RemoteEnvelope<EvidenceRecord[]>>(
    `/api/bkt/evidence/student/${studentId}`,
    { ctx }
  );
  if (response === null) return [];
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) {
    // Some upstream endpoints return a bare array; handle that too.
    return response as unknown as EvidenceRecord[];
  }
  return [];
}

/**
 * Fetch the current BKT diagnoses for a student.
 *
 * Same graceful-degradation policy as `getStudentEvidence`: if svc-bkt is
 * unreachable or returns a non-array payload we return `[]` rather than
 * failing the entire request.
 */
export async function getStudentDiagnosis(
  studentId: string,
  ctx: InterServiceHeaders = {}
): Promise<DiagnosisRecord[]> {
  await findActiveStudentOrThrow(studentId);

  const response = await callSvcBkt<RemoteEnvelope<DiagnosisRecord[]>>(
    `/api/bkt/diagnosis/student/${studentId}`,
    { ctx }
  );
  if (response === null) return [];
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) {
    return response as unknown as DiagnosisRecord[];
  }
  return [];
}
