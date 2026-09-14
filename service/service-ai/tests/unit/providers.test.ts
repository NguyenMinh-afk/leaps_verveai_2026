import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createProvider,
  type OpenAIConfig,
  type AnthropicConfig,
  type LocalLLMConfig,
  type IAIProvider,
} from '../../src/services/providers/index.js';
import { AIError, AIErrorCode } from '../../src/types/errors.js';

describe('AI Provider Abstraction', () => {
  describe('createProvider', () => {
    it('should create an OpenAI provider', () => {
      const config: OpenAIConfig = {
        type: 'openai',
        apiKey: 'test-key',
        model: 'gpt-4o-mini',
        baseUrl: 'https://api.openai.com/v1',
        timeoutMs: 30000,
      };

      const provider = createProvider(config);

      expect(provider.providerName).toBe('openai');
      expect(provider.modelName).toBe('gpt-4o-mini');
      expect(provider.isConfigured).toBe(true);
    });

    it('should create an Anthropic provider', () => {
      const config: AnthropicConfig = {
        type: 'anthropic',
        apiKey: 'test-key',
        model: 'claude-3-5-haiku-20241022',
        timeoutMs: 30000,
      };

      const provider = createProvider(config);

      expect(provider.providerName).toBe('anthropic');
      expect(provider.modelName).toBe('claude-3-5-haiku-20241022');
      expect(provider.isConfigured).toBe(true);
    });

    it('should create a Local LLM provider', () => {
      const config: LocalLLMConfig = {
        type: 'local',
        baseUrl: 'http://localhost:11434',
        model: 'llama3.2',
        timeoutMs: 60000,
      };

      const provider = createProvider(config);

      expect(provider.providerName).toBe('local');
      expect(provider.modelName).toBe('llama3.2');
      expect(provider.isConfigured).toBe(true);
    });

    it('should throw for unsupported provider type', () => {
      const config = {
        type: 'unsupported' as any,
      };

      expect(() => createProvider(config)).toThrow(AIError);
    });
  });

  describe('OpenAI Provider', () => {
    it('should report as not configured with empty API key', () => {
      const config: OpenAIConfig = {
        type: 'openai',
        apiKey: '',
        model: 'gpt-4o-mini',
        baseUrl: 'https://api.openai.com/v1',
        timeoutMs: 30000,
      };

      const provider = createProvider(config);

      expect(provider.isConfigured).toBe(false);
    });

    it('should report as not configured with placeholder API key', () => {
      const config: OpenAIConfig = {
        type: 'openai',
        apiKey: 'your-openai-api-key-here',
        model: 'gpt-4o-mini',
        baseUrl: 'https://api.openai.com/v1',
        timeoutMs: 30000,
      };

      const provider = createProvider(config);

      expect(provider.isConfigured).toBe(false);
    });

    it('should throw AI_PROVIDER_NOT_CONFIGURED when not configured', async () => {
      const config: OpenAIConfig = {
        type: 'openai',
        apiKey: '',
        model: 'gpt-4o-mini',
        baseUrl: 'https://api.openai.com/v1',
        timeoutMs: 30000,
      };

      const provider = createProvider(config);

      await expect(
        provider.generate({ prompt: 'Test prompt' })
      ).rejects.toThrow(AIError);

      await expect(
        provider.generate({ prompt: 'Test prompt' })
      ).rejects.toMatchObject({
        code: AIErrorCode.AI_PROVIDER_NOT_CONFIGURED,
      });
    });
  });

  describe('Anthropic Provider', () => {
    it('should report as not configured with empty API key', () => {
      const config: AnthropicConfig = {
        type: 'anthropic',
        apiKey: '',
        model: 'claude-3-5-haiku-20241022',
        timeoutMs: 30000,
      };

      const provider = createProvider(config);

      expect(provider.isConfigured).toBe(false);
    });

    it('should throw AI_PROVIDER_NOT_CONFIGURED when not configured', async () => {
      const config: AnthropicConfig = {
        type: 'anthropic',
        apiKey: '',
        model: 'claude-3-5-haiku-20241022',
        timeoutMs: 30000,
      };

      const provider = createProvider(config);

      await expect(
        provider.generate({ prompt: 'Test prompt' })
      ).rejects.toThrow(AIError);

      await expect(
        provider.generate({ prompt: 'Test prompt' })
      ).rejects.toMatchObject({
        code: AIErrorCode.AI_PROVIDER_NOT_CONFIGURED,
      });
    });
  });

  describe('Local LLM Provider', () => {
    it('should always report as configured', () => {
      const config: LocalLLMConfig = {
        type: 'local',
        baseUrl: 'http://localhost:11434',
        model: 'llama3.2',
        timeoutMs: 60000,
      };

      const provider = createProvider(config);

      expect(provider.isConfigured).toBe(true);
    });
  });
});
