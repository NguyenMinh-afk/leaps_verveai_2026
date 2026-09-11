import { Router } from 'express';
import { proxyRequest } from '../utils/proxy';

const router = Router();
const UPSTREAM = process.env['SVC_CONTENT_URL'] ?? 'http://svc-content:3004';

router.get('/', proxyRequest(UPSTREAM, 'content'));
router.post('/', proxyRequest(UPSTREAM, 'content'));
router.get('/:id', proxyRequest(UPSTREAM, 'content'));
router.put('/:id', proxyRequest(UPSTREAM, 'content'));
router.delete('/:id', proxyRequest(UPSTREAM, 'content'));

router.get('/bundles', proxyRequest(UPSTREAM, 'content'));
router.get('/bundles/:id', proxyRequest(UPSTREAM, 'content'));
router.post('/bundles/build', proxyRequest(UPSTREAM, 'content'));
router.post('/bundles/:id/sign', proxyRequest(UPSTREAM, 'content'));
router.post('/bundles/:id/publish', proxyRequest(UPSTREAM, 'content'));

router.get('/review', proxyRequest(UPSTREAM, 'content'));
router.post('/review/:id/approve', proxyRequest(UPSTREAM, 'content'));
router.post('/review/:id/reject', proxyRequest(UPSTREAM, 'content'));
router.get('/review/stats', proxyRequest(UPSTREAM, 'content'));

router.get('/reports/aggregate', proxyRequest(UPSTREAM, 'content'));
router.get('/reports/class/:id', proxyRequest(UPSTREAM, 'content'));
router.get('/reports/student/:id', proxyRequest(UPSTREAM, 'content'));
router.get('/reports/export/:type', proxyRequest(UPSTREAM, 'content'));

export default router;
