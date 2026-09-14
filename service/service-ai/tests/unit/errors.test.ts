import { describe, it, expect } from 'vitest';
import {
  AIError,
  AIErrorCode,
  isAIError,
  aiErrorFromUnknown,
} from '../../src/types/errors.js';

describe('AI Error Types', () => {
  describe('AIError', () => {
    it('should create an AIError with code and message', () => {
      const error = new AIError(AIErrorCode.AI_TIMEOUT, 'Request timed out');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AIError);
      expect(error.code).toBe(AIErrorCode.AI_TIMEOUT);
      expect(error.message).toBe('Request timed out');
      expect(error.name).toBe('AIError');
    });

    it('should include optional details', () => {
      const details = { provider: 'openai', model: 'gpt-4' };
      const error = new AIError(AIErrorCode.AI_PROVIDER_UNAVAILABLE, 'Provider unavailable', details);

      expect(error.details).toEqual(details);
    });
  });

  describe('isAIError', () => {
    it('should return true for AIError instances', () => {
      const error = new AIError(AIErrorCode.AI_TIMEOUT, 'Timeout');
      expect(isAIError(error)).toBe(true);
    });

    it('should return false for regular Error', () => {
      const error = new Error('Regular error');
      expect(isAIError(error)).toBe(false);
    });

    it('should return false for non-Error values', () => {
      expect(isAIError('string')).toBe(false);
      expect(isAIError(null)).toBe(false);
      expect(isAIError(undefined)).toBe(false);
      expect(isAIError({})).toBe(false);
    });
  });

  describe('aiErrorFromUnknown', () => {
    it('should map timeout errors', () => {
      const err = new Error('Request timeout');
      const result = aiErrorFromUnknown(err, 'openai');

      expect(result.code).toBe(AIErrorCode.AI_TIMEOUT);
      expect(result.details?.provider).toBe('openai');
    });

    it('should map ETIMEDOUT errors', () => {
      const err = new Error('Connection timed out (ETIMEDOUT)');
      const result = aiErrorFromUnknown(err, 'anthropic');

      expect(result.code).toBe(AIErrorCode.AI_TIMEOUT);
    });

    it('should map ECONNABORTED errors', () => {
      const err = new Error('Request aborted (ECONNABORTED)');
      const result = aiErrorFromUnknown(err, 'openai');

      expect(result.code).toBe(AIErrorCode.AI_TIMEOUT);
    });

    it('should map rate limit errors', () => {
      const err = new Error('Rate limit exceeded (429)');
      const result = aiErrorFromUnknown(err, 'openai');

      expect(result.code).toBe(AIErrorCode.AI_RATE_LIMITED);
    });

    it('should map quota errors', () => {
      const err = new Error('Quota exceeded');
      const result = aiErrorFromUnknown(err, 'anthropic');

      expect(result.code).toBe(AIErrorCode.AI_RATE_LIMITED);
    });

    it('should map auth errors (401)', () => {
      const err = new Error('Unauthorized (401)');
      const result = aiErrorFromUnknown(err, 'openai');

      expect(result.code).toBe(AIErrorCode.AI_CONFIGURATION_ERROR);
    });

    it('should map API key errors', () => {
      const err = new Error('Invalid API key');
      const result = aiErrorFromUnknown(err, 'anthropic');

      expect(result.code).toBe(AIErrorCode.AI_CONFIGURATION_ERROR);
    });

    it('should map forbidden errors (403)', () => {
      const err = new Error('Access forbidden (403)');
      const result = aiErrorFromUnknown(err, 'openai');

      expect(result.code).toBe(AIErrorCode.AI_CONFIGURATION_ERROR);
    });

    it('should map network unavailable errors', () => {
      const err = new Error('Connection refused (ECONNREFUSED)');
      const result = aiErrorFromUnknown(err, 'openai');

      expect(result.code).toBe(AIErrorCode.AI_PROVIDER_UNAVAILABLE);
    });

    it('should map DNS errors', () => {
      const err = new Error('Host not found (ENOTFOUND)');
      const result = aiErrorFromUnknown(err, 'anthropic');

      expect(result.code).toBe(AIErrorCode.AI_PROVIDER_UNAVAILABLE);
    });

    it('should map fetch failures', () => {
      const err = new Error('fetch failed');
      const result = aiErrorFromUnknown(err, 'local');

      expect(result.code).toBe(AIErrorCode.AI_PROVIDER_UNAVAILABLE);
    });

    it('should map token limit errors', () => {
      const err = new Error('Maximum context length exceeded');
      const result = aiErrorFromUnknown(err, 'openai');

      expect(result.code).toBe(AIErrorCode.AI_REQUEST_TOO_LARGE);
    });

    it('should map content filter errors', () => {
      const err = new Error('Content filtered by safety system');
      const result = aiErrorFromUnknown(err, 'anthropic');

      expect(result.code).toBe(AIErrorCode.AI_CONTENT_FILTERED);
    });

    it('should map invalid response errors', () => {
      const err = new Error('Malformed JSON response');
      const result = aiErrorFromUnknown(err, 'openai');

      expect(result.code).toBe(AIErrorCode.AI_INVALID_RESPONSE);
    });

    it('should return AI_UNKNOWN_ERROR for unknown errors', () => {
      const err = new Error('Something went wrong');
      const result = aiErrorFromUnknown(err, 'openai');

      expect(result.code).toBe(AIErrorCode.AI_UNKNOWN_ERROR);
      expect(result.details?.originalMessage).toBe('Something went wrong');
    });

    it('should handle string errors', () => {
      const err = 'Network error occurred';
      const result = aiErrorFromUnknown(err, 'openai');

      expect(result.code).toBe(AIErrorCode.AI_UNKNOWN_ERROR);
    });

    it('should handle object errors', () => {
      const err = { message: 'Custom error object' };
      const result = aiErrorFromUnknown(err, 'anthropic');

      expect(result.code).toBe(AIErrorCode.AI_UNKNOWN_ERROR);
    });
  });
});
