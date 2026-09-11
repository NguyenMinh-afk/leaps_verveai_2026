# ADR-0005: Service Discovery (Consul)

> **Status:** [A] Accepted
> **Date:** 09/09/2026
> **Deciders:** Team Verve Core
> **References:** ADR-0004 (microservices architecture)

---

## Context

5 microservice cần tìm nhau qua DNS thay vì hardcode URL. Khi 1 service restart, URL thay đổi → cần service discovery.

## Decision

**Dùng Consul cho Service Discovery và Health Check.**

### Consul Agent per Service

Mỗi service có Consul agent local, đăng ký với Consul server khi start:

```typescript
// service/service-auth/src/config/consul.ts
import { Consul } from '@service/shared/consul-client';

export async function registerService() {
  await Consul.register({
    name: 'svc-auth',
    port: 3001,
    healthCheck: '/health',
    tags: ['auth', 'v1'],
  });
}

// Graceful deregister khi shutdown
process.on('SIGTERM', async () => {
  await Consul.deregister();
  process.exit(0);
});
```

### Health Check

Mỗi service phải expose `/health`:

```typescript
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', service: 'svc-auth' });
  } catch (e) {
    res.status(503).json({ status: 'down', error: String(e) });
  }
});
```

Consul check health mỗi **10 giây**. Nếu 3 lần fail liên tiếp → deregister tự động.

### DNS Discovery

```typescript
// ❌ KHÔNG: const authUrl = 'http://svc-auth:3001';
// ✅ ĐÚNG:
import { Consul } from '@service/shared/consul-client';

const authUrl = await Consul.resolve('svc-auth');
// → trả về URL hiện tại từ Consul
// → tự động failover nếu service chết
```

### Inter-Service Communication

Tất cả call giữa service phải qua Consul DNS:

```typescript
// service/service-bkt gọi service/service-auth
import { Consul } from '@service/shared/consul-client';
import { createBreaker } from '@service/shared/circuit-breaker';

const authBreaker = createBreaker('svc-auth', async (path: string, init?: RequestInit) => {
  const baseUrl = await Consul.resolve('svc-auth');
  return fetch(`${baseUrl}${path}`, init);
}, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
});

// Sử dụng
const result = await authBreaker.fire('/api/auth/verify', {
  method: 'POST',
  body: JSON.stringify({ token }),
});
```

### Consul UI

- **Port:** 8500
- **URL:** http://localhost:8500 (dev), http://consul:8500 (docker)
- **Xem:** Tất cả service registered, health status, DNS queries

---

## Consequences

### Positive
- **Auto-failover** — khi 1 service chết, Consul deregister, call tự động sang instance khác (nếu có)
- **Không hardcode** — URL lấy từ DNS, không cần update khi service restart
- **Health monitoring** — UI để xem service nào đang sống
- **DNS-based** — đơn giản, tương thích với mọi ngôn ngữ

### Negative
- **Extra container** — Consul server/agent cần RAM (~100MB)
- **Startup dependency** — service phải đợi Consul up trước
- **Network** — tất cả service phải cùng network (docker-compose đã handle)

### Neutral
- **Consul agent per service** — overhead nhỏ nhưng đảm bảo accuracy
- **Health check interval** — 10s là compromise giữa responsiveness và overhead

## References

- [ADR-0004 Microservices Architecture](./0004-microservices-architecture.md)
- [ADR-0006 API Gateway](./0006-api-gateway.md)
- `service/shared/consul-client/` — implementation
