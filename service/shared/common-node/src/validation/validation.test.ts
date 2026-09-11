import { describe, it, expect } from 'vitest';
import {
  z,
  validate,
  UUIDSchema,
  EmailSchema,
  PasswordSchema,
  PageSchema,
  PageSizeSchema,
  enumString,
  infer,
} from '../src/validation';

describe('validation', () => {
  describe('UUIDSchema', () => {
    it('should accept valid UUID v4', () => {
      const result = UUIDSchema.safeParse('550e8400-e29b-41d4-a716-446655440000');
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const result = UUIDSchema.safeParse('not-a-uuid');
      expect(result.success).toBe(false);
    });
  });

  describe('EmailSchema', () => {
    it('should accept valid email', () => {
      const result = EmailSchema.safeParse('teacher@school.vn');
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = EmailSchema.safeParse('not-an-email');
      expect(result.success).toBe(false);
    });

    it('should reject email > 255 chars', () => {
      const long = 'a'.repeat(250) + '@b.com';
      const result = EmailSchema.safeParse(long);
      expect(result.success).toBe(false);
    });
  });

  describe('PasswordSchema', () => {
    it('should accept valid password', () => {
      const result = PasswordSchema.safeParse('Secret123');
      expect(result.success).toBe(true);
    });

    it('should reject password < 8 chars', () => {
      const result = PasswordSchema.safeParse('Short1');
      expect(result.success).toBe(false);
    });

    it('should reject password without letter', () => {
      const result = PasswordSchema.safeParse('12345678');
      expect(result.success).toBe(false);
    });

    it('should reject password without number', () => {
      const result = PasswordSchema.safeParse('Password');
      expect(result.success).toBe(false);
    });
  });

  describe('validate helper', () => {
    const schema = z.object({ name: z.string(), age: z.number() });

    it('should return ok=true for valid data', () => {
      const result = validate(schema, { name: 'Alice', age: 25 });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.data).toEqual({ name: 'Alice', age: 25 });
    });

    it('should return ok=false for invalid data', () => {
      const result = validate(schema, { name: 'Alice' });
      expect(result.ok).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('enumString', () => {
    const StatusSchema = enumString(['ACTIVE', 'INACTIVE'] as const);

    it('should accept allowed values', () => {
      expect(StatusSchema.safeParse('ACTIVE').success).toBe(true);
      expect(StatusSchema.safeParse('INACTIVE').success).toBe(true);
    });

    it('should reject unknown values', () => {
      expect(StatusSchema.safeParse('DELETED').success).toBe(false);
    });
  });

  describe('PageSchema / PageSizeSchema', () => {
    it('should coerce string to number', () => {
      expect(PageSchema.safeParse('5').success).toBe(true);
      expect(PageSizeSchema.safeParse('50').success).toBe(true);
    });

    it('should default to 1 and 20', () => {
      expect(PageSchema.safeParse(undefined).data).toBe(1);
      expect(PageSizeSchema.safeParse(undefined).data).toBe(20);
    });
  });
});
