# VERVEAI svc-bkt

Bayesian Knowledge Tracing engine service (port **3002**).

## Responsibility (per WORK_SPLIT.md)

- **Diagnosis** — run / batch BKT update; fetch per-student / per-class.
- **Evidence** — record a single item response; fetch by id / by student / chain.
- **Interventions** — list / get / update / teacher override (FR-17) / note / resolve.
- **Skills** — flat list, by id, prerequisite tree.

## Stack

- Node.js ≥ 20, TypeScript ≥ 5.0 strict
- Express 4, Prisma 5 (multi-schema, `bkt` only)
- Zod validation, Winston logging, prom-client metrics
- `@verveai/error-types`, `@verveai/circuit-breaker`, `@verveai/consul-client`, `@verveai/tracing`

## Engine — `src/engine/bkt.ts`

Pure functions implementing the standard 4-parameter BKT update
(Corbalan et al., 2010). All entry points are deterministic — same
input always produces the same output, satisfying **TS-07**.

Defaults (per BA v1.4.5 § FR-06):

| Param | Meaning               | Default |
| ----- | --------------------- | ------- |
| P_L0  | Initial P(known)      | 0.10    |
| P_T   | Transition (learning) | 0.10    |
| P_G   | Guess                 | 0.20    |
| P_S   | Slip                  | 0.10    |

## Endpoints

See `src/routes/*.routes.ts` for the full list. All requests are
expected to arrive via Gateway (`http://gateway:8080/api/bkt/...`) and
include `X-User-Id`, `X-User-Role`, `X-Request-Id` headers.

## Run

```bash
pnpm install
pnpm db:generate
pnpm dev        # tsx watch src/index.ts
pnpm test       # vitest
```

## Tests

The test suite is split into three configurations so coverage and runtime
stay cheap:

| Script                | Includes                                          | Count |
| --------------------- | ------------------------------------------------- | ----- |
| `pnpm test:unit`      | unit + E2E (for coverage)                         | 106   |
| `pnpm test:integration` | service-level integration + E2E                  | 62    |
| `pnpm test:smoke`     | live HTTP smoke (boots Express on real port) + demo | 14    |

The smoke test boots the Express app on `port 0` (OS-picked) and
exercises every documented endpoint via Node's `fetch`. It also
includes a `tests/smoke/full-flow-demo.smoke.ts` walkthrough that
prints a per-step trace of the BKT happy path (run → evidence →
chain → override → resolve).

## Coverage

Per `07-testing.mdc` — services 80 %, routes 70 %, middleware 90 %.
CI gate enforced via `vitest.config.ts` thresholds. Current values:

| Metric     | Value | Threshold |
| ---------- | ----- | --------- |
| Lines      | 84 %  | ≥ 80 %    |
| Functions  | 88 %  | ≥ 80 %    |
| Statements | 84 %  | ≥ 80 %    |
| Branches   | 73 %  | ≥ 70 %    |
