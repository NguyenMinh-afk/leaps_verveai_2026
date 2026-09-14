/**
 * Full-flow live demo — boots svc-bkt and walks through a complete
 * teacher / student scenario via real HTTP calls.
 *
 * Run with:  pnpm test:smoke
 *
 * This is the "happy path" walkthrough:
 *   1.  GET  /health
 *   2.  GET  /api/bkt/skills           → catalogue
 *   3.  POST /api/bkt/diagnosis/run    → create diagnosis with P(L)=0.1
 *   4.  POST /api/bkt/evidence         × 8   → record evidence
 *   5.  GET  /api/bkt/evidence/:id/chain → reasoning chain
 *   6.  POST /api/bkt/diagnosis/run    → re-run; P(L) is higher
 *   7.  GET  /api/bkt/diagnosis/student/:id
 *   8.  Seed intervention (via mock state)
 *   9.  PUT  /api/bkt/interventions/:id/override → teacher override (FR-17)
 *  10.  GET  /api/bkt/interventions/:id → see resolved + notes
 *  11.  GET  /metrics                  → prometheus metrics
 */

import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

// ── Env ──────────────────────────────────────────────────────────────────────
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.LOG_LEVEL = 'silent';
process.env.CONSUL_HOST = 'localhost';
process.env.CONSUL_PORT = '8500';
process.env.OTEL_SERVICE_NAME = 'svc-bkt-demo';

// ── In-memory state + prisma mock ────────────────────────────────────────────
import type {
  InMemoryDb,
  InMemorySkill,
  InMemoryIntervention,
  InMemoryDiagnosis,
  InMemoryEvidence,
} from './smoke-prisma.js';
import { buildPrismaMock, seedPrismaState } from './smoke-prisma.js';

const inMemoryDb: InMemoryDb = {
  skills: new Map<string, InMemorySkill>(),
  diagnoses: new Map<string, InMemoryDiagnosis>(),
  evidence: [] as InMemoryEvidence[],
  interventions: new Map<string, InMemoryIntervention>(),
  interventionNotes: [] as Array<unknown>,
  counters: { diagnosisId: 1, evidenceId: 1, interventionId: 1, noteId: 1 },
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

const mockPrisma = buildPrismaMock(inMemoryDb);

// ── Server boot ──────────────────────────────────────────────────────────────
let server: Server;
let baseUrl: string;
let createApp: typeof import('../../src/app.js').createApp;

beforeAll(async () => {
  vi.doMock('../../src/utils/logger.js', () => ({
    logger: {
      info: () => undefined,
      warn: () => undefined,
      error: () => undefined,
      debug: () => undefined,
      child: () => ({
        info: () => undefined,
        warn: () => undefined,
        error: () => undefined,
        debug: () => undefined,
      }),
    },
  }));

  vi.doMock('@verveai/consul-client', () => ({
    Consul: {
      resolve: vi.fn(async () => 'http://svc-class:3003'),
      register: vi.fn(async () => undefined),
      deregister: vi.fn(async () => undefined),
    },
  }));

  vi.doMock('@verveai/circuit-breaker', () => ({
    createBreaker: (
      _name: string,
      fn: (...args: unknown[]) => Promise<unknown>
    ) => ({
      fire: async (...args: unknown[]) => fn(...args),
      getStats: () => ({ state: 'CLOSED', failures: 0, successes: 0 }),
      isOpen: () => false,
      close: () => undefined,
      open: () => undefined,
    }),
  }));

  vi.doMock('../../src/prisma/client.js', () => ({
    prisma: mockPrisma,
    disconnectPrisma: vi.fn(async () => undefined),
  }));

  const mod = await import('../../src/app.js');
  createApp = mod.createApp;

  const app = createApp({ minimal: true });
  server = await new Promise<Server>((resolve) => {
    const s = app.listen(0);
    s.once('listening', () => resolve(s));
  });
  const addr = server.address() as AddressInfo;
  baseUrl = `http://localhost:${addr.port}`;
});

afterAll(
  () =>
    new Promise<void>((resolve) => {
      server?.close(() => resolve());
    })
);

beforeEach(() => {
  inMemoryDb.reset();
  seedPrismaState(inMemoryDb);
});

// ── Helpers ──────────────────────────────────────────────────────────────────
async function call(
  method: string,
  path: string,
  body?: unknown,
  headers: Record<string, string> = {}
): Promise<{ status: number; body: unknown }> {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, body: json };
}

const SKILL_ID = '11111111-1111-1111-1111-111111111111';
const STUDENT_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const TEACHER_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

// ── Demo flow ────────────────────────────────────────────────────────────────

describe('svc-bkt — full BKT flow over HTTP', () => {
  it('1. Health check returns 200', async () => {
    const r = await call('GET', '/health');
    expect(r.status).toBe(200);
    const body = r.body as { service?: string };
    expect(body.service).toBe('svc-bkt');
    process.stdout.write(`\n  GET /health → 200, service=${body.service}\n`);
  });

  it('2. Skills catalogue returns 2 skills', async () => {
    const r = await call('GET', '/api/bkt/skills');
    expect(r.status).toBe(200);
    const data = (r.body as { data?: Array<{ code: string }> }).data ?? [];
    expect(data.length).toBe(2);
    process.stdout.write(
      `  GET /api/bkt/skills → 200, ${data.length} skills: ${data.map((s) => s.code).join(', ')}\n`
    );
  });

  it('3. Run diagnosis — P(L) starts at 0.1', async () => {
    const r = await call('POST', '/api/bkt/diagnosis/run', {
      studentId: STUDENT_ID,
      skillId: SKILL_ID,
    });
    expect(r.status).toBe(200);
    const data = (r.body as { data?: { id: string; pKnown: number } }).data ?? { id: '', pKnown: 0 };
    expect(Math.abs(data.pKnown - 0.1)).toBeLessThan(0.001);
    process.stdout.write(
      `  POST /api/bkt/diagnosis/run → 200, id=${data.id.slice(0, 8)}…, pKnown=${data.pKnown.toFixed(4)}\n`
    );
  });

  it('4. Record 8 evidence items and observe P(L) evolving', async () => {
    // First, ensure diagnosis exists.
    const setup = await call('POST', '/api/bkt/diagnosis/run', {
      studentId: STUDENT_ID,
      skillId: SKILL_ID,
    });
    const diagnosisId = (setup.body as { data?: { id: string } }).data?.id ?? '';

    const observations = [true, true, false, true, true, true, false, true];
    let prevPKnown = (setup.body as { data?: { pKnown: number } }).data?.pKnown ?? 0;
    for (let i = 0; i < observations.length; i++) {
      const r = await call('POST', '/api/bkt/evidence', {
        diagnosisId,
        itemId: `99999999-9999-4999-8999-${String(i).padStart(12, '0')}`,
        correct: observations[i],
        confidence: 0.8,
        quality: 'HIGH',
      });
      expect(r.status).toBe(201);
      const d = (r.body as {
        data?: { diagnosis: { pKnown: number; status: string } };
      }).data?.diagnosis;
      process.stdout.write(
        `  #${i + 1} correct=${String(observations[i]).padEnd(5)} → P(L)=${d?.pKnown.toFixed(4)} (${d?.status})\n`
      );
      prevPKnown = d?.pKnown ?? prevPKnown;
    }
    expect(prevPKnown).toBeGreaterThan(0.1); // net positive trend
  });

  it('5. Reasoning chain is queryable', async () => {
    const setup = await call('POST', '/api/bkt/diagnosis/run', {
      studentId: STUDENT_ID,
      skillId: SKILL_ID,
    });
    const diagnosisId = (setup.body as { data?: { id: string } }).data?.id ?? '';
    await call('POST', '/api/bkt/evidence', {
      diagnosisId,
      itemId: '99999999-9999-4999-8999-000000000005',
      correct: true,
    });
    await call('POST', '/api/bkt/evidence', {
      diagnosisId,
      itemId: '99999999-9999-4999-8999-000000000006',
      correct: false,
    });

    const r = await call('GET', `/api/bkt/evidence/${diagnosisId}/chain`);
    expect(r.status).toBe(200);
    const data = r.body as {
      data?: {
        steps: unknown[];
        currentPKnown: number;
        currentStatus: string;
      };
    };
    expect((data.data?.steps.length ?? 0)).toBeGreaterThan(0);
    process.stdout.write(
      `  GET /api/bkt/evidence/:id/chain → 200, ${data.data?.steps.length} steps, currentPKnown=${data.data?.currentPKnown.toFixed(4)} (${data.data?.currentStatus})\n`
    );
  });

  it('6. Re-run diagnosis — P(L) reflects accumulated evidence', async () => {
    const setup = await call('POST', '/api/bkt/diagnosis/run', {
      studentId: STUDENT_ID,
      skillId: SKILL_ID,
    });
    const pKnown0 = (setup.body as { data?: { pKnown: number } }).data?.pKnown ?? 0;
    const diagnosisId = (setup.body as { data?: { id: string } }).data?.id ?? '';

    for (let i = 0; i < 5; i++) {
      await call('POST', '/api/bkt/evidence', {
        diagnosisId,
        itemId: `99999999-9999-4999-8999-${String(20 + i).padStart(12, '0')}`,
        correct: i % 2 === 0,
      });
    }

    const r = await call('POST', '/api/bkt/diagnosis/run', {
      studentId: STUDENT_ID,
      skillId: SKILL_ID,
    });
    expect(r.status).toBe(200);
    const data = (r.body as {
      data?: { pKnown: number; evidenceCount: number; status: string };
    }).data ?? { pKnown: 0, evidenceCount: 0, status: '' };
    expect(data.pKnown).toBeGreaterThan(pKnown0);
    expect(data.evidenceCount).toBe(5);
    process.stdout.write(
      `  POST /api/bkt/diagnosis/run → 200, P(L): ${pKnown0.toFixed(4)} → ${data.pKnown.toFixed(4)} (${data.status}, evidenceCount=${data.evidenceCount})\n`
    );
  });

  it('7. List student diagnoses', async () => {
    await call('POST', '/api/bkt/diagnosis/run', {
      studentId: STUDENT_ID,
      skillId: SKILL_ID,
    });
    const r = await call('GET', `/api/bkt/diagnosis/student/${STUDENT_ID}`);
    expect(r.status).toBe(200);
    const data = (r.body as { data?: unknown[] }).data ?? [];
    expect(data.length).toBeGreaterThan(0);
    process.stdout.write(`  GET /api/bkt/diagnosis/student/:id → 200, ${data.length} diagnoses\n`);
  });

  it('8-10. Intervention lifecycle: seed → override (FR-17) → audit', async () => {
    // Seed intervention.
    const interventionId = '00000000-0002-4000-8000-000000000001';
    inMemoryDb.interventions.set(interventionId, {
      id: interventionId,
      student_id: STUDENT_ID,
      skill_id: SKILL_ID,
      priority: 80,
      status: 'ACTIVE',
      teacher_id: null,
      notes: null,
      created_at: new Date(),
      resolved_at: null,
    });
    process.stdout.write(`\n  Intervention seeded (id=${interventionId.slice(0, 8)}…, status=ACTIVE)\n`);

    // Teacher override (FR-17).
    const override = await call(
      'PUT',
      `/api/bkt/interventions/${interventionId}/override`,
      {
        reason: 'Student demonstrated mastery in follow-up classroom session',
        newStatus: 'RESOLVED',
      },
      { 'x-user-id': TEACHER_ID }
    );
    expect(override.status).toBe(200);
    const ov = (override.body as {
      data?: { status: string; teacherId: string | null; notes_list: unknown[] };
    }).data ?? { status: '', teacherId: null, notes_list: [] };
    expect(ov.status).toBe('RESOLVED');
    expect(ov.teacherId).toBe(TEACHER_ID);
    process.stdout.write(
      `  PUT /api/bkt/interventions/:id/override → 200, status=${ov.status}, teacherId=${ov.teacherId?.slice(0, 8)}…, audit notes=${ov.notes_list?.length ?? 0}\n`
    );

    // Audit trail.
    const audit = await call('GET', `/api/bkt/interventions/${interventionId}`);
    expect(audit.status).toBe(200);
    const a = (audit.body as {
      data?: { status: string; teacherId: string | null; notes_list: Array<{ content: string }> };
    }).data ?? { status: '', teacherId: null, notes_list: [] };
    expect(a.status).toBe('RESOLVED');
    expect(a.notes_list?.length ?? 0).toBeGreaterThan(0);
    process.stdout.write(
      `  GET /api/bkt/interventions/:id → 200, status=${a.status}, audit notes=${a.notes_list?.length ?? 0}\n`
    );
    if (a.notes_list?.[0]) {
      process.stdout.write(`  First audit note: "${a.notes_list[0].content.slice(0, 70)}…"\n`);
    }
  });

  it('11. Prometheus metrics endpoint exposes counters', async () => {
    const res = await fetch(`${baseUrl}/metrics`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('http_requests_total');
    const matchCount = (text.match(/http_requests_total\{[^}]*\}\s+\d+/g) ?? []).length;
    process.stdout.write(
      `  GET /metrics → 200, ${matchCount} unique request-metric labels observed\n`
    );
  });
});