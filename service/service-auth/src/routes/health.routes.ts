import { Router } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', service: 'svc-auth', version: '1.0.0', timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ status: 'down', error: String(e) });
  }
});

export default router;
