/**
 * Circuit Breaker implementation wrapping opossum
 *
 * Provides a wrapper around the opossum library with our CircuitBreaker interface.
 * Tracks statistics from opossum events: success, failure, reject, timeout.
 */

import OpossumLib from 'opossum';
import type { BreakerOptions, BreakerStats, CircuitBreaker } from './index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createOpossumBreaker<T extends (...args: any[]) => any>(
  name: string,
  fn: T,
  options?: BreakerOptions,
): CircuitBreaker<T> {
  const opossumOptions = {
    timeout: options?.timeout ?? 3000,
    errorThresholdPercentage: options?.errorThresholdPercentage ?? 50,
    resetTimeout: options?.resetTimeout ?? 10000,
    volumeThreshold: options?.volumeThreshold ?? 10,
    name: options?.name ?? name,
  };

  const breaker = new OpossumLib(fn, opossumOptions);

  // Track statistics
  let failures = 0;
  let successes = 0;
  let rejects = 0;

  breaker.on('success', () => {
    successes += 1;
  });

  breaker.on('failure', () => {
    failures += 1;
  });

  breaker.on('reject', () => {
    rejects += 1;
  });

  // Compute mean latency from stats
  const computeLatencyMean = (): number => {
    const stats = breaker.stats;
    if (!stats || typeof stats.latency !== 'object') {
      return 0;
    }
    // Opossum latency stats: { mean: number, ... }
    const latency = stats.latency as { mean?: number } | undefined;
    if (latency && typeof latency.mean === 'number') {
      return latency.mean;
    }
    return 0;
  };

  return {
    fire: async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      const result = await breaker.fire(...args);
      return result as ReturnType<T>;
    },
    getStats: (): BreakerStats => {
      let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
      if (breaker.opened) {
        state = 'OPEN';
      } else if (breaker.halfOpen) {
        state = 'HALF_OPEN';
      }
      return {
        name,
        state,
        failures,
        successes,
        rejects,
        latencyMean: computeLatencyMean(),
      };
    },
    isOpen: (): boolean => breaker.opened,
    close: (): void => {
      breaker.close();
    },
    open: (): void => {
      breaker.open();
    },
  };
}
