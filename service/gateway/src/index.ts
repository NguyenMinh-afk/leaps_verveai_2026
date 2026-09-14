import 'dotenv/config';
import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { join } from 'path';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { metricsHandler } from './middleware/metrics';
import { healthRouter } from './routes/health.routes';
import authRouter from './routes/auth.routes';
import bktRouter from './routes/bkt.routes';
import classRouter from './routes/class.routes';
import contentRouter from './routes/content.routes';
import syncRouter from './routes/sync.routes';
import assignmentRouter from './routes/assignment.routes';
import examRouter from './routes/exam.routes';
import aiRouter from './routes/ai.routes';
import reportsRouter from './routes/reports.routes';
import { verifyJwt } from './policies/jwt';
import type { GatewayConfig } from './types/config';

interface ServiceEndpoint {
  url: string;
}

interface ApiEndpoint {
  paths: string[];
}

interface Pipeline {
  apiEndpoints: string[];
  policies: string[];
}

interface Config {
  http: { port: number };
  apiEndpoints: Record<string, ApiEndpoint>;
  serviceEndpoints: Record<string, ServiceEndpoint>;
  pipelines: Record<string, Pipeline>;
}

async function main() {
  const app = express();

  // Load config from YAML
  const configPath = join(__dirname, '..', 'config', 'gateway.config.yml');
  let config: Config;
  try {
    const raw = readFileSync(configPath, 'utf-8');
    config = parse(raw) as Config;
  } catch {
    logger.warn('gateway.config.yml not found, using env fallback');
    config = {
      http: { port: Number(process.env['PORT'] ?? 8080) },
      apiEndpoints: {
        auth: { paths: ['/api/auth/*'] },
        bkt: { paths: ['/api/bkt/*'] },
        class: { paths: ['/api/class/*'] },
        content: { paths: ['/api/content/*'] },
        sync: { paths: ['/api/sync/*'] },
        assignment: { paths: ['/api/assignment/*'] },
        exam: { paths: ['/api/exam/*'] },
        ai: { paths: ['/api/ai/*'] },
      },
      serviceEndpoints: {
        svcAuth: { url: process.env['SVC_AUTH_URL'] ?? 'http://svc-auth:3001' },
        svcBkt: { url: process.env['SVC_BKT_URL'] ?? 'http://svc-bkt:3002' },
        svcClass: { url: process.env['SVC_CLASS_URL'] ?? 'http://svc-class:3003' },
        svcContent: { url: process.env['SVC_CONTENT_URL'] ?? 'http://svc-content:3004' },
        svcSync: { url: process.env['SVC_SYNC_URL'] ?? 'http://svc-sync:3005' },
        svcExam: { url: process.env['SVC_EXAM_URL'] ?? 'http://svc-exam:3007' },
        svcAi: { url: process.env['SVC_AI_URL'] ?? 'http://svc-ai:3008' },
      },
      pipelines: {
        default: {
          apiEndpoints: ['auth', 'bkt', 'class', 'content', 'sync', 'assignment', 'exam', 'ai'],
          policies: ['cors', 'rate-limit', 'jwt', 'proxy'],
        },
      },
    };
  }

  // Middleware
  app.use(helmet());
  
  const corsOrigins = (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000').split(',');
  app.use(cors({ origin: corsOrigins, credentials: true }));
  
  app.use(express.json());
  app.use(metricsHandler);

  // Rate limiting
  const authLimiter = rateLimit({
    windowMs: Number(process.env['RATE_LIMIT_WINDOW_MS'] ?? 60000),
    max: Number(process.env['RATE_LIMIT_AUTH'] ?? 100),
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
  });

  const apiLimiter = rateLimit({
    windowMs: Number(process.env['RATE_LIMIT_WINDOW_MS'] ?? 60000),
    max: Number(process.env['RATE_LIMIT_API'] ?? 1000),
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
  });

  // Health check
  app.use('/health', healthRouter);

  // Auth routes — rate limit auth endpoints
  app.use('/api/auth', authLimiter, authRouter);
  
  // API routes — rate limit + JWT
  app.use('/api/bkt', apiLimiter, verifyJwt, bktRouter);
  app.use('/api/class', apiLimiter, verifyJwt, classRouter);
  app.use('/api/content', apiLimiter, verifyJwt, contentRouter);
  app.use('/api/sync', apiLimiter, verifyJwt, syncRouter);
  app.use('/api/assignment', apiLimiter, verifyJwt, assignmentRouter);
  app.use('/api/exam', apiLimiter, verifyJwt, examRouter);
  app.use('/api/ai', apiLimiter, verifyJwt, aiRouter);

  // Admin reports - requires JWT and admin role check is in the route itself
  app.use('/api/reports', apiLimiter, verifyJwt, reportsRouter);

  // Error handler
  app.use(errorHandler);

  const port = config.http?.port ?? Number(process.env['PORT'] ?? 8080);
  
  app.listen(port, () => {
    logger.info(`Gateway listening on port ${port}`);
    logger.info(`Environment: ${process.env['NODE_ENV'] ?? 'development'}`);
  });
}

main().catch((err) => {
  console.error('Gateway startup failed:', err);
  logger.error('Gateway startup failed', { error: err.message, stack: err.stack });
  process.exit(1);
});
