/**
 * Live HTTP smoke test for svc-bkt.
 *
 * Boots the Express app on a real port (with Prisma + Consul + Logger
 * mocked) and exercises every documented endpoint via Node's fetch.
 * Confirms:
 *   1. HTTP status codes
 *   2. JSON response shapes
 *   3. Cross-route state changes (e.g. run diagnosis → record evidence
 *      → verify P(L) changed)
 *   4. BKT math is deterministic
 *
 * Run with:  pnpm test:smoke
 *
 * Implementation note:
 *   We use `vi.doMock` (NOT `vi.mock`) so the mock factories are applied
 *   lazily after the vitest namespace is initialized. This avoids the
 *   `__vi_import_0__` initialization order issue that affects `vi.mock`
 *   when combined with `vi.hoisted` for complex helper modules.
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
process.env.OTEL_SERVICE_NAME = 'svc-bkt-smoke';

// ── In-memory state (module-level — shared with the prisma mock factory) ─────
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
  // Apply mocks LAZILY (vi.doMock is not hoisted, so vi is fully initialized).
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

  // Dynamic import — picks up the mocks.
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
async function getJson(path: string): Promise<{ status: number; body: unknown }> {
  const res = await fetch(`${baseUrl}${path}`);
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

async function sendJson(
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
const SKILL_ID_2 = '22222222-2222-2222-2222-222222222222';
const STUDENT_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const TEACHER_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

// ── Smoke checks ─────────────────────────────────────────────────────────────

describe('svc-bkt — live HTTP smoke test', () => {
  it('1. Health endpoints return 200', async () => {
    const health = await getJson('/health');
    expect(health.status).toBe(200);
    const body = health.body as { status?: string; service?: string };
    expect(body.status).toBe('ok');
    expect(body.service).toBe('svc-bkt');

    const ready = await getJson('/health/ready');
    expect(ready.status).toBe(200);

    const res = await fetch(`${baseUrl}/metrics`);
    const text = await res.text();
    expect(res.status).toBe(200);
    expect(text).toContain('http_requests_total');
  });

  it('2. Skills endpoints return 200 / 404 / 400 as expected', async () => {
    const list = await getJson('/api/bkt/skills');
    expect(list.status).toBe(200);
    const listBody = list.body as { data?: Array<{ id: string }> };
    expect(listBody.data?.length).toBe(2);

    const single = await getJson(`/api/bkt/skills/${SKILL_ID}`);
    expect(single.status).toBe(200);
    const singleBody = single.body as { data?: { code: string; stats: unknown } };
    expect(singleBody.data?.code).toBe('MATH-ADD-001');
    expect(singleBody.data?.stats).toBeDefined();

    const missing = await getJson('/api/bkt/skills/00000000-0000-0000-0000-000000000000');
    expect(missing.status).toBe(404);

    const bad = await getJson('/api/bkt/skills/not-a-uuid');
    expect(bad.status).toBe(400);

    const tree = await getJson('/api/bkt/skills/tree');
    expect(tree.status).toBe(200);
    const treeBody = tree.body as {
      data?: Array<{ id: string; children: unknown[] }>;
    };
    const root = treeBody.data?.find((n) => n.id === SKILL_ID);
    expect(root?.children.length).toBe(1);
  });

  it('3. Diagnosis + Evidence — full BKT flow over HTTP', async () => {
    // Run.
    const run = await sendJson('POST', '/api/bkt/diagnosis/run', {
      studentId: STUDENT_ID,
      skillId: SKILL_ID,
    });
    expect(run.status).toBe(200);
    const runBody = run.body as { data?: { id: string; pKnown: number; status: string } };
    const diagnosisId = runBody.data?.id ?? '';
    const initialPKnown = runBody.data?.pKnown ?? 0;
    expect(Math.abs(initialPKnown - 0.1)).toBeLessThan(0.001);
    expect(runBody.data?.status).toBe('PENDING');

    // Batch.
    const batch = await sendJson('POST', '/api/bkt/diagnosis/batch', {
      studentId: STUDENT_ID,
      skillIds: [SKILL_ID, SKILL_ID_2],
    });
    expect(batch.status).toBe(200);
    const batchBody = batch.body as { data?: { results: unknown[] } };
    expect(batchBody.data?.results.length).toBe(2);

    // Bad UUID.
    const bad = await sendJson('POST', '/api/bkt/diagnosis/run', {
      studentId: 'not-a-uuid',
      skillId: SKILL_ID,
    });
    expect(bad.status).toBe(400);

    // Record 5 evidence items.
    const observations = [true, true, false, true, true];
    for (let i = 0; i < observations.length; i++) {
      const r = await sendJson('POST', '/api/bkt/evidence', {
        diagnosisId,
        itemId: `99999999-9999-4999-8999-${String(i).padStart(12, '0')}`,
        correct: observations[i],
      });
      expect(r.status).toBe(201);
    }

    // Re-run diagnosis — P(L) increased.
    const rerun = await sendJson('POST', '/api/bkt/diagnosis/run', {
      studentId: STUDENT_ID,
      skillId: SKILL_ID,
    });
    const rerunBody = rerun.body as { data?: { pKnown: number; evidenceCount: number } };
    expect(rerunBody.data?.pKnown ?? 0).toBeGreaterThan(initialPKnown);
    expect(rerunBody.data?.evidenceCount).toBe(5);

    // Reasoning chain.
    const chain = await getJson(`/api/bkt/evidence/${diagnosisId}/chain`);
    expect(chain.status).toBe(200);
    const chainBody = chain.body as { data?: { steps: unknown[]; currentPKnown: number } };
    expect(chainBody.data?.steps.length).toBe(5);
    expect(chainBody.data?.currentPKnown ?? 0).toBeGreaterThan(0);
  });

  it('4. Intervention lifecycle + FR-17 override', async () => {
    // Seed an intervention.
    const interventionId = '00000000-0002-4000-8000-000000000001';
    inMemoryDb.interventions.set(interventionId, {
      id: interventionId,
      student_id: STUDENT_ID,
      skill_id: SKILL_ID,
      priority: 75,
      status: 'ACTIVE',
      teacher_id: null,
      notes: null,
      created_at: new Date(),
      resolved_at: null,
    });

    // List.
    const list = await getJson('/api/bkt/interventions');
    expect(list.status).toBe(200);
    const listBody = list.body as { data?: Array<{ id: string }> };
    expect(listBody.data?.length).toBe(1);

    // Get one.
    const single = await getJson(`/api/bkt/interventions/${interventionId}`);
    expect(single.status).toBe(200);

    // Update priority.
    const upd = await sendJson('PUT', `/api/bkt/interventions/${interventionId}`, {
      priority: 90,
    });
    expect(upd.status).toBe(200);
    const updBody = upd.body as { data?: { priority: number } };
    expect(updBody.data?.priority).toBe(90);

    // Override (FR-17) with teacher header.
    const override = await sendJson(
      'PUT',
      `/api/bkt/interventions/${interventionId}/override`,
      {
        reason: 'Smoke test override: student demonstrated mastery',
        newStatus: 'RESOLVED',
      },
      { 'x-user-id': TEACHER_ID }
    );
    expect(override.status).toBe(200);
    const overrideBody = override.body as {
      data?: { status: string; teacherId: string | null; notes_list: unknown[] };
    };
    expect(overrideBody.data?.status).toBe('RESOLVED');
    expect(overrideBody.data?.teacherId).toBe(TEACHER_ID);
    expect(overrideBody.data?.notes_list?.length).toBe(1);

    // Add a teacher note.
    const note = await sendJson(
      'POST',
      `/api/bkt/interventions/${interventionId}/note`,
      { content: 'Smoke test follow-up note.' },
      { 'x-user-id': TEACHER_ID }
    );
    expect(note.status).toBe(201);

    // Resolve (idempotent).
    const resolve = await sendJson('POST', `/api/bkt/interventions/${interventionId}/resolve`);
    expect(resolve.status).toBe(200);
    const resolveBody = resolve.body as { data?: { status: string; resolvedAt: string } };
    expect(resolveBody.data?.status).toBe('RESOLVED');
    expect(resolveBody.data?.resolvedAt).toBeDefined();

    // Conflict on RESOLVED → ACTIVE.
    const conflict = await sendJson('PUT', `/api/bkt/interventions/${interventionId}`, {
      status: 'ACTIVE',
    });
    expect(conflict.status).toBe(409);

    // 404.
    const missing = await getJson(
      '/api/bkt/interventions/00000000-0000-0000-0000-000000000000'
    );
    expect(missing.status).toBe(404);
  });

  it('5. BKT determinism — same transcript ⇒ same final P(L)', async () => {
    async function transcript(studentId: string): Promise<number> {
      const r1 = await sendJson('POST', '/api/bkt/diagnosis/run', {
        studentId,
        skillId: SKILL_ID,
      });
      const did = (r1.body as { data?: { id: string } }).data?.id ?? '';
      const obs = [true, true, false, true, true, false, true, true, true, true];
      for (let i = 0; i < obs.length; i++) {
        await sendJson('POST', '/api/bkt/evidence', {
          diagnosisId: did,
          itemId: `99999999-9999-4999-8999-${String(i).padStart(12, '0')}`,
          correct: obs[i],
        });
      }
      const final = await sendJson('POST', '/api/bkt/diagnosis/run', {
        studentId,
        skillId: SKILL_ID,
      });
      return (final.body as { data?: { pKnown: number } }).data?.pKnown ?? 0;
    }

    const sid1 = '11111111-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const sid2 = '22222222-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
    const p1 = await transcript(sid1);
    const p2 = await transcript(sid2);
    expect(Math.abs(p1 - p2)).toBeLessThan(1e-9);
  });
});