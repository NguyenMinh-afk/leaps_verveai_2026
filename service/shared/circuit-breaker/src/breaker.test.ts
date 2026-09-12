/**
 * Tests for Circuit Breaker wrapper
 * Mocks opossum to test our wrapper behavior
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// `vi.mock` is hoisted to the top of the file by vitest, so any helpers
// it references must be created with `vi.hoisted(...)` — otherwise the
// factory runs before the variable exists and we get a ReferenceError.
const opossumMock = vi.hoisted(() => {
  const mockFire = vi.fn();
  const mockOn = vi.fn();
  const mockClose = vi.fn();
  const mockOpen = vi.fn();
  const mockStats = vi.fn();
  // `breaker.opened` and `breaker.halfOpen` are real opossum *getters*
  // (boolean properties) — so the mock must expose them as configurable
  // properties, not as functions. We back them with a tiny mutable state
  // object that tests flip via `setOpened` / `setHalfOpen`.
  const state = { opened: false, halfOpen: false };

  const Ctor = vi.fn().mockImplementation(() => ({
    fire: mockFire,
    on: mockOn,
    close: mockClose,
    open: mockOpen,
    // `stats` is a real opossum getter — back it with a getter that
    // calls our spy so `mockStats.mockReturnValue(...)` takes effect.
    get stats() {
      return mockStats();
    },
    get opened() {
      return state.opened;
    },
    get halfOpen() {
      return state.halfOpen;
    },
  }));

  return {
    Ctor,
    mockFire,
    mockOn,
    mockClose,
    mockOpen,
    mockStats,
    state,
    setOpened: (v: boolean) => {
      state.opened = v;
    },
    setHalfOpen: (v: boolean) => {
      state.halfOpen = v;
    },
  };
});

vi.mock('opossum', () => ({
  default: opossumMock.Ctor,
}));

import { createBreaker } from './index';

beforeEach(() => {
  opossumMock.mockFire.mockReset();
  opossumMock.mockOn.mockReset();
  opossumMock.mockClose.mockReset();
  opossumMock.mockOpen.mockReset();
  opossumMock.mockStats.mockReset();
  opossumMock.setOpened(false);
  opossumMock.setHalfOpen(false);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('createBreaker', () => {
  it('should return a breaker', () => {
    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    expect(breaker).toBeDefined();
    expect(typeof breaker.fire).toBe('function');
    expect(typeof breaker.getStats).toBe('function');
    expect(typeof breaker.isOpen).toBe('function');
    expect(typeof breaker.close).toBe('function');
    expect(typeof breaker.open).toBe('function');
  });

  it('should call the function via fire', async () => {
    const fn = vi.fn().mockResolvedValue('result');
    opossumMock.mockFire.mockResolvedValue('result');

    const breaker = createBreaker('test-breaker', fn);
    const result = await breaker.fire('arg1', 'arg2');

    expect(opossumMock.mockFire).toHaveBeenCalledWith('arg1', 'arg2');
    expect(result).toBe('result');
  });

  it('should throw when circuit is open', async () => {
    const fn = async () => 'result';
    const error = new Error('Breaker is open');
    opossumMock.mockFire.mockRejectedValue(error);

    const breaker = createBreaker('test-breaker', fn);

    await expect(breaker.fire()).rejects.toThrow('Breaker is open');
  });

  it('should return stats from getStats', () => {
    opossumMock.setOpened(false);
    opossumMock.setHalfOpen(false);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();
    expect(stats).toHaveProperty('name', 'test-breaker');
    expect(stats).toHaveProperty('state');
    expect(stats).toHaveProperty('failures');
    expect(stats).toHaveProperty('successes');
  });

  it('should return OPEN state when opened', () => {
    opossumMock.setOpened(true);
    opossumMock.setHalfOpen(false);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();
    expect(stats.state).toBe('OPEN');
  });

  it('should return HALF_OPEN state when halfOpen', () => {
    opossumMock.setOpened(false);
    opossumMock.setHalfOpen(true);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();
    expect(stats.state).toBe('HALF_OPEN');
  });

  it('should return CLOSED state when neither opened nor halfOpen', () => {
    opossumMock.setOpened(false);
    opossumMock.setHalfOpen(false);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();
    expect(stats.state).toBe('CLOSED');
  });

  it('isOpen should return boolean from opossum opened property', () => {
    opossumMock.setOpened(true);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    expect(breaker.isOpen()).toBe(true);
  });

  it('isOpen should return false when circuit is closed', () => {
    opossumMock.setOpened(false);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    expect(breaker.isOpen()).toBe(false);
  });

  it('close() should call opossum close', () => {
    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    breaker.close();

    expect(opossumMock.mockClose).toHaveBeenCalledTimes(1);
  });

  it('open() should call opossum open', () => {
    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    breaker.open();

    expect(opossumMock.mockOpen).toHaveBeenCalledTimes(1);
  });

  it('should register event handlers', () => {
    const fn = async () => 'result';
    createBreaker('test-breaker', fn);

    expect(opossumMock.mockOn).toHaveBeenCalledWith('success', expect.any(Function));
    expect(opossumMock.mockOn).toHaveBeenCalledWith('failure', expect.any(Function));
    expect(opossumMock.mockOn).toHaveBeenCalledWith('reject', expect.any(Function));
  });

  it('should increment failures on failure event', () => {
    opossumMock.setOpened(false);
    opossumMock.setHalfOpen(false);
    opossumMock.mockStats.mockReturnValue({ latency: { mean: 0 } });

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    // Get the failure handler
    const failureHandler = opossumMock.mockOn.mock.calls.find(
      (call) => call[0] === 'failure',
    )?.[1] as () => void;

    expect(failureHandler).toBeDefined();
    failureHandler();
    failureHandler();

    const stats = breaker.getStats();
    expect(stats.failures).toBe(2);
  });

  it('should increment successes on success event', () => {
    opossumMock.setOpened(false);
    opossumMock.setHalfOpen(false);
    opossumMock.mockStats.mockReturnValue({ latency: { mean: 0 } });

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const successHandler = opossumMock.mockOn.mock.calls.find(
      (call) => call[0] === 'success',
    )?.[1] as () => void;

    expect(successHandler).toBeDefined();
    successHandler();

    const stats = breaker.getStats();
    expect(stats.successes).toBe(1);
  });

  it('should increment rejects on reject event', () => {
    opossumMock.setOpened(false);
    opossumMock.setHalfOpen(false);
    opossumMock.mockStats.mockReturnValue({ latency: { mean: 0 } });

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const rejectHandler = opossumMock.mockOn.mock.calls.find(
      (call) => call[0] === 'reject',
    )?.[1] as () => void;

    expect(rejectHandler).toBeDefined();
    rejectHandler();

    const stats = breaker.getStats();
    expect(stats.rejects).toBe(1);
  });

  it('should compute latency mean from opossum stats', () => {
    opossumMock.setOpened(false);
    opossumMock.setHalfOpen(false);
    opossumMock.mockStats.mockReturnValue({ latency: { mean: 42 } });

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();
    expect(stats.latencyMean).toBe(42);
  });

  it('should return 0 latency mean when stats are unavailable', () => {
    opossumMock.setOpened(false);
    opossumMock.setHalfOpen(false);
    opossumMock.mockStats.mockReturnValue(undefined);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();
    expect(stats.latencyMean).toBe(0);
  });
});
