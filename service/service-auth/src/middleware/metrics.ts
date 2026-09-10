import type { Request, Response, NextFunction } from 'express';
import { httpRequestDuration } from './metricsRegistry';

export async function metricsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const end = httpRequestDuration.startTimer({
    method: req.method,
    route: req.route?.path ?? req.path,
    status_code: String(res.statusCode),
  });
  res.on('finish', () => end());
  next();
}
