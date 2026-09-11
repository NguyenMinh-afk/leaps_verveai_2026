/**
 * Intervention Service
 *
 * Implements teacher / system facing CRUD for "intervention" records.
 * An intervention is a flag raised by the BKT engine (or by a teacher)
 * indicating that a student may need additional support for a skill.
 *
 * State transitions:
 *   ACTIVE       — open, awaiting resolution or override
 *   RESOLVED     — closed, student has shown progress (resolvedAt set)
 *   CANCELLED    — closed by an override or other administrative action
 *
 *   (FR-17) — Teacher override writes a reason AND records the
 *   teacherId on the row so the action is auditable.
 */

import { z } from 'zod';
import { prisma } from '../prisma/client.js';
import { logger } from '../utils/logger.js';
import { ConflictError, NotFoundError, ValidationError } from '@verveai/error-types';
import { computePagination } from '@verveai/common-node';

const log = logger.child({ component: 'intervention.service' });

export type InterventionStatus = 'ACTIVE' | 'RESOLVED' | 'CANCELLED';

export interface InterventionDto {
  id: string;
  studentId: string;
  skillId: string;
  priority: number;
  status: InterventionStatus;
  teacherId: string | null;
  notes: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
  notes_list?: InterventionNoteDto[];
}

export interface InterventionNoteDto {
  id: string;
  interventionId: string;
  teacherId: string;
  content: string;
  createdAt: Date;
}

export interface ListInterventionsFilters {
  status?: InterventionStatus;
  minPriority?: number;
  maxPriority?: number;
  classId?: string;
  studentId?: string;
  skillId?: string;
  page: number;
  pageSize: number;
}

export interface ListInterventionsResult {
  data: InterventionDto[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/* ─────────────────────────── Validators ─────────────────────────── */

const statusEnum = z.enum(['ACTIVE', 'RESOLVED', 'CANCELLED']);

const validStatusTransition = (
  from: InterventionStatus,
  to: InterventionStatus
): boolean => {
  if (from === to) return true;
  // Any non-terminal status may move to RESOLVED or CANCELLED.
  if (from === 'ACTIVE' && (to === 'RESOLVED' || to === 'CANCELLED')) return true;
  return false;
};

/* ─────────────────────────── Helpers ─────────────────────────── */

function toInterventionDto(
  row: {
    id: string;
    student_id: string;
    skill_id: string;
    priority: number;
    status: InterventionStatus;
    teacher_id: string | null;
    notes: string | null;
    created_at: Date;
    resolved_at: Date | null;
    notes_list?: Array<{
      id: string;
      intervention_id: string;
      teacher_id: string;
      content: string;
      created_at: Date;
    }>;
  },
  includeNotes: boolean = false
): InterventionDto {
  return {
    id: row.id,
    studentId: row.student_id,
    skillId: row.skill_id,
    priority: row.priority,
    status: row.status,
    teacherId: row.teacher_id,
    notes: row.notes,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
    ...(includeNotes && row.notes_list
      ? {
          notes_list: row.notes_list.map((n) => ({
            id: n.id,
            interventionId: n.intervention_id,
            teacherId: n.teacher_id,
            content: n.content,
            createdAt: n.created_at,
          })),
        }
      : {}),
  };
}

function buildPrismaWhere(filters: ListInterventionsFilters) {
  const where: Record<string, unknown> = {};
  if (filters.status) {
    where['status'] = filters.status;
  }
  if (typeof filters.minPriority === 'number' || typeof filters.maxPriority === 'number') {
    where['priority'] = {
      ...(typeof filters.minPriority === 'number' ? { gte: filters.minPriority } : {}),
      ...(typeof filters.maxPriority === 'number' ? { lte: filters.maxPriority } : {}),
    };
  }
  if (filters.studentId) {
    where['student_id'] = filters.studentId;
  }
  if (filters.skillId) {
    where['skill_id'] = filters.skillId;
  }
  return where;
}

/* ─────────────────────────── Service functions ─────────────────────────── */

/**
 * Paginated list of interventions with optional filters.
 */
export async function listInterventions(
  filters: ListInterventionsFilters
): Promise<ListInterventionsResult> {
  const where = buildPrismaWhere(filters);

  const [rows, total] = await Promise.all([
    prisma.intervention.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { created_at: 'desc' }],
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
    }),
    prisma.intervention.count({ where }),
  ]);

  const data = rows.map((r) => toInterventionDto(r, false));
  const meta = computePagination(filters.page, filters.pageSize, total);

  return { data, meta };
}

/**
 * Fetch one intervention by id (with notes included).
 */
export async function getIntervention(id: string): Promise<InterventionDto> {
  if (!z.string().uuid().safeParse(id).success) {
    throw new ValidationError([
      { path: ['id'], message: 'id must be a UUID', code: 'invalid_uuid' },
    ]);
  }
  const row = await prisma.intervention.findUnique({
    where: { id },
    include: { notes_list: { orderBy: { created_at: 'asc' } } },
  });
  if (!row) {
    throw new NotFoundError('Intervention', id);
  }
  return toInterventionDto(row, true);
}

export interface UpdateInterventionInput {
  priority?: number;
  status?: InterventionStatus;
  notes?: string;
}

/**
 * Patch an intervention.
 *
 * If the new status is RESOLVED or CANCELLED, `resolved_at` is set
 * automatically. RESOLVED state may only be reached from ACTIVE.
 */
export async function updateIntervention(
  id: string,
  patch: UpdateInterventionInput
): Promise<InterventionDto> {
  // Validation.
  if (!z.string().uuid().safeParse(id).success) {
    throw new ValidationError([
      { path: ['id'], message: 'id must be a UUID', code: 'invalid_uuid' },
    ]);
  }
  const parsed = z
    .object({
      priority: z.number().int().min(0).max(100).optional(),
      status: statusEnum.optional(),
      notes: z.string().max(2000).optional(),
    })
    .safeParse(patch);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues);
  }

  const existing = await prisma.intervention.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError('Intervention', id);
  }

  // Validate status transition.
  if (parsed.data.status && !validStatusTransition(existing.status, parsed.data.status)) {
    throw new ConflictError(
      `Cannot transition intervention from ${existing.status} to ${parsed.data.status}`
    );
  }

  const nextStatus = parsed.data.status ?? existing.status;
  const terminal = nextStatus === 'RESOLVED' || nextStatus === 'CANCELLED';
  const resolvedAt = terminal
    ? existing.resolved_at ?? new Date()
    : parsed.data.status === 'ACTIVE'
      ? null
      : existing.resolved_at;

  const updated = await prisma.intervention.update({
    where: { id },
    data: {
      priority: parsed.data.priority ?? existing.priority,
      status: nextStatus,
      notes: parsed.data.notes ?? existing.notes,
      resolved_at: resolvedAt,
    },
    include: { notes_list: { orderBy: { created_at: 'asc' } } },
  });

  log.info('Intervention updated', {
    id,
    from: existing.status,
    to: updated.status,
    priority: updated.priority,
  });

  return toInterventionDto(updated, true);
}

export interface OverrideInterventionInput {
  reason: string;
  newStatus: InterventionStatus;
  teacherId: string;
}

/**
 * FR-17 — teacher override of an automated intervention.
 *
 * The `reason` is persisted in the row's `notes` column (audit log)
 * and a note entry is also recorded so it shows in the timeline.
 */
export async function overrideIntervention(
  id: string,
  teacherId: string,
  reason: string,
  newStatus: InterventionStatus
): Promise<InterventionDto> {
  // Validation.
  if (!z.string().uuid().safeParse(id).success) {
    throw new ValidationError([
      { path: ['id'], message: 'id must be a UUID', code: 'invalid_uuid' },
    ]);
  }
  if (!z.string().uuid().safeParse(teacherId).success) {
    throw new ValidationError([
      { path: ['teacherId'], message: 'teacherId must be a UUID', code: 'invalid_uuid' },
    ]);
  }
  const parsedReason = z
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(1000, 'Reason must be at most 1000 characters')
    .safeParse(reason);
  if (!parsedReason.success) {
    throw new ValidationError(parsedReason.error.issues);
  }
  const parsedStatus = statusEnum.safeParse(newStatus);
  if (!parsedStatus.success) {
    throw new ValidationError(parsedStatus.error.issues);
  }

  const existing = await prisma.intervention.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError('Intervention', id);
  }

  if (!validStatusTransition(existing.status, parsedStatus.data)) {
    throw new ConflictError(
      `Cannot override intervention from ${existing.status} to ${parsedStatus.data}`
    );
  }

  const terminal = parsedStatus.data === 'RESOLVED' || parsedStatus.data === 'CANCELLED';
  const trimmedReason = parsedReason.data.trim();

  const updated = await prisma.$transaction(async (tx) => {
    const intv = await tx.intervention.update({
      where: { id },
      data: {
        status: parsedStatus.data,
        teacher_id: teacherId,
        notes: trimmedReason,
        resolved_at: terminal ? new Date() : null,
      },
    });

    await tx.intervention_note.create({
      data: {
        intervention_id: id,
        teacher_id: teacherId,
        content: `[OVERRIDE → ${parsedStatus.data}] ${trimmedReason}`,
      },
    });

    return tx.intervention.findUnique({
      where: { id: intv.id },
      include: { notes_list: { orderBy: { created_at: 'asc' } } },
    });
  });

  if (!updated) {
    throw new NotFoundError('Intervention', id);
  }

  log.info('Intervention overridden (FR-17)', {
    id,
    teacherId,
    from: existing.status,
    to: updated.status,
  });

  return toInterventionDto(updated, true);
}

/**
 * Append a note to an intervention timeline.
 */
export async function addNote(
  interventionId: string,
  teacherId: string,
  content: string
): Promise<InterventionNoteDto> {
  if (!z.string().uuid().safeParse(interventionId).success) {
    throw new ValidationError([
      { path: ['interventionId'], message: 'interventionId must be a UUID', code: 'invalid_uuid' },
    ]);
  }
  if (!z.string().uuid().safeParse(teacherId).success) {
    throw new ValidationError([
      { path: ['teacherId'], message: 'teacherId must be a UUID', code: 'invalid_uuid' },
    ]);
  }
  const parsedContent = z
    .string()
    .min(1)
    .max(2000)
    .safeParse(content);
  if (!parsedContent.success) {
    throw new ValidationError(parsedContent.error.issues);
  }

  const intervention = await prisma.intervention.findUnique({ where: { id: interventionId } });
  if (!intervention) {
    throw new NotFoundError('Intervention', interventionId);
  }

  const note = await prisma.intervention_note.create({
    data: {
      intervention_id: interventionId,
      teacher_id: teacherId,
      content: parsedContent.data,
    },
  });

  return {
    id: note.id,
    interventionId: note.intervention_id,
    teacherId: note.teacher_id,
    content: note.content,
    createdAt: note.created_at,
  };
}

/**
 * Mark an intervention as RESOLVED and stamp the resolution timestamp.
 *
 * Idempotent — re-resolving an already RESOLVED intervention is a no-op.
 */
export async function resolveIntervention(id: string): Promise<InterventionDto> {
  if (!z.string().uuid().safeParse(id).success) {
    throw new ValidationError([
      { path: ['id'], message: 'id must be a UUID', code: 'invalid_uuid' },
    ]);
  }
  const existing = await prisma.intervention.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError('Intervention', id);
  }

  if (existing.status === 'RESOLVED') {
    // Idempotent — return current state.
    const current = await prisma.intervention.findUnique({
      where: { id },
      include: { notes_list: { orderBy: { created_at: 'asc' } } },
    });
    if (!current) {
      throw new NotFoundError('Intervention', id);
    }
    return toInterventionDto(current, true);
  }

  const updated = await prisma.intervention.update({
    where: { id },
    data: {
      status: 'RESOLVED',
      resolved_at: new Date(),
    },
    include: { notes_list: { orderBy: { created_at: 'asc' } } },
  });

  log.info('Intervention resolved', {
    id,
    resolvedAt: updated.resolved_at?.toISOString() ?? null,
  });

  return toInterventionDto(updated, true);
}

/**
 * List interventions for one class. Requires going through svc-class to
 * resolve class members. Kept simple here — the route layer is expected
 * to call `listInterventions` with the resulting studentIds.
 */
export async function getInterventionsByClass(
  studentIds: string[]
): Promise<InterventionDto[]> {
  if (studentIds.length === 0) return [];
  const rows = await prisma.intervention.findMany({
    where: { student_id: { in: studentIds } },
    orderBy: [{ priority: 'desc' }, { created_at: 'desc' }],
  });
  return rows.map((r) => toInterventionDto(r, false));
}

/**
 * Re-export for callers that need them.
 */
export { ConflictError, NotFoundError };
