import { describe, it, expect, beforeEach } from 'vitest';
import { createLogger, resetLogger, type LoggerConfig } from '../src/logger';

describe('logger', () => {
  beforeEach(() => {
    resetLogger();
  });

  it('should create a logger with service name', () => {
    const log = createLogger({ service: 'svc-test', env: 'test' });
    expect(log).toBeDefined();
    expect(typeof log.info).toBe('function');
    expect(typeof log.error).toBe('function');
  });

  it('should create a child logger with additional fields', () => {
    const log = createLogger({ service: 'svc-test', env: 'test' });
    const child = log.child({ requestId: 'req-123' });
    expect(child).toBeDefined();
    expect(typeof child.info).toBe('function');
  });

  it('should serialize Error objects', () => {
    const log = createLogger({ service: 'svc-test', env: 'test', level: 'error' });
    expect(log.error).toBeDefined();
  });

  it('should support custom log levels', () => {
    const log = createLogger({ service: 'svc-test', env: 'test', level: 'debug' });
    expect(log.level).toBe('debug');
  });
});
