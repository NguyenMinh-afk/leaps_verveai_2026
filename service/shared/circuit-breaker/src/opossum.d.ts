/**
 * Minimal type stub for the `opossum` circuit-breaker library.
 *
 * The npm package ships with no typings — these declarations are enough
 * for the sliver of the API used by @verveai/circuit-breaker.
 *
 * @see https://github.com/nodeshift/opossum
 */

declare module 'opossum' {
  interface Options {
    timeout?: number;
    errorThresholdPercentage?: number;
    resetTimeout?: number;
    volumeThreshold?: number;
    name?: string;
  }

  interface Stats {
    latency?: { mean?: number };
  }

  class Opossum {
    constructor(fn: (...args: unknown[]) => unknown, opts?: Options);
    fire(...args: unknown[]): Promise<unknown>;
    on(event: 'success' | 'failure' | 'reject' | 'timeout' | 'open' | 'close' | 'halfOpen', listener: () => void): void;
    open(): void;
    close(): void;
    opened: boolean;
    halfOpen: boolean;
    stats: Stats;
  }

  export default Opossum;
  export { Opossum as CircuitBreaker };
}
