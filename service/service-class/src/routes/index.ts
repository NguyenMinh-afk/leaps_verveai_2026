import { Router } from 'express';
import classRoutes from './class.routes.js';
import studentRoutes from './student.routes.js';
import progressRoutes from './progress.routes.js';

const router: Router = Router();

router.use('/classes', classRoutes);
router.use('/students', studentRoutes);
router.use('/progress', progressRoutes);

export default router;
