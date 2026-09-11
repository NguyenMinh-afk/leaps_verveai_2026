/**
 * Inter-service communication helpers for VERVEAI svc-sync.
 *
 * Each downstream service has its own CircuitBreaker wrapped around an
 * HTTP fetch. We resolve the upstream URL via Consul (NEVER hardcoded)
 * and forward any provided OpenTelemetry propagation headers.
 *
 * Usage:
 *   import { authBreaker, classBreaker, bktBreaker } from './inter-service';
 *   const user = await authBreaker.fire('/api/users/123', { method: 'GET' });
 */

import { Consul } from '@verveai/consul-client';
import { createBreaker } from '@verveai/circuit-breaker';
import { logger } from '../utils/logger.js';

// ─── Internal HTTP client ─────────────────────────────────────────────────────

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  /** Forward propagation context to upstream service. */
  traceparent?: string | undefined;
  tracestate?: string | undefined;
}

async function callService(
  serviceName: string,
  path: string,
  options: FetchOptions = {},
): Promise<unknown> {
  const baseUrl = await Consul.resolve(serviceName);
  const url = `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  if (options.traceparent !== undefined) {
    headers['traceparent'] = options.traceparent;
  }
  if (options.tracestate !== undefined) {
    headers['tracestate'] = options.tracestate;
  }

  const init: RequestInit = {
    method: options.method ?? 'GET',
    headers,
  };

  if (options.body !== undefined) {
    init.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(url, init);

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const err = new Error(
      `Upstream ${serviceName} returned ${response.status} ${response.statusText}: ${text}`,
    ) as Error & { statusCode?: number };
    err.statusCode = response.status;
    throw err;
  }

  // 204 No Content
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

// ─── Breakers ─────────────────────────────────────────────────────────────────

/**
 * Circuit breaker for svc-auth (port 3001).
 * Used by sync to validate session tokens / user references.
 */
export const authBreaker = createBreaker(
  'svc-auth',
  (path: string, options?: FetchOptions) => callService('svc-auth', path, options ?? {}),
  {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
    volumeThreshold: 10,
  },
);

/**
 * Circuit breaker for svc-class (port 3003).
 * Used by sync to look up student records and class membership.
 */
export const classBreaker = createBreaker(
  'svc-class',
  (path: string, options?: FetchOptions) => callService('svc-class', path, options ?? {}),
  {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
    volumeThreshold: 10,
  },
);

/**
 * Circuit breaker for svc-bkt (port 3002).
 * Used by sync to push/pull evidence records.
 */
export const bktBreaker = createBreaker(
  'svc-bkt',
  (path: string, options?: FetchOptions) => callService('svc-bkt', path, options ?? {}),
  {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
    volumeThreshold: 10,
  },
);

// ─── High-level helpers ───────────────────────────────────────────────────────

export interface UserRef {
  id: string;
  email?: string;
}

/**
 * Verify a user exists via svc-auth.
 * Returns null when the upstream service is unavailable (open circuit).
 */
export async function verifyUser(userId: string): Promise<UserRef | null> {
  try {
    const result = (await authBreaker.fire(`/api/users/${userId}`, {
      method: 'GET',
    })) as { success: boolean; data: UserRef | null };
    return result.data ?? null;
  } catch (err) {
    logger.warn('verifyUser failed', { userId, error: (err as Error).message });
    return null;
  }
}

export interface StudentRef {
  id: string;
  classId?: string;
}

/**
 * Look up a student record via svc-class.
 */
export async function verifyStudent(studentId: string): Promise<StudentRef | null> {
  try {
    const result = (await classBreaker.fire(`/api/class/students/${studentId}`, {
      method: 'GET',
    })) as { success: boolean; data: StudentRef | null };
    return result.data ?? null;
  } catch (err) {
    logger.warn('verifyStudent failed', { studentId, error: (err as Error).message });
    return null;
  }
}

export interface EvidenceRecord {
  id: string;
  studentId: string;
  skillId: string;
  correct: boolean;
  quality?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
}

/**
 * Sync an evidence record to svc-bkt.
 * Returns the upstream evidence id (or the client-provided id when the
 * service is unavailable / circuit is open).
 */
export async function syncEvidenceToBkt(record: EvidenceRecord): Promise<string> {
  try {
    const result = (await bktBreaker.fire('/api/bkt/evidence', {
      method: 'POST',
      body: record,
    })) as { success: boolean; data: { id: string } | null };
    return result.data?.id ?? record.id;
  } catch (err) {
    logger.warn('syncEvidenceToBkt failed', {
      recordId: record.id,
      error: (err as Error).message,
    });
    return record.id;
  }
}

// ─── Diagnostics ─────────────────────────────────────────────────────────────

export interface BreakerHealth {
  name: string;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  successes: number;
  rejects: number;
  latencyMean: number;
}

export function getBreakerHealth(): BreakerHealth[] {
  return [authBreaker, classBreaker, bktBreaker].map((b) => b.getStats());
}
