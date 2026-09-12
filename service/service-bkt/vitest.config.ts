import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Include unit + e2e tests so the coverage report reflects all code
    // exercised by HTTP-layer tests. Integration tests (which exercise
    // the service layer with mocked Prisma) are excluded because they
    // run under a separate config (`vitest.integration.config.ts`).
    include: [
      'tests/unit/**/*.test.ts',
      'tests/e2e/**/*.test.ts',
      'src/**/*.test.ts',
    ],
    exclude: ['node_modules', 'dist', 'coverage', 'tests/integration/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        'tests/',
        'src/generated/**',
        'src/index.ts',
        'src/tracing.ts',
        'src/prisma/client.ts',
        'src/config/consul.ts',
        'src/middleware/metrics*.ts',
        'src/middleware/metricsRegistry.ts',
        'src/app.ts',
        '**/*.test.ts',
        '**/*.config.ts',
        'vitest.config.ts',
        '*.d.ts'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000
  }
});