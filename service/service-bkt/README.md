# svc-bkt - BKT Service

Bayesian Knowledge Tracing service for VERVEAI.

## Overview

- **Port:** 3002
- **Schema:** bkt
- **Responsibility:** BKT engine, Diagnosis, Evidence, Interventions, Skills

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /ready | Readiness check |
| GET | /metrics | Prometheus metrics |
| POST | /api/bkt/diagnosis/run | Run BKT diagnosis |
| POST | /api/bkt/diagnosis/batch | Batch diagnosis |
| GET | /api/bkt/diagnosis/student/:id | Get student diagnoses |
| GET | /api/bkt/diagnosis/class/:id | Get class diagnoses |
| GET | /api/bkt/interventions | Get all interventions |
| GET | /api/bkt/interventions/class/:id | Get class interventions |
| GET | /api/bkt/interventions/:id | Get intervention |
| PUT | /api/bkt/interventions/:id | Update intervention |
| PUT | /api/bkt/interventions/:id/override | Teacher override |
| POST | /api/bkt/interventions/:id/note | Add intervention note |
| POST | /api/bkt/interventions/:id/resolve | Resolve intervention |
| GET | /api/bkt/skills | Get all skills |
| GET | /api/bkt/skills/:id | Get skill |
| GET | /api/bkt/skills/tree | Get skill tree |
| GET | /api/bkt/skills/:id/prerequisites | Get skill prerequisites |
| POST | /api/bkt/evidence | Record evidence |
| GET | /api/bkt/evidence/:id | Get evidence |
| GET | /api/bkt/evidence/:id/chain | Get evidence chain |
| GET | /api/bkt/evidence/student/:id | Get student evidence |

## Development

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Start development server
pnpm dev

# Run tests
pnpm test

# Build
pnpm build
```

## Environment Variables

See `.env.example` for configuration.
