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

## Coverage

Per `07-testing.mdc` — services 80 %, routes 70 %, middleware 90 %.
CI gate enforced via `vitest.config.ts` thresholds.
