import { Router } from 'express';
import { proxyRequest } from '../utils/proxy';

const router = Router();
const UPSTREAM = process.env['SVC_SYNC_URL'] ?? 'http://svc-sync:3005';

router.get('/status', proxyRequest(UPSTREAM, 'sync'));
router.post('/push', proxyRequest(UPSTREAM, 'sync'));
router.get('/pull', proxyRequest(UPSTREAM, 'sync'));
router.get('/pull/:since', proxyRequest(UPSTREAM, 'sync'));
router.post('/resolve', proxyRequest(UPSTREAM, 'sync'));

router.get('/devices', proxyRequest(UPSTREAM, 'sync'));
router.get('/devices/:id', proxyRequest(UPSTREAM, 'sync'));
router.put('/devices/:id', proxyRequest(UPSTREAM, 'sync'));
router.delete('/devices/:id', proxyRequest(UPSTREAM, 'sync'));
router.get('/devices/:id/logs', proxyRequest(UPSTREAM, 'sync'));

export default router;
