/**
 * VERVEAI — API Client
 *
 * Single entry point for all web-portal → Gateway communication.
 *
 * Rules:
 *  - NEVER call microservices directly. Always go through Gateway
 *    (`NEXT_PUBLIC_GATEWAY_URL`, default `http://localhost:8080`).
 *  - Bearer token attached automatically when present in storage.
 *  - Throws `ApiError` with normalised shape on non-2xx responses.
 */

const GATEWAY_URL =
  (typeof process !== 'undefined' && process.env['NEXT_PUBLIC_GATEWAY_URL']) ||
  'http://localhost:8080';

const TOKEN_STORAGE_KEY = 'verveai.auth.token';

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details: Record<string, unknown> | undefined;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message || `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = payload.code || 'UNKNOWN_ERROR';
    this.details = payload.details;
  }
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  error: null;
}

export interface ApiFailure {
  success: false;
  data: null;
  error: ApiErrorPayload | null;
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Skip attaching the bearer token (used for /api/auth/login). */
  skipAuth?: boolean;
  /** Override default Gateway URL — only for testing/mocking. */
  baseUrl?: string;
}

export function getGatewayUrl(): string {
  return GATEWAY_URL;
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token === null) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } else {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export function clearStoredToken(): void {
  setStoredToken(null);
}

function buildUrl(path: string, baseUrl?: string): string {
  const base = baseUrl ?? GATEWAY_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/$/, '')}${cleanPath}`;
}

export function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiEnvelope<T>> {
  const { method = 'GET', body, headers = {}, signal, skipAuth = false, baseUrl } = options;

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const token = getStoredToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  return (async () => {
    let response: Response;
    try {
      response = await fetch(buildUrl(path, baseUrl), {
        method,
        headers: requestHeaders,
        body:
          body === undefined
            ? undefined
            : body instanceof FormData
              ? body
              : JSON.stringify(body),
        signal,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error';
      throw new ApiError(0, { code: 'NETWORK_ERROR', message });
    }

    let envelope: ApiEnvelope<T> | null = null;
    try {
      envelope = (await response.json()) as ApiEnvelope<T>;
    } catch {
      throw new ApiError(response.status, {
        code: 'INVALID_JSON',
        message: `Response was not valid JSON (status ${response.status})`,
      });
    }

    if (!response.ok || envelope.success === false) {
      const errorPayload: ApiErrorPayload =
        envelope.error ?? { code: 'HTTP_ERROR', message: response.statusText };
      throw new ApiError(response.status, errorPayload);
    }

    return envelope;
  })();
}

function unwrap<T>(envelope: ApiEnvelope<T>): T {
  if (envelope.success) {
    return envelope.data as T;
  }
  throw new ApiError(500, envelope.error ?? { code: 'UNKNOWN_ERROR', message: 'Unknown error' });
}

export const api = {
  get: async <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) => {
    const env = await apiRequest<T>(path, { ...options, method: 'GET' });
    return unwrap(env);
  },
  post: async <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method'>) => {
    const env = await apiRequest<T>(path, { ...options, method: 'POST', body });
    return unwrap(env);
  },
  put: async <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method'>) => {
    const env = await apiRequest<T>(path, { ...options, method: 'PUT', body });
    return unwrap(env);
  },
  delete: async <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) => {
    const env = await apiRequest<T>(path, { ...options, method: 'DELETE' });
    return unwrap(env);
  },
};
