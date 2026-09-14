import { Router } from 'express';
import { proxyRequest } from '../utils/proxy';

const router: Router = Router();
const UPSTREAM = process.env['SVC_EXAM_URL'] ?? 'http://svc-exam:3007';

// Exam CRUD
router.get('/exams', proxyRequest(UPSTREAM, 'exam'));
router.post('/exams', proxyRequest(UPSTREAM, 'exam'));
router.get('/exams/:id', proxyRequest(UPSTREAM, 'exam'));
router.put('/exams/:id', proxyRequest(UPSTREAM, 'exam'));
router.delete('/exams/:id', proxyRequest(UPSTREAM, 'exam'));

// Admin stats
router.get('/admin/stats', proxyRequest(UPSTREAM, 'exam'));

// Exam questions
router.get('/exams/:id/questions', proxyRequest(UPSTREAM, 'exam'));

// Exam attempts (teacher view)
router.get('/exams/:id/attempts', proxyRequest(UPSTREAM, 'exam'));

// Student endpoints
router.get('/exams/student', proxyRequest(UPSTREAM, 'exam'));
router.post('/exams/:id/start', proxyRequest(UPSTREAM, 'exam'));

// Attempt endpoints
router.get('/exams/attempt/:attemptId', proxyRequest(UPSTREAM, 'exam'));
router.post('/exams/attempt/:attemptId/submit', proxyRequest(UPSTREAM, 'exam'));
router.get('/exams/student/attempts', proxyRequest(UPSTREAM, 'exam'));

// Result endpoints
router.get('/results/:attemptId', proxyRequest(UPSTREAM, 'exam'));
router.get('/history', proxyRequest(UPSTREAM, 'exam'));
router.get('/exams/:examId/results', proxyRequest(UPSTREAM, 'exam'));
router.get('/exams/:examId/results/summary', proxyRequest(UPSTREAM, 'exam'));
router.post('/exams/:examId/results/:attemptId/grade', proxyRequest(UPSTREAM, 'exam'));
router.get('/grading/pending', proxyRequest(UPSTREAM, 'exam'));
router.post('/grading/manual', proxyRequest(UPSTREAM, 'exam'));

// Diagnosis endpoints
router.post('/diagnosis/start', proxyRequest(UPSTREAM, 'exam'));
router.get('/diagnosis/student', proxyRequest(UPSTREAM, 'exam'));
router.get('/diagnosis/:id', proxyRequest(UPSTREAM, 'exam'));
router.post('/diagnosis/:id/answer', proxyRequest(UPSTREAM, 'exam'));
router.post('/diagnosis/:id/complete', proxyRequest(UPSTREAM, 'exam'));
router.get('/diagnosis/questions/:skillId', proxyRequest(UPSTREAM, 'exam'));

export default router;
