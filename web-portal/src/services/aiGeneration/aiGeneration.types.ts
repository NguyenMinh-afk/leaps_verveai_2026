// ============================================
// VERVE AI - AI Generation Service Types
// ============================================

/**
 * AI Generation job status
 */
export type AIGenerationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

/**
 * Question difficulty for AI generation
 */
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

/**
 * Question type for AI generation
 */
export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'mixed'

/**
 * AI Generation job
 */
export interface AIGenerationJob {
  id: string
  courseId: string
  courseName: string
  courseNameVi: string
  topicId?: string
  topicName?: string
  topicNameVi?: string
  requestedCount: number
  difficulty: QuestionDifficulty
  questionType: QuestionType
  language: 'vi' | 'en' | 'mixed'
  additionalInstructions?: string
  status: AIGenerationStatus
  progress: number
  generatedCount: number
  questions?: GeneratedQuestion[]
  error?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

/**
 * Generated question from AI
 */
export interface GeneratedQuestion {
  id: string
  content: string
  contentVi: string
  type: QuestionType
  options?: {
    id: string
    content: string
    contentVi: string
  }[]
  correctOptionIndex?: number
  correctAnswer?: string
  explanation: string
  explanationVi: string
  difficulty: QuestionDifficulty
  topicId?: string
  topicName?: string
  topicNameVi?: string
  confidence?: number
}

/**
 * Create AI generation job input
 */
export interface CreateAIGenerationInput {
  courseId: string
  courseName: string
  courseNameVi: string
  topicId?: string
  topicName?: string
  topicNameVi?: string
  requestedCount: number
  difficulty: QuestionDifficulty
  questionType: QuestionType
  language: 'vi' | 'en' | 'mixed'
  additionalInstructions?: string
}

/**
 * AI Generation action response
 */
export interface AIGenerationActionResponse {
  success: boolean
  job?: AIGenerationJob
  error?: string
}
