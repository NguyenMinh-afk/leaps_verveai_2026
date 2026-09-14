/**
 * Environment configuration for service-ai.
 * All AI provider credentials remain server-side only.
 */

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3008),
  SERVICE_NAME: z.string().default('service-ai'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // AI Provider
  LLM_PROVIDER: z.enum(['openai', 'anthropic', 'local']).default('openai'),

  // OpenAI
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  OPENAI_BASE_URL: z.string().default('https://api.openai.com/v1'),
  OPENAI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-3-5-haiku-20241022'),
  ANTHROPIC_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),

  // Local LLM
  LOCAL_LLM_URL: z.string().default('http://localhost:11434'),
  LOCAL_LLM_MODEL: z.string().default('llama3.2'),
  LOCAL_LLM_TIMEOUT_MS: z.coerce.number().int().min(1000).max(300000).default(60000),

  // Inter-service
  SVC_CONTENT_URL: z.string().default('http://svc-content:3004'),
  SVC_BKT_URL: z.string().default('http://svc-bkt:3002'),
  SVC_CLASS_URL: z.string().default('http://svc-class:3003'),
  SVC_AUTH_URL: z.string().default('http://svc-auth:3001'),
  SVC_EXAM_URL: z.string().default('http://svc-exam:3007'),

  // Generation settings
  MAX_QUESTIONS_PER_REQUEST: z.coerce.number().int().min(1).max(50).default(20),
  DEFAULT_QUESTION_COUNT: z.coerce.number().int().min(1).max(20).default(5),
  MAX_PROMPT_TOKENS: z.coerce.number().int().min(100).max(10000).default(4000),

  // Consul
  CONSUL_HOST: z.string().default('localhost'),
  CONSUL_PORT: z.coerce.number().int().default(8500),

  // Observability
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function validateEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const raw = {
    NODE_ENV: process.env['NODE_ENV'],
    PORT: process.env['PORT'],
    SERVICE_NAME: process.env['SERVICE_NAME'],
    LOG_LEVEL: process.env['LOG_LEVEL'],
    LLM_PROVIDER: process.env['LLM_PROVIDER'],
    OPENAI_API_KEY: process.env['OPENAI_API_KEY'],
    OPENAI_MODEL: process.env['OPENAI_MODEL'],
    OPENAI_BASE_URL: process.env['OPENAI_BASE_URL'],
    OPENAI_TIMEOUT_MS: process.env['OPENAI_TIMEOUT_MS'],
    ANTHROPIC_API_KEY: process.env['ANTHROPIC_API_KEY'],
    ANTHROPIC_MODEL: process.env['ANTHROPIC_MODEL'],
    ANTHROPIC_TIMEOUT_MS: process.env['ANTHROPIC_TIMEOUT_MS'],
    LOCAL_LLM_URL: process.env['LOCAL_LLM_URL'],
    LOCAL_LLM_MODEL: process.env['LOCAL_LLM_MODEL'],
    LOCAL_LLM_TIMEOUT_MS: process.env['LOCAL_LLM_TIMEOUT_MS'],
    SVC_CONTENT_URL: process.env['SVC_CONTENT_URL'],
    SVC_BKT_URL: process.env['SVC_BKT_URL'],
    SVC_CLASS_URL: process.env['SVC_CLASS_URL'],
    SVC_AUTH_URL: process.env['SVC_AUTH_URL'],
    SVC_EXAM_URL: process.env['SVC_EXAM_URL'],
    MAX_QUESTIONS_PER_REQUEST: process.env['MAX_QUESTIONS_PER_REQUEST'],
    DEFAULT_QUESTION_COUNT: process.env['DEFAULT_QUESTION_COUNT'],
    MAX_PROMPT_TOKENS: process.env['MAX_PROMPT_TOKENS'],
    CONSUL_HOST: process.env['CONSUL_HOST'],
    CONSUL_PORT: process.env['CONSUL_PORT'],
    OTEL_EXPORTER_OTLP_ENDPOINT: process.env['OTEL_EXPORTER_OTLP_ENDPOINT'],
  };

  const result = envSchema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.errors.map(e => `  ${e.path.join('.')}: ${e.message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${errors}`);
  }

  cachedEnv = result.data;
  return cachedEnv;
}
