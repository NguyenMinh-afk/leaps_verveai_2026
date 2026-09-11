# ADR-0004: Microservices Architecture

> **Status:** [A] Accepted
> **Date:** 09/09/2026
> **Deciders:** Team Verve Core
> **Supersedes:** monolith `backend/` (lỗi thời)

---

## Context

LEAPS backend phức tạp với 30+ endpoints theo BA v1.4.5. Cần tách theo domain để 3 dev làm song song hiệu quả.

`service/WORK_SPLIT.md` (v1.1, ngày 09/09/2026) đã chốt 5 service ở port 3001-3005.

## Decision

**Chia backend thành 5 microservice + 1 Gateway + Service Discovery.**

### 5 Microservice

| Service | Port | Schema | Dev | Routes |
|---------|------|--------|-----|--------|
| `svc-auth` | 3001 | `auth` | Dev 1 | `/api/auth/*`, `/api/users/*` |
| `svc-bkt` | 3002 | `bkt` | Dev 2 | `/api/bkt/*` |
| `svc-class` | 3003 | `class` | Dev 3 | `/api/class/*` |
| `svc-content` | 3004 | `content` | Dev 1 | `/api/content/*` |
| `svc-sync` | 3005 | `sync` | Dev 3 | `/api/sync/*` |

### Gateway (Express Gateway)
- **Port:** 8080
- **Trách nhiệm:**
  - JWT verify (single point)
  - Rate limiting (100 req/min auth, 1000 req/min API)
  - CORS whitelist
  - Request routing → service tương ứng
  - Metrics → Prometheus
  - Tracing → OpenTelemetry → Jaeger

### Service Discovery (Consul)
- **Port:** 8500
- **Trách nhiệm:**
  - Service registration (tự động khi service start)
  - Health check (mỗi 10s)
  - DNS-based discovery (vd: `svc-auth.service.consul`)

### Database
- **1 PostgreSQL instance** với **5 schema riêng biệt:**
  - `auth` — users, sessions, tokens
  - `bkt` — skills, items, evidence, diagnosis, interventions
  - `class` — classes, students, progress
  - `content` — content, bundles, reviews, reports
  - `sync` — devices, sync_log, conflicts

### Shared Code (`service/shared/`)
```
service/shared/
├── consul-client/       # Service discovery wrapper
├── circuit-breaker/     # opossum wrapper
├── jwt-utils/           # JWT verify (gateway-side)
├── prisma-schema/      # 5 schema gốc
├── tracing/             # OpenTelemetry init
└── error-types/         # Domain errors chuẩn
```

### Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│  web-portal/ (Next.js)                                                      │
│  Browser → http://gateway:8080/api/...                                      │
└────────────────────┬───────────────────────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────────────────────┐
│  gateway/ (8080)                                                            │
│  • JWT verify • Rate limit • CORS • Routing                                 │
└────────────────────┬───────────────────────────────────────────────────────┘
                     │
              Consul DNS (8500)
              ───────────────────
                     │
   ┌──────────┬──────┼──────┬──────────┬──────────┐
   ▼          ▼      ▼      ▼          ▼          ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│svc-auth│ │svc-bkt│ │svc-cls│ │svc-cnt│ │svc-sync│
│:3001  │ │:3002  │ │:3003  │ │:3004  │ │:3005  │
└───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
    │         │         │         │         │
    └─────────┴─────────┴─────────┴─────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
  ┌──────────┐              ┌──────────┐
  │ Jaeger   │              │PostgreSQL│
  │ :16686   │              │(5 schema)│
  └──────────┘              └──────────┘
```

## Consequences

### Positive
- **Team song song hiệu quả** — 3 dev làm độc lập
- **Mỗi service độc lập scale** — nhưng pilot nhỏ, chưa cần
- **Gateway tập trung bảo mật** — JWT verify 1 chỗ
- **Consul tự động detect fail** — health check + deregister
- **Isolate failures** — 1 service chết không kéo chết cả hệ thống (circuit breaker)

### Negative
- **Distributed tracing complexity** — phải setup OpenTelemetry
- **Inter-service latency** — ~5-20ms overhead cho call giữa service
- **Consul learning curve** — dev phải học cách debug
- **More infrastructure** — 7 container (5 svc + gateway + consul)

### Neutral
- **Prisma schema tách** — mỗi service có schema riêng, nhưng dùng chung 1 DB
- **CI/CD phức tạp hơn** — phải test từng service riêng

## References

- [WORK_SPLIT.md](../../service/WORK_SPLIT.md) — Phân chia 5 microservice (canonical)
- [ADR-0005 Service Discovery](./0005-service-discovery.md)
- [ADR-0006 API Gateway](./0006-api-gateway.md)
- BA v1.4.5 — Tất cả endpoints
