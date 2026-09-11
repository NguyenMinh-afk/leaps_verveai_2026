# @verveai/prisma-schema

Canonical multi-schema Prisma definition for the VERVEAI microservice backend.

This package owns **one** `schema.prisma` file that defines all five logical
schemas (`auth`, `bkt`, `class`, `content`, `sync`) against a single shared
PostgreSQL database. Each microservice then imports the canonical schema and
generates a Prisma client scoped to its own subset.

## Why one schema, five logical schemas?

PostgreSQL's `SCHEMA` namespace lets us keep a single physical database while
enforcing clean ownership boundaries between services:

| Schema | Owner | Service |
| --- | --- | --- |
| `auth` | Dev 1 | `service/service-auth` (port 3001) |
| `bkt` | Dev 2 | `service/service-bkt` (port 3002) |
| `class` | Dev 3 | `service/service-class` (port 3003) |
| `content` | Dev 1 | `service/service-content` (port 3004) |
| `sync` | Dev 3 | `service/service-sync` (port 3005) |

Benefits:

1. **Single migration source of truth** — one file means cross-service
   dependencies (e.g. `bkt.diagnosis` referencing `class.student`) stay in sync.
2. **No data duplication** — services share physical storage but each only ever
   generates a client for the models it owns (plus any cross-schema FKs it
   needs).
3. **Local development parity** — `pnpm dev` brings up one Postgres container
   with all five schemas prefilled.

## How each service imports the schema

Each service keeps a *thin* `prisma/schema.prisma` whose only job is to filter
the canonical file down to its own schema plus any cross-schema relations it
needs:

```prisma
// service/service-auth/prisma/schema.prisma
generator client { provider = "prisma-client-js" }
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["auth"]
}
// ... `user`, `session`, `refresh_token`, `teacher_class`, `teacher_note` ...
```

In CI/local builds, the canonical file is **synced** into each service's
`prisma/schema.prisma` by `scripts/sync-prisma-schemas.ts` (see
`infra/scripts/`). The canonical `schema.prisma` in this package remains the
single source of truth.

## Layout (current)

- `schema.prisma` — canonical definition for all five schemas.
- `seed.ts` — TypeScript seed that creates 1 admin + 1 teacher user (used by
  `service-auth` dev environment).
- `package.json` + `tsconfig.json` — build metadata; no runtime deps.

## Migration strategy

1. **Centralized migrations** — `database/migrations/` owns all migrations.
   Run `pnpm prisma migrate dev` from the repo root after editing
   `schema.prisma`.
2. **Single apply per schema-set** — services share one Postgres instance, so a
   migration touches all five schemas in one transaction.
3. **Backwards-compatible first** — never drop or rename a column without an
   `// ADR` comment and a multi-step migration.
4. **Per-service client regeneration** — after each migration, every service
   runs `prisma generate` to refresh its client.

## Conventions (enforced in `schema.prisma`)

- `PascalCase` model names; `snake_case` table names via `@@map`.
- UUID primary keys (`@default(uuid())`).
- `created_at` and `updated_at` on every mutable model.
- All relations use explicit `onDelete` (`Cascade` for owned entities,
  `Restrict` for cross-service references).
- All foreign keys get a matching `@@index`.

## Seed

```bash
# From a service-auth working directory
pnpm exec tsx ../../shared/prisma-schema/seed.ts
```

Default dev credentials:

| Email | Role | Password |
| --- | --- | --- |
| `admin@verveai.local` | ADMIN | `Admin@123` |
| `teacher@verveai.local` | TEACHER | `Teacher@123` |

> ⚠️ **Never use these credentials outside local development.**

## Related

- ADR-0004 Microservices Architecture
- `service/WORK_SPLIT.md`
- `docs/02-architecture/adr/0004-microservices-architecture.md`
