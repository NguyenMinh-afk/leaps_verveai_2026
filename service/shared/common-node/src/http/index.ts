/**
 * HTTP client — fetch wrapper with retry, timeout, and error handling.
 *
 * Usage:
 *   import { httpClient } from '@verveai/common-node';
 *
 *   const data = await httpClient.get<User>('http://svc-auth:3001/api/users/123', {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *
 *   const result = await httpClient.post('/api/bkt/diagnosis', { studentId, skillId });
 *
 * @module http
 */

export interface HttpRequestInit extends RequestInit {
  /** Timeout in milliseconds — default 5000 */
  timeout?: number;
  /** Retry on failure — default 3 */
  retries?: number;
  /** Base URL — prepended to path if path doesn't start with http */
  baseUrl?: string;
}

export interface HttpResponse<T> {
  ok: boolean;
  status: number;
  statusText: string;
  data: T | null;
  error: string | null;
}

/**
 * Minimal HTTP client wrapping native fetch with timeout + retry.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;
  private readonly defaultRetries: number;

  constructor(baseUrl = '', defaultTimeout = 5000, defaultRetries = 3) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = defaultTimeout;
    this.defaultRetries = defaultRetries;
  }

  /**
   * Build full URL from path.
   * If path starts with http:// or https://, use as-is.
   * Otherwise prepend baseUrl.
   */
  private resolveUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    const base = this.baseUrl.replace(/\/$/, '');
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${base}${p}`;
  }

  /**
   * Execute fetch with AbortController timeout.
   */
  private async fetchWithTimeout(
    url: string,
    init: RequestInit,
    timeout: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Make an HTTP request with retry logic.
   * Retries on network errors and 5xx responses.
   */
  private async request<T>(
    method: string,
    path: string,
    init: HttpRequestInit = {},
  ): Promise<HttpResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      baseUrl,
      ...fetchInit
    } = init;

    const url = baseUrl ? new HttpClient(baseUrl, timeout, retries).resolveUrl(path) : this.resolveUrl(path);
    const mergedInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...fetchInit.headers,
      },
      ...fetchInit,
    };

    if (mergedInit.body && typeof mergedInit.body === 'object') {
      mergedInit.body = JSON.stringify(mergedInit.body);
    }

    let lastError: string = '';
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await this.fetchWithTimeout(url, mergedInit as RequestInit, timeout);
        const status = res.status;

        if (status >= 200 && status < 300) {
          let data: T | null = null;
          const contentType = res.headers.get('content-type') ?? '';
          if (contentType.includes('application/json')) {
            data = await res.json() as T;
          }
          return {
            ok: true,
            status,
            statusText: res.statusText,
            data,
            error: null,
          };
        }

        // 4xx — don't retry
        if (status >= 400 && status < 500) {
          const text = await res.text().catch(() => res.statusText);
          return {
            ok: false,
            status,
            statusText: res.statusText,
            data: null,
            error: text,
          };
        }

        // 5xx — retry
        lastError = `HTTP ${status}: ${res.statusText}`;
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
        if (lastError.includes('aborted')) {
          lastError = `Request timeout after ${timeout}ms`;
        }
      }

      if (attempt < retries) {
        // Exponential backoff: 100ms, 200ms, 400ms...
        const delay = Math.min(100 * 2 ** attempt, 5000);
        await sleep(delay);
      }
    }

    return {
      ok: false,
      status: 0,
      statusText: 'Network error',
      data: null,
      error: lastError,
    };
  }

  get<T>(path: string, init?: HttpRequestInit): Promise<HttpResponse<T>> {
    return this.request<T>('GET', path, init);
  }

  post<T>(path: string, init?: HttpRequestInit): Promise<HttpResponse<T>> {
    return this.request<T>('POST', path, init);
  }

  put<T>(path: string, init?: HttpRequestInit): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', path, init);
  }

  patch<T>(path: string, init?: HttpRequestInit): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', path, init);
  }

  delete<T>(path: string, init?: HttpRequestInit): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', path, init);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Default HTTP client instance */
export const httpClient = new HttpClient();
