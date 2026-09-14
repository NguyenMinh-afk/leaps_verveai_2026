import { Router } from 'express';
import { proxyRequest } from '../utils/proxy';

const router = Router();
const UPSTREAM = process.env['SVC_ASSIGNMENT_URL'] ?? 'http://svc-assignment:3006';

router.get('/', proxyRequest(UPSTREAM, 'assignment'));
router.post('/', proxyRequest(UPSTREAM, 'assignment'));
router.get('/:id', proxyRequest(UPSTREAM, 'assignment'));
router.put('/:id', proxyRequest(UPSTREAM, 'assignment'));
router.delete('/:id', proxyRequest(UPSTREAM, 'assignment'));
router.get('/student', proxyRequest(UPSTREAM, 'assignment'));

export default router;
