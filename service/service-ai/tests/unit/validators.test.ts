import { describe, it, expect } from 'vitest';
import {
  generateQuestionsInputSchema,
  generatedQuestionDraftSchema,
  generationResponseSchema,
} from '../../src/validators/generation.validator.js';

describe('Generation Validators', () => {
  describe('generateQuestionsInputSchema', () => {
    it('should accept valid minimal input', () => {
      const result = generateQuestionsInputSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.language).toBe('vi');
        expect(result.data.autoSubmit).toBe(false);
      }
    });

    it('should accept valid full input', () => {
      const input = {
        topic: 'Algebra',
        topicName: 'Đại số',
        difficulty: 'medium' as const,
        questionType: 'multiple-choice' as const,
        questionCount: 10,
        skillId: 'skill-123',
        language: 'en' as const,
        additionalInstructions: 'Include word problems',
        autoSubmit: true,
      };

      const result = generateQuestionsInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.topic).toBe('Algebra');
        expect(result.data.difficulty).toBe('medium');
        expect(result.data.questionCount).toBe(10);
      }
    });

    it('should reject invalid question type', () => {
      const result = generateQuestionsInputSchema.safeParse({
        questionType: 'invalid',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid difficulty', () => {
      const result = generateQuestionsInputSchema.safeParse({
        difficulty: 'extreme',
      });
      expect(result.success).toBe(false);
    });

    it('should reject topic longer than 200 characters', () => {
      const result = generateQuestionsInputSchema.safeParse({
        topic: 'x'.repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it('should reject question count over 50', () => {
      const result = generateQuestionsInputSchema.safeParse({
        questionCount: 51,
      });
      expect(result.success).toBe(false);
    });

    it('should reject additional instructions over 1000 characters', () => {
      const result = generateQuestionsInputSchema.safeParse({
        additionalInstructions: 'x'.repeat(1001),
      });
      expect(result.success).toBe(false);
    });

    it('should accept "mixed" for question type', () => {
      const result = generateQuestionsInputSchema.safeParse({
        questionType: 'mixed',
      });
      expect(result.success).toBe(true);
    });

    it('should accept "mixed" for difficulty', () => {
      const result = generateQuestionsInputSchema.safeParse({
        difficulty: 'mixed',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('generatedQuestionDraftSchema', () => {
    it('should accept valid multiple-choice question', () => {
      const question = {
        title: 'What is 2 + 2?',
        body: 'Calculate 2 + 2',
        difficulty: 1,
        type: 'multiple-choice' as const,
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false },
          { text: '6', isCorrect: false },
        ],
        explanation: '2 + 2 = 4',
      };

      const result = generatedQuestionDraftSchema.safeParse(question);
      expect(result.success).toBe(true);
    });

    it('should accept valid true-false question', () => {
      const question = {
        title: 'True or False',
        body: 'The sky is blue',
        difficulty: 1,
        type: 'true-false' as const,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
        ],
        explanation: 'The sky is indeed blue',
      };

      const result = generatedQuestionDraftSchema.safeParse(question);
      expect(result.success).toBe(true);
    });

    it('should accept valid short-answer question', () => {
      const question = {
        title: 'Short Answer',
        body: 'What is the capital of France?',
        difficulty: 2,
        type: 'short-answer' as const,
        correctAnswer: 'Paris',
        explanation: 'Paris is the capital of France',
      };

      const result = generatedQuestionDraftSchema.safeParse(question);
      expect(result.success).toBe(true);
    });

    it('should reject missing title', () => {
      const question = {
        body: 'Question body',
        difficulty: 1,
        type: 'multiple-choice' as const,
        options: [
          { text: 'A', isCorrect: true },
          { text: 'B', isCorrect: false },
        ],
        explanation: 'Explanation',
      };

      const result = generatedQuestionDraftSchema.safeParse(question);
      expect(result.success).toBe(false);
    });

    it('should reject missing body', () => {
      const question = {
        title: 'Title',
        difficulty: 1,
        type: 'multiple-choice' as const,
        options: [
          { text: 'A', isCorrect: true },
          { text: 'B', isCorrect: false },
        ],
        explanation: 'Explanation',
      };

      const result = generatedQuestionDraftSchema.safeParse(question);
      expect(result.success).toBe(false);
    });

    it('should reject empty title', () => {
      const question = {
        title: '',
        body: 'Body',
        difficulty: 1,
        type: 'short-answer' as const,
        correctAnswer: 'Answer',
        explanation: 'Explanation',
      };

      const result = generatedQuestionDraftSchema.safeParse(question);
      expect(result.success).toBe(false);
    });

    it('should reject difficulty out of range', () => {
      const question = {
        title: 'Title',
        body: 'Body',
        difficulty: 6,
        type: 'short-answer' as const,
        correctAnswer: 'Answer',
        explanation: 'Explanation',
      };

      const result = generatedQuestionDraftSchema.safeParse(question);
      expect(result.success).toBe(false);
    });

    it('should reject invalid question type', () => {
      const question = {
        title: 'Title',
        body: 'Body',
        difficulty: 1,
        type: 'invalid-type' as any,
        explanation: 'Explanation',
      };

      const result = generatedQuestionDraftSchema.safeParse(question);
      expect(result.success).toBe(false);
    });

    it('should accept optional metadata', () => {
      const question = {
        title: 'Title',
        body: 'Body',
        difficulty: 1,
        type: 'short-answer' as const,
        correctAnswer: 'Answer',
        explanation: 'Explanation',
        metadata: {
          topicId: 'topic-123',
          skillId: 'skill-456',
          language: 'vi',
        },
      };

      const result = generatedQuestionDraftSchema.safeParse(question);
      expect(result.success).toBe(true);
    });
  });
});
