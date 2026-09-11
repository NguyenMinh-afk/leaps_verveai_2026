import { Router } from 'express';
import { proxyRequest } from '../utils/proxy';

const router = Router();
const UPSTREAM = process.env['SVC_BKT_URL'] ?? 'http://svc-bkt:3002';

router.post('/diagnosis/run', proxyRequest(UPSTREAM, 'bkt'));
router.post('/diagnosis/batch', proxyRequest(UPSTREAM, 'bkt'));
router.get('/diagnosis/student/:id', proxyRequest(UPSTREAM, 'bkt'));
router.get('/diagnosis/class/:id', proxyRequest(UPSTREAM, 'bkt'));

router.post('/evidence', proxyRequest(UPSTREAM, 'bkt'));
router.get('/evidence/:id', proxyRequest(UPSTREAM, 'bkt'));
router.get('/evidence/:id/chain', proxyRequest(UPSTREAM, 'bkt'));
router.get('/evidence/student/:id', proxyRequest(UPSTREAM, 'bkt'));

router.get('/interventions', proxyRequest(UPSTREAM, 'bkt'));
router.get('/interventions/class/:id', proxyRequest(UPSTREAM, 'bkt'));
router.get('/interventions/:id', proxyRequest(UPSTREAM, 'bkt'));
router.put('/interventions/:id', proxyRequest(UPSTREAM, 'bkt'));
router.put('/interventions/:id/override', proxyRequest(UPSTREAM, 'bkt'));
router.post('/interventions/:id/note', proxyRequest(UPSTREAM, 'bkt'));
router.post('/interventions/:id/resolve', proxyRequest(UPSTREAM, 'bkt'));

router.get('/skills', proxyRequest(UPSTREAM, 'bkt'));
router.get('/skills/:id', proxyRequest(UPSTREAM, 'bkt'));
router.get('/skills/tree', proxyRequest(UPSTREAM, 'bkt'));
router.get('/skills/:id/prerequisites', proxyRequest(UPSTREAM, 'bkt'));

export default router;
