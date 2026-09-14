/**
 * Content service client for service-ai.
 * Handles HTTP calls to service-content for question persistence.
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { validateEnv } from '../config/env.js';
import { logger } from '../utils/logger.js';
import type { GeneratedQuestionDraft } from '../validators/generation.validator.js';

const env = validateEnv();

/**
 * Question creation payload for service-content API.
 * Maps from GeneratedQuestionDraft to content service DTO.
 */
interface ContentServiceQuestionPayload {
  title: string;
  body: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
  chapter?: string;
  metadata: {
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    options?: Array<{ content: string }>;
    correctOptionIndex?: number;
    correctAnswer?: string;
    explanation?: string;
    topicId?: string;
    topicName?: string;
    tags?: string[];
    skillId?: string;
  };
}

/**
 * Response from service-content when creating a question.
 */
interface ContentServiceQuestionResponse {
  success: boolean;
  data: {
    id: string;
    status: string;
    title: string;
  };
  error: { code: string; message: string } | null;
}

/**
 * Content service HTTP client.
 */
class ContentServiceClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.SVC_CONTENT_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Name': 'service-ai',
      },
    });
  }

  /**
   * Create a question in service-content.
   *
   * @param question - The generated question draft
   * @param authorId - ID of the user creating the question
   * @param skillId - Optional BKT skill ID to tag
   * @returns Created question response with ID
   */
  async createQuestion(
    question: GeneratedQuestionDraft,
    authorId: string,
    skillId?: string
  ): Promise<ContentServiceQuestionResponse> {
    const difficultyMap: Record<number, 'easy' | 'medium' | 'hard'> = {
      1: 'easy',
      2: 'easy',
      3: 'medium',
      4: 'medium',
      5: 'hard',
    };

    const difficulty = difficultyMap[question.difficulty] ?? 'medium';

    const payload: ContentServiceQuestionPayload = {
      title: question.title,
      body: question.body,
      difficulty,
      topic: question.topic,
      metadata: {
        type: question.type,
        explanation: question.explanation,
        skillId,
        tags: skillId ? [skillId] : undefined,
      },
    };

    // Handle options for multiple-choice and true-false
    if (question.options && question.options.length > 0) {
      payload.metadata.options = question.options.map((opt) => ({
        content: opt.text,
      }));

      // Find correct option index
      const correctIndex = question.options.findIndex((opt) => opt.isCorrect);
      if (correctIndex !== -1) {
        payload.metadata.correctOptionIndex = correctIndex;
      }
    }

    // Handle short-answer correct answer
    if (question.type === 'short-answer' && question.correctAnswer) {
      payload.metadata.correctAnswer = question.correctAnswer;
    }

    logger.debug('Creating question in content service', {
      topic: question.topic,
      type: question.type,
      difficulty,
    });

    try {
      const response = await this.client.post<ContentServiceQuestionResponse>(
        '/api/content/questions',
        payload,
        {
          headers: {
            'X-User-Id': authorId,
            'X-User-Role': 'teacher',
          },
        }
      );

      logger.info('Question created in content service', {
        questionId: response.data.data.id,
        status: response.data.data.status,
      });

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ContentServiceQuestionResponse>;

      logger.error('Failed to create question in content service', {
        status: axiosError.response?.status,
        message: axiosError.message,
      });

      throw new Error(
        `Content service error: ${axiosError.response?.status ?? 'unknown'} ${
          axiosError.message
        }`
      );
    }
  }

  /**
   * Submit a question for review in service-content.
   *
   * @param questionId - ID of the question to submit
   * @param authorId - ID of the user submitting
   */
  async submitForReview(questionId: string, authorId: string): Promise<void> {
    try {
      await this.client.post(`/api/content/questions/${questionId}/submit`, undefined, {
        headers: {
          'X-User-Id': authorId,
          'X-User-Role': 'teacher',
        },
      });

      logger.info('Question submitted for review', { questionId });
    } catch (err) {
      const axiosError = err as AxiosError;

      logger.error('Failed to submit question for review', {
        questionId,
        status: axiosError.response?.status,
        message: axiosError.message,
      });

      // Don't throw — the question was created, just not submitted
    }
  }
}

// Singleton instance
let contentClient: ContentServiceClient | null = null;

export function getContentClient(): ContentServiceClient {
  if (!contentClient) {
    contentClient = new ContentServiceClient();
  }
  return contentClient;
}
