# Plan C2 — Real inter-service call (svc-bkt ↔ stub svc-class)

This document captures the C2 progression on top of C1 (svc-bkt solo).

## Goal

Validate that `svc-bkt` can actually discover and call another service
(`svc-class`) at runtime using:

1. **Real Consul** (not mocked) for service discovery
2. **Real opossum circuit breaker** (not mocked)
3. **Real HTTP** through Node's `http` module — the call crosses a
   TCP socket, no in-process shortcuts

## What C2 adds vs. C1

| Layer | Plan C1 | Plan C2 |
|-------|---------|---------|
| Consul discovery | mocked (`vi.mock('@verveai/consul-client')`) | **real** Consul 1.15 in Docker |
| Circuit breaker | mocked (`vi.mock('@verveai/circuit-breaker')`) | **real** opossum |
| HTTP transport | supertest in-process | **real** TCP server in the test |
| Prisma | in-memory mock | in-memory mock (unchanged) |

## Pre-requisites for running C2

1. **Consul must be reachable** at `CONSUL_HOST:CONSUL_PORT` (defaults
   to `localhost:8500`). The test skips itself gracefully if Consul is
   not reachable, so it never breaks CI environments without Consul.
2. Start Consul for local dev:

   ```bash
   docker run -d --name consul-c2 -p 8500:8500 consul:1.15
   ```

3. To force-skip the suite even when Consul is running (e.g. in CI
   that intentionally avoids network calls):

   ```bash
   VERVEAI_SKIP_C2=1 pnpm --filter @verveai/service-bkt test:integration
   ```

## What the test boots

```
+-------------------+      register       +-------------------+
|     Consul 1.15   | <-----------------  |  stub svc-class   |
|  (Docker, :8500)  | ----------------->  | (in-process Node) |
+--------+----------+      resolve        +---------+---------+
         ^                                          ^
         |            resolve('svc-class')          |
         |  +--------------------------------------+|
         |  |                                       |
+--------+--+-----------+        fire(path)  +------+---------+
|   diagnosis.service   | -----------------> | classMembers... |
|   (real svc-bkt code) |                    | (real CB, no mock)|
+-----------------------+                    +-----------------+
```

## Test cases

1. **Skip safely** when Consul is not reachable.
2. **Consul.resolve** returns the URL the stub registered with
   `host=127.0.0.1`.
3. **Happy path**: `GET /api/bkt/diagnosis/class/:id` actually calls
   `/api/class/classes/:id/students` on the stub and assembles a
   response from the in-memory Prisma store.
4. **Graceful degradation on 5xx**: stub returns 500 → svc-bkt
   returns `[]`, the call still completes, no unhandled error leaks.
5. **Graceful degradation on connection refused**: stub drops the
   connection → svc-bkt returns `[]`.
6. **Circuit breaker opens**: 12 consecutive 5xx responses → the
   13th call fast-fails (≤ 20 ms) because the opossum breaker rejects
   without invoking the wrapped fetch.

## Why this matters

The C1 unit + e2e suite already proved that:

- The BKT engine is deterministic (same transcript → same P(L)).
- The HTTP API behaves correctly under various payloads.
- The FR-17 override flow produces a correct audit trail.

What C1 **did not** prove:

- That `Consul.resolve()` actually understands Consul's catalog
  response format. (C2 caught a real bug here: the previous code
  read `service.Port` while Consul ≥ 1.0 returns `service.ServicePort`
  — silently producing `http://host:undefined`.)
- That the opossum circuit breaker actually trips after enough
  failures, instead of always waiting for the timeout.

C2 proves both.

## Files touched by C2

| File | Purpose |
|------|---------|
| `service/shared/consul-client/src/index.ts` | Fix `resolve()` to read `ServicePort` / `ServiceAddress` (with fallback to legacy names). |
| `service/service-bkt/tests/integration/c2-inter-service.test.ts` | The C2 integration suite (6 tests). |

## Running the full suite

```bash
# Unit + e2e (mocks everything, fast)
cd service/service-bkt && npm run test:unit     # 106 tests, ~2 s

# Integration + smoke + e2e (uses real Consul for C2)
npm run test:integration                        # 77 tests, ~2 s

# Full coverage report
npm run test:cov
```

## Known limitations of C2

- The stub svc-class is in-process, not a real Node service.
- Health-check critical status from Consul does not influence
  resolve() — we use the catalog endpoint which returns all
  instances regardless of health.
- We do not exercise Consul's multi-instance load balancing; only
  one instance of `svc-class` is registered.

These can be added in C3 (Docker Compose stack) where multiple
service instances will run in real containers.