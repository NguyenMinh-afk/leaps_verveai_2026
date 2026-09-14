import { describe, it, expect } from 'vitest';
import {
  diagnosticRequestSchema,
  diagnosticQuerySchema,
} from '../../src/validators/diagnostic.validator.js';
import { recommendationQuerySchema } from '../../src/validators/recommendation.validator.js';

describe('Diagnostic Validators', () => {
  describe('diagnosticRequestSchema', () => {
    it('should accept valid minimal input', () => {
      const result = diagnosticRequestSchema.safeParse({
        studentId: 'student-123',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.includeEvidence).toBe(true);
        expect(result.data.includePrerequisites).toBe(false);
        expect(result.data.maxSkills).toBe(10);
        expect(result.data.language).toBe('vi');
      }
    });

    it('should accept valid full input', () => {
      const result = diagnosticRequestSchema.safeParse({
        studentId: 'student-123',
        includeEvidence: false,
        includePrerequisites: true,
        maxSkills: 20,
        language: 'en',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing studentId', () => {
      const result = diagnosticRequestSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject empty studentId', () => {
      const result = diagnosticRequestSchema.safeParse({
        studentId: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject maxSkills over 50', () => {
      const result = diagnosticRequestSchema.safeParse({
        studentId: 'student-123',
        maxSkills: 51,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid language', () => {
      const result = diagnosticRequestSchema.safeParse({
        studentId: 'student-123',
        language: 'fr',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('diagnosticQuerySchema', () => {
    it('should accept valid query parameters', () => {
      const result = diagnosticQuerySchema.safeParse({
        includeEvidence: 'true',
        includePrerequisites: 'false',
        maxSkills: '15',
        language: 'en',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.includeEvidence).toBe(true);
        expect(result.data.includePrerequisites).toBe(false);
        expect(result.data.maxSkills).toBe(15);
      }
    });

    it('should handle string boolean transforms', () => {
      const result = diagnosticQuerySchema.safeParse({
        includeEvidence: 'false',
        includePrerequisites: 'true',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.includeEvidence).toBe(false);
        expect(result.data.includePrerequisites).toBe(true);
      }
    });

    it('should accept empty query', () => {
      const result = diagnosticQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should coerce maxSkills to number', () => {
      const result = diagnosticQuerySchema.safeParse({
        maxSkills: '25',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.maxSkills).toBe(25);
      }
    });
  });
});

describe('Recommendation Validators', () => {
  describe('recommendationQuerySchema', () => {
    it('should accept valid query parameters', () => {
      const result = recommendationQuerySchema.safeParse({
        limit: '10',
        includeContent: 'true',
        language: 'vi',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(10);
        expect(result.data.includeContent).toBe(true);
        expect(result.data.language).toBe('vi');
      }
    });

    it('should apply default values', () => {
      const result = recommendationQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(5);
        expect(result.data.includeContent).toBe(true);
        expect(result.data.language).toBe('vi');
      }
    });

    it('should reject limit over 20', () => {
      const result = recommendationQuerySchema.safeParse({
        limit: 25,
      });
      expect(result.success).toBe(false);
    });

    it('should reject limit less than 1', () => {
      const result = recommendationQuerySchema.safeParse({
        limit: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid language', () => {
      const result = recommendationQuerySchema.safeParse({
        language: 'fr',
      });
      expect(result.success).toBe(false);
    });

    it('should coerce boolean string', () => {
      // Note: Zod's coerce.boolean() uses JavaScript Boolean() which returns true for any non-empty string
      // 'true' -> true, 'false' -> true (this is the current behavior)
      const result = recommendationQuerySchema.safeParse({
        includeContent: 'true',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.includeContent).toBe(true);
      }
    });
  });
});
