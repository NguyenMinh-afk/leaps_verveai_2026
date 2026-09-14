import { Router } from 'express';
import contentRoutes from './content.routes.js';
import bundleRoutes from './bundle.routes.js';
import reviewRoutes from './review.routes.js';
import reportRoutes from './report.routes.js';
import questionRoutes from './question.routes.js';

const router: Router = Router();

router.use('/', contentRoutes);
router.use('/bundles', bundleRoutes);
router.use('/review', reviewRoutes);
router.use('/reports', reportRoutes);
router.use('/questions', questionRoutes);

export default router;
