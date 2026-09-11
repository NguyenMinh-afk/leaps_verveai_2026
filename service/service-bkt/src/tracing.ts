/**
 * OpenTelemetry tracing initialisation for svc-bkt.
 *
 * Loads env and calls the shared tracing init from @verveai/tracing when available.
 * Gracefully degrades when OTEL is not configured.
 */

import dotenv from 'dotenv';

dotenv.config();

// Attempt to initialise OpenTelemetry tracing.
// If @verveai/tracing fails to build, fall back to a no-op.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { initTracing } = require('@verveai/tracing');
  const serviceName = process.env.OTEL_SERVICE_NAME ?? 'svc-bkt';
  initTracing({ serviceName, serviceVersion: '1.0.0' });
} catch {
  // Tracing is optional — the service still runs without it.
  // eslint-disable-next-line no-console
  console.warn('[tracing] OpenTelemetry init skipped — @verveai/tracing not available');
}
