/**
 * Shared type definitions for VERVEAI error handling.
 *
 * These types are intentionally framework-agnostic so they can be consumed
 * by Express middleware, logging adapters, and API response formatters.
 */

/**
 * A single validation issue produced by input validation (typically Zod).
 *
 * `path` mirrors Zod's issue path: an array of property names / indices
 * pointing at the field that failed validation.
 */
export interface ValidationIssue {
  path: (string | number)[];
  message: string;
  code: string;
}

/**
 * Structured context that can be attached to an error for logging or
 * downstream propagation (request correlation, authenticated user, etc.).
 *
 * The index signature allows services to attach extra fields
 * (e.g. `tenantId`, `deviceId`) without modifying this definition.
 */
export interface ErrorContext {
  /** Correlation id of the originating HTTP request. */
  requestId?: string;
  /** Authenticated user id, if available. */
  userId?: string;
  /** Logical name of the service that produced the error. */
  service?: string;
  /** Allow additional context fields specific to the calling service. */
  [key: string]: unknown;
}
