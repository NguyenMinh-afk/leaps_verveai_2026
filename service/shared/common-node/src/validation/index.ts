/**
 * Validation — Zod schemas + common validators.
 *
 * Usage:
 *   import { z, createSchema, isEmail, isUUID } from '@verveai/common-node';
 *
 *   const LoginSchema = z.object({
 *     email: z.string().email(),
 *     password: z.string().min(8),
 *   });
 *
 *   const validated = LoginSchema.safeParse(req.body);
 *   if (!validated.success) throw new ValidationError(validated.error.issues);
 *
 * @module validation
 */

import { z, type ZodError, type ZodType, type ZodTypeDef } from 'zod';

// Re-export Zod primitives so callers don't need to import zod directly
export { z, type ZodError, type ZodType, type ZodTypeDef };

// ─── Common schemas ────────────────────────────────────────────────────────────

/** UUID v4 string */
export const UUIDSchema = z.string().uuid({ message: 'Must be a valid UUID' });

/** Non-empty string */
export const NonEmptyStringSchema = z.string().min(1, 'Cannot be empty');

/** Email address */
export const EmailSchema = z
  .string()
  .email({ message: 'Invalid email address' })
  .max(255);

/** Password — min 8 chars, at least 1 letter and 1 number */
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .max(128);

/** Pagination page (1-based) */
export const PageSchema = z.coerce.number().int().min(1).default(1);

/** Pagination pageSize (1-100) */
export const PageSizeSchema = z.coerce.number().int().min(1).max(100).default(20);

/** ISO 8601 date string */
export const ISO8601DateSchema = z.string().datetime({ message: 'Must be ISO 8601 datetime' });

/** Positive integer */
export const PositiveIntSchema = z.number().int().positive();

/** Enum-like string from allowed values */
export function enumString<T extends string>(allowed: T[]) {
  return z.enum(allowed, { errorMap: () => ({ message: `Must be one of: ${allowed.join(', ')}` }) });
}

// ─── Schema builder helpers ───────────────────────────────────────────────────

/**
 * Create a schema with common fields (id, createdAt, updatedAt).
 * Use as base for response DTOs.
 */
export function withTimestamps<T extends ZodType>(schema: T) {
  return schema.extend({
    id: UUIDSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
  });
}

/**
 * Create a schema with optional pagination fields.
 * Use for list endpoint request schemas.
 */
export function withPagination(schema: ZodType) {
  return schema.extend({
    page: PageSchema.optional(),
    pageSize: PageSizeSchema.optional(),
  });
}

/**
 * Extract the inferred TypeScript type from a Zod schema.
 */
export type Infer<T extends ZodType> = z.infer<T>;

// ─── Validation helpers ────────────────────────────────────────────────────────

/**
 * Validate a value against a schema and return the parsed result.
 * Use in service layer (not route handlers).
 *
 * @example
 * const parsed = validate(LoginSchema, req.body);
 * if (!parsed.ok) throw new ValidationError(parsed.error.issues);
 * const { email, password } = parsed.data;
 */
export function validate<T extends ZodType>(
  schema: T,
  data: unknown,
): { ok: true; data: z.infer<T> } | { ok: false; error: ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return { ok: false, error: result.error };
}

/**
 * Validate a value, throw ValidationError on failure.
 */
export function validateOrThrow<T extends ZodType>(
  schema: T,
  data: unknown,
  message = 'Validation failed',
): z.infer<T> {
  const result = validate(schema, data);
  if (!result.ok) {
    const { ValidationError } = require('../error');
    throw new ValidationError(result.error.issues, message);
  }
  return result.data;
}
