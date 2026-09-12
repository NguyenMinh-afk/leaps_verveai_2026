/**
 * Tests for Consul HTTP API wrapper
 * Mocks `node-fetch` (the module consul.ts uses) so we can run unit
 * tests without a real Consul server. `global.fetch` is left untouched
 * because consul.ts relies on the `node-fetch` import specifically.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// `vi.mock` is hoisted to the top of the file by vitest, so any variables
// it references must be created with `vi.hoisted(...)` — otherwise the
// factory runs before the variable exists and we get a ReferenceError.
const mockFetch = vi.hoisted(() => vi.fn());

vi.mock('node-fetch', () => ({
  __esModule: true,
  default: mockFetch,
}));

import {
  registerService,
  deregisterService,
  resolveService,
  listAllServices,
  getHealthChecks,
  buildUrl,
  getConsulHost,
  getConsulPort,
} from './consul';

beforeEach(() => {
  mockFetch.mockReset();
  delete process.env.CONSUL_HOST;
  delete process.env.CONSUL_PORT;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('buildUrl', () => {
  it('should build URL with default host and port', () => {
    const url = buildUrl('/v1/test');
    expect(url).toBe('http://localhost:8500/v1/test');
  });

  it('should build URL with custom host and port', () => {
    const url = buildUrl('/v1/test', 'consul.example.com', 9500);
    expect(url).toBe('http://consul.example.com:9500/v1/test');
  });

  it('should use CONSUL_HOST env var', () => {
    process.env.CONSUL_HOST = 'env-host';
    expect(getConsulHost()).toBe('env-host');
  });

  it('should use CONSUL_PORT env var', () => {
    process.env.CONSUL_PORT = '9999';
    expect(getConsulPort()).toBe(9999);
  });
});

describe('registerService', () => {
  it('should call correct URL with PUT method', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(''),
    } as unknown as Response);

    await registerService({
      ID: 'svc-auth-3001',
      Name: 'svc-auth',
      Address: 'localhost',
      Port: 3001,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];

    expect(url).toBe('http://localhost:8500/v1/agent/service/register');
    expect(options.method).toBe('PUT');
    expect((options.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    expect(JSON.parse(options.body as string)).toEqual({
      ID: 'svc-auth-3001',
      Name: 'svc-auth',
      Address: 'localhost',
      Port: 3001,
    });
  });

  it('should use custom host and port', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(''),
    } as unknown as Response);

    await registerService({ Name: 'svc-test' }, 'remote-host', 9999);

    const [url] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://remote-host:9999/v1/agent/service/register');
  });

  it('should throw error when registration fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Internal Server Error'),
    } as unknown as Response);

    await expect(registerService({ Name: 'svc-test' })).rejects.toThrow('Failed to register service: 500');
  });
});

describe('deregisterService', () => {
  it('should call correct URL with PUT method', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(''),
    } as unknown as Response);

    await deregisterService('svc-auth-3001');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];

    expect(url).toBe('http://localhost:8500/v1/agent/service/deregister/svc-auth-3001');
    expect(options.method).toBe('PUT');
  });

  it('should throw error when deregistration fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve('Service not found'),
    } as unknown as Response);

    await expect(deregisterService('svc-test')).rejects.toThrow('Failed to deregister service: 404');
  });
});

describe('resolveService', () => {
  it('should return service instances', async () => {
    const mockServices = [
      { ServiceAddress: 'svc-auth.local', Address: '192.168.1.10', Port: 3001 },
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockServices),
    } as unknown as Response);

    const services = await resolveService('svc-auth');

    expect(services).toEqual(mockServices);
    const [url] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:8500/v1/catalog/service/svc-auth');
  });

  it('should throw error when service not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    } as unknown as Response);

    await expect(resolveService('nonexistent')).rejects.toThrow('Service nonexistent not found in Consul');
  });

  it('should throw error when API call fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as unknown as Response);

    await expect(resolveService('svc-test')).rejects.toThrow('Failed to resolve service svc-test: 500');
  });
});

describe('listAllServices', () => {
  it('should return services map', async () => {
    const mockData = {
      'svc-auth': [],
      'svc-bkt': [],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    } as unknown as Response);

    const services = await listAllServices();

    expect(services).toEqual(mockData);
    const [url] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:8500/v1/catalog/services');
  });

  it('should throw error when API call fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
    } as unknown as Response);

    await expect(listAllServices()).rejects.toThrow('Failed to list services: 503');
  });
});

describe('getHealthChecks', () => {
  it('should return health checks array', async () => {
    const mockChecks = [
      { Status: 'passing' },
      { Status: 'passing' },
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockChecks),
    } as unknown as Response);

    const checks = await getHealthChecks('svc-auth');

    expect(checks).toEqual(mockChecks);
    const [url] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:8500/v1/health/checks/svc-auth');
  });

  it('should return empty array when no checks', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    } as unknown as Response);

    const checks = await getHealthChecks('svc-auth');

    expect(checks).toEqual([]);
  });

  it('should throw error when API call fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as unknown as Response);

    await expect(getHealthChecks('svc-test')).rejects.toThrow('Failed to get health checks for svc-test: 500');
  });
});
