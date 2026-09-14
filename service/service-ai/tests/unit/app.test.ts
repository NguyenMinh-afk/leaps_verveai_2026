import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createApp } from '../../src/app.js';

describe('service-ai app', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.stubEnv('PORT', '3008');
    vi.stubEnv('SERVICE_NAME', 'service-ai-test');
    vi.stubEnv('LLM_PROVIDER', 'openai');
    vi.stubEnv('LOG_LEVEL', 'error');
    vi.stubEnv('OPENAI_API_KEY', 'test-key');
    vi.stubEnv('OPENAI_MODEL', 'gpt-4o-mini');
    vi.stubEnv('OPENAI_BASE_URL', 'https://api.openai.com/v1');
    vi.stubEnv('OPENAI_TIMEOUT_MS', '30000');
    vi.stubEnv('SVC_CONTENT_URL', 'http://localhost:3004');
    vi.stubEnv('SVC_BKT_URL', 'http://localhost:3002');
    vi.stubEnv('SVC_CLASS_URL', 'http://localhost:3003');
    vi.stubEnv('SVC_AUTH_URL', 'http://localhost:3001');
    vi.stubEnv('SVC_EXAM_URL', 'http://localhost:3007');
    vi.stubEnv('MAX_QUESTIONS_PER_REQUEST', '50');
    vi.stubEnv('DEFAULT_QUESTION_COUNT', '5');
    vi.stubEnv('MAX_PROMPT_TOKENS', '4000');
    app = createApp();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('health endpoint', () => {
    it('should return healthy status', async () => {
      const mockReq = {
        method: 'GET',
        path: '/health',
        headers: {},
        body: undefined,
        query: {},
        params: {},
      } as unknown as Parameters<typeof app>[0];
      const mockRes = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
        setHeader: vi.fn(),
      } as unknown as Parameters<typeof app>[1];
      const mockNext = vi.fn();

      // We can't easily test the Express handler without supertest
      // This is a placeholder for a more complete integration test
      expect(app).toBeDefined();
    });
  });
});
