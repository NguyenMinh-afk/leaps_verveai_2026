import { Router } from 'express';
import { proxyRequest } from '../utils/proxy';

const router = Router();
const UPSTREAM = process.env['SVC_AUTH_URL'] ?? 'http://svc-auth:3001';

// Auth routes
router.post('/login', proxyRequest(UPSTREAM, 'auth'));
router.post('/logout', proxyRequest(UPSTREAM, 'auth'));
router.get('/session', proxyRequest(UPSTREAM, 'auth'));
router.get('/me', proxyRequest(UPSTREAM, 'auth'));

// User management routes (admin and general)
router.get('/users', proxyRequest(UPSTREAM, 'auth'));
router.get('/users/admin/list', proxyRequest(UPSTREAM, 'auth'));
router.get('/users/admin/stats', proxyRequest(UPSTREAM, 'auth'));
router.get('/users/:id', proxyRequest(UPSTREAM, 'auth'));
router.patch('/users/:id', proxyRequest(UPSTREAM, 'auth'));
router.delete('/users/:id', proxyRequest(UPSTREAM, 'auth'));

export default router;
