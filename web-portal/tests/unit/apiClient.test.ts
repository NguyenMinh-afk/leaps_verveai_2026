/**
 * Tests for the API client.
 *
 * Covers:
 *  - GET request attaches Authorization header when token present
 *  - GET request skips Authorization when skipAuth=true
 *  - POST serialises JSON body
 *  - Throws ApiError on non-2xx with structured payload
 *  - Throws ApiError on network failure
 *  - Throws ApiError when response is not valid JSON
 *  - Token storage helpers (get/set/clear)
 *  - Gateway URL helper
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  api,
  ApiError,
  apiRequest,
  clearStoredToken,
  getGatewayUrl,
  getStoredToken,
  setStoredToken,
} from '@/lib/api/apiClient';

const ORIGINAL_FETCH = global.fetch;

afterEach(() => {
  global.fetch = ORIGINAL_FETCH;
  clearStoredToken();
  vi.restoreAllMocks();
});

function mockFetchOnce(impl: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) {
  global.fetch = vi.fn().mockImplementation(impl) as unknown as typeof fetch;
}

describe('apiClient — token storage', () => {
  beforeEach(() => clearStoredToken());

  it('returns null when no token is stored', () => {
    expect(getStoredToken()).toBeNull();
  });

  it('stores and retrieves the token', () => {
    setStoredToken('abc123');
    expect(getStoredToken()).toBe('abc123');
  });

  it('clears the token', () => {
    setStoredToken('abc123');
    clearStoredToken();
    expect(getStoredToken()).toBeNull();
  });

  it('removes the token when setStoredToken(null)', () => {
    setStoredToken('abc123');
    setStoredToken(null);
    expect(getStoredToken()).toBeNull();
  });
});

describe('apiClient — getGatewayUrl', () => {
  it('returns a non-empty string', () => {
    const url = getGatewayUrl();
    expect(url).toBeTruthy();
    expect(typeof url).toBe('string');
  });
});

describe('apiClient — apiRequest', () => {
  it('attaches Authorization header from storage on GET', async () => {
    setStoredToken('test-token');
    let capturedUrl = '';
    let capturedInit: RequestInit | undefined;
    mockFetchOnce(async (url, init) => {
      capturedUrl = String(url);
      capturedInit = init;
      return new Response(
        JSON.stringify({ success: true, data: { ok: true }, error: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    });

    await apiRequest('/api/class/classes');

    expect(capturedUrl).toContain('/api/class/classes');
    expect(capturedInit?.method).toBe('GET');
    const headers = capturedInit?.headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer test-token');
  });

  it('skips Authorization when skipAuth=true', async () => {
    setStoredToken('test-token');
    let capturedInit: RequestInit | undefined;
    mockFetchOnce(async (_url, init) => {
      capturedInit = init;
      return new Response(
        JSON.stringify({ success: true, data: { token: 't' }, error: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    });

    await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'a@b.c', password: 'pwd' },
      skipAuth: true,
    });

    const headers = capturedInit?.headers as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });

  it('serialises JSON body for POST', async () => {
    let capturedInit: RequestInit | undefined;
    mockFetchOnce(async (_url, init) => {
      capturedInit = init;
      return new Response(
        JSON.stringify({ success: true, data: { id: 'x' }, error: null }),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      );
    });

    await apiRequest('/api/class/classes', {
      method: 'POST',
      body: { name: 'Math 101' },
    });

    expect(capturedInit?.method).toBe('POST');
    expect(JSON.parse(capturedInit?.body as string)).toEqual({ name: 'Math 101' });
    const headers = capturedInit?.headers as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('throws ApiError on non-2xx envelope', async () => {
    mockFetchOnce(async () =>
      new Response(
        JSON.stringify({
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'no such class' },
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    await expect(apiRequest('/api/class/classes/x')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      code: 'NOT_FOUND',
      message: 'no such class',
    });
  });

  it('throws ApiError on network failure', async () => {
    mockFetchOnce(async () => {
      throw new Error('socket hangup');
    });

    await expect(apiRequest('/api/class/classes')).rejects.toBeInstanceOf(ApiError);
  });

  it('throws ApiError when response body is not JSON', async () => {
    mockFetchOnce(async () => new Response('plain text', { status: 500 }));

    await expect(apiRequest('/api/class/classes')).rejects.toMatchObject({
      name: 'ApiError',
      code: 'INVALID_JSON',
    });
  });

  it('returns envelope on success', async () => {
    mockFetchOnce(async () =>
      new Response(
        JSON.stringify({ success: true, data: [{ id: 'c1' }], error: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const result = await apiRequest<Array<{ id: string }>>('/api/class/classes');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual([{ id: 'c1' }]);
    }
  });
});

describe('apiClient — shorthand helpers', () => {
  it('api.get calls apiRequest with method GET', async () => {
    let capturedInit: RequestInit | undefined;
    mockFetchOnce(async (_url, init) => {
      capturedInit = init;
      return new Response(JSON.stringify({ success: true, data: [], error: null }), {
        status: 200,
      });
    });
    await api.get('/api/x');
    expect(capturedInit?.method).toBe('GET');
  });

  it('api.post calls apiRequest with method POST + body', async () => {
    let capturedInit: RequestInit | undefined;
    mockFetchOnce(async (_url, init) => {
      capturedInit = init;
      return new Response(JSON.stringify({ success: true, data: null, error: null }), {
        status: 200,
      });
    });
    await api.post('/api/x', { hello: 'world' });
    expect(capturedInit?.method).toBe('POST');
    expect(JSON.parse(capturedInit?.body as string)).toEqual({ hello: 'world' });
  });

  it('api.put + api.delete use PUT/DELETE methods', async () => {
    let lastMethod = '';
    mockFetchOnce(async (_url, init) => {
      lastMethod = String(init?.method);
      return new Response(JSON.stringify({ success: true, data: null, error: null }), {
        status: 200,
      });
    });
    await api.put('/api/x', { name: 'n' });
    expect(lastMethod).toBe('PUT');
    await api.delete('/api/x');
    expect(lastMethod).toBe('DELETE');
  });
});
