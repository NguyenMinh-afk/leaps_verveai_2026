# @verveai/circuit-breaker

Circuit breaker wrapper for VERVEAI inter-service communication, built on top of [opossum](https://github.com/nodeshift/opossum).

## Purpose

Provides resilience for inter-service HTTP calls by:

- **Fail fast** when a service is unresponsive
- **Trip the circuit** when error threshold is exceeded
- **Auto-recover** by periodically testing the service

This is a **mandatory** component of all inter-service calls in the VERVEAI architecture.

## Installation

```bash
pnpm add @verveai/circuit-breaker
```

## Usage

### Basic Usage

```typescript
import { createBreaker } from '@verveai/circuit-breaker';

const authBreaker = createBreaker('svc-auth', async (path: string) => {
  const url = await Consul.resolve('svc-auth');
  return fetch(`${url}${path}`);
});

// Use it like the original function
const response = await authBreaker.fire('/api/auth/verify');
```

### With Options

```typescript
import { createBreaker } from '@verveai/circuit-breaker';

const breaker = createBreaker(
  'svc-bkt',
  async (studentId: string) => {
    const url = await Consul.resolve('svc-bkt');
    return fetch(`${url}/api/bkt/diagnosis/${studentId}`);
  },
  {
    timeout: 3000,                  // 3 second timeout
    errorThresholdPercentage: 50,   // Trip at 50% error rate
    resetTimeout: 10000,            // Try to recover after 10s
    volumeThreshold: 10,            // Need at least 10 requests before evaluating
  },
);

const diagnosis = await breaker.fire('student-123');
```

### Inspect Stats

```typescript
const stats = breaker.getStats();
console.log({
  name: stats.name,
  state: stats.state,        // 'CLOSED' | 'OPEN' | 'HALF_OPEN'
  failures: stats.failures,
  successes: stats.successes,
  rejects: stats.rejects,
  latencyMean: stats.latencyMean,
});
```

### Manual Control

```typescript
// Force the circuit open (e.g., during maintenance)
breaker.open();

// Force the circuit closed
breaker.close();

// Check if the circuit is open
if (breaker.isOpen()) {
  // Use fallback strategy
}
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | number | `3000` | Request timeout in milliseconds |
| `errorThresholdPercentage` | number | `50` | Percentage of errors to trip the circuit |
| `resetTimeout` | number | `10000` | Time to wait before attempting recovery (ms) |
| `volumeThreshold` | number | `10` | Minimum requests before evaluating error rate |
| `name` | string | `undefined` | Optional name override |

## Circuit States

- **CLOSED** — Normal operation. Requests pass through to the wrapped function.
- **OPEN** — Circuit is tripped. All requests fail fast without calling the function.
- **HALF_OPEN** — Recovery mode. A single test request is allowed; success closes the circuit.

## Best Practices

1. **Always combine with Consul** — Use `Consul.resolve()` to get the current service URL (handles failover).
2. **One breaker per service** — Create a separate breaker instance for each target service.
3. **Use descriptive names** — Name breakers clearly so metrics are meaningful.
4. **Monitor stats** — Expose breaker stats via Prometheus for visibility.
5. **Tune thresholds per service** — Critical services may need lower thresholds.

## Testing

```bash
pnpm test        # Run tests
pnpm test:cov    # Run tests with coverage
```

Coverage thresholds:
- Lines: 85%
- Functions: 85%
- Branches: 80%
- Statements: 85%

## License

MIT
