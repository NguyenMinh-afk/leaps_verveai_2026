# Plan C3 — Real infrastructure: Consul + Postgres + real svc-class

This document captures the C3 progression on top of C1 and C2:

| Plan | What was real |
|------|---------------|
| C1   | nothing — everything mocked (svc-bkt solo) |
| C2   | Consul + opossum circuit breaker (svc-class was an in-process stub) |
| C3   | everything — real Postgres + real Consul + real svc-class running as a separate Node process |

The suite in `tests/integration/c2-inter-service.test.ts` (kept under
the same filename for git history, even though it's now C3) hits:

- real `svc-class` over real TCP, registered with real Consul
- real Postgres via real Prisma (data seeded by `c3-seed.sql` + `prisma/seed-c3.ts`)
- real opossum circuit breaker — failures trip it for real
- real graceful degradation when svc-class is unreachable

The only mocks left are the winston logger (so test output stays clean).

## Pre-requisites

Three things must be running before `npm run test:integration`:

1. **Consul** on `:8500`
   ```bash
   docker run -d --name consul-c3 -p 8500:8500 consul:1.15
   ```

2. **Postgres 15** on `:5432`
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
`scripts/c3-up.sh` for the canonical sequence).

## Running the suite

```bash
cd service/service-bkt
DATABASE_URL='postgresql://verveai:verveai_c3_pass@127.0.0.1:5432/verveai?schema=bkt' \
  npm run test:integration
```

The C3 file skips itself gracefully (a single log line per run) when any
of Consul / Postgres / svc-class is not reachable, so it never breaks CI
environments that don't have the full infra. To force-skip:

```bash
VERVEAI_SKIP_C3=1 npm run test:integration
```

## Stable IDs (what the seed inserts)

| Entity | UUID |
|--------|------|
| CLASS_ID    | `c3000000-0000-4000-8000-000000000001` |
| STUDENT_A   | `c3000000-0000-4000-8000-0000000000aa` |
| STUDENT_B   | `c3000000-0000-4000-8000-0000000000bb` |
| SKILL_ID    | `c3000000-0000-4000-8000-0000000000cc` |
| DIAGNOSIS_A | `c3000000-0000-4000-8000-0000000000d1` (p_known=0.65, DIAGNOSED) |
| DIAGNOSIS_B | `c3000000-0000-4000-8000-0000000000d2` (p_known=0.85, MASTERED) |

These are intentionally UUID-shaped so that the service-bkt routes accept
them directly without any test-time wizardry.

## The 6 tests

1. **reports infrastructure availability** — sanity check that Consul,
   Postgres, and svc-class all reply. Skips otherwise.
2. **Consul.resolve returns the URL of the real process** — proves the
   shared consul-client's `ServicePort`/`ServiceAddress` fix from C2
   still works against a running process.
3. **GET /api/bkt/diagnosis/class/:id returns the seeded diagnoses for
   both students** — the headline test. svc-class returns the two
   student IDs; svc-bkt's real Prisma reads the two seeded diagnoses;
   the HTTP response carries the same `pKnown` and `status` values we
   put into the database. **No mocks anywhere in this path.**
4. **returns empty list when svc-class returns 5xx** — the suite starts
   an in-process sibling that always responds 500, swaps Consul's catalog
   entry so svc-class resolves to it, exercises the breaker, then puts
   the real registration back.
5. **returns empty list when svc-class is unreachable** — similar to #4
   but the sibling closes the socket mid-connection.
6. **circuit breaker opens after repeated failures** — 12 consecutive
   5xx, then the 13th call must complete in ≤ 20 ms because opossum
   fast-fails.

Tests #4–#6 use a swap helper that talks to Consul's raw
`/v1/agent/service/{register,deregister}` endpoints so the catalog ends
up with exactly one entry after each test — important so subsequent
test runs don't accumulate stale registrations.

## Why this matters

C3 is the first time we run the full E2E slice:

```
        ┌─────────────────────────────────────────────┐
        │  Service-bkt (in-process test)              │
        │  ─ Real Prisma → real Postgres (bkt schema) │
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
- The new `GET /api/class/classes/:id/students` route returns the
  envelope svc-bkt's `diagnosis.service` expects.
- Real Postgres migrations on two schemas (`class` and `bkt`) coexist in
  a single database instance.
- The cross-service data flow — `svc-class → Consul discovery → real
  HTTP → svc-bkt's breaker → real Prisma read` — completes in well
  under a second end-to-end.
- Failure modes (5xx, connection refused, repeated failures) all
  degrade gracefully without unhandled errors or test fixtures
  leaking into Consul's catalog.

## Cleanup / reset

```bash
# Wipe Consul registrations
curl -s -X PUT http://localhost:8500/v1/agent/service/deregister/svc-class-3003

# Wipe Postgres data
PGPASSWORD=verveai_c3_pass psql -h localhost -U verveai -d verveai \
  -c "TRUNCATE class.enrollments, class.students, class.classes CASCADE;"
PGPASSWORD=verveai_c3_pass psql -h localhost -U verveai -d verveai \
  -c "TRUNCATE bkt.diagnoses, bkt.skills, bkt.evidence_items, bkt.interventions, bkt.intervention_notes CASCADE;"

# Stop everything
docker rm -f consul-c3 verveai-pg-c3
pkill -f "tsx src/index.ts"
```

`scripts/c3-up.sh` automates the bring-up; `scripts/c3-down.sh` the
teardown.