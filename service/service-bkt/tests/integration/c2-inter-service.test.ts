/**
 * Plan C3 — Real inter-service test with real svc-class + real Postgres.
 *
 * Progression:
 *   C1 (svc-bkt solo, all mocks)
 *   → C2 (real Consul + real CB, stub svc-class)
 *   → C3 (everything real, including real Postgres + real svc-class)
 *
 * Pre-requisites (set up by the developer / CI):
 *   1. A real Consul agent at CONSUL_HOST:CONSUL_PORT.
 *      docker run -d --name consul-c2 -p 8500:8500 consul:1.15
 *   2. A real Postgres 15 at the DATABASE_URL.
 *      docker run -d --name verveai-pg-c3 -p 5432:5432 \
 *        -e POSTGRES_USER=verveai -e POSTGRES_PASSWORD=verveai_c3_pass \
 *        -e POSTGRES_DB=verveai postgres:15
 *   3. Migrations + seed for both services:
 *      cd service/service-class
 *        DATABASE_URL='postgresql://verveai:verveai_c3_pass@localhost:5432/verveai?schema=class' \
 *          npx prisma migrate deploy
 *        DATABASE_URL='...schema=class' npx tsx prisma/seed-c3.ts
 *      cd service/service-bkt
 *        DATABASE_URL='...schema=bkt' npx prisma migrate deploy
 *        # Then insert the skill + diagnoses via the seed-c3.sql script
 *        # in `tests/integration/c3-seed.sql`.
 *   4. svc-class running in another shell:
 *      cd service/service-class
 *        DATABASE_URL='...schema=class' PORT=3003 SERVICE_NAME=svc-class \
 *          SERVICE_PORT=3003 CONSUL_HOST=localhost CONSUL_PORT=8500 \
 *          LOG_LEVEL=info npx tsx src/index.ts
 *
 * Skip the suite: VERVEAI_SKIP_C3=1 ...
 *
 * No mocks for Consul / circuit breaker / Prisma / svc-class.
 * Logger is mocked (output silenced).
 */

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import http from 'node:http';
import type { AddressInfo } from 'node:net';

// ── Environment — must be set BEFORE any service code is imported ────────────
const SHOULD_SKIP = process.env['VERVEAI_SKIP_C3'] === '1';
const CONSUL_HOST = process.env['CONSUL_HOST'] ?? 'localhost';
const CONSUL_PORT = Number.parseInt(process.env['CONSUL_PORT'] ?? '8500', 10);

// Real DATABASE_URL pointing at the C3 Postgres container. Schema `bkt`.
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] =
  process.env['DATABASE_URL'] ??
  'postgresql://verveai:verveai_c3_pass@127.0.0.1:5432/verveai?schema=bkt';
process.env['PORT'] = '3002';
process.env['SERVICE_NAME'] = 'svc-bkt';
process.env['SERVICE_PORT'] = '3002';
process.env['LOG_LEVEL'] = 'silent';
process.env['CONSUL_HOST'] = CONSUL_HOST;
process.env['CONSUL_PORT'] = String(CONSUL_PORT);
process.env['OTEL_SERVICE_NAME'] = 'svc-bkt-c3';

// ── Logger silenced — keeps test output readable ────────────────────────────
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

// ── Real imports — NO mocks for Consul / circuit breaker / Prisma ───────────
import { Consul } from '@verveai/consul-client';
import { createApp } from '../../src/app.js';
import { prisma, disconnectPrisma } from '../../src/prisma/client.js';
import type { Express } from 'express';

// ── Stable UUIDs — match what the C3 seed inserted ──────────────────────────
const CLASS_ID = 'c3000000-0000-4000-8000-000000000001';
const STUDENT_A = 'c3000000-0000-4000-8000-0000000000aa';
const STUDENT_B = 'c3000000-0000-4000-8000-0000000000bb';
const SKILL_ID = 'c3000000-0000-4000-8000-0000000000cc';
const DIAG_A = 'c3000000-0000-4000-8000-0000000000d1';
const DIAG_B = 'c3000000-0000-4000-8000-0000000000d2';
const REAL_SVC_CLASS_ID = 'svc-class-3003';

// ── Infrastructure reachability checks ──────────────────────────────────────
async function isConsulReachable(): Promise<boolean> {
  try {
    const res = await fetch(`http://${CONSUL_HOST}:${CONSUL_PORT}/v1/status/leader`, {
      signal: AbortSignal.timeout(1000)
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function isPostgresReachable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

async function isSvcClassReachable(): Promise<boolean> {
  try {
    const url = await Consul.resolve('svc-class');
    const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

let app: Express;
let consulReachable = false;
let postgresReachable = false;
let svcClassReachable = false;

beforeAll(async () => {
  if (SHOULD_SKIP) return;

  consulReachable = await isConsulReachable();
  postgresReachable = await isPostgresReachable();
  if (consulReachable && postgresReachable) {
    svcClassReachable = await isSvcClassReachable();
  }

  // Build the real svc-bkt Express app even on skip so static checks pass.
  app = createApp({ minimal: true });
});

afterAll(async () => {
  if (SHOULD_SKIP) return;
  // Do NOT deregister svc-class — it was registered by the running process.
  await disconnectPrisma();
});

// ── Helpers ────────────────────────────────────────────────────────────────
function fetchViaHttp(expressApp: Express, path: string): Promise<Response> {
  return new Promise((resolve, reject) => {
    const server = expressApp.listen(0, '127.0.0.1', () => {
      const addr = server.address() as AddressInfo | null;
      if (addr === null) {
        reject(new Error('listen failed'));
        return;
      }
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: addr.port,
          path,
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (c: Buffer) => chunks.push(c));
          res.on('end', () => {
            const body = Buffer.concat(chunks).toString('utf8');
            const response = new Response(body, {
              status: res.statusCode ?? 500,
              headers: res.headers as HeadersInit
            });
            server.close();
            resolve(response);
          });
        }
      );
      req.on('error', (err) => {
        server.close();
        reject(err);
      });
      req.end();
    });
    server.on('error', reject);
  });
}

/**
 * Replace the Consul registration of `svc-class` with a sibling we control
 * in-process, then put the original registration back when the caller is
 * done. Uses the raw Consul agent API so the swap is atomic — Consul's
 * `/v1/catalog/service/:name` returns instances in registration order, so
 * we drop the real entry FIRST and then register the sibling. The running
 * svc-class process is unaffected — only Consul's catalog entry is moved.
 */
async function swapSvcClassWithSibling(
  siblingServer: http.Server
): Promise<{ restore: () => Promise<void>; siblingPort: number }> {
  const siblingPort = (siblingServer.address() as AddressInfo).port;
  const siblingId = `svc-class-${siblingPort}`;

  // 1. Drop the real svc-class entry directly via the agent API. Using
  //    `/v1/agent/service/deregister/:id` is more reliable than going
  //    through the shared Consul client's local `serviceId` field,
  //    which may be stale from previous registrations in this process.
  await rawConsulDeregister('svc-class-3003');

  // 2. Register the sibling under the canonical `svc-class` name + ID.
  //    Using the same serviceId as the real one (svc-class-3003) is OK
  //    because we just deregistered it.
  await Consul.register({
    name: 'svc-class',
    port: siblingPort,
    host: '127.0.0.1',
    healthCheck: '/health'
  });

  // 3. Brief settle so Consul propagates the catalog change to readers.
  await new Promise((r) => setTimeout(r, 300));

  return {
    siblingPort,
    restore: async (): Promise<void> => {
      // Drop BOTH the sibling (with its port-based ID) AND the canonical
      // svc-class-3003 entry, so we end with exactly one registration.
      await rawConsulDeregister(siblingId);
      await rawConsulDeregister('svc-class-3003');
      await rawConsulRegister({
        id: 'svc-class-3003',
        name: 'svc-class',
        address: '127.0.0.1',
        port: 3003,
        tags: ['class', 'v1', 'microservice']
      });
      await new Promise((r) => setTimeout(r, 300));
    }
  };
}

/** Raw Consul HTTP API — bypasses the shared client's local state. */
async function rawConsulDeregister(id: string): Promise<void> {
  const url = `http://${CONSUL_HOST}:${CONSUL_PORT}/v1/agent/service/deregister/${id}`;
  await fetch(url, { method: 'PUT' });
}

async function rawConsulRegister(input: {
  id: string;
  name: string;
  address: string;
  port: number;
  tags: string[];
}): Promise<void> {
  const url = `http://${CONSUL_HOST}:${CONSUL_PORT}/v1/agent/service/register`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ID: input.id,
      Name: input.name,
      Address: input.address,
      Port: input.port,
      Tags: input.tags,
      Check: {
        HTTP: `http://${input.address}:${input.port}/health`,
        Interval: '10s'
      }
    })
  });
}

function startSiblingServer(
  handler: (req: http.IncomingMessage, res: http.ServerResponse) => void
): Promise<http.Server> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(handler);
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function stopServer(server: http.Server): Promise<void> {
  return new Promise((resolve) => server.close(() => resolve()));
}

const skipReason = (): string => {
  if (SHOULD_SKIP) return 'VERVEAI_SKIP_C3=1 set';
  if (!consulReachable) return 'Consul not reachable';
  if (!postgresReachable) return 'Postgres not reachable';
  if (!svcClassReachable) return 'svc-class not reachable';
  return '';
};

// Debug helper — logs once at most so the test output stays clean.
let _skipLogged = false;
function logSkipOnce(): void {
  if (_skipLogged) return;
  const reason = skipReason();
  if (reason !== '') {
    // eslint-disable-next-line no-console
    console.log(`[C3] Skipping tests — ${reason}`);
    _skipLogged = true;
  }
}

describe('C3: end-to-end real infrastructure (Consul + Postgres + svc-class)', () => {
  it('reports infrastructure availability', () => {
    const reason = skipReason();
    if (reason !== '') {
      expect(reason).toBeTruthy();
      return;
    }
    expect(consulReachable).toBe(true);
    expect(postgresReachable).toBe(true);
    expect(svcClassReachable).toBe(true);
  });

  it('Consul.resolve("svc-class") returns the URL where the real process listens', async () => {
    if (skipReason() !== '') { logSkipOnce(); return; }
    const url = await Consul.resolve('svc-class');
    expect(url).toMatch(/^http:\/\/[^:]+:\d+$/);
    // Sanity: the URL must actually serve /health right now.
    const res = await fetch(`${url}/health`);
    expect(res.ok).toBe(true);
  });

  it('GET /api/bkt/diagnosis/class/:id returns the seeded diagnoses for both students', async () => {
    if (skipReason() !== '') { logSkipOnce(); return; }

    const response = await fetchViaHttp(app, `/api/bkt/diagnosis/class/${CLASS_ID}`);
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      success: boolean;
      data: Array<{
        id: string;
        studentId: string;
        skillId: string;
        pKnown: number;
        status: string;
      }>;
    };
    expect(body.success).toBe(true);

    // svc-class returns students A and B; svc-bkt should return 2 diagnoses
    // for those two students + the seeded skill.
    expect(body.data).toHaveLength(2);

    const studentIds = body.data.map((d) => d.studentId).sort();
    expect(studentIds).toEqual([STUDENT_A, STUDENT_B].sort());

    const ids = body.data.map((d) => d.id).sort();
    expect(ids).toContain(DIAG_A);
    expect(ids).toContain(DIAG_B);

    // Real Prisma read returns the values we seeded.
    const diagA = body.data.find((d) => d.id === DIAG_A);
    const diagB = body.data.find((d) => d.id === DIAG_B);
    expect(diagA?.pKnown).toBeCloseTo(0.65, 5);
    expect(diagB?.pKnown).toBeCloseTo(0.85, 5);
    expect(diagA?.status).toBe('DIAGNOSED');
    expect(diagB?.status).toBe('MASTERED');
    expect(diagA?.skillId).toBe(SKILL_ID);
    expect(diagB?.skillId).toBe(SKILL_ID);
  });

  it('returns empty list when svc-class returns 5xx — graceful degradation', async () => {
    if (skipReason() !== '') { logSkipOnce(); return; }

    // Swap the catalog registration so Consul routes svc-class calls to
    // our in-process sibling that always returns 500.
    const sibling = await startSiblingServer((req, res) => {
      if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
      }
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'sibling-fail' }));
    });

    const swap = await swapSvcClassWithSibling(sibling);
    try {
      const response = await fetchViaHttp(app, `/api/bkt/diagnosis/class/${CLASS_ID}`);
      expect(response.status).toBe(200);
      const body = (await response.json()) as { success: boolean; data: unknown[] };
      expect(body.success).toBe(true);
      expect(body.data).toEqual([]);
    } finally {
      await swap.restore();
      await stopServer(sibling);
    }
  });

  it('returns empty list when svc-class is unreachable — graceful degradation', async () => {
    if (skipReason() !== '') { logSkipOnce(); return; }

    // Swap the catalog registration to a port that accepts and immediately
    // closes the socket, so every fetch on `Consul.resolve('svc-class')`
    // results in ECONNREFUSED.
    const sibling = await startSiblingServer((_req, res) => {
      // Destroy the socket immediately — fetch sees a hang-then-error.
      res.destroy();
    });
    const swap = await swapSvcClassWithSibling(sibling);
    try {
      const response = await fetchViaHttp(app, `/api/bkt/diagnosis/class/${CLASS_ID}`);
      expect(response.status).toBe(200);
      const body = (await response.json()) as { data: unknown[] };
      expect(body.data).toEqual([]);
    } finally {
      await swap.restore();
      await stopServer(sibling);
    }
  });

  it('circuit breaker opens after repeated failures — next call rejects fast', async () => {
    if (skipReason() !== '') { logSkipOnce(); return; }

    const sibling = await startSiblingServer((req, res) => {
      if (req.url === '/health') {
        res.writeHead(200); res.end('ok'); return;
      }
      res.writeHead(500); res.end('fail');
    });
    const swap = await swapSvcClassWithSibling(sibling);
    try {
      // 12 consecutive 5xx responses — breaker opens after ~10.
      for (let i = 0; i < 12; i++) {
        const r = await fetchViaHttp(app, `/api/bkt/diagnosis/class/${CLASS_ID}`);
        expect(r.status).toBe(200);
      }

      // Subsequent call should fast-fail (opossum rejects without fetch).
      const t0 = Date.now();
      const r = await fetchViaHttp(app, `/api/bkt/diagnosis/class/${CLASS_ID}`);
      const elapsed = Date.now() - t0;
      expect(r.status).toBe(200);
      expect(elapsed).toBeLessThanOrEqual(20);
    } finally {
      await swap.restore();
      await stopServer(sibling);
    }
  });
});
