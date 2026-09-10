import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import healthRouter from './routes/health.routes';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import { metricsHandler } from './middleware/metrics';
import { initTracing } from './tracing';
import { registerService } from './config/consul';
import { prisma } from './prisma/client';

initTracing({ serviceName: 'svc-auth', serviceVersion: '1.0.0' });

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(metricsHandler);

// Routes
app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// Error handler
app.use(errorHandler);

const PORT = Number(process.env['PORT'] ?? 3001);

async function bootstrap(): Promise<void> {
  await registerService();
  
  app.listen(PORT, () => {
    logger.info(`svc-auth listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  logger.error('svc-auth startup failed', { error: err });
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  const { ConsulClient } = await import('@verveai/consul-client');
  const consul = new ConsulClient();
  await consul.deregister();
  await prisma.$disconnect();
  process.exit(0);
});
