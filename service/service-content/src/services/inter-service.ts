/**
 * Inter-service communication helpers.
 *
 * Wraps HTTP calls to other microservice via Consul discovery + circuit breaker.
 * Used by report.service.ts to aggregate data from svc-class and svc-bkt.
 */

import { ConsulClient } from '@verveai/consul-client';
import { createBreaker, type CircuitBreaker } from '@verveai/circuit-breaker';
import { logger } from '../utils/logger.js';

// Lazy-consul instance to avoid import-order issues
function consul(): ConsulClient {
  return new ConsulClient(process.env['CONSUL_HOST'] ?? 'localhost', parseInt(process.env['CONSUL_PORT'] ?? '8500', 10));
}

// ─── Generic HTTP call helpers ─────────────────────────────────────────────────

interface HttpOptions extends RequestInit {
  timeout?: number;
}

async function httpCall<T>(url: string, options?: HttpOptions): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options?.timeout ?? 5000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status} from ${url}: ${body}`);
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Circuit-breaker factories ─────────────────────────────────────────────────

/** Build (or memoize) a circuit breaker for svc-auth. */
let _authBreaker: CircuitBreaker<() => Promise<unknown>> | null = null;
function authBreaker(): CircuitBreaker<() => Promise<unknown>> {
  if (!_authBreaker) {
    _authBreaker = createBreaker('svc-auth', async () => {
      const baseUrl = await consul().resolve('svc-auth');
      return httpCall(`${baseUrl}/api/auth/session`);
    }, { timeout: 3000, errorThresholdPercentage: 50, volumeThreshold: 5 });
  }
  return _authBreaker;
}

/** Build (or memoize) a circuit breaker for svc-class. */
let _classBreaker: CircuitBreaker<(...args: unknown[]) => Promise<unknown>> | null = null;
function classBreaker(): CircuitBreaker<(...args: unknown[]) => Promise<unknown>> {
  if (!_classBreaker) {
    _classBreaker = createBreaker('svc-class', async (...args: unknown[]) => {
      const [path] = args as [string];
      const baseUrl = await consul().resolve('svc-class');
      return httpCall(`${baseUrl}${path}`);
    }, { timeout: 5000, errorThresholdPercentage: 50, volumeThreshold: 5 });
  }
  return _classBreaker;
}

/** Build (or memoize) a circuit breaker for svc-bkt. */
let _bktBreaker: CircuitBreaker<(...args: unknown[]) => Promise<unknown>> | null = null;
function bktBreaker(): CircuitBreaker<(...args: unknown[]) => Promise<unknown>> {
  if (!_bktBreaker) {
    _bktBreaker = createBreaker('svc-bkt', async (...args: unknown[]) => {
      const [path] = args as [string];
      const baseUrl = await consul().resolve('svc-bkt');
      return httpCall(`${baseUrl}${path}`);
    }, { timeout: 5000, errorThresholdPercentage: 50, volumeThreshold: 5 });
  }
  return _bktBreaker;
}

// ─── Typed public API ──────────────────────────────────────────────────────────

/**
 * Call svc-class GET endpoint with circuit-breaker protection.
 * Returns parsed JSON or null if the circuit is open.
 */
export async function callClassService<T>(path: string): Promise<T | null> {
  try {
    const result = await classBreaker().fire(path);
    return result as T;
  } catch (err) {
    logger.warn('svc-class call failed, circuit may be open', { err, path });
    return null;
  }
}

/**
 * Call svc-bkt GET endpoint with circuit-breaker protection.
 * Returns parsed JSON or null if the circuit is open.
 */
export async function callBktService<T>(path: string): Promise<T | null> {
  try {
    const result = await bktBreaker().fire(path);
    return result as T;
  } catch (err) {
    logger.warn('svc-bkt call failed, circuit may be open', { err, path });
    return null;
  }
}

/**
 * Get the stats snapshot for all known breakers.
 */
export function getBreakerStats(): Array<{ name: string; state: string; failures: number; successes: number }> {
  return [
    authBreaker().getStats(),
    classBreaker().getStats(),
    bktBreaker().getStats(),
  ].map((s) => ({
    name: s.name,
    state: s.state,
    failures: s.failures,
    successes: s.successes,
  }));
}
