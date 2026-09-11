/**
 * Sync routes index — mounts all /api/sync/* sub-routers.
 */

import { Router } from 'express';
import syncRoutes from './sync.routes.js';
import deviceRoutes from './device.routes.js';
import conflictRoutes from './conflict.routes.js';
import transferRoutes from './transfer.routes.js';

const router: Router = Router();

// /api/sync/*     — sync orchestration (status, push, pull, resolve, conflicts, logs)
router.use('/', syncRoutes);

// /api/sync/devices — device CRUD + per-device logs
router.use('/devices', deviceRoutes);

// /api/sync/conflicts — conflict listing + resolution
router.use('/conflicts', conflictRoutes);

// /api/sync/transfers — student transfer orchestration
router.use('/transfers', transferRoutes);

export default router;
