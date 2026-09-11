/**
 * @verveai/tracing
 *
 * OpenTelemetry initialization and helpers for VERVEAI microservices.
 *
 * Provides:
 * - Lazy NodeSDK initialization with OTLP HTTP exporter
 * - `getTracer` — obtain a tracer instance
 * - `createSpan` — async helper that creates a span around a function
 * - `withSpan` — sync helper that creates a span around a synchronous function
 *
 * USAGE (in service `src/index.ts`):
 *   ```ts
 *   import { initTracing } from '@verveai/tracing';
 *
 *   initTracing({ serviceName: 'svc-auth', serviceVersion: '1.0.0' });
 *   ```
 *
 * Environment variables:
 * - `OTEL_EXPORTER_OTLP_ENDPOINT` — OTLP HTTP endpoint (default: `http://localhost:4318/v1/traces`)
 */

import type { Span, Tracer } from '@opentelemetry/api';

export interface TracingConfig {
  /** Logical name of the service (e.g. `svc-auth`). Required. */
  serviceName: string;
  /** Semantic version of the service. Defaults to `1.0.0`. */
  serviceVersion?: string;
  /** OTLP HTTP endpoint URL. Falls back to `OTEL_EXPORTER_OTLP_ENDPOINT`. */
  otlpEndpoint?: string;
  /** Set to `false` to no-op (useful for tests). Defaults to `true`. */
  enabled?: boolean;
}

export {
  initTracing,
  getTracer,
  createSpan,
  withSpan,
} from './init';

// Re-export Span and Tracer types for consumer convenience.
export type { Span, Tracer };
