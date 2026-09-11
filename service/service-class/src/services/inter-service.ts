/**
 * Cross-service HTTP helpers for service-class.
 *
 * Every inter-service call MUST be wrapped in a circuit breaker so that a
 * downstream outage does not cascade into our request handlers. We resolve
 * the target URL through Consul (never hard-coded) and propagate the
 * `X-User-Id` / `X-User-Role` headers injected by the Gateway so the
 * downstream service can run its own authorization checks.
 *
 * Only svc-bkt is needed today; the same pattern can be replicated for
 * svc-auth, svc-content, etc. as new flows land.
 */

import { createBreaker } from '@verveai/circuit-breaker';
import { Consul } from '@verveai/consul-client';
import { logger } from '../utils/logger.js';

/**
 * Shape of the per-request context headers we forward to downstream
 * services. The Gateway injects them after JWT verification; if the call
 * originates from a background job the headers will be empty strings.
 */
export interface InterServiceHeaders {
  userId?: string;
  userRole?: string;
  requestId?: string;
}

/**
 * Pull the inter-service headers out of an Express request (if present).
 * Used by route handlers to forward caller context to svc-bkt.
 */
export function extractInterServiceHeaders(req: {
  headers: Record<string, string | string[] | undefined>;
}): InterServiceHeaders {
  const headerValue = (key: string): string | undefined => {
    const raw = req.headers[key.toLowerCase()];
    if (typeof raw === 'string') return raw;
    if (Array.isArray(raw) && raw.length > 0) return raw[0];
    return undefined;
  };
  return {
    userId: headerValue('x-user-id'),
    userRole: headerValue('x-user-role'),
    requestId: headerValue('x-request-id')
  };
}

/**
 * Build the `fetch` `RequestInit` for an inter-service call.
 *
 * The wrapper returns a fresh object on every call so that concurrent
 * invocations cannot mutate each other's headers/body.
 */
function buildInit(
  init: RequestInit | undefined,
  ctx: InterServiceHeaders
): RequestInit {
  const merged: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-User-Id': ctx.userId ?? '',
    'X-User-Role': ctx.userRole ?? '',
    'X-Request-Id': ctx.requestId ?? ''
  };

  if (init?.headers !== undefined) {
    const incoming = init.headers;
    if (incoming instanceof Headers) {
      incoming.forEach((value, key) => {
        if (key !== undefined) {
          merged[key] = value;
        }
      });
    } else if (Array.isArray(incoming)) {
      for (const entry of incoming) {
        const [key, value] = entry;
        if (key !== undefined && value !== undefined) {
          merged[key] = value;
        }
      }
    } else {
      for (const [key, value] of Object.entries(incoming as Record<string, string>)) {
        merged[key] = value;
      }
    }
  }

  return {
    ...init,
    headers: merged
  };
}

/**
 * Circuit breaker that wraps outbound HTTP calls to svc-bkt.
 *
 * The breaker opens after ~50% failures within the rolling window, then
 * fast-fails for 10 seconds before allowing a single trial request. Any
 * thrown error inside the wrapped function — including non-2xx responses —
 * counts toward the failure rate.
 */
const bktBreaker = createBreaker(
  'svc-bkt',
  async (
    path: string,
    init: RequestInit | undefined,
    ctx: InterServiceHeaders
  ): Promise<Response> => {
    const baseUrl = await Consul.resolve('svc-bkt');
    const url = `${baseUrl}${path}`;
    const finalInit = buildInit(init, ctx);
    logger.debug('Calling svc-bkt', { url, method: finalInit.method ?? 'GET' });
    const response = await fetch(url, finalInit);
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `svc-bkt call failed: ${response.status} ${response.statusText} ${text}`
      );
    }
    return response;
  },
  {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000
  }
);

/**
 * Public helper for calling svc-bkt and getting the parsed JSON body.
 *
 * Returns `null` (NOT throws) when the breaker is open or the request
 * fails so that callers in the student flow can degrade gracefully and
 * still return core data from the local database.
 */
export interface CallSvcBktOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  ctx?: InterServiceHeaders;
  /** When true, throw on failure instead of returning null. Default: false. */
  throwOnError?: boolean;
}

export async function callSvcBkt<T = unknown>(
  path: string,
  options: CallSvcBktOptions = {}
): Promise<T | null> {
  const init: RequestInit = {
    method: options.method ?? 'GET'
  };
  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  try {
    const response = await bktBreaker.fire(path, init, options.ctx ?? {});
    // We already verified `response.ok` in the wrapped function.
    const json = (await response.json()) as T;
    return json;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn('svc-bkt call failed; degrading gracefully', {
      path,
      message,
      breakerOpen: bktBreaker.isOpen()
    });
    if (options.throwOnError === true) {
      throw err;
    }
    return null;
  }
}

/**
 * Lightweight auth lookup for class ownership checks. The Gateway is the
 * single source of truth for authentication, so we only consult svc-auth
 * to confirm that the supplied teacherId corresponds to a real user.
 */
const authBreaker = createBreaker(
  'svc-auth',
  async (
    path: string,
    init: RequestInit | undefined,
    ctx: InterServiceHeaders
  ): Promise<Response> => {
    const baseUrl = await Consul.resolve('svc-auth');
    const finalInit = buildInit(init, ctx);
    const url = `${baseUrl}${path}`;
    logger.debug('Calling svc-auth', { url, method: finalInit.method ?? 'GET' });
    const response = await fetch(url, finalInit);
    if (!response.ok) {
      throw new Error(
        `svc-auth call failed: ${response.status} ${response.statusText}`
      );
    }
    return response;
  },
  {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000
  }
);

export async function callSvcAuth<T = unknown>(
  path: string,
  options: CallSvcBktOptions = {}
): Promise<T | null> {
  const init: RequestInit = {
    method: options.method ?? 'GET'
  };
  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  try {
    const response = await authBreaker.fire(path, init, options.ctx ?? {});
    const json = (await response.json()) as T;
    return json;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn('svc-auth call failed', {
      path,
      message,
      breakerOpen: authBreaker.isOpen()
    });
    if (options.throwOnError === true) {
      throw err;
    }
    return null;
  }
}
