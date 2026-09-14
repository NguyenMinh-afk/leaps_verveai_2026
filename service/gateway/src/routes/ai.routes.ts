import { Router } from 'express';
import { proxyRequest } from '../utils/proxy.js';

const router = Router();
const UPSTREAM = process.env['SVC_AI_URL'] ?? 'http://svc-ai:3008';

// Generation
router.post('/generate/questions', proxyRequest(UPSTREAM, 'ai'));
router.get('/generate/questions/status/:jobId', proxyRequest(UPSTREAM, 'ai'));

// Diagnostic
router.get('/diagnostic/student/:studentId', proxyRequest(UPSTREAM, 'ai'));

// Recommendations
router.get('/recommendations/student/:studentId', proxyRequest(UPSTREAM, 'ai'));

export default router;
