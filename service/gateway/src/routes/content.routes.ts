import { Router } from 'express';
import { proxyRequest } from '../utils/proxy';

const router = Router();
const UPSTREAM = process.env['SVC_CONTENT_URL'] ?? 'http://svc-content:3004';

// Content routes
router.get('/', proxyRequest(UPSTREAM, 'content'));
router.post('/', proxyRequest(UPSTREAM, 'content'));
router.get('/:id', proxyRequest(UPSTREAM, 'content'));
router.put('/:id', proxyRequest(UPSTREAM, 'content'));
router.delete('/:id', proxyRequest(UPSTREAM, 'content'));
router.post('/:id/submit', proxyRequest(UPSTREAM, 'content'));

// Bundle routes
router.get('/bundles', proxyRequest(UPSTREAM, 'content'));
router.get('/bundles/:id', proxyRequest(UPSTREAM, 'content'));
router.post('/bundles/build', proxyRequest(UPSTREAM, 'content'));
router.post('/bundles/:id/sign', proxyRequest(UPSTREAM, 'content'));
router.post('/bundles/:id/publish', proxyRequest(UPSTREAM, 'content'));

// Review routes
router.get('/review', proxyRequest(UPSTREAM, 'content'));
router.post('/review/:id/approve', proxyRequest(UPSTREAM, 'content'));
router.post('/review/:id/reject', proxyRequest(UPSTREAM, 'content'));
router.get('/review/stats', proxyRequest(UPSTREAM, 'content'));

// Report routes
router.get('/reports/aggregate', proxyRequest(UPSTREAM, 'content'));
router.get('/reports/class/:id', proxyRequest(UPSTREAM, 'content'));
router.get('/reports/student/:id', proxyRequest(UPSTREAM, 'content'));
router.get('/reports/export/:type', proxyRequest(UPSTREAM, 'content'));

// Question routes - proxied to service-content/questions/*
router.get('/questions', proxyRequest(UPSTREAM, 'content'));
router.get('/questions/admin/stats', proxyRequest(UPSTREAM, 'content'));
router.get('/questions/:id', proxyRequest(UPSTREAM, 'content'));
router.post('/questions', proxyRequest(UPSTREAM, 'content'));
router.put('/questions/:id', proxyRequest(UPSTREAM, 'content'));
router.delete('/questions/:id', proxyRequest(UPSTREAM, 'content'));
router.post('/questions/:id/submit', proxyRequest(UPSTREAM, 'content'));
router.post('/questions/:id/approve', proxyRequest(UPSTREAM, 'content'));
router.post('/questions/:id/reject', proxyRequest(UPSTREAM, 'content'));

export default router;
