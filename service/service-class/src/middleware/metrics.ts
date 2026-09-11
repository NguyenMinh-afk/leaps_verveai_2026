import { Request, Response, NextFunction } from 'express';
import { metricsRegistry } from './metricsRegistry.js';

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode.toString()
    };

    metricsRegistry.httpRequestDuration.observe(labels, duration);
    metricsRegistry.httpRequestsTotal.inc(labels);
  });

  next();
}

export function metricsHandler(_req: Request, res: Response): void {
  res.set('Content-Type', metricsRegistry.register.contentType);
  metricsRegistry.register.metrics().then((metrics) => {
    res.send(metrics);
  });
}
