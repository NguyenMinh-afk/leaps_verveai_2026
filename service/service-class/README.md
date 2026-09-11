# svc-class - Class Service

Class and Student management service for VERVEAI.

## Overview

- **Port:** 3003
- **Schema:** class
- **Responsibility:** Classes, Students, Progress management

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /ready | Readiness check |
| GET | /metrics | Prometheus metrics |
| GET | /api/class/classes | Get all classes |
| POST | /api/class/classes | Create a class |
| GET | /api/class/classes/:id | Get class |
| PUT | /api/class/classes/:id | Update class |
| DELETE | /api/class/classes/:id | Delete class |
| GET | /api/class/classes/:id/stats | Get class stats |
| GET | /api/class/students | Get all students |
| POST | /api/class/students | Create a student |
| GET | /api/class/students/:id | Get student |
| PUT | /api/class/students/:id | Update student |
| DELETE | /api/class/students/:id | Delete student |
| GET | /api/class/students/:id/evidence | Get student evidence |
| GET | /api/class/students/:id/diagnosis | Get student diagnosis |
| GET | /api/class/progress/:studentId | Get student progress |
| GET | /api/class/progress/:studentId/history | Get progress history |
| GET | /api/class/progress/:studentId/skills | Get skills progress |

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
