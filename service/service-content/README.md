# svc-content - Content Service

Content management service for VERVEAI.

## Overview

- **Port:** 3004
- **Schema:** content
- **Responsibility:** Content, Bundles (Ed25519), Review, Reports

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /ready | Readiness check |
| GET | /metrics | Prometheus metrics |
| GET | /api/content | Get all content |
| POST | /api/content | Create content |
| GET | /api/content/:id | Get content |
| PUT | /api/content/:id | Update content |
| DELETE | /api/content/:id | Delete content |
| GET | /api/content/bundles | Get all bundles |
| GET | /api/content/bundles/:id | Get bundle |
| POST | /api/content/bundles/build | Build bundle |
| POST | /api/content/bundles/:id/sign | Sign bundle (Ed25519) |
| POST | /api/content/bundles/:id/publish | Publish bundle |
| GET | /api/content/review | Get pending reviews |
| POST | /api/content/review/:id/approve | Approve content |
| POST | /api/content/review/:id/reject | Reject content |
| GET | /api/content/review/stats | Get review stats |

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
