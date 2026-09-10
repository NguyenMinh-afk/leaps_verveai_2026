import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    test: {
      globals: true,
      environment: 'node',
      include: ['tests/unit/**/*.test.ts'],
      env: {
        NODE_ENV: 'test',
        DATABASE_URL: 'postgresql://test:test@localhost:5432/test_auth?schema=auth',
        JWT_SECRET: 'test-jwt-secret-key-32-characters-long-for-testing',
        JWT_ISSUER: 'verveai-test',
        JWT_EXPIRES_IN: '1h',
        CONSUL_HOST: 'localhost',
        CONSUL_PORT: '8500',
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 70,
          statements: 80,
        },
      },
    },
  };
});
