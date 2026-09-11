import { Registry, Histogram, Counter, collectDefaultMetrics } from 'prom-client';

export const metricsRegistry = {
  register: new Registry(),

  httpRequestDuration: new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
  }) as Histogram<string>,

  httpRequestsTotal: new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']
  }) as Counter<string>,

  dbQueryDuration: new Histogram({
    name: 'db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'table'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
  }) as Histogram<string>,

  circuitBreakerState: new Histogram({
    name: 'circuit_breaker_state',
    help: 'Circuit breaker state (0=closed, 1=open, 2=half-open)',
    labelNames: ['service'],
    buckets: [0, 1, 2]
  }) as Histogram<string>
};

metricsRegistry.register.registerMetric(metricsRegistry.httpRequestDuration);
metricsRegistry.register.registerMetric(metricsRegistry.httpRequestsTotal);
metricsRegistry.register.registerMetric(metricsRegistry.dbQueryDuration);
metricsRegistry.register.registerMetric(metricsRegistry.circuitBreakerState);

collectDefaultMetrics({ register: metricsRegistry.register, prefix: 'svc_bkt_' });

export { collectDefaultMetrics };
