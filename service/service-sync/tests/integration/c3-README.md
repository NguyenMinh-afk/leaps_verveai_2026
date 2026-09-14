# Plan C3 — Real infrastructure: Consul + Postgres + real svc-class (conflict E2E)

This document captures the C3 progression for `service-sync`, mirroring
the canonical reference at `service/service-bkt/tests/integration/c3-README.md`.

| Plan | What was real |
|------|---------------|
| C1   | nothing — everything mocked (svc-sync solo) |
| C2   | (skipped — promoted straight to C3 once the shared `consul-client` fix landed) |
| C3   | everything — real Postgres + real Consul + real svc-class running as a separate Node process |

The suite in `tests/integration/c3-conflict-e2e.test.ts` hits:

- real `svc-class` over real TCP, registered with real Consul
- real Postgres via real Prisma (data seeded by `c3-seed.sql`)
- real opossum circuit breaker (registered with `svc-class` through Consul)
- real graceful degradation when svc-class is unreachable

The only mocks left are the winston logger (so test output stays clean).

## Pre-requisites

Three things must be running before `npm run test:integration`:

1. **Consul** on `:8500`
   ```bash
   docker run -d --name consul-c3 -p 8500:8500 consul:1.15
   ```

2. **Postgres 15** on `:5432**
   ```bash
   docker run -d --name verveai-pg-c3 -p 5432:5432 \
     -e POSTGRES_USER=verveai \
     -e POSTGRES_PASSWORD=verveai_c3_pass \
     -e POSTGRES_DB=verveai \
     postgres:15
   ```

3. **`svc-class`** running on `:3003` (separate Node process)
   ```bash
   cd service/service-class
   DATABASE_URL='postgresql://verveai:verveai_c3_pass@localhost:5432/verveai?schema=class' \
   PORT=3003 SERVICE_NAME=svc-class SERVICE_PORT=3003 \
   CONSUL_HOST=localhost CONSUL_PORT=8500 LOG_LEVEL=info \
     npx tsx src/index.ts
   ```

Both services' migrations and the C3 seed data must be present (see
`scripts/c3-up.sh` for the canonical sequence — it now creates the
`sync` schema and runs `service-sync/tests/integration/c3-seed.sql`).

## Running the suite

```bash
cd service/service-sync
DATABASE_URL='postgresql://verveai:verveai_c3_pass@127.0.0.1:5432/verveai?schema=sync' \
  npm run test:integration
```

The C3 file skips itself gracefully (a single log line per run) when any
of Consul / Postgres / svc-class is not reachable, so it never breaks CI
environments that don't have the full infra. To force-skip:

```bash
VERVEAI_SKIP_C3=1 npm run test:integration
```

## Stable IDs (what the seed inserts)

| Entity      | UUID |
|-------------|------|
| `DEVICE_A`    | `c3000000-0000-4000-8000-0000000000e1` (TABLET) |
| `DEVICE_B`    | `c3000000-0000-4000-8000-0000000000e2` (WINDOWS) |
| `CONFLICT_1`  | `c3000000-0000-4000-8000-0000000000f1` (PENDING — evidence) |
| `CONFLICT_2`  | `c3000000-0000-4000-8000-0000000000f2` (PENDING — student) |
| `CONFLICT_3`  | `c3000000-0000-4000-8000-0000000000f3` (RESOLVED — SERVER_WINS) |

These are intentionally UUID-shaped so that the service-sync routes accept
them directly without any test-time wizardry.

## The 12 tests

1. **reports infrastructure availability** — sanity check that Consul,
   Postgres, and svc-class all reply. Skips otherwise.
2. **Consul.resolve returns the URL of the real process** — proves the
   shared consul-client's `ServicePort`/`ServiceAddress` fix still works
   against a running process.
3. **GET /api/sync/conflicts?resolved=false returns the seeded PENDING
   conflicts** — the headline test. Two seeded PENDING conflicts appear;
   the already-RESOLVED one does not.
4. **GET /api/sync/conflicts?resolved=true returns only resolved
   conflicts** — confirms the `resolved_at: { not: null }` filter.
5. **GET /api/sync/conflicts?deviceId=… filters by device** — confirms
   the device filter works against real Prisma.
6. **POST /api/sync/conflicts/:id/resolve transitions a PENDING conflict
   to RESOLVED** — write-path test. Verifies both the HTTP response
   shape AND the database row.
7. **POST resolve on an already-resolved conflict returns 400** —
   exercises the `Conflict already resolved` validation branch.
8. **POST resolve on unknown conflict returns 404** — exercises the
   `NotFoundError` branch.
9. **end-to-end conflict lifecycle: detect → list → resolve → verify** —
   inserts a fresh conflict via Prisma (mirroring what the real sync
   push flow does), lists it, resolves it, verifies in DB, cleans up.
10. **returns 200 when svc-class is reachable but unhealthy** — swap
    Consul's catalog entry so svc-class resolves to a sibling that
    always 500s; confirm the read path stays intact (degrades
    gracefully).
11. **handles malformed resolve payload with 400** — invalid
    `resolution: 'INVALID_STRATEGY'` fails zod validation.
12. **rejects non-UUID conflict id with 400** — `conflictIdParamSchema`
    zod path validation.

## Why this matters

C3 is the first time we run the full E2E slice for the conflict domain:

```
        ┌─────────────────────────────────────────────┐
        │  Service-sync (in-process test)             │
        │  ─ Real Prisma → real Postgres (sync schema) │
        │  ─ Real Consul → svc-class                   │
        │  ─ Real opossum circuit breaker             │
        └────────────────────┬────────────────────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │  Consul agent (Docker) │
                └────────────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────────────┐
        │  Service-class (separate Node process)     │
        │  ─ Real Express HTTP                       │
        │  ─ Real Prisma → real Postgres (class schema) │
        │  ─ Registered with Consul                  │
        └─────────────────────────────────────────────┘
```

What C3 proves:

- The shared `consul-client` package works end-to-end against a real
  Consul agent in Docker.
- Real Postgres migrations on three schemas (`class`, `bkt`, `sync`)
  coexist in a single database instance.
- The conflict resolution flow — Prisma read → Express route →
  Prisma write → HTTP response — completes end-to-end with no mocks.
- Validation errors surface as proper HTTP 400/404 responses through
  the shared `error-types` package.
- The cross-service read path stays intact when svc-class is
  unhealthy (graceful degradation).

## Cleanup / reset

```bash
# Wipe Consul registrations
curl -s -X PUT http://localhost:8500/v1/agent/service/deregister/svc-class-3003

# Wipe Postgres data (keeps schema)
PGPASSWORD=verveai_c3_pass psql -h localhost -U verveai -d verveai \
  -c "TRUNCATE sync.sync_conflicts, sync.sync_logs, sync.student_transfers, sync.devices CASCADE;"

# Stop everything
docker rm -f consul-c3 verveai-pg-c3
pkill -f "tsx src/index.ts"
```

`scripts/c3-up.sh` automates the bring-up; `scripts/c3-down.sh` the
teardown.
