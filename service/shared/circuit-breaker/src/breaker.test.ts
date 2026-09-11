/**
 * Tests for Circuit Breaker wrapper
 * Mocks opossum to test our wrapper behavior
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock opossum before importing our module
const mockFire = vi.fn();
const mockOn = vi.fn();
const mockClose = vi.fn();
const mockOpen = vi.fn();
const mockOpened = vi.fn();
const mockHalfOpen = vi.fn();
const mockStats = vi.fn();

vi.mock('opossum', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      fire: mockFire,
      on: mockOn,
      close: mockClose,
      open: mockOpen,
      opened: mockOpened,
      halfOpen: mockHalfOpen,
      stats: mockStats,
    })),
  };
});

import { createBreaker } from './index';

beforeEach(() => {
  mockFire.mockReset();
  mockOn.mockReset();
  mockClose.mockReset();
  mockOpen.mockReset();
  mockOpened.mockReset();
  mockHalfOpen.mockReset();
  mockStats.mockReset();
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
    mockFire.mockResolvedValue('result');

    const breaker = createBreaker('test-breaker', fn);
    const result = await breaker.fire('arg1', 'arg2');

    expect(mockFire).toHaveBeenCalledWith('arg1', 'arg2');
    expect(result).toBe('result');
  });

  it('should throw when circuit is open', async () => {
    const fn = async () => 'result';
    const error = new Error('Breaker is open');
    mockFire.mockRejectedValue(error);

    const breaker = createBreaker('test-breaker', fn);

    await expect(breaker.fire()).rejects.toThrow('Breaker is open');
  });

  it('should return stats from getStats', () => {
    mockOpened.mockReturnValue(false);
    mockHalfOpen.mockReturnValue(false);
    mockStats.mockReturnValue({ latency: { mean: 100 } });

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();

    expect(stats).toHaveProperty('name', 'test-breaker');
    expect(stats).toHaveProperty('state');
    expect(stats).toHaveProperty('failures');
    expect(stats).toHaveProperty('successes');
    expect(stats).toHaveProperty('rejects');
    expect(stats).toHaveProperty('latencyMean');
    expect(typeof stats.state).toBe('string');
  });

  it('should return OPEN state when opened', () => {
    mockOpened.mockReturnValue(true);
    mockHalfOpen.mockReturnValue(false);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();
    expect(stats.state).toBe('OPEN');
  });

  it('should return HALF_OPEN state when halfOpen', () => {
    mockOpened.mockReturnValue(false);
    mockHalfOpen.mockReturnValue(true);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();
    expect(stats.state).toBe('HALF_OPEN');
  });

  it('should return CLOSED state when neither opened nor halfOpen', () => {
    mockOpened.mockReturnValue(false);
    mockHalfOpen.mockReturnValue(false);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();
    expect(stats.state).toBe('CLOSED');
  });

  it('isOpen should return boolean from opossum opened property', () => {
    mockOpened.mockReturnValue(true);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    expect(breaker.isOpen()).toBe(true);
  });

  it('isOpen should return false when circuit is closed', () => {
    mockOpened.mockReturnValue(false);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    expect(breaker.isOpen()).toBe(false);
  });

  it('close() should call opossum close', () => {
    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    breaker.close();

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('open() should call opossum open', () => {
    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    breaker.open();

    expect(mockOpen).toHaveBeenCalledTimes(1);
  });

  it('should register event handlers', () => {
    const fn = async () => 'result';
    createBreaker('test-breaker', fn);

    expect(mockOn).toHaveBeenCalledWith('success', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('failure', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('reject', expect.any(Function));
  });

  it('should increment failures on failure event', () => {
    mockOpened.mockReturnValue(false);
    mockHalfOpen.mockReturnValue(false);
    mockStats.mockReturnValue({ latency: { mean: 0 } });

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    // Get the failure handler
    const failureHandler = mockOn.mock.calls.find(
      (call) => call[0] === 'failure',
    )?.[1] as () => void;

    expect(failureHandler).toBeDefined();
    failureHandler();
    failureHandler();

    const stats = breaker.getStats();
    expect(stats.failures).toBe(2);
  });

  it('should increment successes on success event', () => {
    mockOpened.mockReturnValue(false);
    mockHalfOpen.mockReturnValue(false);
    mockStats.mockReturnValue({ latency: { mean: 0 } });

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const successHandler = mockOn.mock.calls.find(
      (call) => call[0] === 'success',
    )?.[1] as () => void;

    expect(successHandler).toBeDefined();
    successHandler();

    const stats = breaker.getStats();
    expect(stats.successes).toBe(1);
  });

  it('should increment rejects on reject event', () => {
    mockOpened.mockReturnValue(false);
    mockHalfOpen.mockReturnValue(false);
    mockStats.mockReturnValue({ latency: { mean: 0 } });

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const rejectHandler = mockOn.mock.calls.find(
      (call) => call[0] === 'reject',
    )?.[1] as () => void;

    expect(rejectHandler).toBeDefined();
    rejectHandler();

    const stats = breaker.getStats();
    expect(stats.rejects).toBe(1);
  });

  it('should accept custom options', () => {
    const fn = async () => 'result';
    createBreaker('test-breaker', fn, {
      timeout: 5000,
      errorThresholdPercentage: 75,
      resetTimeout: 20000,
      volumeThreshold: 20,
      name: 'custom-name',
    });

    // CircuitBreaker constructor should be called with our options
    // (verified indirectly through the mock being called)
    expect(mockOn).toHaveBeenCalled();
  });

  it('should handle latency stats when stats are undefined', () => {
    mockOpened.mockReturnValue(false);
    mockHalfOpen.mockReturnValue(false);
    mockStats.mockReturnValue(undefined);

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();
    expect(stats.latencyMean).toBe(0);
  });

  it('should handle latency stats when latency is missing', () => {
    mockOpened.mockReturnValue(false);
    mockHalfOpen.mockReturnValue(false);
    mockStats.mockReturnValue({});

    const fn = async () => 'result';
    const breaker = createBreaker('test-breaker', fn);

    const stats = breaker.getStats();
    expect(stats.latencyMean).toBe(0);
  });
});
