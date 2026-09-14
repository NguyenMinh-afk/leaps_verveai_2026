import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_content?schema=content',
      ED25519_PRIVATE_KEY_PATH: './tests/fixtures/test_private.pem',
      ED25519_PUBLIC_KEY_PATH: './tests/fixtures/test_public.pem',
      CONSUL_HOST: 'localhost',
      CONSUL_PORT: '8500',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        'tests/',
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
