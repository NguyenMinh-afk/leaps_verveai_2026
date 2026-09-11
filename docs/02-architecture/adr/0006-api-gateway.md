# ADR-0006: API Gateway (Express Gateway)

> **Status:** [A] Accepted
> **Date:** 09/09/2026
> **Deciders:** Team Verve Core
> **References:** ADR-0004 (microservices architecture)

---

## Context

5 microservice cần entry point duy nhất để:
1. Verify JWT (thay vì mỗi service verify lại)
2. Rate limiting tập trung
3. CORS policy tập trung
4. Routing đến service tương ứng

## Decision

**Dùng Express Gateway (Node.js) làm API Gateway.**

### Gateway Responsibilities

| Trách nhiệm | Implementation | Chi tiết |
|-------------|----------------|----------|
| **JWT Verify** | Custom policy | Verify token, extract `userId`, `role` → headers `X-User-Id`, `X-User-Role` |
| **Rate Limit** | express-rate-limit | 100 req/min cho auth endpoints, 1000 req/min cho API |
| **CORS** | cors middleware | Whitelist domains từ env |
| **Routing** | Express Gateway config | `/api/auth/*` → `svc-auth`, `/api/bkt/*` → `svc-bkt`, ... |
| **Metrics** | prom-client | Expose `/metrics` endpoint |
| **Tracing** | OpenTelemetry | Propagate context đến service |

### Gateway Config (`gateway.config.yml`)

```yaml
http:
  port: 8080

apiEndpoints:
  auth:
    paths:
      - /api/auth/*
      - /api/users/*
  bkt:
    paths:
      - /api/bkt/*
  class:
    paths:
      - /api/class/*
  content:
    paths:
      - /api/content/*
  sync:
    paths:
      - /api/sync/*
  health:
    paths:
      - /health

serviceEndpoints:
  svc-auth:
    url: http://svc-auth:3001
  svc-bkt:
    url: http://svc-bkt:3002
  svc-class:
    url: http://svc-class:3003
  svc-content:
    url: http://svc-content:3004
  svc-sync:
    url: http://svc-sync:3005

pipelines:
  default:
    apiEndpoints:
      - auth
      - bkt
      - class
      - content
      - sync
    policies:
      - cors
      - rate-limit
      - jwt           # ← Verify JWT, set X-User-Id header
      - proxy

  health:
    apiEndpoints:
      - health
    policies:
      - proxy
```

### JWT Policy (`gateway/src/policies/jwt.js`)

```javascript
// Verify JWT tại Gateway
// Set headers cho downstream service
module.exports = async function jwtPolicy(proxyReq, req, res, config) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set headers cho service
    proxyReq.headers['X-User-Id'] = decoded.userId;
    proxyReq.headers['X-User-Role'] = decoded.role;
    proxyReq.headers['X-User-Email'] = decoded.email;
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Service nhận headers

```typescript
// service/service-auth/src/routes/auth.routes.ts
app.get('/api/auth/me', (req, res) => {
  // KHÔNG verify JWT ở đây — Gateway đã verify
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Tiếp tục xử lý
  res.json({ userId, role: userRole });
});
```

### Health Check

```typescript
// Gateway health check — không cần JWT
app.get('/health', async (req, res) => {
  try {
    // Check Consul connectivity
    await Consul.ping();

    res.json({
      status: 'ok',
      gateway: 'up',
      services: {
        svcAuth: await Consul.isHealthy('svc-auth'),
        svcBkt: await Consul.isHealthy('svc-bkt'),
        svcClass: await Consul.isHealthy('svc-class'),
        svcContent: await Consul.isHealthy('svc-content'),
        svcSync: await Consul.isHealthy('svc-sync'),
      }
    });
  } catch (e) {
    res.status(503).json({ status: 'degraded', error: String(e) });
  }
});
```

---

## Consequences

### Positive
- **Single security point** — JWT verify 1 chỗ, không cần verify lại ở service
- **Rate limiting tập trung** — dễ quản lý
- **CORS tập trung** — 1 chỗ config
- **Observability** — metrics và tracing từ 1 điểm
- **Simpler service code** — service không cần biết về auth

### Negative
- **Single point of failure** — Gateway chết → không gọi được gì
  - **Mitigation:** Horizontal scaling Gateway (nhiều instance)
- **Latency overhead** — thêm ~5-10ms per request
  - **Mitigation:** Latency acceptable cho pilot
- **More config** — phải config routing ở Gateway thay vì hardcode

### Neutral
- **Separate team ownership** — Dev Lead sở hữu Gateway
- **Testing** — phải test integration Gateway → service

## Ports

| Component | Port | Mục đích |
|-----------|------|----------|
| Gateway | 8080 | Public API entry |
| Consul UI | 8500 | Service discovery UI |
| Jaeger | 16686 | Distributed tracing UI |
| Prometheus | 9090 | Metrics |
| Grafana | 3000 | Metrics dashboard |
| Postgres | 5432 | Database (internal) |

## References

- [ADR-0004 Microservices Architecture](./0004-microservices-architecture.md)
- [ADR-0005 Service Discovery](./0005-service-discovery.md)
- `service/gateway/` — implementation
