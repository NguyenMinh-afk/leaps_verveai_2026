# @verveai/consul-client

Consul service discovery client for VERVEAI microservices.

## Purpose

Provides a TypeScript wrapper around Consul's HTTP API for service registration, discovery, and health checking. Used by all VERVEAI microservices to:

- Register themselves with Consul on startup
- Deregister on graceful shutdown (SIGTERM)
- Discover other services via Consul DNS-style API
- Check service health before making calls

## Installation

```bash
pnpm add @verveai/consul-client
```

## Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `CONSUL_HOST` | `localhost` | Consul HTTP API host |
| `CONSUL_PORT` | `8500` | Consul HTTP API port |
| `HOSTNAME` | `localhost` | Service hostname (used for registration) |

## Usage

### Register a Service

```typescript
import { ConsulClient } from '@verveai/consul-client';

const consul = new ConsulClient();

await consul.register({
  name: 'svc-auth',
  port: 3001,
  healthCheck: '/health',
  tags: ['auth', 'v1', 'microservice'],
  meta: {
    version: '1.0.0',
    environment: 'production',
  },
});
```

### Deregister on Shutdown

```typescript
process.on('SIGTERM', async () => {
  await consul.deregister();
  process.exit(0);
});
```

### Resolve Service URL

```typescript
import { ConsulClient } from '@verveai/consul-client';

const consul = new ConsulClient();

// Resolve service name to URL
const authUrl = await consul.resolve('svc-auth');
// Returns: 'http://svc-auth.host:3001'

const response = await fetch(`${authUrl}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

### List All Services

```typescript
const services = await consul.listServices();
// Returns: { 'svc-auth': { Address: '...', Port: 3001, ID: '...' }, ... }
```

### Health Check

```typescript
const isHealthy = await consul.healthCheck('svc-auth');
// Returns: true if all health checks are passing
```

## API Reference

### `new ConsulClient(host?, port?)`

Creates a new Consul client instance.

- `host` (optional) — Consul host (default: from `CONSUL_HOST` env or `localhost`)
- `port` (optional) — Consul port (default: from `CONSUL_PORT` env or `8500`)

### `register(config: ServiceRegistration): Promise<void>`

Registers the service with Consul.

### `deregister(serviceId?): Promise<void>`

Deregisters the service. Uses the stored service ID if no ID provided.

### `resolve(serviceName: string): Promise<string>`

Resolves a service name to its HTTP URL.

Throws if the service is not found in Consul.

### `listServices(): Promise<Record<string, ServiceInfo>>`

Lists all registered services.

### `healthCheck(serviceName: string): Promise<boolean>`

Returns `true` if all health checks for the service are passing.

## Best Practices

1. **Always deregister on shutdown** — Use `process.on('SIGTERM', ...)` to deregister before exiting.
2. **Don't hardcode URLs** — Use `resolve()` to get the current service URL.
3. **Combine with circuit breaker** — Wrap service calls in `@verveai/circuit-breaker` for resilience.
4. **Health check endpoint required** — Every service must expose `/health` for Consul to monitor it.

## Testing

```bash
pnpm test        # Run tests
pnpm test:cov    # Run tests with coverage
```

Coverage thresholds:
- Lines: 80%
- Functions: 80%
- Branches: 70%
- Statements: 80%

## License

MIT
