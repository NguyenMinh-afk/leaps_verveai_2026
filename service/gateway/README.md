# VERVEAI API Gateway

Express-based API Gateway for VERVEAI microservices.

## Responsibilities
- JWT verification at gateway level (single point)
- Rate limiting (100 req/min auth, 1000 req/min API)
- CORS whitelist
- Request proxying to upstream services
- Prometheus metrics at `/metrics`

## Port
8080

## Routes
| Path | Upstream | Auth |
|------|----------|------|
| POST /api/auth/login | svc-auth:3001 | No |
| GET /api/bkt/* | svc-bkt:3002 | JWT |
| GET /api/class/* | svc-class:3003 | JWT |
| GET /api/content/* | svc-content:3004 | JWT |
| GET /api/sync/* | svc-sync:3005 | JWT |

## Development
```bash
pnpm install
pnpm dev     # tsx watch
pnpm build   # tsc
pnpm test    # vitest
```
