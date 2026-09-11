import { Router } from 'express';
import { proxyRequest } from '../utils/proxy';

const router = Router();
const UPSTREAM = process.env['SVC_CLASS_URL'] ?? 'http://svc-class:3003';

router.get('/classes', proxyRequest(UPSTREAM, 'class'));
router.post('/classes', proxyRequest(UPSTREAM, 'class'));
router.get('/classes/:id', proxyRequest(UPSTREAM, 'class'));
router.put('/classes/:id', proxyRequest(UPSTREAM, 'class'));
router.delete('/classes/:id', proxyRequest(UPSTREAM, 'class'));
router.get('/classes/:id/stats', proxyRequest(UPSTREAM, 'class'));

router.get('/students/:id', proxyRequest(UPSTREAM, 'class'));
router.post('/students', proxyRequest(UPSTREAM, 'class'));
router.put('/students/:id', proxyRequest(UPSTREAM, 'class'));
router.delete('/students/:id', proxyRequest(UPSTREAM, 'class'));
router.get('/students/:id/evidence', proxyRequest(UPSTREAM, 'class'));
router.get('/students/:id/diagnosis', proxyRequest(UPSTREAM, 'class'));

router.get('/progress/:studentId', proxyRequest(UPSTREAM, 'class'));
router.get('/progress/:studentId/history', proxyRequest(UPSTREAM, 'class'));
router.get('/progress/:studentId/skills', proxyRequest(UPSTREAM, 'class'));

export default router;
