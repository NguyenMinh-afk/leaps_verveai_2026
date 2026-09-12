// ============================================
// VERVE AI - Question Service Types
// ============================================

import type { Question, QuestionOption } from '@/types'

/**
 * Question difficulty levels
 */
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

/**
 * Question types
 */
export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer'

/**
 * Question status
 */
export type QuestionStatus = 'draft' | 'pending-review' | 'approved' | 'published' | 'rejected'

/**
 * Create question input
 */
export interface CreateQuestionInput {
  content: string
  contentVi?: string
  type: QuestionType
  options?: Omit<QuestionOption, 'id'>[]
  correctOptionIndex?: number
  correctAnswer?: string
  explanation?: string
  explanationVi?: string
  difficulty: QuestionDifficulty
  topicId?: string
  topicName?: string
  topicNameVi?: string
  tags?: string[]
}

/**
 * Update question input
 */
export interface UpdateQuestionInput extends Partial<CreateQuestionInput> {
  id: string
  status?: QuestionStatus
}

/**
 * Question filters
 */
export interface QuestionFiltersInput {
  search?: string
  difficulty?: QuestionDifficulty
  type?: QuestionType
  status?: QuestionStatus
  source?: 'teacher' | 'ai'
  topicId?: string
  page?: number
  limit?: number
}

/**
 * Question list response
 */
export interface QuestionListResponse {
  questions: Question[]
  total: number
  page: number
  totalPages: number
}

/**
 * Question action response
 */
export interface QuestionActionResponse {
  success: boolean
  question?: Question
  error?: string
}

/**
 * Question validation
 */
export interface QuestionValidationError {
  field: string
  message: string
}

/**
 * Validate question input
 */
export function validateQuestionInput(input: CreateQuestionInput): QuestionValidationError[] {
  const errors: QuestionValidationError[] = []

  if (!input.content.trim() && !input.contentVi?.trim()) {
    errors.push({ field: 'content', message: 'Nội dung câu hỏi là bắt buộc' })
  }

  if (!input.difficulty) {
    errors.push({ field: 'difficulty', message: 'Độ khó là bắt buộc' })
  }

  if (input.type === 'multiple-choice') {
    if (!input.options || input.options.length < 2) {
      errors.push({ field: 'options', message: 'Cần ít nhất 2 lựa chọn cho câu hỏi trắc nghiệm' })
    }
    if (input.correctOptionIndex === undefined || input.correctOptionIndex < 0) {
      errors.push({ field: 'correctOptionIndex', message: 'Cần chọn đáp án đúng' })
    }
  }

  if (input.type === 'true-false') {
    if (input.correctAnswer === undefined) {
      errors.push({ field: 'correctAnswer', message: 'Cần chọn đáp án đúng (Đúng/Sai)' })
    }
  }

  if (input.type === 'short-answer') {
    if (!input.correctAnswer?.trim()) {
      errors.push({ field: 'correctAnswer', message: 'Cần nhập đáp án đúng' })
    }
  }

  return errors
}
