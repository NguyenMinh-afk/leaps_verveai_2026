import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { logger } from './logger';

export function proxyRequest(upstream: string, servicePrefix: string): RequestHandler {
  return async (req: Request, res: Response, _next: NextFunction) => {
    // req.path includes route-specific path like /login, /logout
    // Service expects /api/{service}/{path}
    const path = `/api/${servicePrefix}${req.path}`;
    const url = `${upstream}${path}`;
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Forwarded-For': req.ip ?? '',
        'X-User-Id': String(req.headers['x-user-id'] ?? ''),
        'X-User-Role': String(req.headers['x-user-role'] ?? ''),
        'X-User-Email': String(req.headers['x-user-email'] ?? ''),
      };

      const response = await fetch(url, {
        method: req.method,
        headers,
        body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (err) {
      logger.error('Proxy error', { upstream, path, error: String(err) });
      res.status(502).json({
        success: false,
        error: { code: 'BAD_GATEWAY', message: 'Upstream service unavailable' },
      });
    }
  };
}
