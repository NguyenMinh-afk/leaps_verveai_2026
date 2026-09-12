/**
 * In-memory Prisma mock used by `tests/smoke/live-http.smoke.ts`.
 *
 * Mirrors the shape of the in-memory store used by
 * `tests/e2e/bkt.http.test.ts` but lives outside the test file so it
 * can be imported by the standalone smoke runner.
 */

import { vi } from 'vitest';

export interface InMemoryEvidence {
  id: string;
  diagnosis_id: string;
  item_id: string;
  extracted_answer: string | null;
  correct: boolean;
  confidence: number;
  quality: string;
  created_at: Date;
}

export interface InMemoryDiagnosis {
  id: string;
  student_id: string;
  skill_id: string;
  p_known: number;
  confidence: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface InMemorySkill {
  id: string;
  code: string;
  name: string;
  difficulty: number;
  description: string | null;
  prereq_skills: string[];
  created_at: Date;
  updated_at: Date;
}

export interface InMemoryIntervention {
  id: string;
  student_id: string;
  skill_id: string;
  priority: number;
  status: string;
  teacher_id: string | null;
  notes: string | null;
  created_at: Date;
  resolved_at: Date | null;
}

export interface InMemoryDb {
  skills: Map<string, InMemorySkill>;
  diagnoses: Map<string, InMemoryDiagnosis>;
  evidence: InMemoryEvidence[];
  interventions: Map<string, InMemoryIntervention>;
  interventionNotes: unknown[];
  counters: {
    diagnosisId: number;
    evidenceId: number;
    interventionId: number;
    noteId: number;
  };
  reset(): void;
}

const pad = (n: number, len = 12): string => String(n).padStart(len, '0');
const makeDiagnosisId = (n: number): string =>
  `00000000-0000-4000-8000-${pad(n)}`;
const makeEvidenceId = (n: number): string =>
  `00000000-0001-4000-8000-${pad(n)}`;
const makeInterventionId = (n: number): string =>
  `00000000-0002-4000-8000-${pad(n)}`;

export function buildPrismaMock(inMemoryDb: InMemoryDb): unknown {
  return {
    $queryRaw: vi.fn(async () => [{ '?column?': 1 }]),
    $connect: vi.fn(async () => undefined),
    $disconnect: vi.fn(async () => undefined),
    $transaction: vi.fn(
      async <T>(
        fn: (tx: ReturnType<typeof buildPrismaMock>) => Promise<T>
      ): Promise<T> => fn(buildPrismaMock(inMemoryDb))
    ),

    skill: {
      findUnique: vi.fn(({ where }: { where: { id?: string; code?: string } }) => {
        if (where.id)
          return Promise.resolve(inMemoryDb.skills.get(where.id) ?? null);
        for (const s of inMemoryDb.skills.values()) {
          if (s.code === where.code) return Promise.resolve(s);
        }
        return Promise.resolve(null);
      }),
      findMany: vi.fn(
        ({
          orderBy,
          skip = 0,
          take,
        }: {
          orderBy?: Array<Record<string, 'asc' | 'desc'>>;
          skip?: number;
          take?: number;
        } = {}) => {
          let rows = [...inMemoryDb.skills.values()];
          if (orderBy) {
            const [{ code: codeDir }] = orderBy as Array<{ code: 'asc' | 'desc' }>;
            rows.sort((a, b) =>
              codeDir === 'desc' ? b.code.localeCompare(a.code) : a.code.localeCompare(b.code)
            );
          }
          const sliced = take !== undefined ? rows.slice(skip, skip + take) : rows.slice(skip);
          return Promise.resolve(sliced);
        }
      ),
      count: vi.fn(async () => inMemoryDb.skills.size),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },

    diagnosis: {
      findFirst: vi.fn(
        ({
          where,
          include,
        }: {
          where: { student_id?: string; skill_id?: string };
          include?: { evidence?: { orderBy?: { created_at?: 'asc' | 'desc' } } };
        }) => {
          const row =
            [...inMemoryDb.diagnoses.values()].find((d) => {
              if (where.student_id !== undefined && d.student_id !== where.student_id)
                return false;
              if (where.skill_id !== undefined && d.skill_id !== where.skill_id) return false;
              return true;
            }) ?? null;
          if (row === null) return Promise.resolve(null);
          if (include?.evidence !== undefined) {
            const order = include.evidence.orderBy?.created_at ?? 'asc';
            const chain = inMemoryDb.evidence
              .filter((e) => e.diagnosis_id === row.id)
              .sort((a, b) =>
                order === 'desc'
                  ? b.created_at.getTime() - a.created_at.getTime()
                  : a.created_at.getTime() - b.created_at.getTime()
              );
            return Promise.resolve({ ...row, evidence: chain });
          }
          return Promise.resolve(row);
        }
      ),
      findUnique: vi.fn(
        ({
          where,
          include,
        }: {
          where: { id?: string };
          include?: { evidence?: { orderBy?: { created_at?: 'asc' | 'desc' } } };
        }) => {
          const row = where.id ? inMemoryDb.diagnoses.get(where.id) ?? null : null;
          if (row === null) return Promise.resolve(null);
          if (include?.evidence !== undefined) {
            const order = include.evidence.orderBy?.created_at ?? 'asc';
            const chain = inMemoryDb.evidence
              .filter((e) => e.diagnosis_id === row.id)
              .sort((a, b) =>
                order === 'desc'
                  ? b.created_at.getTime() - a.created_at.getTime()
                  : a.created_at.getTime() - b.created_at.getTime()
              );
            return Promise.resolve({ ...row, evidence: chain });
          }
          return Promise.resolve(row);
        }
      ),
      findMany: vi.fn(
        ({
          where,
          orderBy,
          skip = 0,
          take,
          include,
        }: {
          where?: { student_id?: string; skill_id?: string };
          orderBy?: Array<Record<string, 'asc' | 'desc'>>;
          skip?: number;
          take?: number;
          include?: unknown;
        } = {}) => {
          let rows = [...inMemoryDb.diagnoses.values()];
          if (where?.student_id) {
            const sid = where.student_id;
            if (typeof sid === 'string') {
              rows = rows.filter((d) => d.student_id === sid);
            } else if (sid && typeof sid === 'object' && 'in' in sid) {
              rows = rows.filter((d) => (sid as { in: string[] }).in.includes(d.student_id));
            }
          }
          if (where?.skill_id) rows = rows.filter((d) => d.skill_id === where.skill_id);
          if (orderBy) {
            const first = orderBy[0];
            if (first) {
              const key = Object.keys(first)[0] as keyof InMemoryDiagnosis;
              const dir = (first as Record<string, 'asc' | 'desc'>)[key as string];
              if (key) {
                rows.sort((a, b) => {
                  const av = a[key];
                  const bv = b[key];
                  if (av instanceof Date && bv instanceof Date) {
                    return dir === 'desc'
                      ? bv.getTime() - av.getTime()
                      : av.getTime() - bv.getTime();
                  }
                  return dir === 'desc'
                    ? String(bv).localeCompare(String(av))
                    : String(av).localeCompare(String(bv));
                });
              }
            }
          }
          const sliced = take !== undefined ? rows.slice(skip, skip + take) : rows.slice(skip);
          if (include) {
            return Promise.resolve(
              sliced.map((d) => ({
                ...d,
                skill: inMemoryDb.skills.get(d.skill_id) ?? null,
                _count: {
                  evidence: inMemoryDb.evidence.filter((e) => e.diagnosis_id === d.id).length,
                },
              }))
            );
          }
          return Promise.resolve(sliced);
        }
      ),
      create: vi.fn(
        ({ data }: { data: Omit<InMemoryDiagnosis, 'id' | 'created_at' | 'updated_at'> }) => {
          const now = new Date();
          const row: InMemoryDiagnosis = {
            id: makeDiagnosisId(inMemoryDb.counters.diagnosisId++),
            ...data,
            created_at: now,
            updated_at: now,
          };
          inMemoryDb.diagnoses.set(row.id, row);
          return Promise.resolve({
            ...row,
            skill: inMemoryDb.skills.get(row.skill_id) ?? null,
            _count: { evidence: 0 },
          });
        }
      ),
      update: vi.fn(
        ({ where, data }: { where: { id: string }; data: Partial<InMemoryDiagnosis> }) => {
          const existing = inMemoryDb.diagnoses.get(where.id);
          if (!existing) return Promise.reject(new Error('Diagnosis not found'));
          const updated: InMemoryDiagnosis = { ...existing, ...data, updated_at: new Date() };
          inMemoryDb.diagnoses.set(where.id, updated);
          return Promise.resolve({
            ...updated,
            skill: inMemoryDb.skills.get(updated.skill_id) ?? null,
            _count: {
              evidence: inMemoryDb.evidence.filter((e) => e.diagnosis_id === updated.id).length,
            },
          });
        }
      ),
      count: vi.fn(async () => inMemoryDb.diagnoses.size),
      aggregate: vi.fn(
        ({ where }: { where?: { skill_id?: string } }) => {
          const rows = where?.skill_id
            ? [...inMemoryDb.diagnoses.values()].filter((d) => d.skill_id === where.skill_id)
            : [...inMemoryDb.diagnoses.values()];
          const avg = rows.length === 0 ? 0 : rows.reduce((s, d) => s + d.p_known, 0) / rows.length;
          return Promise.resolve({ _avg: { p_known: avg } });
        }
      ),
      groupBy: vi.fn(
        ({ by, where }: { by: string[]; where?: { skill_id?: string } }) => {
          let rows = [...inMemoryDb.diagnoses.values()];
          if (where?.skill_id) rows = rows.filter((d) => d.skill_id === where.skill_id);
          const map = new Map<string, number>();
          for (const r of rows) {
            for (const k of by) {
              const key = (r as unknown as Record<string, string>)[k];
              map.set(key, (map.get(key) ?? 0) + 1);
            }
          }
          return Promise.resolve(
            [...map.entries()].map(([status, count]) => ({
              status,
              _count: { _all: count },
            }))
          );
        }
      ),
    },

    evidenceItem: {
      findMany: vi.fn(
        ({
          where,
          orderBy,
        }: {
          where?: { diagnosis_id?: string; diagnosis?: { student_id?: string } };
          orderBy?: { created_at?: 'asc' | 'desc' };
        } = {}) => {
          let rows = [...inMemoryDb.evidence];
          if (where?.diagnosis_id) rows = rows.filter((e) => e.diagnosis_id === where.diagnosis_id);
          if (where?.diagnosis?.student_id) {
            const sid = where.diagnosis.student_id;
            const validDiagIds = new Set(
              [...inMemoryDb.diagnoses.values()]
                .filter((d) => d.student_id === sid)
                .map((d) => d.id)
            );
            rows = rows.filter((e) => validDiagIds.has(e.diagnosis_id));
          }
          if (orderBy?.created_at) {
            const dir = orderBy.created_at;
            rows.sort((a, b) =>
              dir === 'desc'
                ? b.created_at.getTime() - a.created_at.getTime()
                : a.created_at.getTime() - b.created_at.getTime()
            );
          }
          return Promise.resolve(rows);
        }
      ),
      findUnique: vi.fn(({ where }: { where: { id: string } }) => {
        const row = inMemoryDb.evidence.find((e) => e.id === where.id);
        return Promise.resolve(row ?? null);
      }),
      create: vi.fn(
        ({ data }: { data: Omit<InMemoryEvidence, 'id' | 'created_at'> }) => {
          const row: InMemoryEvidence = {
            id: makeEvidenceId(inMemoryDb.counters.evidenceId++),
            ...data,
            created_at: new Date(),
          };
          inMemoryDb.evidence.push(row);
          return Promise.resolve(row);
        }
      ),
      count: vi.fn(
        ({ where }: { where?: { diagnosis?: { skill_id?: string } } } = {}) => {
          if (where?.diagnosis?.skill_id) {
            const skid = where.diagnosis.skill_id;
            const validDiagIds = new Set(
              [...inMemoryDb.diagnoses.values()]
                .filter((d) => d.skill_id === skid)
                .map((d) => d.id)
            );
            return Promise.resolve(
              inMemoryDb.evidence.filter((e) => validDiagIds.has(e.diagnosis_id)).length
            );
          }
          return Promise.resolve(inMemoryDb.evidence.length);
        }
      ),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },

    intervention: {
      findMany: vi.fn(
        ({
          where,
          orderBy,
          skip = 0,
          take,
        }: {
          where?: {
            status?: string;
            priority?: { gte?: number; lte?: number };
            student_id?: string | { in?: string[] };
            skill_id?: string;
          };
          orderBy?: Array<Record<string, 'asc' | 'desc'>>;
          skip?: number;
          take?: number;
        } = {}) => {
          let rows = [...inMemoryDb.interventions.values()];
          if (where?.status) rows = rows.filter((r) => r.status === where.status);
          if (where?.priority) {
            if (where.priority.gte !== undefined)
              rows = rows.filter((r) => r.priority >= (where.priority?.gte ?? 0));
            if (where.priority.lte !== undefined)
              rows = rows.filter((r) => r.priority <= (where.priority?.lte ?? 100));
          }
          if (where?.student_id) {
            const sid = where.student_id;
            if (typeof sid === 'string') {
              rows = rows.filter((r) => r.student_id === sid);
            } else if (sid && typeof sid === 'object' && 'in' in sid) {
              rows = rows.filter((r) => (sid as { in: string[] }).in.includes(r.student_id));
            }
          }
          if (where?.skill_id) rows = rows.filter((r) => r.skill_id === where.skill_id);
          if (orderBy) {
            const first = orderBy[0];
            if (first) {
              const key = Object.keys(first)[0] as keyof InMemoryIntervention;
              const dir = (first as Record<string, 'asc' | 'desc'>)[key as string];
              if (key === 'priority' || key === 'created_at') {
                rows.sort((a, b) => {
                  const av = a[key] as number | Date;
                  const bv = b[key] as number | Date;
                  if (av instanceof Date && bv instanceof Date) {
                    return dir === 'desc' ? bv.getTime() - av.getTime() : av.getTime() - bv.getTime();
                  }
                  return dir === 'desc' ? Number(bv) - Number(av) : Number(av) - Number(bv);
                });
              }
            }
          }
          const sliced = take !== undefined ? rows.slice(skip, skip + take) : rows.slice(skip);
          return Promise.resolve(sliced);
        }
      ),
      findUnique: vi.fn(
        ({
          where,
          include,
        }: {
          where: { id: string };
          include?: { notes_list?: { orderBy?: { created_at?: 'asc' | 'desc' } } };
        }) => {
          const row = inMemoryDb.interventions.get(where.id) ?? null;
          if (row === null) return Promise.resolve(null);
          if (include?.notes_list) {
            const order = include.notes_list.orderBy?.created_at ?? 'asc';
            const notes = inMemoryDb.interventionNotes
              .filter((n: unknown) => (n as { intervention_id: string }).intervention_id === row.id)
              .sort((a, b) => {
                const at = (a as { created_at: Date }).created_at.getTime();
                const bt = (b as { created_at: Date }).created_at.getTime();
                return order === 'desc' ? bt - at : at - bt;
              });
            return Promise.resolve({ ...row, notes_list: notes });
          }
          return Promise.resolve(row);
        }
      ),
      create: vi.fn(
        ({ data }: { data: Omit<InMemoryIntervention, 'id' | 'created_at' | 'resolved_at'> }) => {
          const row: InMemoryIntervention = {
            id: makeInterventionId(inMemoryDb.counters.interventionId++),
            ...data,
            created_at: new Date(),
            resolved_at: null,
          };
          inMemoryDb.interventions.set(row.id, row);
          return Promise.resolve(row);
        }
      ),
      update: vi.fn(
        ({
          where,
          data,
          include,
        }: {
          where: { id: string };
          data: Partial<InMemoryIntervention>;
          include?: { notes_list?: { orderBy?: { created_at?: 'asc' | 'desc' } } };
        }) => {
          const existing = inMemoryDb.interventions.get(where.id);
          if (!existing) return Promise.reject(new Error('Intervention not found'));
          const updated: InMemoryIntervention = { ...existing, ...data };
          inMemoryDb.interventions.set(where.id, updated);
          if (include?.notes_list) {
            const order = include.notes_list.orderBy?.created_at ?? 'asc';
            const notes = inMemoryDb.interventionNotes
              .filter((n: unknown) => (n as { intervention_id: string }).intervention_id === updated.id)
              .sort((a, b) => {
                const at = (a as { created_at: Date }).created_at.getTime();
                const bt = (b as { created_at: Date }).created_at.getTime();
                return order === 'desc' ? bt - at : at - bt;
              });
            return Promise.resolve({ ...updated, notes_list: notes });
          }
          return Promise.resolve(updated);
        }
      ),
      count: vi.fn(
        ({ where }: { where?: { status?: string; student_id?: string; skill_id?: string } } = {}) => {
          let rows = [...inMemoryDb.interventions.values()];
          if (where?.status) rows = rows.filter((r) => r.status === where.status);
          if (where?.student_id) rows = rows.filter((r) => r.student_id === where.student_id);
          if (where?.skill_id) rows = rows.filter((r) => r.skill_id === where.skill_id);
          return Promise.resolve(rows.length);
        }
      ),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },

    interventionNote: {
      findMany: vi.fn(() => Promise.resolve([...inMemoryDb.interventionNotes])),
      create: vi.fn(({ data }: { data: unknown }) => {
        const row = { id: 'note-id', ...(data as object), created_at: new Date() };
        inMemoryDb.interventionNotes.push(row);
        return Promise.resolve(row);
      }),
      count: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },
  };
}

export function seedPrismaState(inMemoryDb: InMemoryDb): void {
  const now = new Date();
  inMemoryDb.skills.set('11111111-1111-1111-1111-111111111111', {
    id: '11111111-1111-1111-1111-111111111111',
    code: 'MATH-ADD-001',
    name: 'Basic Addition',
    difficulty: 1,
    description: 'Single-digit addition',
    prereq_skills: [],
    created_at: now,
    updated_at: now,
  });
  inMemoryDb.skills.set('22222222-2222-2222-2222-222222222222', {
    id: '22222222-2222-2222-2222-222222222222',
    code: 'MATH-SUB-001',
    name: 'Basic Subtraction',
    difficulty: 1,
    description: 'Single-digit subtraction',
    prereq_skills: ['11111111-1111-1111-1111-111111111111'],
    created_at: now,
    updated_at: now,
  });
}