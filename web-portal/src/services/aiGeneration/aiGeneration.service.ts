// ============================================
// VERVE AI - AI Generation Service
// ============================================
//
// REAL BACKEND INTEGRATION
//
// This service calls the real service-ai microservice through the Gateway.
//
// Endpoints:
// - POST /api/ai/generate/questions - Generate questions using AI
// - POST /api/ai/generate/questions (autoSubmit=true) - Generate and persist
//
// ============================================

import type { Question, QuestionOption } from '@/types'
import type { AIGenerationOptions } from '@/components/teacher/ai-create-question-modal'
import { generateQuestions, generateAndSubmitQuestions, type GenerateQuestionsInput } from '@/lib/api/ai'

/**
 * Generate unique ID
 */
function generateId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate option ID
 */
function generateOptionId(): string {
  return `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Convert AIGenerationOptions to API request format
 */
function toApiInput(options: AIGenerationOptions): GenerateQuestionsInput {
  return {
    topic: options.topicNameVi || options.topicId,
    topicName: options.topicNameVi,
    difficulty: options.difficulty,
    questionType: options.questionType,
    questionCount: options.questionCount,
    skillId: options.skillId,
    language: options.language,
    additionalInstructions: options.additionalInstructions,
    autoSubmit: false, // Always false for draft generation
  }
}

/**
 * Convert API question draft to frontend Question type
 */
function toQuestion(draft: {
  title: string
  body: string
  difficulty: number
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  options?: Array<{ text: string; isCorrect: boolean }>
  correctAnswer?: string
  explanation: string
  topic?: string
}, options: AIGenerationOptions): Question {
  const difficultyMap: Record<number, 'easy' | 'medium' | 'hard'> = {
    1: 'easy',
    2: 'easy',
    3: 'medium',
    4: 'medium',
    5: 'hard',
  }

  const question: Question = {
    id: generateId(),
    content: draft.body,
    contentVi: draft.body,
    topicId: options.topicId || '',
    topicName: draft.topic || options.topicNameVi || '',
    topicNameVi: draft.topic || options.topicNameVi || '',
    difficulty: difficultyMap[draft.difficulty] || 'medium',
    type: draft.type,
    status: 'pending-review',
    createdBy: 'ai',
    source: `AI Generated - Topic: ${options.topicNameVi || 'General'}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    options: [],
    correctOptionIndex: 0,
    explanation: draft.explanation,
    explanationVi: draft.explanation,
  }

  // Add options for multiple-choice
  if (draft.type === 'multiple-choice' && draft.options && draft.options.length > 0) {
    const optionsArray: QuestionOption[] = draft.options.map((opt, idx) => ({
      id: generateOptionId(),
      content: opt.text,
      contentVi: opt.text,
    }))

    question.options = optionsArray
    const correctIndex = draft.options.findIndex(opt => opt.isCorrect)
    question.correctOptionIndex = correctIndex >= 0 ? correctIndex : 0
  }

  // Add true/false options
  if (draft.type === 'true-false') {
    question.options = [
      { id: generateOptionId(), content: 'True', contentVi: 'Đúng' },
      { id: generateOptionId(), content: 'False', contentVi: 'Sai' },
    ]
    const correctIndex = draft.options?.findIndex(opt => opt.isCorrect) ?? 0
    question.correctOptionIndex = correctIndex >= 0 ? correctIndex : 0
  }

  // Short answer
  if (draft.type === 'short-answer') {
    question.correctAnswer = draft.correctAnswer || ''
    question.options = []
  }

  return question
}

/**
 * Generate AI questions using real backend API
 * 
 * @param options - Generation options
 * @returns Array of generated questions
 * @throws {Error} On API errors
 */
export async function generateAIQuestions(options: AIGenerationOptions): Promise<Question[]> {
  try {
    // Call the real AI generation API
    const response = await generateQuestions(toApiInput(options))

    // Convert API response to frontend Question type
    const questions = response.questions.map(draft => toQuestion(draft, options))

    return questions
  } catch (error) {
    // Re-throw with context for the UI to handle
    if (error instanceof Error) {
      throw new Error(`AI generation failed: ${error.message}`)
    }
    throw new Error('AI generation failed: Unknown error')
  }
}

/**
 * Generate and auto-submit questions to content service
 * 
 * @param options - Generation options
 * @returns Created question IDs and statuses
 * @throws {Error} On API errors
 */
export async function generateAndSubmitAIQuestions(options: AIGenerationOptions): Promise<Array<{
  draft: Question
  questionId: string
  status: string
}>> {
  try {
    const response = await generateAndSubmitQuestions({
      ...toApiInput(options),
      autoSubmit: true,
    })

    return response.questions.map(item => ({
      draft: toQuestion(item.draft, options),
      questionId: item.questionId,
      status: item.status,
    }))
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`AI generation and submit failed: ${error.message}`)
    }
    throw new Error('AI generation and submit failed: Unknown error')
  }
}

/**
 * AI Generation Service
 */
export const aiGenerationService = {
  generateQuestions: generateAIQuestions,
  generateAndSubmit: generateAndSubmitAIQuestions,
}

export default aiGenerationService
