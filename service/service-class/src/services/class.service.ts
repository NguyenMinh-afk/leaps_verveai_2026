/**
 * Business logic for class management in service-class.
 *
 * Responsibilities:
 *  - CRUD on `class` rows, scoped to a teacher.
 *  - Compute aggregate statistics (student count, average mastery).
 *  - Enforce teacher ownership for mutations.
 *  - Soft-delete classes and cascade the `deleted_at` flag onto enrollments.
 *
 * Cross-service calls (svc-auth for teacher validation, svc-bkt for
 * intervention counts) go through the helpers in `inter-service.ts` and
 * are wrapped in opossum circuit breakers — see ADR-0004 / ADR-0005.
 */

import { prisma } from '../prisma/client.js';
import {
  NotFoundError,
  ValidationError,
  ConflictError
} from '@verveai/error-types';
import { logger } from '../utils/logger.js';
import { ForbiddenError } from '../errors.js';
import { callSvcAuth, callSvcBkt, type InterServiceHeaders } from './inter-service.js';
import type { PaginationInput } from '../validators/class.validator.js';

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

/**
 * Public shape returned to API consumers. We translate snake_case DB columns
 * to camelCase here so the rest of the service never has to think about the
 * underlying Prisma model.
 */
export interface ClassRecord {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Detailed view returned by `getClass` — adds the non-deleted enrollments
 * with the student identifiers teachers need to render rosters.
 */
export interface ClassDetail extends ClassRecord {
  enrollments: Array<{
    id: string;
    studentId: string;
    enrolledAt: Date;
  }>;
}

/**
 * Class row enriched with aggregate metrics used by the dashboard.
 * `studentCount` and `averageProgress` are computed at read time so they
 * stay consistent with the current state of the database.
 */
export interface ClassWithStats extends ClassRecord {
  studentCount: number;
  averageProgress: number;
}

/**
 * Result of `listClasses` — items plus pagination metadata so the route
 * layer can build a `{ success, data, meta }` envelope.
 */
export interface ClassListPage {
  items: ClassWithStats[];
  total: number;
  skip: number;
  take: number;
}

/**
 * Aggregate stats for a single class. Used by the dashboard and the
 * `GET /api/class/classes/:id/stats` endpoint.
 */
export interface ClassStats {
  classId: string;
  studentCount: number;
  averageMastery: number;
  masteryRate: number;
  interventionCount: number;
  interventionAvailable: boolean;
}

/** Subset of the user record we need to confirm a teacher is real. */
interface AuthUserResponse {
  data?: { id: string; isActive?: boolean };
}

/** Subset of the intervention payload we consume from svc-bkt. */
interface InterventionCountResponse {
  data?: { count: number };
  count?: number;
}

/* -------------------------------------------------------------------------- */
/*                              Internal helpers                             */
/* -------------------------------------------------------------------------- */

/**
 * Cast a Prisma row to the public `ClassRecord` shape.
 *
 * Using an explicit mapper keeps the public API stable even if the Prisma
 * model later changes (e.g. adding columns we don't want to leak).
 */
function toClassRecord(row: {
  id: string;
  name: string;
  subject: string;
  teacher_id: string;
  created_at: Date;
  updated_at: Date;
}): ClassRecord {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject,
    teacherId: row.teacher_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Verify that a userId refers to an existing, active teacher in svc-auth.
 *
 * Returns `true` when svc-auth confirms the user is real and active, `false`
 * otherwise. Network failures are logged but do NOT block the request — we
 * degrade to "unknown teacher" and let the caller decide. Validation that
 * the caller truly has the TEACHER role happens at the Gateway.
 */
async function verifyTeacherExists(
  teacherId: string,
  ctx: InterServiceHeaders
): Promise<boolean> {
  if (!UUID_REGEX.test(teacherId)) {
    return false;
  }
  const response = await callSvcAuth<AuthUserResponse>(
    `/api/users/${teacherId}`,
    { ctx }
  );
  if (response === null) {
    logger.warn('Could not verify teacher via svc-auth', { teacherId });
    return true; // fail-open: don't block writes when svc-auth is down
  }
  const user = response.data;
  if (!user) {
    return false;
  }
  if (user.isActive === false) {
    return false;
  }
  return true;
}

/**
 * Lightweight UUID check — saves a DB round-trip when callers pass garbage.
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Throw 404 if the class does not exist OR has been soft-deleted.
 *
 * Soft-deleted rows are intentionally invisible to read endpoints so that
 * "delete" is recoverable in tests/ops while still being hidden from users.
 */
async function findActiveClassOrThrow(id: string) {
  if (!UUID_REGEX.test(id)) {
    throw new ValidationError(
      [{ path: ['id'], message: 'id must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid class id'
    );
  }
  const row = await prisma.class.findFirst({
    where: { id, deleted_at: null }
  });
  if (!row) {
    throw new NotFoundError('Class', id);
  }
  return row;
}

/* -------------------------------------------------------------------------- */
/*                              Public API                                    */
/* -------------------------------------------------------------------------- */

/**
 * Paginated list of classes taught by `teacherId`, each annotated with
 * student count and average mastery. When `teacherId` is omitted the
 * endpoint returns ALL active classes — used by admins.
 *
 * Average mastery is computed across the students' per-skill `p_known`
 * values; if a class has no progress records yet, we report 0.
 */
export async function listClasses(
  teacherId: string | undefined,
  pagination: PaginationInput,
  ctx: InterServiceHeaders = {}
): Promise<ClassListPage> {
  const where: {
    deleted_at: null;
    teacher_id?: string;
  } = { deleted_at: null };
  if (teacherId !== undefined && teacherId.length > 0) {
    where.teacher_id = teacherId;
  }

  const [rows, total] = await Promise.all([
    prisma.class.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
      include: {
        enrollments: {
          where: { deleted_at: null },
          select: {
            student: {
              select: {
                id: true,
                progress: { select: { p_known: true } }
              }
            }
          }
        }
      }
    }),
    prisma.class.count({ where })
  ]);

  const items: ClassWithStats[] = rows.map((row) => {
    let pKnownSum = 0;
    let pKnownCount = 0;
    const seenStudents = new Set<string>();
    for (const enrollment of row.enrollments) {
      if (seenStudents.has(enrollment.student.id)) continue;
      seenStudents.add(enrollment.student.id);
      for (const p of enrollment.student.progress) {
        pKnownSum += p.p_known;
        pKnownCount += 1;
      }
    }
    return {
      ...toClassRecord(row),
      studentCount: row.enrollments.length,
      averageProgress: pKnownCount > 0 ? pKnownSum / pKnownCount : 0
    };
  });

  return {
    items,
    total,
    skip: pagination.skip,
    take: pagination.take
  };
}

/**
 * Create a new class after verifying the teacher exists in svc-auth.
 *
 * Throws:
 *  - `ValidationError` when the input fails schema validation.
 *  - `ConflictError` if a non-deleted class with the same `(name, teacher)`
 *    already exists — protects teachers from double-creating.
 */
export async function createClass(
  input: { name: string; subject: string; teacherId: string },
  ctx: InterServiceHeaders = {}
): Promise<ClassRecord> {
  const teacherOk = await verifyTeacherExists(input.teacherId, ctx);
  if (!teacherOk) {
    throw new ValidationError(
      [
        {
          path: ['teacherId'],
          message: 'teacherId does not refer to an active user',
          code: 'teacher_not_found'
        }
      ],
      'Unknown teacher'
    );
  }

  const existing = await prisma.class.findFirst({
    where: {
      teacher_id: input.teacherId,
      name: input.name,
      deleted_at: null
    }
  });
  if (existing) {
    throw new ConflictError(
      `Class "${input.name}" already exists for this teacher`
    );
  }

  const created = await prisma.class.create({
    data: {
      name: input.name,
      subject: input.subject,
      teacher_id: input.teacherId
    }
  });

  logger.info('Class created', {
    classId: created.id,
    teacherId: created.teacher_id
  });
  return toClassRecord(created);
}

/**
 * Fetch a single class with its non-deleted enrollments.
 */
export async function getClass(id: string): Promise<ClassDetail> {
  const row = await findActiveClassOrThrow(id);
  const enrollments = await prisma.enrollment.findMany({
    where: { class_id: id, deleted_at: null, dropped_at: null },
    orderBy: { enrolled_at: 'asc' }
  });
  return {
    ...toClassRecord(row),
    enrollments: enrollments.map((e) => ({
      id: e.id,
      studentId: e.student_id,
      enrolledAt: e.enrolled_at
    }))
  };
}

/**
 * Update mutable fields on a class. Only the owning teacher (or an admin,
 * identified by `actingUserId`) may update.
 *
 * Returns the updated record.
 */
export async function updateClass(
  id: string,
  input: { name?: string; subject?: string; teacherId?: string },
  actingUserId: string,
  actingUserRole: string,
  ctx: InterServiceHeaders = {}
): Promise<ClassRecord> {
  const existing = await findActiveClassOrThrow(id);

  const isAdmin = actingUserRole === 'ADMIN';
  if (!isAdmin && existing.teacher_id !== actingUserId) {
    throw new ForbiddenError(
      'FORBIDDEN_NOT_OWNER',
      'Only the owning teacher or an admin can update this class',
      { classId: id, ownerId: existing.teacher_id, actingUserId }
    );
  }

  // If teacherId is being changed, validate it too.
  if (input.teacherId !== undefined && input.teacherId !== existing.teacher_id) {
    const ok = await verifyTeacherExists(input.teacherId, ctx);
    if (!ok) {
      throw new ValidationError(
        [
          {
            path: ['teacherId'],
            message: 'teacherId does not refer to an active user',
            code: 'teacher_not_found'
          }
        ],
        'Unknown teacher'
      );
    }
  }

  // Reject empty payloads early — Zod already strips them, but if every
  // field is undefined we should not issue a no-op UPDATE.
  const data: Record<string, string> = {};
  if (input.name !== undefined) data['name'] = input.name;
  if (input.subject !== undefined) data['subject'] = input.subject;
  if (input.teacherId !== undefined) data['teacher_id'] = input.teacherId;
  if (Object.keys(data).length === 0) {
    return toClassRecord(existing);
  }

  const updated = await prisma.class.update({
    where: { id },
    data
  });
  logger.info('Class updated', { classId: id, fields: Object.keys(data) });
  return toClassRecord(updated);
}

/**
 * Soft-delete a class and cascade the deletion to its non-dropped enrollments.
 *
 * Uses a transaction so that we either hide everything or nothing.
 */
export async function deleteClass(
  id: string,
  actingUserId: string,
  actingUserRole: string
): Promise<void> {
  const existing = await findActiveClassOrThrow(id);

  const isAdmin = actingUserRole === 'ADMIN';
  if (!isAdmin && existing.teacher_id !== actingUserId) {
    throw new ForbiddenError(
      'FORBIDDEN_NOT_OWNER',
      'Only the owning teacher or an admin can delete this class',
      { classId: id, ownerId: existing.teacher_id, actingUserId }
    );
  }

  const now = new Date();
  await prisma.$transaction([
    prisma.class.update({
      where: { id },
      data: { deleted_at: now }
    }),
    prisma.enrollment.updateMany({
      where: { class_id: id, deleted_at: null },
      data: { deleted_at: now, dropped_at: now }
    })
  ]);

  logger.info('Class soft-deleted', { classId: id, actingUserId });
}

/**
 * Aggregate stats for a single class. Combines local aggregates with the
 * intervention count proxied from svc-bkt. When svc-bkt is unavailable we
 * still return the local stats and set `interventionAvailable = false`.
 */
export async function getClassStats(
  id: string,
  ctx: InterServiceHeaders = {}
): Promise<ClassStats> {
  await findActiveClassOrThrow(id);

  const enrollments = await prisma.enrollment.findMany({
    where: { class_id: id, deleted_at: null },
    select: {
      student: {
        select: { id: true, progress: { select: { p_known: true } } }
      }
    }
  });

  const studentIds = new Set<string>();
  let pKnownSum = 0;
  let pKnownCount = 0;
  for (const enrollment of enrollments) {
    if (studentIds.has(enrollment.student.id)) continue;
    studentIds.add(enrollment.student.id);
    for (const p of enrollment.student.progress) {
      pKnownSum += p.p_known;
      pKnownCount += 1;
    }
  }
  const studentCount = studentIds.size;
  const averageMastery = pKnownCount > 0 ? pKnownSum / pKnownCount : 0;
  // Mastery rate = fraction of skills with p_known >= 0.8.
  const masteryThreshold = 0.8;
  let mastered = 0;
  for (const enrollment of enrollments) {
    for (const p of enrollment.student.progress) {
      if (p.p_known >= masteryThreshold) mastered += 1;
    }
  }
  const masteryRate = pKnownCount > 0 ? mastered / pKnownCount : 0;

  // Cross-service: ask svc-bkt for the count of active interventions in
  // this class. Return null on failure and report it in the response.
  const interventions = await callSvcBkt<InterventionCountResponse>(
    `/api/bkt/interventions/class/${id}`,
    { ctx, throwOnError: false }
  );

  let interventionCount = 0;
  let interventionAvailable = true;
  if (interventions === null) {
    interventionAvailable = false;
  } else if (typeof interventions.count === 'number') {
    interventionCount = interventions.count;
  } else if (
    interventions.data !== undefined &&
    typeof interventions.data.count === 'number'
  ) {
    interventionCount = interventions.data.count;
  }

  return {
    classId: id,
    studentCount,
    averageMastery,
    masteryRate,
    interventionCount,
    interventionAvailable
  };
}
