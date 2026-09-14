// ============================================
// VERVE AI - Question Service
// ============================================
//
// Backend Integration: service-content via Gateway
//
// API Endpoints:
// - GET    /api/content/questions         - List questions
// - GET    /api/content/questions/:id     - Get question
// - POST   /api/content/questions         - Create question
// - PUT    /api/content/questions/:id    - Update question
// - DELETE /api/content/questions/:id     - Delete question
// - POST   /api/content/questions/:id/submit  - Submit for review
// - POST   /api/content/questions/:id/approve - Approve question
// - POST   /api/content/questions/:id/reject  - Reject question
//
// ============================================

import type { Question } from '@/types'
import type {
  CreateQuestionInput,
  UpdateQuestionInput,
  QuestionFiltersInput,
  QuestionListResponse,
  QuestionActionResponse,
  BackendQuestionResponse,
  BackendQuestionListResponse,
} from './question.types'
import {
  mapBackendQuestionToFrontend,
  toBackendCreateQuestion,
  toBackendUpdateQuestion,
  toBackendFilters,
} from './question.types'
import { api, ApiError } from '@/lib/api/apiClient'

const API_BASE = '/api/content/questions'

/**
 * Handle API errors and return standardized response
 */
function handleApiError(error: unknown, defaultMessage: string): QuestionActionResponse {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return { success: false, error: 'Vui lòng đăng nhập lại' }
    }
    if (error.status === 403) {
      return { success: false, error: 'Bạn không có quyền thực hiện thao tác này' }
    }
    if (error.status === 404) {
      return { success: false, error: 'Không tìm thấy câu hỏi' }
    }
    if (error.status === 409) {
      return { success: false, error: 'Câu hỏi đã tồn tại hoặc đang chờ xử lý' }
    }
    if (error.status === 400 && error.details) {
      const details = error.details as Record<string, unknown>
      if (details.message) {
        return { success: false, error: String(details.message) }
      }
    }
    return { success: false, error: error.message || defaultMessage }
  }
  return { success: false, error: defaultMessage }
}

/**
 * Question service - Real API implementation
 */
export const questionService = {
  /**
   * Get all questions with optional filters
   */
  async getQuestions(filters?: QuestionFiltersInput): Promise<QuestionListResponse> {
    try {
      const queryParams = toBackendFilters(filters || {})
      const queryString = new URLSearchParams(queryParams).toString()
      const url = queryString ? `${API_BASE}?${queryString}` : API_BASE

      const response = await api.get<BackendQuestionListResponse>(url)

      const questions = (response.data || []).map(mapBackendQuestionToFrontend)

      return {
        questions,
        total: response.meta?.total || questions.length,
        page: filters?.page || 1,
        totalPages: response.meta?.totalPages || 1,
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
      throw error
    }
  },

  /**
   * Get question by ID
   */
  async getQuestionById(id: string): Promise<Question | null> {
    try {
      const response = await api.get<{ data: BackendQuestionResponse }>(`${API_BASE}/${id}`)
      return mapBackendQuestionToFrontend(response.data)
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null
      }
      console.error('Failed to fetch question:', error)
      throw error
    }
  },

  /**
   * Create new question
   */
  async createQuestion(input: CreateQuestionInput): Promise<QuestionActionResponse> {
    try {
      const backendInput = toBackendCreateQuestion(input)
      const response = await api.post<{ data: BackendQuestionResponse }>(
        API_BASE,
        backendInput
      )
      return {
        success: true,
        question: mapBackendQuestionToFrontend(response.data),
      }
    } catch (error) {
      return handleApiError(error, 'Không thể tạo câu hỏi')
    }
  },

  /**
   * Update question
   */
  async updateQuestion(input: UpdateQuestionInput): Promise<QuestionActionResponse> {
    try {
      const { id, ...data } = input
      const backendInput = toBackendUpdateQuestion(data)
      const response = await api.put<{ data: BackendQuestionResponse }>(
        `${API_BASE}/${id}`,
        backendInput
      )
      return {
        success: true,
        question: mapBackendQuestionToFrontend(response.data),
      }
    } catch (error) {
      return handleApiError(error, 'Không thể cập nhật câu hỏi')
    }
  },

  /**
   * Delete question
   */
  async deleteQuestion(id: string): Promise<QuestionActionResponse> {
    try {
      await api.delete(`${API_BASE}/${id}`)
      return { success: true }
    } catch (error) {
      return handleApiError(error, 'Không thể xóa câu hỏi')
    }
  },

  /**
   * Submit question for review
   */
  async submitForReview(id: string): Promise<QuestionActionResponse> {
    try {
      const response = await api.post<{ data: BackendQuestionResponse }>(
        `${API_BASE}/${id}/submit`,
        {}
      )
      return {
        success: true,
        question: mapBackendQuestionToFrontend(response.data),
      }
    } catch (error) {
      return handleApiError(error, 'Không thể gửi câu hỏi để duyệt')
    }
  },

  /**
   * Approve question
   */
  async approveQuestion(id: string, comment?: string): Promise<QuestionActionResponse> {
    try {
      const response = await api.post<{ data: BackendQuestionResponse }>(
        `${API_BASE}/${id}/approve`,
        { comment }
      )
      return {
        success: true,
        question: mapBackendQuestionToFrontend(response.data),
      }
    } catch (error) {
      return handleApiError(error, 'Không thể phê duyệt câu hỏi')
    }
  },

  /**
   * Reject question
   */
  async rejectQuestion(id: string, reason: string): Promise<QuestionActionResponse> {
    try {
      const response = await api.post<{ data: BackendQuestionResponse }>(
        `${API_BASE}/${id}/reject`,
        { comment: reason }
      )
      return {
        success: true,
        question: mapBackendQuestionToFrontend(response.data),
      }
    } catch (error) {
      return handleApiError(error, 'Không thể từ chối câu hỏi')
    }
  },

  /**
   * Duplicate question - creates a copy with draft status
   * Note: Backend doesn't have a dedicated duplicate endpoint
   * We fetch, create a new one with same content
   */
  async duplicateQuestion(id: string): Promise<QuestionActionResponse> {
    try {
      const original = await this.getQuestionById(id)
      if (!original) {
        return { success: false, error: 'Không tìm thấy câu hỏi' }
      }

      const duplicate = await this.createQuestion({
        content: original.content,
        contentVi: original.contentVi,
        type: original.type,
        options: original.options,
        correctOptionIndex: original.correctOptionIndex,
        correctAnswer: original.correctAnswer,
        explanation: original.explanation,
        explanationVi: original.explanationVi,
        difficulty: original.difficulty,
        topicId: original.topicId,
        topicName: original.topicName,
        topicNameVi: original.topicNameVi,
        tags: original.tags,
      })

      if (duplicate.success && duplicate.question) {
        // Update title to indicate copy
        await this.updateQuestion({
          id: duplicate.question.id,
          content: `${duplicate.question.content} (Copy)`,
        })
        const updated = await this.getQuestionById(duplicate.question.id)
        return { success: true, question: updated || duplicate.question }
      }

      return duplicate
    } catch (error) {
      return handleApiError(error, 'Không thể sao chép câu hỏi')
    }
  },

  /**
   * Publish question - maps to approve on backend
   * Note: Backend doesn't have PUBLISHED status
   */
  async publishQuestion(id: string): Promise<QuestionActionResponse> {
    // On backend, APPROVED is the final state
    // This is just an alias for approve with a comment
    return this.approveQuestion(id, 'Published')
  },
}

export default questionService
