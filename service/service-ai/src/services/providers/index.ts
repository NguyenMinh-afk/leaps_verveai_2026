/**
 * AI Provider abstraction layer.
 * All provider-specific logic is isolated here.
 * Business services interact only with the IAIProvider interface.
 */

import { AIError, AIErrorCode, aiErrorFromUnknown } from '../../types/errors.js';

// ============================================================
// Provider Interface
// ============================================================

export interface AIGenerationOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  responseFormat?: {
    type: 'json_schema';
    json_schema: {
      name: string;
      strict: boolean;
      schema: Record<string, unknown>;
    };
  };
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  latencyMs: number;
}

export interface IAIProvider {
  generate(options: AIGenerationOptions): Promise<AIResponse>;
  readonly providerName: string;
  readonly modelName: string;
  readonly isConfigured: boolean;
}

// ============================================================
// Provider Factory
// ============================================================

export type ProviderType = 'openai' | 'anthropic' | 'local';

export interface OpenAIConfig { type: 'openai'; apiKey: string; model: string; baseUrl: string; timeoutMs: number; }
export interface AnthropicConfig { type: 'anthropic'; apiKey: string; model: string; timeoutMs: number; }
export interface LocalLLMConfig { type: 'local'; baseUrl: string; model: string; timeoutMs: number; }
export type LLMConfig = OpenAIConfig | AnthropicConfig | LocalLLMConfig;

export function createProvider(config: LLMConfig): IAIProvider {
  switch (config.type) {
    case 'openai': return new OpenAIProvider(config);
    case 'anthropic': return new AnthropicProvider(config);
    case 'local': return new LocalLLMProvider(config);
    default: throw new AIError(AIErrorCode.AI_CONFIGURATION_ERROR, `Unsupported provider: ${(config as {type:string}).type}`);
  }
}

// ============================================================
// OpenAI Provider
// ============================================================

class OpenAIProvider implements IAIProvider {
  readonly providerName = 'openai';
  readonly modelName: string;
  readonly isConfigured: boolean;

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(config: OpenAIConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.timeoutMs = config.timeoutMs;
    this.modelName = config.model;
    this.isConfigured = !!(this.apiKey && this.apiKey !== 'your-openai-api-key-here');
  }

  async generate(options: AIGenerationOptions): Promise<AIResponse> {
    if (!this.isConfigured) {
      throw new AIError(AIErrorCode.AI_PROVIDER_NOT_CONFIGURED, 'OpenAI provider is not configured with a valid API key');
    }

    const startTime = Date.now();
    const body: Record<string, unknown> = {
      model: this.modelName,
      messages: [{ role: 'user', content: options.prompt }],
      max_tokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 0.7,
    };
    if (options.responseFormat) {
      body.response_format = options.responseFormat;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new AIError(AIErrorCode.AI_UNKNOWN_ERROR, `OpenAI API error: ${response.status} ${response.statusText}`, { status: response.status, body: errorBody });
      }

      const data = await response.json() as {
        choices: Array<{ message: { content: string } }>;
        usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
        model: string;
      };

      return {
        content: data.choices[0]?.message?.content ?? '',
        usage: data.usage ? { promptTokens: data.usage.prompt_tokens, completionTokens: data.usage.completion_tokens, totalTokens: data.usage.total_tokens } : undefined,
        model: data.model ?? this.modelName,
        latencyMs: Date.now() - startTime,
      };
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof AIError) throw err;
      if ((err as {name?:string}).name === 'AbortError') throw new AIError(AIErrorCode.AI_TIMEOUT, 'OpenAI request timed out');
      throw aiErrorFromUnknown(err, this.providerName);
    }
  }
}

// ============================================================
// Anthropic Provider
// ============================================================

class AnthropicProvider implements IAIProvider {
  readonly providerName = 'anthropic';
  readonly modelName: string;
  readonly isConfigured: boolean;

  private readonly apiKey: string;
  private readonly timeoutMs: number;

  constructor(config: AnthropicConfig) {
    this.apiKey = config.apiKey;
    this.timeoutMs = config.timeoutMs;
    this.modelName = config.model;
    this.isConfigured = !!(this.apiKey && this.apiKey !== 'your-anthropic-api-key-here');
  }

  async generate(options: AIGenerationOptions): Promise<AIResponse> {
    if (!this.isConfigured) {
      throw new AIError(AIErrorCode.AI_PROVIDER_NOT_CONFIGURED, 'Anthropic provider is not configured with a valid API key');
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const body: Record<string, unknown> = {
        model: this.modelName,
        messages: [{ role: 'user', content: options.prompt }],
        max_tokens: options.maxTokens ?? 4096,
        temperature: options.temperature ?? 0.7,
      };

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': this.apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new AIError(AIErrorCode.AI_UNKNOWN_ERROR, `Anthropic API error: ${response.status} ${response.statusText}`, { status: response.status, body: errorBody });
      }

      const data = await response.json() as {
        content: Array<{ type: 'text'; text: string }>;
        usage?: { input_tokens: number; output_tokens: number };
        model: string;
      };

      return {
        content: data.content[0]?.text ?? '',
        usage: data.usage ? { promptTokens: data.usage.input_tokens, completionTokens: data.usage.output_tokens, totalTokens: data.usage.input_tokens + data.usage.output_tokens } : undefined,
        model: data.model ?? this.modelName,
        latencyMs: Date.now() - startTime,
      };
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof AIError) throw err;
      if ((err as {name?:string}).name === 'AbortError') throw new AIError(AIErrorCode.AI_TIMEOUT, 'Anthropic request timed out');
      throw aiErrorFromUnknown(err, this.providerName);
    }
  }
}

// ============================================================
// Local LLM Provider (e.g. Ollama)
// ============================================================

class LocalLLMProvider implements IAIProvider {
  readonly providerName = 'local';
  readonly modelName: string;
  readonly isConfigured = true;

  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(config: LocalLLMConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.timeoutMs = config.timeoutMs;
    this.modelName = config.model;
  }

  async generate(options: AIGenerationOptions): Promise<AIResponse> {
    const startTime = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const body: Record<string, unknown> = {
        model: this.modelName,
        prompt: options.prompt,
        stream: false,
        options: { temperature: options.temperature ?? 0.7, num_predict: options.maxTokens ?? 4096 },
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new AIError(AIErrorCode.AI_PROVIDER_UNAVAILABLE, `Local LLM error: ${response.status} ${response.statusText}`, { status: response.status, body: errorBody });
      }

      const data = await response.json() as { response: string; model: string };

      return {
        content: data.response ?? '',
        model: data.model ?? this.modelName,
        latencyMs: Date.now() - startTime,
      };
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof AIError) throw err;
      if ((err as {name?:string}).name === 'AbortError') throw new AIError(AIErrorCode.AI_TIMEOUT, 'Local LLM request timed out');
      throw aiErrorFromUnknown(err, this.providerName);
    }
  }
}
