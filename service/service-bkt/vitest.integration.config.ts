import { defineConfig } from 'vitest/config';

/**
 * Integration / E2E / smoke config — runs against a process-in-process
 * Express app (no real Postgres / Consul).
 *
 *   • tests/integration/** — service-level integration (mocked Prisma)
 *   • tests/e2e/**         — HTTP-layer E2E with supertest (mocked Prisma)
 *   • tests/smoke/**       — live HTTP smoke test booting a real listener
 *
 * Use `pnpm test:integration` or `pnpm test:smoke`.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'tests/integration/**/*.test.ts',
      'tests/e2e/**/*.test.ts',
      'tests/smoke/**/*.smoke.ts',
    ],
    exclude: ['node_modules', 'dist', 'coverage', 'tests/unit/**'],
    testTimeout: 15000,
    hookTimeout: 15000
  }
});