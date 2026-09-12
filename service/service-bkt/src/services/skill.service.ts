/**
 * Skill Service
 *
 * Skill catalogue reads: list, get by id, build the dependency tree,
 * and walk prereq chains. Writes (CRUD on skills themselves) are NOT
 * exposed at runtime — skills are seeded via the content service and
 * shipped in signed bundles, so this service is intentionally
 * read-only against `skill`.
 */

import { z } from 'zod';
import { prisma } from '../prisma/client.js';
import { logger } from '../utils/logger.js';
import { NotFoundError, ValidationError } from '@verveai/error-types';
import { computePagination } from '@verveai/common-node';

const log = logger.child({ component: 'skill.service' });

/* ─────────────────────────── DTOs ─────────────────────────── */

export interface SkillDto {
  id: string;
  code: string;
  name: string;
  difficulty: number;
  description: string | null;
  prereqSkills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillWithStatsDto extends SkillDto {
  stats: {
    totalAttempts: number;
    masteredStudents: number;
    diagnosedStudents: number;
    strugglingStudents: number;
    averagePKnown: number;
  };
}

export interface SkillTreeNode {
  id: string;
  code: string;
  name: string;
  difficulty: number;
  prereqSkills: string[];
  children: SkillTreeNode[];
}

/* ─────────────────────────── Helpers ─────────────────────────── */

interface SkillRow {
  id: string;
  code: string;
  name: string;
  difficulty: number;
  description: string | null;
  prereq_skills: string[];
  created_at: Date;
  updated_at: Date;
}

function toSkillDto(row: SkillRow): SkillDto {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    difficulty: row.difficulty,
    description: row.description,
    prereqSkills: row.prereq_skills,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* ─────────────────────────── Service functions ─────────────────────────── */

/**
 * Paginated list of all skills in the catalogue.
 */
export async function listSkills(
  page: number = 1,
  pageSize: number = 20
): Promise<{ data: SkillDto[]; meta: ReturnType<typeof computePagination> }> {
  if (!Number.isInteger(page) || page < 1) {
    throw new ValidationError([
      { path: ['page'], message: 'page must be >= 1', code: 'invalid' },
    ]);
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new ValidationError([
      { path: ['pageSize'], message: 'pageSize must be in [1,100]', code: 'invalid' },
    ]);
  }

  const [rows, total] = await Promise.all([
    prisma.skill.findMany({
      orderBy: [{ code: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.skill.count(),
  ]);

  return {
    data: rows.map((r) => toSkillDto(r as unknown as SkillRow)),
    meta: computePagination(page, pageSize, total),
  };
}

/**
 * Fetch a single skill by id together with aggregate stats computed
 * from the diagnoses table.
 */
export async function getSkillById(id: string): Promise<SkillWithStatsDto> {
  if (!z.string().uuid().safeParse(id).success) {
    throw new ValidationError([
      { path: ['id'], message: 'id must be a UUID', code: 'invalid_uuid' },
    ]);
  }

  const row = await prisma.skill.findUnique({ where: { id } });
  if (!row) {
    throw new NotFoundError('Skill', id);
  }

  const stats = await computeSkillStats(id);

  log.debug('Skill fetched', { id, code: row.code });

  return {
    ...toSkillDto(row as unknown as SkillRow),
    stats,
  };
}

async function computeSkillStats(skillId: string): Promise<SkillWithStatsDto['stats']> {
  const [aggregate, counts, evidenceCount] = await Promise.all([
    prisma.diagnosis.aggregate({
      where: { skill_id: skillId },
      _avg: { p_known: true },
    }),
    prisma.diagnosis.groupBy({
      by: ['status'],
      where: { skill_id: skillId },
      _count: { _all: true },
    }),
    prisma.evidenceItem.count({ where: { diagnosis: { skill_id: skillId } } }),
  ]);

  let mastered = 0;
  let diagnosed = 0;
  let struggling = 0;
  for (const c of counts) {
    if (c.status === 'MASTERED') mastered = c._count._all;
    else if (c.status === 'DIAGNOSED') diagnosed = c._count._all;
    else if (c.status === 'STRUGGLING') struggling = c._count._all;
  }

  return {
    totalAttempts: evidenceCount,
    masteredStudents: mastered,
    diagnosedStudents: diagnosed,
    strugglingStudents: struggling,
    averagePKnown: aggregate._avg.p_known ?? 0,
  };
}

/**
 * Build the dependency tree of skills.
 *
 * Each node lists its direct prereqs in `prereqSkills` (ids) AND expands
 * the children (skills that depend on it) so callers can render both
 * directions of the dependency graph without re-traversal.
 */
export async function getSkillTree(): Promise<SkillTreeNode[]> {
  const allSkills = await prisma.skill.findMany({
    orderBy: [{ code: 'asc' }],
  });

  const byId = new Map<string, SkillTreeNode>();
  for (const s of allSkills) {
    byId.set(s.id, {
      id: s.id,
      code: s.code,
      name: s.name,
      difficulty: s.difficulty,
      prereqSkills: s.prereq_skills,
      children: [],
    });
  }

  // Reverse linkage: who depends on me?
  for (const s of allSkills) {
    const node = byId.get(s.id);
    if (!node) continue;
    for (const prereqId of s.prereq_skills) {
      const parent = byId.get(prereqId);
      if (parent) {
        parent.children.push(node);
      }
    }
  }

  // Roots = skills with no prerequisites.
  const roots: SkillTreeNode[] = [];
  for (const node of byId.values()) {
    if (node.prereqSkills.length === 0) {
      roots.push(node);
    }
  }

  log.debug('Skill tree built', { totalSkills: allSkills.length, roots: roots.length });
  return roots;
}

/**
 * Walk the prerequisite graph of a skill recursively.
 *
 * Returns skills in BFS order so the caller sees the immediate
 * prerequisites first. Capped at `MAX_DEPTH` to prevent runaway
 * traversal in pathological data.
 */
export const MAX_DEPTH = 16;

export async function getPrerequisites(id: string): Promise<SkillDto[]> {
  if (!z.string().uuid().safeParse(id).success) {
    throw new ValidationError([
      { path: ['id'], message: 'id must be a UUID', code: 'invalid_uuid' },
    ]);
  }

  const root = await prisma.skill.findUnique({ where: { id } });
  if (!root) {
    throw new NotFoundError('Skill', id);
  }

  const visited = new Set<string>();
  const out: SkillDto[] = [];

  const queue: Array<{ id: string; depth: number }> = root.prereq_skills.map((prereqId) => ({
    id: prereqId,
    depth: 1,
  }));

  while (queue.length > 0) {
    const head = queue.shift();
    if (!head) break;
    if (visited.has(head.id)) continue;
    if (head.depth > MAX_DEPTH) continue;
    visited.add(head.id);

    const row = await prisma.skill.findUnique({ where: { id: head.id } });
    if (!row) continue;

    out.push(toSkillDto(row as unknown as SkillRow));

    for (const nextId of row.prereq_skills) {
      if (!visited.has(nextId)) {
        queue.push({ id: nextId, depth: head.depth + 1 });
      }
    }
  }

  return out;
}

/**
 * Re-exported for callers.
 */
export { NotFoundError };
