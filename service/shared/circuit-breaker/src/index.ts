/**
 * Circuit Breaker wrapper for VERVEAI inter-service communication
 *
 * Provides resilience for inter-service calls using the opossum library.
 * Wraps service calls to automatically:
 * - Trip the circuit when error threshold is exceeded
 * - Fail fast when the circuit is open
 * - Periodically attempt to recover
 *
 * Usage:
 * ```typescript
 * import { createBreaker } from '@verveai/circuit-breaker';
 *
 * const authBreaker = createBreaker('svc-auth', async (path: string) => {
 *   const url = await Consul.resolve('svc-auth');
 *   return fetch(`${url}${path}`);
 * }, { timeout: 3000, errorThresholdPercentage: 50 });
 *
 * const response = await authBreaker.fire('/api/auth/verify');
 * ```
 */

export interface BreakerOptions {
  /** Timeout in milliseconds (default: 3000) */
  timeout?: number;
  /** Error percentage threshold to trip circuit (default: 50) */
  errorThresholdPercentage?: number;
  /** Reset timeout in milliseconds (default: 10000) */
  resetTimeout?: number;
  /** Minimum number of requests before evaluating errors (default: 10) */
  volumeThreshold?: number;
  /** Optional circuit name */
  name?: string;
}

export interface BreakerStats {
  name: string;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  successes: number;
  rejects: number;
  latencyMean: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CircuitBreaker<T extends (...args: any[]) => any> {
  fire(...args: Parameters<T>): Promise<ReturnType<T>>;
  getStats(): BreakerStats;
  isOpen(): boolean;
  close(): void;
  open(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createBreaker<T extends (...args: any[]) => any>(
  name: string,
  fn: T,
  options?: BreakerOptions,
): CircuitBreaker<T> {
  // Implementation delegates to the .js (compiled) module so that we
  // don't have to keep two copies of `opossum` typings in sync.
  // The require is resolved at runtime by Node when the .js file is built.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createOpossumBreaker } = require('./breaker');
  return createOpossumBreaker(name, fn, options);
}

export { createOpossumBreaker } from './breaker';
