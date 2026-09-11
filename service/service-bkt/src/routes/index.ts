import { Router } from 'express';
import diagnosisRoutes from './diagnosis.routes.js';
import interventionRoutes from './intervention.routes.js';
import skillRoutes from './skill.routes.js';
import evidenceRoutes from './evidence.routes.js';

const router: Router = Router();

router.use('/diagnosis', diagnosisRoutes);
router.use('/interventions', interventionRoutes);
router.use('/skills', skillRoutes);
router.use('/evidence', evidenceRoutes);

export default router;
