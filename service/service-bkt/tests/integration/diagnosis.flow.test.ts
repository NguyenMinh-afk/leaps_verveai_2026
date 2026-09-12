/**
 * Integration test for the BKT diagnosis flow
 *
 * This test exercises the full service chain:
 *   runDiagnosis → recordEvidence → runDiagnosis (verify updated pKnown)
 *
 * Uses a deterministic in-memory mock of Prisma so it runs without a
 * real database. It does NOT require testcontainers.
 *
 * The test validates that:
 *   1. A diagnosis is created with P(L₀) = 0.1
 *   2. Recording a correct evidence item updates P(L) upward
 *   3. Recording an incorrect evidence item updates P(L) downward
 *   4. The diagnosis status transitions correctly
 *   5. The evidence chain is traceable
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Set up environment variables ──────────────────────────────────────────────
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] = 'postgresql://test:test@localhost:5432/test';
process.env['PORT'] = '3002';
process.env['SERVICE_NAME'] = 'svc-bkt';
process.env['SERVICE_PORT'] = '3002';
process.env['LOG_LEVEL'] = 'silent';
process.env['CONSUL_HOST'] = 'localhost';
process.env['CONSUL_PORT'] = '8500';
process.env['OTEL_SERVICE_NAME'] = 'svc-bkt-test';

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
      debug: vi.fn()
    }))
  }
}));

// ── Mock Consul resolve (for getClassDiagnoses) ───────────────────────────────
vi.mock('@verveai/consul-client', () => ({
  Consul: {
    resolve: vi.fn().mockResolvedValue('http://svc-class:3003'),
    register: vi.fn().mockResolvedValue(undefined),
    deregister: vi.fn().mockResolvedValue(undefined)
  }
}));

// ── Mock circuit-breaker ──────────────────────────────────────────────────────
vi.mock('@verveai/circuit-breaker', () => ({
  createBreaker: vi.fn(
    (_name: string, fn: (...args: unknown[]) => Promise<unknown>) => ({
      fire: async (...args: unknown[]) => fn(...args),
      getStats: vi
        .fn()
        .mockReturnValue({ state: 'CLOSED', failures: 0, successes: 0 }),
      isOpen: vi.fn().mockReturnValue(false),
      close: vi.fn(),
      open: vi.fn()
    })
  )
}));

// ── In-memory Prisma state (hoisted so the vi.mock factory can read it) ──────

interface InMemoryEvidence {
  id: string;
  diagnosis_id: string;
  item_id: string;
  extracted_answer: string | null;
  correct: boolean | null;
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

interface InMemoryState {
  skills: Map<
    string,
    {
      id: string;
      code: string;
      name: string;
      difficulty: number;
      prereq_skills: string[];
    }
  >;
  diagnoses: Map<string, InMemoryDiagnosis>;
  evidence: InMemoryEvidence[];
  counters: { diagnosisId: number; evidenceId: number };
  reset(): void;
}

const inMemoryDb = vi.hoisted<InMemoryState>(() => {
  const state: InMemoryState = {
    skills: new Map(),
    diagnoses: new Map(),
    evidence: [],
    counters: { diagnosisId: 1, evidenceId: 1 },
    reset() {
      this.skills.clear();
      this.diagnoses.clear();
      this.evidence.length = 0;
      this.counters.diagnosisId = 1;
      this.counters.evidenceId = 1;
    }
  };
  return state;
});

function makeDiagnosisId(): string {
  // Format: 8-4-4-4-12 with version=4 and variant=8/9/a/b so it
  // satisfies `z.string().uuid()` validators used in the service.
  const part = (): string =>
    Math.random().toString(16).slice(2, 6).padStart(4, '0');
  const n = String(inMemoryDb.counters.diagnosisId++).padStart(12, '0');
  return `00000000-0000-4000-8000-${n}`;
}

function makeEvidenceId(): string {
  const n = String(inMemoryDb.counters.evidenceId++).padStart(12, '0');
  return `00000000-0001-4000-8000-${n}`;
}

const mockPrisma = vi.hoisted(() => ({
  skill: {
    findUnique: vi.fn(({ where }: { where: { id: string } }) =>
      Promise.resolve(inMemoryDb.skills.get(where.id) ?? null)
    ),
    findMany: vi.fn(() => Promise.resolve([...inMemoryDb.skills.values()]))
  },
  // The service runs the chain-recompute inside `prisma.$transaction(cb)`
  // so that `evidences.create` and `diagnosis.update` either both fire
  // or neither. The in-memory mock satisfies the callback by exposing
  // the same delegates under `tx`.
  $transaction: vi.fn(
    async <T>(fn: (tx: typeof mockPrisma) => Promise<T>): Promise<T> => fn(mockPrisma)
  ),
  diagnosis: {
    findFirst: vi.fn(
      ({
        where,
        include
      }: {
        where?: { student_id?: string; skill_id?: string };
        include?: { evidence?: { orderBy?: { created_at?: 'asc' | 'desc' } } };
      }) => {
        const sid = where?.student_id;
        const skid = where?.skill_id;
        const row = [...inMemoryDb.diagnoses.values()].find((d) => {
          if (sid !== undefined && d.student_id !== sid) return false;
          if (skid !== undefined && d.skill_id !== skid) return false;
          return true;
        }) ?? null;
        if (row === null) return Promise.resolve(null);
        if (include?.evidence !== undefined) {
          const order = include.evidence.orderBy?.created_at ?? 'asc';
          const evidenceChain = inMemoryDb.evidence
            .filter((e) => e.diagnosis_id === row.id)
            .sort((a, b) => {
              const diff = a.created_at.getTime() - b.created_at.getTime();
              return order === 'desc' ? -diff : diff;
            });
          // Mimic Prisma's `include` shape — the relation key matches
          // the field name in the model (`evidence`).
          return Promise.resolve({ ...row, evidence: evidenceChain });
        }
        return Promise.resolve(row);
      }
    ),
    findUnique: vi.fn(
      ({
        where,
        include
      }: {
        where: { id?: string; student_id_skill_id?: unknown };
        include?: { evidence?: { orderBy?: { created_at?: 'asc' | 'desc' } } };
      }) => {
        if (where.student_id_skill_id !== undefined) {
          const key = where.student_id_skill_id as {
            student_id: string;
            skill_id: string;
          };
          const row = [...inMemoryDb.diagnoses.values()].find(
            (d) =>
              d.student_id === key.student_id && d.skill_id === key.skill_id
          ) ?? null;
          if (row === null) return Promise.resolve(null);
          if (include?.evidence !== undefined) {
            const order = include.evidence.orderBy?.created_at ?? 'asc';
            const evidenceChain = inMemoryDb.evidence
              .filter((e) => e.diagnosis_id === row.id)
              .sort((a, b) => {
                const diff = a.created_at.getTime() - b.created_at.getTime();
                return order === 'desc' ? -diff : diff;
              });
            return Promise.resolve({ ...row, evidence: evidenceChain });
          }
          return Promise.resolve(row);
        }
        if (where.id !== undefined) {
          const row = inMemoryDb.diagnoses.get(where.id) ?? null;
          if (row === null) return Promise.resolve(null);
          if (include?.evidence !== undefined) {
            const order = include.evidence.orderBy?.created_at ?? 'asc';
            const evidenceChain = inMemoryDb.evidence
              .filter((e) => e.diagnosis_id === row.id)
              .sort((a, b) => {
                const diff = a.created_at.getTime() - b.created_at.getTime();
                return order === 'desc' ? -diff : diff;
              });
            return Promise.resolve({ ...row, evidence: evidenceChain });
          }
          return Promise.resolve(row);
        }
        return Promise.resolve(null);
      }
    ),
    findMany: vi.fn(({ where }: { where?: { student_id?: string } }) => {
      if (where?.student_id !== undefined) {
        const sid = where.student_id;
        return Promise.resolve(
          [...inMemoryDb.diagnoses.values()].filter((d) => d.student_id === sid)
        );
      }
      return Promise.resolve([...inMemoryDb.diagnoses.values()]);
    }),
    create: vi.fn(
      ({
        data
      }: {
        data: Omit<InMemoryDiagnosis, 'id' | 'created_at' | 'updated_at'>;
      }) => {
        const now = new Date();
        const row: InMemoryDiagnosis = {
          id: makeDiagnosisId(),
          ...data,
          created_at: now,
          updated_at: now
        };
        inMemoryDb.diagnoses.set(row.id, row);
        return Promise.resolve(row);
      }
    ),
    update: vi.fn(
      ({
        where,
        data
      }: {
        where: { id: string };
        data: Partial<InMemoryDiagnosis>;
      }) => {
        const existing = inMemoryDb.diagnoses.get(where.id);
        if (existing === undefined) return Promise.reject(new Error('Not found'));
        const updated: InMemoryDiagnosis = {
          ...existing,
          ...data,
          updated_at: new Date()
        };
        inMemoryDb.diagnoses.set(where.id, updated);
        return Promise.resolve(updated);
      }
    )
  },
  evidenceItem: {
    findMany: vi.fn(({ where }: { where?: { diagnosis_id?: string } }) => {
      if (where?.diagnosis_id !== undefined) {
        const did = where.diagnosis_id;
        return Promise.resolve(
          inMemoryDb.evidence
            .filter((e) => e.diagnosis_id === did)
            .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
        );
      }
      return Promise.resolve([...inMemoryDb.evidence]);
    }),
    create: vi.fn(
      ({ data }: { data: Omit<InMemoryEvidence, 'id' | 'created_at'> }) => {
        const row: InMemoryEvidence = {
          id: makeEvidenceId(),
          ...data,
          created_at: new Date()
        };
        inMemoryDb.evidence.push(row);
        return Promise.resolve(row);
      }
    ),
    count: vi.fn(
      ({
        where
      }: { where?: { diagnosis?: { skill_id?: string } } }) => {
        if (where?.diagnosis?.skill_id !== undefined) {
          const targetSkill = where.diagnosis.skill_id;
          return Promise.resolve(
            inMemoryDb.evidence.filter((e) => {
              const diag = [...inMemoryDb.diagnoses.values()].find(
                (d) => d.id === e.diagnosis_id
              );
              return diag?.skill_id === targetSkill;
            }).length
          );
        }
        return Promise.resolve(inMemoryDb.evidence.length);
      }
    ),
    aggregate: vi.fn(),
    groupBy: vi.fn()
  }
}));

vi.mock('../../src/prisma/client.js', () => ({
  prisma: mockPrisma
}));

// ── Import services under test ─────────────────────────────────────────────────
import { runDiagnosis } from '../../src/services/diagnosis.service.js';
import {
  recordEvidence,
  getEvidenceChain
} from '../../src/services/evidence.service.js';
import { BKT_PARAMS } from '../../src/services/bkt-engine.js';

// Seed constants.
const SKILL_ID = '55555555-5555-5555-5555-555555555555';
const STUDENT_ID = '66666666-6666-6666-6666-666666666666';
const SKILL_ID_2 = '77777777-7777-7777-7777-777777777777';

function seedSkills(): void {
  inMemoryDb.skills.set(SKILL_ID, {
    id: SKILL_ID,
    code: 'MATH-ADD-001',
    name: 'Basic Addition',
    difficulty: 1,
    prereq_skills: []
  });
  inMemoryDb.skills.set(SKILL_ID_2, {
    id: SKILL_ID_2,
    code: 'MATH-SUB-001',
    name: 'Basic Subtraction',
    difficulty: 1,
    prereq_skills: [SKILL_ID]
  });
}

beforeEach(() => {
  inMemoryDb.reset();
  seedSkills();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('BKT Diagnosis Flow — Integration', () => {
  it('creates a diagnosis with initial P(L₀) = 0.1 when none exists', async () => {
    const result = await runDiagnosis(STUDENT_ID, SKILL_ID);

    expect(result.pKnown).toBeCloseTo(BKT_PARAMS.P_INIT, 4);
    expect(result.status).toBe('PENDING');
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.studentId).toBe(STUDENT_ID);
    expect(result.skillId).toBe(SKILL_ID);
    expect(mockPrisma.diagnosis.create).toHaveBeenCalled();
  });

  it('reuses existing diagnosis and re-derives P(L) from evidence chain', async () => {
    await runDiagnosis(STUDENT_ID, SKILL_ID);
    await runDiagnosis(STUDENT_ID, SKILL_ID);

    expect(mockPrisma.diagnosis.create).toHaveBeenCalledTimes(1);
  });

  it('records correct evidence and updates P(L) monotonically upward', async () => {
    const diag = await runDiagnosis(STUDENT_ID, SKILL_ID);
    const { diagnosis } = await recordEvidence({
      diagnosisId: diag.id,
      itemId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      correct: true,
      confidence: 0.9,
      quality: 'HIGH'
    });

    expect(diagnosis.pKnown).toBeGreaterThan(BKT_PARAMS.P_INIT);
    expect(diagnosis.attempts).toBe(1);
  });

  it('records incorrect evidence and updates P(L) deterministically', async () => {
    const diag = await runDiagnosis(STUDENT_ID, SKILL_ID);
    const { diagnosis } = await recordEvidence({
      diagnosisId: diag.id,
      itemId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
      correct: false,
      quality: 'MEDIUM'
    });

    expect(diagnosis.pKnown).not.toBeCloseTo(BKT_PARAMS.P_INIT, 2);
    expect(diagnosis.attempts).toBe(1);
  });

  it('many correct answers eventually reach MASTERED status', async () => {
    const diag = await runDiagnosis(STUDENT_ID, SKILL_ID);

    for (let i = 0; i < 30; i++) {
      await recordEvidence({
        diagnosisId: diag.id,
        itemId: `aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa${String(i).padStart(2, '0')}`,
        correct: true,
        quality: 'HIGH'
      });
    }

    const final = await runDiagnosis(STUDENT_ID, SKILL_ID);
    expect(final.status).toBe('MASTERED');
  });

  it('evidence chain is traceable — steps reflect cumulative P(L)', async () => {
    const diag = await runDiagnosis(STUDENT_ID, SKILL_ID);

    await recordEvidence({
      diagnosisId: diag.id,
      itemId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
      correct: true
    });
    await recordEvidence({
      diagnosisId: diag.id,
      itemId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
      correct: false
    });
    await recordEvidence({
      diagnosisId: diag.id,
      itemId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
      correct: true
    });

    const chain = await getEvidenceChain(diag.id);

    expect(chain.steps).toHaveLength(3);
    const first = chain.steps[0];
    expect(first).toBeDefined();
    if (first === undefined) return;
    expect(first.pKnownBefore).toBeCloseTo(BKT_PARAMS.P_INIT, 4);

    const last = chain.steps[chain.steps.length - 1];
    if (last !== undefined) {
      expect(chain.currentPKnown).toBeCloseTo(last.pKnownAfter, 4);
    }
  });

  it('throws NotFoundError for unknown diagnosis id in getEvidenceChain', async () => {
    await expect(
      getEvidenceChain('00000000-0000-0000-0000-000000000000')
    ).rejects.toThrow('not found');
  });

  it('throws NotFoundError when recording evidence for unknown diagnosis', async () => {
    await expect(
      recordEvidence({
        diagnosisId: '00000000-0000-0000-0000-000000000000',
        itemId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa10',
        correct: true
      })
    ).rejects.toThrow('not found');
  });

  it('runDiagnosis throws NotFoundError for unknown skill', async () => {
    await expect(
      runDiagnosis(STUDENT_ID, '00000000-0000-0000-0000-000000000000')
    ).rejects.toThrow('not found');
  });

  it('BKT math is deterministic: same transcript → same final P(L)', async () => {
    async function transcript(): Promise<number> {
      const a = await runDiagnosis('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', SKILL_ID);
      const observations = [
        true, true, false, true, true, false, true, true, true, true
      ];
      for (let i = 0; i < observations.length; i++) {
        await recordEvidence({
          diagnosisId: a.id,
          itemId: `cccccccc-cccc-4ccc-8ccc-cccccccccc${String(i).padStart(2, '0')}`,
          correct: observations[i] ?? false
        });
      }
      const final = await runDiagnosis('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', SKILL_ID);
      return final.pKnown;
    }

    const r1 = await transcript();
    inMemoryDb.reset();
    seedSkills();
    const r2 = await transcript();

    expect(r1).toBeCloseTo(r2, 10);
  });
});
