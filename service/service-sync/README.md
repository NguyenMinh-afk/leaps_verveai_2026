# svc-sync - Sync Service

Sync and device management service for VERVEAI.

## Overview

- **Port:** 3005
- **Schema:** sync
- **Responsibility:** Sync, Devices, Conflict resolution

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /ready | Readiness check |
| GET | /metrics | Prometheus metrics |
| GET | /api/sync/status | Get sync status |
| POST | /api/sync/push | Push sync from device |
| GET | /api/sync/pull | Pull sync from server |
| GET | /api/sync/pull/:since | Pull sync since timestamp |
| POST | /api/sync/resolve | Resolve conflict |
| GET | /api/sync/devices | Get all devices |
| GET | /api/sync/devices/:id | Get device |
| PUT | /api/sync/devices/:id | Update device |
| DELETE | /api/sync/devices/:id | Delete device |
| GET | /api/sync/devices/:id/logs | Get device logs |

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
