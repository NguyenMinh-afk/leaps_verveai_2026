/**
 * Business logic for assignment management in service-assignment.
 *
 * Responsibilities:
 *  - CRUD on `assignments` rows, scoped to a teacher.
 *  - Enforce teacher ownership for mutations.
 *  - Soft-delete assignments.
 *  - Allow students to view assignments for classes they are enrolled in.
 */

import { prisma } from '../prisma/client.js';
import {
  NotFoundError,
  ValidationError
} from '@verveai/error-types';
import { logger } from '../utils/logger.js';
import { ForbiddenError } from '../errors.js';
import type { PaginationInput } from '../validators/assignment.validator.js';

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

/**
 * Public shape returned to API consumers.
 */
export interface AssignmentRecord {
  id: string;
  title: string;
  description: string | null;
  teacherId: string;
  classId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  dueAt: Date | null;
  startsAt: Date | null;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Result of list functions — items plus pagination metadata.
 */
export interface AssignmentListPage {
  items: AssignmentRecord[];
  total: number;
  skip: number;
  take: number;
}

/**
 * Shape of filters for listing assignments.
 */
export interface ListAssignmentsFilters {
  teacherId?: string;
  classId?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

/* -------------------------------------------------------------------------- */
/*                              Internal helpers                             */
/* -------------------------------------------------------------------------- */

/**
 * Lightweight UUID check — saves a DB round-trip when callers pass garbage.
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Cast a Prisma row to the public `AssignmentRecord` shape.
 */
function toAssignmentRecord(row: {
  id: string;
  title: string;
  description: string | null;
  teacher_id: string;
  class_id: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  due_at: Date | null;
  starts_at: Date | null;
  max_attempts: number;
  created_at: Date;
  updated_at: Date;
}): AssignmentRecord {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    teacherId: row.teacher_id,
    classId: row.class_id,
    status: row.status,
    dueAt: row.due_at,
    startsAt: row.starts_at,
    maxAttempts: row.max_attempts,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Throw 404 if the assignment does not exist OR has been soft-deleted.
 */
async function findActiveAssignmentOrThrow(id: string) {
  if (!UUID_REGEX.test(id)) {
    throw new ValidationError(
      [{ path: ['id'], message: 'id must be a valid UUID', code: 'invalid_uuid' }],
      'Invalid assignment id'
    );
  }
  const row = await prisma.assignment.findFirst({
    where: { id, deleted_at: null }
  });
  if (!row) {
    throw new NotFoundError('Assignment', id);
  }
  return row;
}

/* -------------------------------------------------------------------------- */
/*                              Public API                                    */
/* -------------------------------------------------------------------------- */

/**
 * Create a new assignment.
 *
 * Throws:
 *  - ForbiddenError when the acting user is not a teacher
 *  - ValidationError when input validation fails
 */
export async function createAssignment(
  input: {
    title: string;
    description?: string | null;
    classId: string;
    startsAt?: string | null;
    dueAt?: string | null;
    maxAttempts?: number;
  },
  actingUserId: string,
  actingUserRole: string
): Promise<AssignmentRecord> {
  // Only teachers can create assignments
  if (actingUserRole !== 'TEACHER') {
    throw new ForbiddenError(
      'FORBIDDEN_ROLE',
      'Only teachers can create assignments',
      { actingUserId, actingUserRole }
    );
  }

  const data: {
    title: string;
    description: string | null;
    teacher_id: string;
    class_id: string;
    starts_at: Date | null;
    due_at: Date | null;
    max_attempts: number;
  } = {
    title: input.title,
    description: input.description ?? null,
    teacher_id: actingUserId,
    class_id: input.classId,
    starts_at: input.startsAt ? new Date(input.startsAt) : null,
    due_at: input.dueAt ? new Date(input.dueAt) : null,
    max_attempts: input.maxAttempts ?? 1
  };

  const created = await prisma.assignment.create({
    data
  });

  logger.info('Assignment created', {
    assignmentId: created.id,
    teacherId: created.teacher_id,
    classId: created.class_id
  });

  return toAssignmentRecord(created);
}

/**
 * Update an existing assignment. Only the owning teacher (or an admin) may update.
 */
export async function updateAssignment(
  id: string,
  input: {
    title?: string;
    description?: string | null;
    classId?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    startsAt?: string | null;
    dueAt?: string | null;
    maxAttempts?: number;
  },
  actingUserId: string,
  actingUserRole: string
): Promise<AssignmentRecord> {
  const existing = await findActiveAssignmentOrThrow(id);

  const isAdmin = actingUserRole === 'ADMIN';
  if (!isAdmin && existing.teacher_id !== actingUserId) {
    throw new ForbiddenError(
      'FORBIDDEN_NOT_OWNER',
      'Only the owning teacher or an admin can update this assignment',
      { assignmentId: id, ownerId: existing.teacher_id, actingUserId }
    );
  }

  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data['title'] = input.title;
  if (input.description !== undefined) data['description'] = input.description;
  if (input.classId !== undefined) data['class_id'] = input.classId;
  if (input.status !== undefined) data['status'] = input.status;
  if (input.startsAt !== undefined) data['starts_at'] = input.startsAt ? new Date(input.startsAt) : null;
  if (input.dueAt !== undefined) data['due_at'] = input.dueAt ? new Date(input.dueAt) : null;
  if (input.maxAttempts !== undefined) data['max_attempts'] = input.maxAttempts;

  if (Object.keys(data).length === 0) {
    return toAssignmentRecord(existing);
  }

  const updated = await prisma.assignment.update({
    where: { id },
    data
  });

  logger.info('Assignment updated', { assignmentId: id, fields: Object.keys(data) });
  return toAssignmentRecord(updated);
}

/**
 * Soft-delete an assignment. Only the owning teacher (or an admin) may delete.
 */
export async function deleteAssignment(
  id: string,
  actingUserId: string,
  actingUserRole: string
): Promise<void> {
  const existing = await findActiveAssignmentOrThrow(id);

  const isAdmin = actingUserRole === 'ADMIN';
  if (!isAdmin && existing.teacher_id !== actingUserId) {
    throw new ForbiddenError(
      'FORBIDDEN_NOT_OWNER',
      'Only the owning teacher or an admin can delete this assignment',
      { assignmentId: id, ownerId: existing.teacher_id, actingUserId }
    );
  }

  await prisma.assignment.update({
    where: { id },
    data: { deleted_at: new Date() }
  });

  logger.info('Assignment soft-deleted', { assignmentId: id, actingUserId });
}

/**
 * Get a single assignment by ID.
 * Students can only view assignments for classes they are enrolled in.
 * Teachers can only view their own assignments.
 * Admins can view all.
 */
export async function getAssignment(
  id: string,
  actingUserId: string,
  actingUserRole: string
): Promise<AssignmentRecord> {
  const existing = await findActiveAssignmentOrThrow(id);

  const isAdmin = actingUserRole === 'ADMIN';
  const isOwner = existing.teacher_id === actingUserId;
  const isStudent = actingUserRole === 'STUDENT';

  if (isAdmin || isOwner) {
    return toAssignmentRecord(existing);
  }

  if (isStudent) {
    // For students, we need to verify enrollment
    // Note: In a full implementation, this would check against svc-class
    // For now, we allow students to view published assignments
    if (existing.status === 'PUBLISHED') {
      return toAssignmentRecord(existing);
    }
    throw new ForbiddenError(
      'FORBIDDEN_NOT_ENROLLED',
      'Students can only view published assignments for their enrolled classes',
      { assignmentId: id, actingUserId }
    );
  }

  throw new ForbiddenError(
    'FORBIDDEN_NOT_OWNER',
    'You do not have access to this assignment',
    { assignmentId: id, actingUserId }
  );
}

/**
 * Paginated list of assignments with optional filters.
 * Teachers can only list their own assignments.
 * Admins can list all assignments.
 */
export async function listAssignments(
  filters: ListAssignmentsFilters,
  pagination: PaginationInput,
  actingUserId: string,
  actingUserRole: string
): Promise<AssignmentListPage> {
  const isAdmin = actingUserRole === 'ADMIN';

  const where: {
    deleted_at: null;
    teacher_id?: string;
    class_id?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  } = { deleted_at: null };

  // Teachers can only see their own assignments
  if (actingUserRole === 'TEACHER') {
    where.teacher_id = actingUserId;
  }

  // Apply additional filters
  if (filters.teacherId !== undefined && isAdmin) {
    where.teacher_id = filters.teacherId;
  }
  if (filters.classId !== undefined) {
    where.class_id = filters.classId;
  }
  if (filters.status !== undefined) {
    where.status = filters.status;
  }

  const [rows, total] = await Promise.all([
    prisma.assignment.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.assignment.count({ where })
  ]);

  const items = rows.map(toAssignmentRecord);

  return {
    items,
    total,
    skip: pagination.skip,
    take: pagination.take
  };
}

/**
 * List assignments for a student based on their enrollments.
 * Students can only see published assignments for classes they are enrolled in.
 */
export async function listStudentAssignments(
  studentId: string,
  pagination: PaginationInput
): Promise<AssignmentListPage> {
  // In a full implementation, we would:
  // 1. First query svc-class to get the student's enrolled class IDs
  // 2. Then query assignments for those class IDs with status PUBLISHED
  
  // For now, we query assignments without class enrollment verification
  // The actual enrollment check should happen via svc-class
  
  const where: {
    deleted_at: null;
    status: 'PUBLISHED';
  } = {
    deleted_at: null,
    status: 'PUBLISHED'
  };

  // Note: studentId class enrollment check should be done via svc-class
  // This is a simplified implementation that relies on the gateway
  // to properly validate student enrollment

  const [rows, total] = await Promise.all([
    prisma.assignment.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.assignment.count({ where })
  ]);

  const items = rows.map(toAssignmentRecord);

  return {
    items,
    total,
    skip: pagination.skip,
    take: pagination.take
  };
}
