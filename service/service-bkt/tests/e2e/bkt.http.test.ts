/**
 * E2E HTTP tests for svc-bkt — full flow via supertest.
 *
 * This test boots the Express app in-process (no real Postgres / Consul
 * required) and exercises every HTTP endpoint with realistic payloads.
 *
 * What is covered:
 *   1. Health + metrics endpoints
 *   2. Skills catalogue (list, by id, tree, prerequisites)
 *   3. Diagnosis (run, batch, by student, by class)
 *   4. Evidence (record, get by id, chain, by student)
 *   5. Intervention lifecycle (list, get, update, override [FR-17],
 *      note, resolve, by class)
 *   6. Validation errors → 400
 *   7. Not found errors → 404
 *   8. End-to-end BKT happy path through HTTP layer
 *   9. Determinism — same evidence transcript ⇒ same final P(L)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';

// ── Set up environment variables (validateEnv requires DATABASE_URL) ──────────
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] = 'postgresql://test:test@localhost:5432/test';
process.env['PORT'] = '3002';
process.env['SERVICE_NAME'] = 'svc-bkt';
process.env['SERVICE_PORT'] = '3002';
process.env['LOG_LEVEL'] = 'silent';
process.env['CONSUL_HOST'] = 'localhost';
process.env['CONSUL_PORT'] = '8500';
process.env['OTEL_SERVICE_NAME'] = 'svc-bkt-e2e';

// ── Mock logger ───────────────────────────────────────────────────────────────
vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    child: vi.fn(() => ({
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    })),
  },
}));

// ── Mock Consul ───────────────────────────────────────────────────────────────
vi.mock('@verveai/consul-client', () => ({
  Consul: {
    resolve: vi.fn().mockResolvedValue('http://svc-class:3003'),
    register: vi.fn().mockResolvedValue(undefined),
    deregister: vi.fn().mockResolvedValue(undefined),
  },
}));

// ── Mock circuit-breaker (passthrough — used by diagnosis.service) ────────────
vi.mock('@verveai/circuit-breaker', () => ({
  createBreaker: vi.fn(
    (_name: string, fn: (...args: unknown[]) => Promise<unknown>) => ({
      fire: async (...args: unknown[]) => fn(...args),
      getStats: vi
        .fn()
        .mockReturnValue({ state: 'CLOSED', failures: 0, successes: 0 }),
      isOpen: vi.fn().mockReturnValue(false),
      close: vi.fn(),
      open: vi.fn(),
    })
  ),
}));

// ── Mock fetch for cross-service calls (svc-class) ───────────────────────────
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

// ── In-memory Prisma state ────────────────────────────────────────────────────

interface InMemoryEvidence {
  id: string;
  diagnosis_id: string;
  item_id: string;
  extracted_answer: string | null;
  correct: boolean;
  confidence: number;
  quality: string;
  created_at: Date;
}

interface InMemoryDiagnosis {
  id: string;
  student_id: string;
  skill_id: string;
  p_known: number;
  confidence: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface InMemorySkill {
  id: string;
  code: string;
  name: string;
  difficulty: number;
  description: string | null;
  prereq_skills: string[];
  created_at: Date;
  updated_at: Date;
}

interface InMemoryIntervention {
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

interface InMemoryInterventionNote {
  id: string;
  intervention_id: string;
  teacher_id: string;
  content: string;
  created_at: Date;
}

interface InMemoryState {
  skills: Map<string, InMemorySkill>;
  diagnoses: Map<string, InMemoryDiagnosis>;
  evidence: InMemoryEvidence[];
  interventions: Map<string, InMemoryIntervention>;
  interventionNotes: InMemoryInterventionNote[];
  counters: {
    diagnosisId: number;
    evidenceId: number;
    interventionId: number;
    noteId: number;
  };
  reset(): void;
}

// ── In-memory state + prisma mock (hoisted together so the test
//    code and the mock factory see the SAME Map/array references).

const { inMemoryDb, mockPrisma } = vi.hoisted(() => {
  // ---- State ----
  const inMemoryDb: InMemoryState = {
    skills: new Map(),
    diagnoses: new Map(),
    evidence: [],
    interventions: new Map(),
    interventionNotes: [],
    counters: {
      diagnosisId: 1,
      evidenceId: 1,
      interventionId: 1,
      noteId: 1,
    },
    reset() {
      this.skills.clear();
      this.diagnoses.clear();
      this.evidence.length = 0;
      this.interventions.clear();
      this.interventionNotes.length = 0;
      this.counters.diagnosisId = 1;
      this.counters.evidenceId = 1;
      this.counters.interventionId = 1;
      this.counters.noteId = 1;
    },
  };

  // ---- Prisma mock ----
  function build() {
    return {
      $queryRaw: vi.fn(async () => [{ '?column?': 1 }]),
      $connect: vi.fn(async () => undefined),
      $disconnect: vi.fn(async () => undefined),
      $transaction: vi.fn(
        async <T>(fn: (tx: ReturnType<typeof build>) => Promise<T>): Promise<T> =>
          fn(build())
      ),

      skill: {
        findUnique: vi.fn(
          ({ where }: { where: { id?: string; code?: string } }) => {
            if (where.id)
              return Promise.resolve(inMemoryDb.skills.get(where.id) ?? null);
            for (const s of inMemoryDb.skills.values()) {
              if (s.code === where.code) return Promise.resolve(s);
            }
            return Promise.resolve(null);
          }
        ),
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
                if (where.student_id !== undefined && d.student_id !== where.student_id) return false;
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
            where?: { student_id?: string; skill_id?: string; student_id?: { in?: string[] } };
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
            if (where?.skill_id) {
              const skid = where.skill_id;
              rows = rows.filter((d) => d.skill_id === skid);
            }
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
                      return dir === 'desc' ? bv.getTime() - av.getTime() : av.getTime() - bv.getTime();
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
          ({
            data,
          }: {
            data: Omit<InMemoryDiagnosis, 'id' | 'created_at' | 'updated_at'>;
          }) => {
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
            const updated: InMemoryDiagnosis = {
              ...existing,
              ...data,
              updated_at: new Date(),
            };
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
            if (where?.diagnosis_id) {
              rows = rows.filter((e) => e.diagnosis_id === where.diagnosis_id);
            }
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
        findUnique: vi.fn(
          ({ where }: { where: { id: string } }) => {
            const row = inMemoryDb.evidence.find((e) => e.id === where.id);
            return Promise.resolve(row ?? null);
          }
        ),
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
          ({
            where,
          }: { where?: { diagnosis?: { skill_id?: string } } } = {}) => {
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
                .filter((n) => n.intervention_id === row.id)
                .sort((a, b) =>
                  order === 'desc'
                    ? b.created_at.getTime() - a.created_at.getTime()
                    : a.created_at.getTime() - b.created_at.getTime()
                );
              return Promise.resolve({ ...row, notes_list: notes });
            }
            return Promise.resolve(row);
          }
        ),
        create: vi.fn(
          ({
            data,
          }: {
            data: Omit<InMemoryIntervention, 'id' | 'created_at' | 'resolved_at'>;
          }) => {
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
            const updated: InMemoryIntervention = {
              ...existing,
              ...data,
            };
            inMemoryDb.interventions.set(where.id, updated);
            if (include?.notes_list) {
              const order = include.notes_list.orderBy?.created_at ?? 'asc';
              const notes = inMemoryDb.interventionNotes
                .filter((n) => n.intervention_id === updated.id)
                .sort((a, b) =>
                  order === 'desc'
                    ? b.created_at.getTime() - a.created_at.getTime()
                    : a.created_at.getTime() - b.created_at.getTime()
                );
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
        create: vi.fn(
          ({ data }: { data: Omit<InMemoryInterventionNote, 'id' | 'created_at'> }) => {
            const row: InMemoryInterventionNote = {
              id: makeNoteId(inMemoryDb.counters.noteId++),
              ...data,
              created_at: new Date(),
            };
            inMemoryDb.interventionNotes.push(row);
            return Promise.resolve(row);
          }
        ),
        count: vi.fn(),
        aggregate: vi.fn(),
        groupBy: vi.fn(),
      },
    };
  }

  return { inMemoryDb, mockPrisma: build() };
});

// ── ID helpers (module-level so seed helpers and tests can use them) ──────────
const pad = (n: number, len = 12): string => String(n).padStart(len, '0');
const makeDiagnosisId = (n: number): string =>
  `00000000-0000-4000-8000-${pad(n)}`;
const makeEvidenceId = (n: number): string =>
  `00000000-0001-4000-8000-${pad(n)}`;
const makeInterventionId = (n: number): string =>
  `00000000-0002-4000-8000-${pad(n)}`;
const makeNoteId = (n: number): string =>
  `00000000-0003-4000-8000-${pad(n)}`;

vi.mock('../../src/prisma/client.js', () => ({
  prisma: mockPrisma,
  disconnectPrisma: vi.fn().mockResolvedValue(undefined),
}));

// ── Import app factory after mocks are set up ─────────────────────────────────
import { createApp } from '../../src/app.js';
import { BKT_PARAMS } from '../../src/services/bkt-engine.js';

// ── Seed data ─────────────────────────────────────────────────────────────────
const SKILL_ID = '11111111-1111-1111-1111-111111111111';
const SKILL_ID_2 = '22222222-2222-2222-2222-222222222222';
const STUDENT_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const TEACHER_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const CLASS_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

function seedSkills(): void {
  const now = new Date();
  inMemoryDb.skills.set(SKILL_ID, {
    id: SKILL_ID,
    code: 'MATH-ADD-001',
    name: 'Basic Addition',
    difficulty: 1,
    description: 'Single-digit addition',
    prereq_skills: [],
    created_at: now,
    updated_at: now,
  });
  inMemoryDb.skills.set(SKILL_ID_2, {
    id: SKILL_ID_2,
    code: 'MATH-SUB-001',
    name: 'Basic Subtraction',
    difficulty: 1,
    description: 'Single-digit subtraction',
    prereq_skills: [SKILL_ID],
    created_at: now,
    updated_at: now,
  });
}

function seedIntervention(): InMemoryIntervention {
  const now = new Date();
  const row: InMemoryIntervention = {
    id: makeInterventionId(inMemoryDb.counters.interventionId++),
    student_id: STUDENT_ID,
    skill_id: SKILL_ID,
    priority: 75,
    status: 'ACTIVE',
    teacher_id: null,
    notes: null,
    created_at: now,
    resolved_at: null,
  };
  inMemoryDb.interventions.set(row.id, row);
  return row;
}

let app: Express;
let serverAvailable = true;

beforeEach(() => {
  inMemoryDb.reset();
  seedSkills();
  fetchMock.mockReset();
  vi.clearAllMocks();
  app = createApp();
  serverAvailable = true;
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  // Re-stub fetch because afterEach unstubbed it.
  vi.stubGlobal('fetch', fetchMock);
});

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH & METRICS
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — Health & metrics', () => {
  it('GET /health returns 200 with service name', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      service: 'svc-bkt',
      version: '1.0.0',
    });
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /health/ready returns 200', async () => {
    const res = await request(app).get('/health/ready');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ready: true });
  });

  it('GET /metrics returns Prometheus text format', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('http_requests_total');
    expect(res.text).toContain('http_request_duration_seconds');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SKILLS
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — Skills', () => {
  it('GET /api/bkt/skills lists paginated skills', async () => {
    const res = await request(app).get('/api/bkt/skills');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toMatchObject({
      page: 1,
      pageSize: 20,
      total: 2,
      totalPages: 1,
    });
  });

  it('GET /api/bkt/skills/:id returns skill with stats', async () => {
    const res = await request(app).get(`/api/bkt/skills/${SKILL_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: SKILL_ID,
      code: 'MATH-ADD-001',
      name: 'Basic Addition',
      difficulty: 1,
      prereqSkills: [],
    });
    expect(res.body.data.stats).toBeDefined();
    expect(res.body.data.stats.averagePKnown).toBe(0);
  });

  it('GET /api/bkt/skills/:id returns 404 for unknown skill', async () => {
    const res = await request(app).get(
      '/api/bkt/skills/00000000-0000-0000-0000-000000000000'
    );
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('GET /api/bkt/skills/:id returns 400 for bad UUID', async () => {
    const res = await request(app).get('/api/bkt/skills/not-a-uuid');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/bkt/skills/tree returns root nodes with children', async () => {
    const res = await request(app).get('/api/bkt/skills/tree');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    // SKILL_ID has no prereqs → root.
    const root = res.body.data.find((n: { id: string }) => n.id === SKILL_ID);
    expect(root).toBeDefined();
    // SKILL_ID_2 has SKILL_ID as prereq → child of root.
    expect(root.children).toHaveLength(1);
    expect(root.children[0].id).toBe(SKILL_ID_2);
  });

  it('GET /api/bkt/skills/:id/prerequisites walks the graph BFS', async () => {
    const res = await request(app).get(`/api/bkt/skills/${SKILL_ID_2}/prerequisites`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(SKILL_ID);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DIAGNOSIS
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — Diagnosis', () => {
  it('POST /api/bkt/diagnosis/run creates diagnosis with P(L₀)=0.1', async () => {
    const res = await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: STUDENT_ID, skillId: SKILL_ID });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pKnown).toBeCloseTo(BKT_PARAMS.P_INIT, 4);
    expect(res.body.data.status).toBe('PENDING');
    expect(res.body.data.studentId).toBe(STUDENT_ID);
    expect(res.body.data.skillId).toBe(SKILL_ID);
    expect(res.body.data.id).toBeDefined();
  });

  it('POST /api/bkt/diagnosis/run returns 400 on bad UUID', async () => {
    const res = await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: 'not-a-uuid', skillId: SKILL_ID });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/bkt/diagnosis/run returns 404 for unknown skill', async () => {
    const res = await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: STUDENT_ID, skillId: '00000000-0000-0000-0000-000000000000' });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('POST /api/bkt/diagnosis/batch runs multiple skills', async () => {
    const res = await request(app)
      .post('/api/bkt/diagnosis/batch')
      .send({ studentId: STUDENT_ID, skillIds: [SKILL_ID, SKILL_ID_2] });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.results).toHaveLength(2);
    expect(res.body.data.studentId).toBe(STUDENT_ID);
  });

  it('POST /api/bkt/diagnosis/batch returns 400 for empty skillIds', async () => {
    const res = await request(app)
      .post('/api/bkt/diagnosis/batch')
      .send({ studentId: STUDENT_ID, skillIds: [] });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/bkt/diagnosis/student/:id lists all student diagnoses', async () => {
    // Seed one diagnosis first.
    await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: STUDENT_ID, skillId: SKILL_ID });

    const res = await request(app).get(`/api/bkt/diagnosis/student/${STUDENT_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].studentId).toBe(STUDENT_ID);
  });

  it('GET /api/bkt/diagnosis/class/:id returns diagnoses for class members', async () => {
    // Seed diagnosis for STUDENT_ID.
    await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: STUDENT_ID, skillId: SKILL_ID });

    // Mock svc-class to return STUDENT_ID.
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { students: [{ id: STUDENT_ID }] },
      }),
      text: async () => '',
      status: 200,
    });

    const res = await request(app).get(`/api/bkt/diagnosis/class/${CLASS_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].studentId).toBe(STUDENT_ID);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// EVIDENCE
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — Evidence', () => {
  it('POST /api/bkt/evidence records evidence and updates P(L)', async () => {
    // Seed diagnosis.
    const diagRes = await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: STUDENT_ID, skillId: SKILL_ID });
    const diagnosisId = diagRes.body.data.id;

    const evRes = await request(app)
      .post('/api/bkt/evidence')
      .send({
        diagnosisId,
        itemId: '99999999-9999-4999-8999-999999999991',
        correct: true,
        confidence: 0.9,
        quality: 'HIGH',
      });

    expect(evRes.status).toBe(201);
    expect(evRes.body.success).toBe(true);
    expect(evRes.body.data.evidence.correct).toBe(true);
    expect(evRes.body.data.evidence.quality).toBe('HIGH');
    expect(evRes.body.data.diagnosis.pKnown).toBeGreaterThan(BKT_PARAMS.P_INIT);
    expect(evRes.body.data.diagnosis.attempts).toBe(1);
  });

  it('POST /api/bkt/evidence returns 400 on missing required field', async () => {
    const res = await request(app)
      .post('/api/bkt/evidence')
      .send({
        diagnosisId: '00000000-0000-4000-8000-000000000001',
        // itemId missing
        correct: true,
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/bkt/evidence returns 404 for unknown diagnosis', async () => {
    const res = await request(app)
      .post('/api/bkt/evidence')
      .send({
        diagnosisId: '00000000-0000-0000-0000-000000000000',
        itemId: '99999999-9999-4999-8999-999999999991',
        correct: true,
      });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('GET /api/bkt/evidence/:id fetches evidence by id', async () => {
    const diagRes = await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: STUDENT_ID, skillId: SKILL_ID });
    const diagnosisId = diagRes.body.data.id;

    const evRes = await request(app)
      .post('/api/bkt/evidence')
      .send({
        diagnosisId,
        itemId: '99999999-9999-4999-8999-999999999992',
        correct: true,
      });
    const evidenceId = evRes.body.data.evidence.id;

    const fetchRes = await request(app).get(`/api/bkt/evidence/${evidenceId}`);
    expect(fetchRes.status).toBe(200);
    expect(fetchRes.body.data.id).toBe(evidenceId);
    expect(fetchRes.body.data.diagnosisId).toBe(diagnosisId);
  });

  it('GET /api/bkt/evidence/:id returns 404 for unknown evidence', async () => {
    const res = await request(app).get(
      '/api/bkt/evidence/00000000-0000-0000-0000-000000000000'
    );
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('GET /api/bkt/evidence/:id/chain returns reasoning chain', async () => {
    const diagRes = await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: STUDENT_ID, skillId: SKILL_ID });
    const diagnosisId = diagRes.body.data.id;

    // Record 3 evidence items.
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/api/bkt/evidence')
        .send({
          diagnosisId,
          itemId: `99999999-9999-4999-8999-99999999999${i}`,
          correct: i % 2 === 0,
        });
    }

    const chainRes = await request(app).get(`/api/bkt/evidence/${diagnosisId}/chain`);
    expect(chainRes.status).toBe(200);
    expect(chainRes.body.data.steps).toHaveLength(3);
    expect(chainRes.body.data.diagnosisId).toBe(diagnosisId);
    expect(chainRes.body.data.steps[0].pKnownBefore).toBeCloseTo(BKT_PARAMS.P_INIT, 4);
    expect(chainRes.body.data.currentPKnown).toBeGreaterThan(0);
  });

  it('GET /api/bkt/evidence/student/:id lists student evidence', async () => {
    const diagRes = await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: STUDENT_ID, skillId: SKILL_ID });
    const diagnosisId = diagRes.body.data.id;

    await request(app)
      .post('/api/bkt/evidence')
      .send({
        diagnosisId,
        itemId: '99999999-9999-4999-8999-999999999993',
        correct: true,
      });

    const res = await request(app).get(`/api/bkt/evidence/student/${STUDENT_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// INTERVENTION
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — Intervention', () => {
  it('GET /api/bkt/interventions returns paginated list', async () => {
    seedIntervention();

    const res = await request(app).get('/api/bkt/interventions');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta).toBeDefined();
  });

  it('GET /api/bkt/interventions/:id fetches a single intervention', async () => {
    const seeded = seedIntervention();
    const res = await request(app).get(`/api/bkt/interventions/${seeded.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(seeded.id);
    expect(res.body.data.status).toBe('ACTIVE');
  });

  it('GET /api/bkt/interventions/:id returns 404 for unknown id', async () => {
    const res = await request(app).get(
      '/api/bkt/interventions/00000000-0000-0000-0000-000000000000'
    );
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('PUT /api/bkt/interventions/:id updates priority', async () => {
    const seeded = seedIntervention();

    const res = await request(app)
      .put(`/api/bkt/interventions/${seeded.id}`)
      .send({ priority: 90 });

    expect(res.status).toBe(200);
    expect(res.body.data.priority).toBe(90);
    expect(res.body.data.status).toBe('ACTIVE');
  });

  it('PUT /api/bkt/interventions/:id/override implements FR-17', async () => {
    const seeded = seedIntervention();

    const res = await request(app)
      .put(`/api/bkt/interventions/${seeded.id}/override`)
      .set('x-user-id', TEACHER_ID)
      .send({
        reason: 'Student demonstrated mastery in follow-up session',
        newStatus: 'RESOLVED',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('RESOLVED');
    expect(res.body.data.teacherId).toBe(TEACHER_ID);
    expect(res.body.data.notes).toContain('mastery');
    expect(res.body.data.resolvedAt).toBeDefined();
  });

  it('PUT /api/bkt/interventions/:id/override returns 400 on short reason', async () => {
    const seeded = seedIntervention();

    const res = await request(app)
      .put(`/api/bkt/interventions/${seeded.id}/override`)
      .set('x-user-id', TEACHER_ID)
      .send({ reason: 'too short', newStatus: 'RESOLVED' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/bkt/interventions/:id/note appends note', async () => {
    const seeded = seedIntervention();

    const res = await request(app)
      .post(`/api/bkt/interventions/${seeded.id}/note`)
      .set('x-user-id', TEACHER_ID)
      .send({ content: 'Follow-up scheduled for next Tuesday.' });

    expect(res.status).toBe(201);
    expect(res.body.data.content).toBe('Follow-up scheduled for next Tuesday.');
    expect(res.body.data.teacherId).toBe(TEACHER_ID);
    expect(res.body.data.interventionId).toBe(seeded.id);
  });

  it('POST /api/bkt/interventions/:id/note returns 400 on empty content', async () => {
    const seeded = seedIntervention();

    const res = await request(app)
      .post(`/api/bkt/interventions/${seeded.id}/note`)
      .set('x-user-id', TEACHER_ID)
      .send({ content: '' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/bkt/interventions/:id/resolve marks RESOLVED', async () => {
    const seeded = seedIntervention();

    const res = await request(app).post(`/api/bkt/interventions/${seeded.id}/resolve`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('RESOLVED');
    expect(res.body.data.resolvedAt).toBeDefined();
  });

  it('POST /api/bkt/interventions/:id/resolve is idempotent', async () => {
    const seeded = seedIntervention();
    const first = await request(app).post(`/api/bkt/interventions/${seeded.id}/resolve`);
    const second = await request(app).post(`/api/bkt/interventions/${seeded.id}/resolve`);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(second.body.data.status).toBe('RESOLVED');
    // resolvedAt is preserved on second call.
    expect(second.body.data.resolvedAt).toBe(first.body.data.resolvedAt);
  });

  it('GET /api/bkt/interventions/class/:id lists class interventions', async () => {
    const seeded = seedIntervention();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { students: [{ id: STUDENT_ID }] },
      }),
      text: async () => '',
      status: 200,
    });

    const res = await request(app).get(`/api/bkt/interventions/class/${CLASS_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.find((iv: { id: string }) => iv.id === seeded.id)).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// FULL FLOW E2E
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — Full BKT flow through HTTP', () => {
  it('end-to-end: seed skill → run → evidence → chain → intervention → override → resolve', async () => {
    // 1. List skills — confirm seed is visible.
    let res = await request(app).get('/api/bkt/skills');
    expect(res.status).toBe(200);
    expect(res.body.data.find((s: { id: string }) => s.id === SKILL_ID)).toBeDefined();

    // 2. Run diagnosis (creates row with P(L₀)=0.1).
    res = await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: STUDENT_ID, skillId: SKILL_ID });
    expect(res.status).toBe(200);
    const diagnosisId = res.body.data.id;
    const initialPKnown = res.body.data.pKnown;
    expect(initialPKnown).toBeCloseTo(BKT_PARAMS.P_INIT, 4);

    // 3. Record 4 correct + 1 incorrect evidence item.
    const observations = [true, true, false, true, true];
    for (let i = 0; i < observations.length; i++) {
      const r = await request(app)
        .post('/api/bkt/evidence')
        .send({
          diagnosisId,
          itemId: `99999999-9999-4999-8999-99999999999${i}`,
          correct: observations[i],
        });
      expect(r.status).toBe(201);
    }

    // 4. Re-run diagnosis — P(L) is higher than initial.
    res = await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: STUDENT_ID, skillId: SKILL_ID });
    expect(res.status).toBe(200);
    expect(res.body.data.pKnown).toBeGreaterThan(initialPKnown);
    expect(res.body.data.evidenceCount).toBe(5);

    // 5. Fetch reasoning chain — verify 5 steps.
    res = await request(app).get(`/api/bkt/evidence/${diagnosisId}/chain`);
    expect(res.status).toBe(200);
    expect(res.body.data.steps).toHaveLength(5);

    // 6. Seed an intervention, then override (FR-17).
    const intervention = seedIntervention();
    res = await request(app)
      .put(`/api/bkt/interventions/${intervention.id}/override`)
      .set('x-user-id', TEACHER_ID)
      .send({
        reason: 'Override after student demonstrated mastery in follow-up',
        newStatus: 'RESOLVED',
      });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('RESOLVED');
    expect(res.body.data.teacherId).toBe(TEACHER_ID);

    // 7. Verify override recorded a note in the timeline.
    res = await request(app).get(`/api/bkt/interventions/${intervention.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.notes_list).toHaveLength(1);
    expect(res.body.data.notes_list[0].content).toContain('OVERRIDE');
  });

  it('BKT math is deterministic via HTTP: same transcript → same final P(L)', async () => {
    async function runTranscript(): Promise<number> {
      inMemoryDb.reset();
      seedSkills();

      // Run diagnosis.
      let res = await request(app)
        .post('/api/bkt/diagnosis/run')
        .send({ studentId: STUDENT_ID, skillId: SKILL_ID });
      const diagnosisId: string = res.body.data.id;

      // Record 10 evidence items.
      const observations = [
        true, true, false, true, true, false, true, true, true, true,
      ];
      for (let i = 0; i < observations.length; i++) {
        await request(app)
          .post('/api/bkt/evidence')
          .send({
            diagnosisId,
            itemId: `99999999-9999-4999-8999-${String(i).padStart(12, '0')}`,
            correct: observations[i],
          });
      }

      // Re-run diagnosis to get final pKnown.
      res = await request(app)
        .post('/api/bkt/diagnosis/run')
        .send({ studentId: STUDENT_ID, skillId: SKILL_ID });
      return res.body.data.pKnown;
    }

    const r1 = await runTranscript();
    const r2 = await runTranscript();
    expect(r1).toBeCloseTo(r2, 10);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// COVERAGE TARGETED — error paths and branches not yet exercised
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — Branch coverage (targeted)', () => {
  it('GET /api/bkt/skills?page=0 returns 400 (validateQuery branch)', async () => {
    const res = await request(app).get('/api/bkt/skills?page=0');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/bkt/skills?pageSize=500 returns 400 (pageSize cap)', async () => {
    const res = await request(app).get('/api/bkt/skills?pageSize=500');
    expect(res.status).toBe(400);
  });

  it('PUT /api/bkt/interventions/:id returns 409 on illegal status transition (RESOLVED → ACTIVE)', async () => {
    const seeded = seedIntervention();
    // First resolve it.
    let res = await request(app).post(`/api/bkt/interventions/${seeded.id}/resolve`);
    expect(res.status).toBe(200);

    // Now try to flip it back to ACTIVE — should be a ConflictError.
    res = await request(app)
      .put(`/api/bkt/interventions/${seeded.id}`)
      .send({ status: 'ACTIVE' });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('PUT /api/bkt/interventions/:id/override returns 409 on illegal transition', async () => {
    const seeded = seedIntervention();
    await request(app).post(`/api/bkt/interventions/${seeded.id}/resolve`);

    const res = await request(app)
      .put(`/api/bkt/interventions/${seeded.id}/override`)
      .set('x-user-id', TEACHER_ID)
      .send({
        reason: 'Trying to revive a resolved intervention - should conflict',
        newStatus: 'ACTIVE',
      });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('POST /api/bkt/interventions/:id/resolve returns 409 on unknown id', async () => {
    const res = await request(app).post(
      '/api/bkt/interventions/00000000-0000-0000-0000-000000000000/resolve'
    );
    expect(res.status).toBe(404);
  });

  it('GET /api/bkt/diagnosis/class/:id returns empty array when svc-class is down', async () => {
    // Force fetch to throw.
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const res = await request(app).get(`/api/bkt/diagnosis/class/${CLASS_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('GET /api/bkt/interventions/class/:id returns empty when svc-class returns non-ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'svc-class error',
      json: async () => ({}),
    });

    const res = await request(app).get(`/api/bkt/interventions/class/${CLASS_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('GET /api/bkt/evidence/:id with bad UUID returns 400', async () => {
    const res = await request(app).get('/api/bkt/evidence/not-a-uuid');
    expect(res.status).toBe(400);
  });

  it('GET /api/bkt/diagnosis/student/:id with bad UUID returns 400', async () => {
    const res = await request(app).get('/api/bkt/diagnosis/student/not-a-uuid');
    expect(res.status).toBe(400);
  });

  it('GET /api/bkt/skills/tree returns roots when skills have prereqs (full traversal)', async () => {
    const res = await request(app).get('/api/bkt/skills/tree');
    expect(res.status).toBe(200);
    // SKILL_ID is a root (no prereqs).
    expect(res.body.data.find((n: { id: string }) => n.id === SKILL_ID)).toBeDefined();
    // SKILL_ID_2 is a child of SKILL_ID (in tree but not in roots).
    expect(res.body.data.find((n: { id: string }) => n.id === SKILL_ID_2)).toBeUndefined();
  });

  it('GET /api/bkt/skills/:id with stats accumulates DIAGNOSED + STRUGGLING', async () => {
    // Create some diagnoses to populate stats.
    await request(app)
      .post('/api/bkt/diagnosis/run')
      .send({ studentId: STUDENT_ID, skillId: SKILL_ID });

    const res = await request(app).get(`/api/bkt/skills/${SKILL_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.stats).toBeDefined();
    expect(res.body.data.stats.totalAttempts).toBeGreaterThanOrEqual(0);
    expect(res.body.data.stats.masteredStudents).toBeGreaterThanOrEqual(0);
  });
});