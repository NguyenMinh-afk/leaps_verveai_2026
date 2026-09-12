import { defineConfig } from 'vitest/config';

/**
 * Integration config — runs the full flow against a process-in-process
 * Express app (no real Postgres / Consul). Use `pnpm test:integration`.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage', 'tests/unit/**'],
    testTimeout: 15000,
    hookTimeout: 15000
  }
});
