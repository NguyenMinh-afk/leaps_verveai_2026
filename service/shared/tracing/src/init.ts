import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { trace, Span, SpanStatusCode, Tracer } from '@opentelemetry/api';
import type { TracingConfig } from './index';

/**
 * Lazy singleton SDK instance.
 *
 * We keep this module-scoped so `initTracing` is idempotent within a process.
 * Test environments typically pass `enabled: false` to avoid side effects.
 */
let sdk: NodeSDK | null = null;

/**
 * Initialize the OpenTelemetry NodeSDK.
 *
 * @param config - {@link TracingConfig} service name, version, OTLP endpoint and enable flag.
 *
 * @remarks
 * - No-op when `config.enabled === false`.
 * - Defaults `otlpEndpoint` to `OTEL_EXPORTER_OTLP_ENDPOINT` or `http://localhost:4318/v1/traces`.
 * - Registers a `SIGTERM` handler that flushes and shuts down the SDK.
 */
export function initTracing(config: TracingConfig): void {
  if (config.enabled === false) return;

  const endpoint =
    config.otlpEndpoint ??
    process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] ??
    'http://localhost:4318/v1/traces';

  const exporter = new OTLPTraceExporter({ url: endpoint });

  sdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: config.serviceName,
      [SEMRESATTRS_SERVICE_VERSION]: config.serviceVersion ?? '1.0.0',
    }),
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk?.shutdown().catch(console.error);
  });
}

/**
 * Get a tracer from the global OpenTelemetry tracer provider.
 *
 * @param name - Tracer name. Defaults to `verveai`.
 */
export function getTracer(name: string = 'verveai'): Tracer {
  return trace.getTracer(name);
}

/**
 * Run an async function inside an active span.
 *
 * The span automatically:
 * - sets status to {@link SpanStatusCode.OK} on success,
 * - sets status to {@link SpanStatusCode.ERROR} and records the exception on failure,
 * - is always ended in `finally`.
 *
 * @param name - Span name.
 * @param fn - Async function to run inside the span.
 * @returns The function's resolved value.
 */
export async function createSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const tracer = getTracer();
  return tracer.startActiveSpan(name, async (span) => {
    try {
      const result = await fn();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (e) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: e instanceof Error ? e.message : String(e),
      });
      span.recordException(e as Error);
      throw e;
    } finally {
      span.end();
    }
  });
}

/**
 * Run a synchronous function inside an active span.
 *
 * The span automatically:
 * - sets status to {@link SpanStatusCode.OK} on success,
 * - sets status to {@link SpanStatusCode.ERROR} and records the exception on failure,
 * - is always ended in `finally`.
 *
 * @param name - Span name.
 * @param fn - Synchronous function receiving the active span.
 * @returns The function's return value.
 */
export function withSpan<T>(name: string, fn: (span: Span) => T): T {
  const tracer = getTracer();
  return tracer.startActiveSpan(name, (span) => {
    try {
      const result = fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (e) {
      span.setStatus({ code: SpanStatusCode.ERROR });
      span.recordException(e as Error);
      throw e;
    } finally {
      span.end();
    }
  });
}
