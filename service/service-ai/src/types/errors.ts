/**
 * Error types for the AI service.
 * Stable, machine-readable error codes — never expose raw provider errors.
 */

export enum AIErrorCode {
  // Configuration
  AI_CONFIGURATION_ERROR = 'AI_CONFIGURATION_ERROR',
  AI_PROVIDER_NOT_CONFIGURED = 'AI_PROVIDER_NOT_CONFIGURED',

  // Provider failures
  AI_PROVIDER_UNAVAILABLE = 'AI_PROVIDER_UNAVAILABLE',
  AI_TIMEOUT = 'AI_TIMEOUT',
  AI_RATE_LIMITED = 'AI_RATE_LIMITED',
  AI_INVALID_RESPONSE = 'AI_INVALID_RESPONSE',
  AI_CONTENT_FILTERED = 'AI_CONTENT_FILTERED',

  // Request errors
  AI_REQUEST_TOO_LARGE = 'AI_REQUEST_TOO_LARGE',
  AI_INVALID_INPUT = 'AI_INVALID_INPUT',

  // Unknown
  AI_UNKNOWN_ERROR = 'AI_UNKNOWN_ERROR',
}

export class AIError extends Error {
  constructor(
    public readonly code: AIErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AIError';
  }
}

export function isAIError(err: unknown): err is AIError {
  return err instanceof AIError;
}

/**
 * Create an AIError from an unknown error, mapping to the appropriate AIErrorCode.
 * Never exposes raw provider error details to the client.
 */
export function aiErrorFromUnknown(err: unknown, provider: string): AIError {
  const message = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();

  if (message.includes('timeout') || message.includes('etimedout') || message.includes('econnaborted')) {
    return new AIError(AIErrorCode.AI_TIMEOUT, 'AI request timed out', { provider });
  }
  if (message.includes('429') || message.includes('rate limit') || message.includes('quota')) {
    return new AIError(AIErrorCode.AI_RATE_LIMITED, 'AI provider rate limit exceeded', { provider });
  }
  if (message.includes('401') || message.includes('unauthorized') || message.includes('api key')) {
    return new AIError(AIErrorCode.AI_CONFIGURATION_ERROR, 'AI provider authentication failed', { provider });
  }
  if (message.includes('403') || message.includes('forbidden')) {
    return new AIError(AIErrorCode.AI_CONFIGURATION_ERROR, 'AI provider access forbidden', { provider });
  }
  if (message.includes('enotfound') || message.includes('econnrefused') || message.includes('fetch failed')) {
    return new AIError(AIErrorCode.AI_PROVIDER_UNAVAILABLE, 'AI provider is unavailable', { provider });
  }
  if (message.includes('413') || message.includes('maximum context') || message.includes('too many tokens')) {
    return new AIError(AIErrorCode.AI_REQUEST_TOO_LARGE, 'Request exceeds AI provider token limit', { provider });
  }
  if (message.includes('content_filter') || message.includes('filtered') || message.includes('safety')) {
    return new AIError(AIErrorCode.AI_CONTENT_FILTERED, 'Request was filtered by AI provider', { provider });
  }
  if (message.includes('invalid') || message.includes('malformed') || message.includes('unexpected token')) {
    return new AIError(AIErrorCode.AI_INVALID_RESPONSE, 'AI provider returned an invalid response', { provider });
  }

  const originalMessage = err instanceof Error ? err.message : String(err);
  return new AIError(AIErrorCode.AI_UNKNOWN_ERROR, `AI provider error: ${provider}`, {
    provider,
    originalMessage,
  });
}
