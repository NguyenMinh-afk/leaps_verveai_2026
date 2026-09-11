import { Router } from 'express';
import { proxyRequest } from '../utils/proxy';

const router = Router();
const UPSTREAM = process.env['SVC_AUTH_URL'] ?? 'http://svc-auth:3001';

router.post('/login', proxyRequest(UPSTREAM, 'auth'));
router.post('/logout', proxyRequest(UPSTREAM, 'auth'));
router.get('/session', proxyRequest(UPSTREAM, 'auth'));
router.get('/me', proxyRequest(UPSTREAM, 'auth'));

export default router;
