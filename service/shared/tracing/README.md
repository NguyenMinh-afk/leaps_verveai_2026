# @verveai/tracing

OpenTelemetry initialization and helpers for VERVEAI microservices.

This package wraps `@opentelemetry/sdk-node` and exposes:

- `initTracing(config)` — bootstrap the global `NodeSDK` with OTLP HTTP exporter.
- `getTracer(name?)` — fetch a tracer from the global provider.
- `createSpan(name, fn)` — run an async function inside an active span.
- `withSpan(name, fn)` — run a synchronous function inside an active span.

## Install

Within the monorepo this package is consumed by all five services and the gateway through the pnpm workspace config (e.g. `@verveai/tracing` resolves to this folder).

```json
{
  "dependencies": {
    "@verveai/tracing": "workspace:*"
  }
}
```

## Usage

In each service's `src/index.ts` (or `tracing.ts`) add a single call at the top of the file:

```ts
import { initTracing } from '@verveai/tracing';

initTracing({
  serviceName: 'svc-auth',
  serviceVersion: process.env.SERVICE_VERSION ?? '1.0.0',
  // otlpEndpoint: 'http://otel-collector:4318/v1/traces', // optional
});
```

Wrap any business logic with a span:

```ts
import { createSpan, withSpan, getTracer } from '@verveai/tracing';

const tracer = getTracer('svc-auth');

export async function login(email: string, password: string) {
  return createSpan('auth.login', async () => {
    // ... do login
    return token;
  });
}

export function evaluate(payload: unknown) {
  return withSpan('auth.evaluate', (span) => {
    span.setAttribute('payload.size', JSON.stringify(payload).length);
    return { ok: true };
  });
}
```

## Configuration

`TracingConfig`:

| Field | Description | Default |
| --- | --- | --- |
| `serviceName` | Logical service name (e.g. `svc-auth`). **Required.** | — |
| `serviceVersion` | Semantic version. | `1.0.0` |
| `otlpEndpoint` | OTLP HTTP URL for trace export. | `process.env.OTEL_EXPORTER_OTLP_ENDPOINT` → `http://localhost:4318/v1/traces` |
| `enabled` | When `false`, `initTracing` becomes a no-op (useful in tests). | `true` |

## Environment

- `OTEL_EXPORTER_OTLP_ENDPOINT` — overrides the OTLP endpoint if `otlpEndpoint` is not provided in config.
- Standard OpenTelemetry env vars (`OTEL_RESOURCE_ATTRIBUTES`, `OTEL_SERVICE_NAME`, …) are also respected.

## Integration with the Stack

- **Jaeger** — collects traces via the OTLP exporter at `http://jaeger:4318` (compose default).
- **Prometheus** — separate metrics package; tracing concerns itself with *spans*, not counters.
- **Consul** — independent of tracing; used only for service discovery.

## Tests

```bash
npm test          # Vitest unit suite
npm run test:cov  # Coverage report
```

Coverage thresholds (per ADR-0004 / testing rules):

| Metric | Threshold |
| --- | --- |
| Lines | 80 % |
| Statements | 80 % |
| Functions | 80 % |
| Branches | 70 % |

## Related

- ADR-0004 `docs/02-architecture/adr/0004-microservices-architecture.md`
- ADR-0005 `docs/02-architecture/adr/0005-service-discovery.md`
- `docs/02-architecture/adr/0006-api-gateway.md`
