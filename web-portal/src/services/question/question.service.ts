// ============================================
// VERVE AI - Question Service Mock Implementation
// ============================================

import type { Question } from '@/types'
import { mockQuestions } from '@/data/teacher-mock-data'
import type {
  CreateQuestionInput,
  UpdateQuestionInput,
  QuestionFiltersInput,
  QuestionListResponse,
  QuestionActionResponse,
} from './question.types'

/**
 * Development question service
 * This is a mock implementation for development only
 */

const MOCK_DELAY = 500

async function simulateDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Local state for questions (simulates backend storage)
 */
let localQuestions: Question[] = [...mockQuestions]

/**
 * Reset to mock data
 */
function resetToMockData(): void {
  localQuestions = [...mockQuestions]
}

/**
 * Question service
 */
export const questionService = {
  /**
   * Get all questions with optional filters
   */
  async getQuestions(filters?: QuestionFiltersInput): Promise<QuestionListResponse> {
    await simulateDelay()

    let filtered = [...localQuestions]

    if (filters?.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(
        (q) =>
          q.content.toLowerCase().includes(query) ||
          q.contentVi?.toLowerCase().includes(query) ||
          q.topicName?.toLowerCase().includes(query) ||
          q.topicNameVi?.toLowerCase().includes(query)
      )
    }

    if (filters?.difficulty) {
      filtered = filtered.filter((q) => q.difficulty === filters.difficulty)
    }

    if (filters?.type) {
      filtered = filtered.filter((q) => q.type === filters.type)
    }

    if (filters?.status) {
      filtered = filtered.filter((q) => q.status === filters.status)
    }

    if (filters?.source) {
      filtered = filtered.filter((q) => q.createdBy === filters.source)
    }

    if (filters?.topicId) {
      filtered = filtered.filter((q) => q.topicId === filters.topicId)
    }

    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const start = (page - 1) * limit
    const end = start + limit

    return {
      questions: filtered.slice(start, end),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    }
  },

  /**
   * Get question by ID
   */
  async getQuestionById(id: string): Promise<Question | null> {
    await simulateDelay()
    return localQuestions.find((q) => q.id === id) || null
  },

  /**
   * Create new question
   */
  async createQuestion(input: CreateQuestionInput): Promise<QuestionActionResponse> {
    await simulateDelay()

    try {
      const newQuestion: Question = {
        id: generateId(),
        content: input.content,
        contentVi: input.contentVi || input.content,
        type: input.type,
        options:
          input.options?.map((opt, idx) => ({
            ...opt,
            id: `opt-${Date.now()}-${idx}`,
          })) || [],
        correctOptionIndex: input.correctOptionIndex ?? -1,
        explanation: input.explanation || '',
        explanationVi: input.explanationVi || input.explanation || '',
        difficulty: input.difficulty,
        topicId: input.topicId || 'topic-1',
        topicName: input.topicName || 'General',
        topicNameVi: input.topicNameVi || input.topicName || 'Tổng quát',
        status: 'draft',
        createdBy: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: input.tags || [],
      }

      localQuestions = [newQuestion, ...localQuestions]

      return { success: true, question: newQuestion }
    } catch (error) {
      return { success: false, error: 'Không thể tạo câu hỏi' }
    }
  },

  /**
   * Update question
   */
  async updateQuestion(input: UpdateQuestionInput): Promise<QuestionActionResponse> {
    await simulateDelay()

    try {
      const index = localQuestions.findIndex((q) => q.id === input.id)
      if (index === -1) {
        return { success: false, error: 'Không tìm thấy câu hỏi' }
      }

      const existing = localQuestions[index]
      const updated: Question = {
        ...existing,
        content: input.content ?? existing.content,
        contentVi: input.contentVi ?? existing.contentVi,
        type: input.type ?? existing.type,
        options: input.options 
          ? input.options.map((opt, idx) => ({
              content: opt.content,
              contentVi: opt.contentVi,
              id: `opt-${Date.now()}-${idx}`,
            }))
          : existing.options,
        correctOptionIndex: input.correctOptionIndex ?? existing.correctOptionIndex,
        explanation: input.explanation ?? existing.explanation,
        explanationVi: input.explanationVi ?? existing.explanationVi,
        difficulty: input.difficulty ?? existing.difficulty,
        topicId: input.topicId ?? existing.topicId,
        topicName: input.topicName ?? existing.topicName,
        topicNameVi: input.topicNameVi ?? existing.topicNameVi,
        status: input.status ?? existing.status,
        updatedAt: new Date(),
      }

      localQuestions = [
        ...localQuestions.slice(0, index),
        updated,
        ...localQuestions.slice(index + 1),
      ]

      return { success: true, question: updated }
    } catch (error) {
      return { success: false, error: 'Không thể cập nhật câu hỏi' }
    }
  },

  /**
   * Delete question
   */
  async deleteQuestion(id: string): Promise<QuestionActionResponse> {
    await simulateDelay()

    try {
      localQuestions = localQuestions.filter((q) => q.id !== id)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Không thể xóa câu hỏi' }
    }
  },

  /**
   * Duplicate question
   */
  async duplicateQuestion(id: string): Promise<QuestionActionResponse> {
    await simulateDelay()

    try {
      const original = localQuestions.find((q) => q.id === id)
      if (!original) {
        return { success: false, error: 'Không tìm thấy câu hỏi' }
      }

      const duplicate: Question = {
        ...original,
        id: generateId(),
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        content: `${original.content} (Copy)`,
        contentVi: original.contentVi ? `${original.contentVi} (Bản sao)` : original.content,
      }

      localQuestions = [duplicate, ...localQuestions]

      return { success: true, question: duplicate }
    } catch (error) {
      return { success: false, error: 'Không thể sao chép câu hỏi' }
    }
  },

  /**
   * Approve question
   */
  async approveQuestion(id: string): Promise<QuestionActionResponse> {
    await simulateDelay()

    try {
      const index = localQuestions.findIndex((q) => q.id === id)
      if (index === -1) {
        return { success: false, error: 'Không tìm thấy câu hỏi' }
      }

      const updated: Question = {
        ...localQuestions[index],
        status: 'approved',
        updatedAt: new Date(),
      }

      localQuestions = [
        ...localQuestions.slice(0, index),
        updated,
        ...localQuestions.slice(index + 1),
      ]

      return { success: true, question: updated }
    } catch (error) {
      return { success: false, error: 'Không thể phê duyệt câu hỏi' }
    }
  },

  /**
   * Reject question
   */
  async rejectQuestion(id: string): Promise<QuestionActionResponse> {
    await simulateDelay()

    try {
      const index = localQuestions.findIndex((q) => q.id === id)
      if (index === -1) {
        return { success: false, error: 'Không tìm thấy câu hỏi' }
      }

      const updated: Question = {
        ...localQuestions[index],
        status: 'rejected',
        updatedAt: new Date(),
      }

      localQuestions = [
        ...localQuestions.slice(0, index),
        updated,
        ...localQuestions.slice(index + 1),
      ]

      return { success: true, question: updated }
    } catch (error) {
      return { success: false, error: 'Không thể từ chối câu hỏi' }
    }
  },

  /**
   * Publish question
   */
  async publishQuestion(id: string): Promise<QuestionActionResponse> {
    await simulateDelay()

    try {
      const index = localQuestions.findIndex((q) => q.id === id)
      if (index === -1) {
        return { success: false, error: 'Không tìm thấy câu hỏi' }
      }

      const updated: Question = {
        ...localQuestions[index],
        status: 'published',
        updatedAt: new Date(),
      }

      localQuestions = [
        ...localQuestions.slice(0, index),
        updated,
        ...localQuestions.slice(index + 1),
      ]

      return { success: true, question: updated }
    } catch (error) {
      return { success: false, error: 'Không thể xuất bản câu hỏi' }
    }
  },

  /**
   * Get questions for current session (observable)
   */
  getQuestionsSnapshot(): Question[] {
    return [...localQuestions]
  },

  /**
   * Reset to mock data (for testing)
   */
  resetToMockData,
}

export default questionService
