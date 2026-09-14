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
 * Question status - Backend values
 */
export type QuestionStatus = 'draft' | 'pending-review' | 'approved' | 'published' | 'rejected'

/**
 * Backend status values (from API)
 */
export type BackendQuestionStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'

/**
 * Map backend status to frontend status
 */
export function mapBackendStatusToFrontend(status: BackendQuestionStatus): QuestionStatus {
  switch (status) {
    case 'DRAFT':
      return 'draft'
    case 'PENDING_REVIEW':
      return 'pending-review'
    case 'APPROVED':
      return 'approved'
    case 'REJECTED':
      return 'rejected'
    default:
      return 'draft'
  }
}

/**
 * Map frontend status to backend status
 */
export function mapFrontendStatusToBackend(status: QuestionStatus): BackendQuestionStatus | undefined {
  switch (status) {
    case 'draft':
      return 'DRAFT'
    case 'pending-review':
      return 'PENDING_REVIEW'
    case 'approved':
      return 'APPROVED'
    case 'rejected':
      return 'REJECTED'
    case 'published':
      // published is frontend-only, map to APPROVED for filtering
      return 'APPROVED'
    default:
      return undefined
  }
}

/**
 * Map backend difficulty to frontend difficulty
 */
export function mapBackendDifficultyToFrontend(difficulty: number): QuestionDifficulty {
  if (difficulty <= 2) return 'easy'
  if (difficulty <= 4) return 'medium'
  return 'hard'
}

/**
 * Map frontend difficulty to backend difficulty value
 */
export function mapFrontendDifficultyToBackend(difficulty: QuestionDifficulty): number {
  switch (difficulty) {
    case 'easy':
      return 1
    case 'medium':
      return 3
    case 'hard':
      return 5
    default:
      return 3
  }
}

/**
 * Backend API response types
 */
export interface BackendQuestionResponse {
  id: string
  title: string
  body: string
  bodyVi?: string
  difficulty: number
  difficultyLabel: 'easy' | 'medium' | 'hard'
  type: QuestionType
  status: BackendQuestionStatus
  authorId: string
  topic?: string
  chapter?: string
  metadata: BackendQuestionMetadata
  createdAt: string
  updatedAt: string
  reviews?: BackendReview[]
}

export interface BackendQuestionMetadata {
  type: QuestionType
  options?: { id?: string; content: string; contentVi?: string }[]
  correctOptionIndex?: number
  correctAnswer?: string
  explanation?: string
  explanationVi?: string
  topicId?: string
  topicName?: string
  topicNameVi?: string
  tags?: string[]
  contentVi?: string
}

export interface BackendReview {
  id: string
  reviewerId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  comment?: string
  createdAt: string
}

export interface BackendQuestionListResponse {
  success: boolean
  data: BackendQuestionResponse[]
  meta?: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
  error: null
}

/**
 * Map backend question to frontend Question type
 */
export function mapBackendQuestionToFrontend(q: BackendQuestionResponse): Question {
  return {
    id: q.id,
    content: q.body,
    contentVi: q.bodyVi || q.metadata?.contentVi || q.metadata?.topicNameVi || '',
    type: q.type,
    options: (q.metadata?.options || []).map((opt, idx) => ({
      id: opt.id || `opt-${idx}`,
      content: opt.content,
      contentVi: opt.contentVi || opt.content,
    })),
    correctOptionIndex: q.metadata?.correctOptionIndex ?? 0,
    correctAnswer: q.metadata?.correctAnswer,
    explanation: q.metadata?.explanation || '',
    explanationVi: q.metadata?.explanationVi || '',
    difficulty: mapBackendDifficultyToFrontend(q.difficulty),
    topicId: q.metadata?.topicId || q.topic || '',
    topicName: q.topic || q.metadata?.topicName || '',
    topicNameVi: q.metadata?.topicNameVi || q.metadata?.topicName || '',
    status: mapBackendStatusToFrontend(q.status),
    createdBy: 'teacher', // Backend doesn't distinguish teacher/ai in the response
    createdAt: new Date(q.createdAt),
    updatedAt: new Date(q.updatedAt),
    source: undefined,
    reviewedBy: q.reviews?.[0]?.reviewerId,
    reviewedAt: q.reviews?.[0]?.createdAt ? new Date(q.reviews[0].createdAt) : undefined,
  }
}

/**
 * Create question input - maps frontend form to backend API
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
 * Convert frontend CreateQuestionInput to backend API format
 */
export function toBackendCreateQuestion(input: CreateQuestionInput): {
  title: string
  body: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic?: string
  metadata: {
    type: QuestionType
    options?: { content: string; contentVi?: string }[]
    correctOptionIndex?: number
    correctAnswer?: string
    explanation?: string
    explanationVi?: string
    topicId?: string
    topicName?: string
    topicNameVi?: string
    tags?: string[]
    contentVi?: string
  }
} {
  return {
    title: input.contentVi || input.content,
    body: input.content,
    difficulty: input.difficulty,
    topic: input.topicName || input.topicNameVi,
    metadata: {
      type: input.type,
      options: input.options?.map((opt) => ({
        content: opt.content,
        contentVi: opt.contentVi,
      })),
      correctOptionIndex: input.correctOptionIndex,
      correctAnswer: input.correctAnswer,
      explanation: input.explanation,
      explanationVi: input.explanationVi,
      topicId: input.topicId,
      topicName: input.topicName,
      topicNameVi: input.topicNameVi,
      tags: input.tags,
      contentVi: input.contentVi,
    },
  }
}

/**
 * Convert frontend UpdateQuestionInput to backend API format
 */
export interface BackendUpdateQuestionInput {
  title?: string
  body?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  topic?: string
  metadata?: Partial<{
    type: QuestionType
    options?: { content: string; contentVi?: string }[]
    correctOptionIndex?: number
    correctAnswer?: string
    explanation?: string
    explanationVi?: string
    topicId?: string
    topicName?: string
    topicNameVi?: string
    tags?: string[]
    contentVi?: string
  }>
}

export function toBackendUpdateQuestion(input: Partial<CreateQuestionInput>): BackendUpdateQuestionInput {
  const result: BackendUpdateQuestionInput = {}
  
  if (input.content !== undefined) {
    result.body = input.content
  }
  if (input.contentVi !== undefined) {
    if (!result.metadata) result.metadata = {}
    result.metadata.contentVi = input.contentVi
    result.title = input.contentVi || input.content
  }
  if (input.difficulty !== undefined) {
    result.difficulty = input.difficulty
  }
  if (input.topicName !== undefined) {
    result.topic = input.topicName
  }
  if (input.topicNameVi !== undefined) {
    if (!result.metadata) result.metadata = {}
    result.metadata.topicNameVi = input.topicNameVi
  }
  
  if (input.options !== undefined || input.correctOptionIndex !== undefined || 
      input.correctAnswer !== undefined || input.explanation !== undefined ||
      input.explanationVi !== undefined || input.type !== undefined) {
    result.metadata = result.metadata || {}
    if (input.type !== undefined) result.metadata.type = input.type
    if (input.options !== undefined) {
      result.metadata.options = input.options.map((opt) => ({
        content: opt.content,
        contentVi: opt.contentVi,
      }))
    }
    if (input.correctOptionIndex !== undefined) result.metadata.correctOptionIndex = input.correctOptionIndex
    if (input.correctAnswer !== undefined) result.metadata.correctAnswer = input.correctAnswer
    if (input.explanation !== undefined) result.metadata.explanation = input.explanation
    if (input.explanationVi !== undefined) result.metadata.explanationVi = input.explanationVi
  }
  
  return result
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
 * Convert frontend filters to backend query params
 */
export function toBackendFilters(filters: QuestionFiltersInput): Record<string, string> {
  const params: Record<string, string> = {}
  
  if (filters.search) params.search = filters.search
  if (filters.difficulty) params.difficulty = filters.difficulty
  if (filters.type) params.type = filters.type
  if (filters.status) {
    const backendStatus = mapFrontendStatusToBackend(filters.status)
    if (backendStatus) params.status = backendStatus
  }
  if (filters.topicId) params.topic = filters.topicId
  if (filters.page) params.skip = String((filters.page - 1) * (filters.limit || 20))
  if (filters.limit) params.take = String(filters.limit)
  
  return params
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
