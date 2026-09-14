/**
 * AI question generation service.
 * Handles the business logic for generating questions via AI providers.
 */

import { z } from 'zod';
import { validateEnv } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AIError, AIErrorCode, aiErrorFromUnknown } from '../types/errors.js';
import { IAIProvider } from './providers/index.js';
import type {
  GenerateQuestionsInput,
  GeneratedQuestionDraft,
  GenerationResponse,
} from '../validators/generation.validator.js';

const env = validateEnv();

// ─── JSON Schema for AI Response ──────────────────────────────────────────────

const GENERATED_QUESTION_SCHEMA = {
  type: 'object',
  required: ['title', 'body', 'difficulty', 'type', 'explanation'],
  properties: {
    title: {
      type: 'string',
      description: 'Short title for the question (max 255 characters)',
    },
    body: {
      type: 'string',
      description: 'The question text itself',
    },
    difficulty: {
      type: 'integer',
      description: 'Difficulty level: 1=easy, 3=medium, 5=hard',
      minimum: 1,
      maximum: 5,
    },
    type: {
      type: 'string',
      enum: ['multiple-choice', 'true-false', 'short-answer'],
      description: 'Type of question',
    },
    options: {
      type: 'array',
      description: 'Answer options for multiple-choice or true-false questions',
      items: {
        type: 'object',
        required: ['text', 'isCorrect'],
        properties: {
          text: { type: 'string', description: 'Option text' },
          isCorrect: { type: 'boolean', description: 'Whether this is the correct answer' },
        },
      },
    },
    correctAnswer: {
      type: 'string',
      description: 'Correct answer for short-answer questions',
    },
    explanation: {
      type: 'string',
      description: 'Explanation for why the answer is correct',
    },
    topic: {
      type: 'string',
      description: 'Topic name for the question',
    },
    metadata: {
      type: 'object',
      properties: {
        topicId: { type: 'string' },
        skillId: { type: 'string' },
        language: { type: 'string' },
      },
    },
  },
};

const QUESTIONS_ARRAY_SCHEMA = {
  type: 'array',
  items: GENERATED_QUESTION_SCHEMA,
};

// ─── Prompt Builder ───────────────────────────────────────────────────────────

/**
 * Build the generation prompt for AI.
 * Requests Vietnamese-language questions with structured JSON output.
 */
function buildGenerationPrompt(input: GenerateQuestionsInput): string {
  const parts: string[] = [];

  // Language instruction
  const language = input.language === 'en' ? 'English' : 'Vietnamese';
  parts.push(`You are an expert education content creator specializing in ${language} language questions.`);

  // Topic context
  if (input.topic) {
    parts.push(`Generate questions about the topic: "${input.topic}".`);
    if (input.topicName && input.topicName !== input.topic) {
      parts.push(`Also known as: "${input.topicName}".`);
    }
  } else {
    parts.push('Generate questions on a general educational topic.');
  }

  // Question type
  const questionTypeText = input.questionType
    ? input.questionType === 'mixed'
      ? 'a mix of multiple-choice, true-false, and short-answer questions'
      : `${input.questionType.replace('-', ' ')} questions`
    : 'multiple-choice questions';

  // Difficulty
  const difficultyText = input.difficulty
    ? input.difficulty === 'mixed'
      ? 'varying difficulty levels (easy, medium, and hard)'
      : `${input.difficulty} difficulty`
    : 'medium difficulty';

  // Count
  const count = input.questionCount ?? env.DEFAULT_QUESTION_COUNT;

  parts.push(
    `Generate exactly ${count} ${questionTypeText} with ${difficultyText}.`
  );

  // Additional instructions
  if (input.additionalInstructions) {
    parts.push(`\nAdditional requirements: ${input.additionalInstructions}`);
  }

  // Question format specifications
  parts.push('\n## Question Format Requirements:\n');

  parts.push('### Multiple-Choice Questions:');
  parts.push('- Provide exactly 4 options labeled A, B, C, D');
  parts.push('- Exactly one option must be marked as correct (isCorrect: true)');
  parts.push('- Options should be plausible but with only one correct answer');

  parts.push('\n### True-False Questions:');
  parts.push('- Provide exactly 2 options: "True" and "False"');
  parts.push('- Mark the correct answer with isCorrect: true');

  parts.push('\n### Short-Answer Questions:');
  parts.push('- Provide the correct answer in the correctAnswer field');
  parts.push('- Answers should be concise (1-2 sentences or a number)');

  // Difficulty mapping reminder
  parts.push('\n## Difficulty Levels:');
  parts.push('- Easy (1): Basic recall, simple calculations, straightforward definitions');
  parts.push('- Medium (3): Application of concepts, problem-solving, analysis');
  parts.push('- Hard (5): Complex problems, synthesis, multi-step reasoning');

  // Explanation requirement
  parts.push('\n## Explanation:');
  parts.push('Every question MUST have a clear explanation that:');
  parts.push('- Explains why the correct answer is correct');
  parts.push('- May clarify common misconceptions');
  parts.push('- Is written in the same language as the question');

  // Title requirement
  parts.push('\n## Title:');
  parts.push('- Provide a short, descriptive title (max 255 characters)');
  parts.push('- Should be unique and descriptive of the question content');

  // Output format
  parts.push('\n## Output Format:');
  parts.push('Return your response as a valid JSON array of question objects.');
  parts.push('The entire response must be parseable as JSON - no markdown code blocks, no extra text.');
  parts.push('Example structure:');
  parts.push(JSON.stringify([{
    title: 'Example Question Title',
    body: 'What is 2 + 2?',
    difficulty: 1,
    type: 'multiple-choice',
    options: [
      { text: '3', isCorrect: false },
      { text: '4', isCorrect: true },
      { text: '5', isCorrect: false },
      { text: '6', isCorrect: false },
    ],
    explanation: '2 + 2 equals 4, which is the correct answer.',
    topic: 'Basic Arithmetic',
    metadata: { language: 'vi' },
  }], null, 2));

  return parts.join('\n');
}

// ─── Response Parser ──────────────────────────────────────────────────────────

const questionSchema = z.object({
  title: z.string().min(1).max(255),
  body: z.string().min(1),
  difficulty: z.number().int().min(1).max(5),
  type: z.enum(['multiple-choice', 'true-false', 'short-answer']),
  options: z
    .array(
      z.object({
        text: z.string().min(1),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().min(1),
  topic: z.string().optional(),
  metadata: z
    .object({
      topicId: z.string().optional(),
      skillId: z.string().optional(),
      language: z.string().optional(),
    })
    .optional(),
});

const questionsArraySchema = z.array(questionSchema);

/**
 * Parse and validate the AI response.
 * @throws AIError if parsing or validation fails
 */
function parseAIResponse(content: string): z.infer<typeof questionsArraySchema> {
  let jsonString = content.trim();

  // Remove markdown code blocks if present
  const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonString = jsonMatch[1].trim();
  }

  // Try to parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new AIError(
      AIErrorCode.AI_INVALID_RESPONSE,
      'AI provider returned invalid JSON. Please try again.',
      { rawContent: content.substring(0, 200) }
    );
  }

  // Validate with Zod
  const result = questionsArraySchema.safeParse(parsed);
  if (!result.success) {
    const errors = result.error.errors
      .slice(0, 5)
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');

    throw new AIError(
      AIErrorCode.AI_INVALID_RESPONSE,
      `Generated questions failed validation: ${errors}`,
      { validationErrors: result.error.errors.map((e) => ({ path: e.path, message: e.message })) }
    );
  }

  return result.data;
}

// ─── Generation Service ────────────────────────────────────────────────────────

export interface GenerationOptions {
  provider: IAIProvider;
  input: GenerateQuestionsInput;
}

/**
 * Generate questions using the AI provider.
 *
 * @param options - Generation options including provider and input
 * @returns Validated generation response with question drafts
 * @throws AIError on validation failure, provider error, or timeout
 */
export async function generateQuestions(options: GenerationOptions): Promise<GenerationResponse> {
  const { provider, input } = options;
  const startTime = Date.now();

  logger.info('Starting question generation', {
    topic: input.topic,
    difficulty: input.difficulty,
    questionType: input.questionType,
    questionCount: input.questionCount ?? env.DEFAULT_QUESTION_COUNT,
    provider: provider.providerName,
    model: provider.modelName,
  });

  // Validate question count against max
  const questionCount = input.questionCount ?? env.DEFAULT_QUESTION_COUNT;
  if (questionCount > env.MAX_QUESTIONS_PER_REQUEST) {
    throw new AIError(
      AIErrorCode.AI_INVALID_INPUT,
      `Requested ${questionCount} questions, maximum is ${env.MAX_QUESTIONS_PER_REQUEST}`,
      { requested: questionCount, max: env.MAX_QUESTIONS_PER_REQUEST }
    );
  }

  // Build prompt
  const prompt = buildGenerationPrompt(input);

  try {
    // Call AI provider with structured output
    const response = await provider.generate({
      prompt,
      maxTokens: env.MAX_PROMPT_TOKENS,
      temperature: 0.7,
      responseFormat: {
        type: 'json_schema',
        json_schema: {
          name: 'generated_questions',
          strict: true,
          schema: QUESTIONS_ARRAY_SCHEMA,
        },
      },
    });

    // Parse and validate response
    const questions = parseAIResponse(response.content);

    const latencyMs = Date.now() - startTime;

    logger.info('Question generation completed', {
      topic: input.topic,
      questionCount: questions.length,
      provider: provider.providerName,
      model: provider.modelName,
      latencyMs,
      success: true,
    });

    return {
      questions,
      meta: {
        topic: input.topic,
        difficulty: input.difficulty,
        questionType: input.questionType,
        requestedCount: questionCount,
        generatedCount: questions.length,
        provider: provider.providerName,
        model: provider.modelName,
        latencyMs,
      },
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;

    if (err instanceof AIError) {
      logger.warn('Question generation failed', {
        topic: input.topic,
        errorCode: err.code,
        errorMessage: err.message,
        latencyMs,
        provider: provider.providerName,
      });
      throw err;
    }

    // Map provider error
    const aiError = aiErrorFromUnknown(err, provider.providerName);

    logger.error('Question generation error', {
      topic: input.topic,
      errorCode: aiError.code,
      errorMessage: aiError.message,
      latencyMs,
      provider: provider.providerName,
      model: provider.modelName,
    });

    throw aiError;
  }
}

/**
 * Get the JSON schema for the AI response format.
 * Used for testing and documentation.
 */
export function getResponseSchema(): typeof QUESTIONS_ARRAY_SCHEMA {
  return QUESTIONS_ARRAY_SCHEMA;
}
