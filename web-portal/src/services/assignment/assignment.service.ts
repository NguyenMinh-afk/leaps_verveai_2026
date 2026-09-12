// ============================================
// VERVE AI - Assignments Service Mock Implementation
// ============================================

import type { Assignment } from '@/types'
import { mockAssignments } from '@/data/teacher-mock-data'
import type {
  CreateAssignmentInput,
  UpdateAssignmentInput,
  AssignmentFiltersInput,
  AssignmentListResponse,
  AssignmentActionResponse,
} from './assignment.types'

/**
 * Development assignments service
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
  return `asg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Local state for assignments (simulates backend storage)
 */
let localAssignments: Assignment[] = [...mockAssignments]

/**
 * Reset to mock data
 */
function resetToMockData(): void {
  localAssignments = [...mockAssignments]
}

/**
 * Assignments service
 */
export const assignmentService = {
  /**
   * Get all assignments with optional filters
   */
  async getAssignments(filters?: AssignmentFiltersInput): Promise<AssignmentListResponse> {
    await simulateDelay()

    let filtered = [...localAssignments]

    if (filters?.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.titleVi?.toLowerCase().includes(query) ||
          a.className?.toLowerCase().includes(query)
      )
    }

    if (filters?.status) {
      filtered = filtered.filter((a) => a.status === filters.status)
    }

    if (filters?.classId) {
      filtered = filtered.filter((a) => a.classId === filters.classId)
    }

    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const start = (page - 1) * limit
    const end = start + limit

    return {
      assignments: filtered.slice(start, end),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    }
  },

  /**
   * Get assignment by ID
   */
  async getAssignmentById(id: string): Promise<Assignment | null> {
    await simulateDelay()
    return localAssignments.find((a) => a.id === id) || null
  },

  /**
   * Create new assignment
   */
  async createAssignment(input: CreateAssignmentInput): Promise<AssignmentActionResponse> {
    await simulateDelay()

    try {
      const newAssignment: Assignment = {
        id: generateId(),
        title: input.title,
        titleVi: input.titleVi || input.title,
        description: input.description,
        descriptionVi: input.descriptionVi || input.description,
        classId: input.classId,
        className: input.className,
        status: input.status || 'draft',
        questionCount: input.questionIds.length,
        studentCount: 0,
        completionCount: 0,
        createdAt: new Date(),
        dueDate: input.dueDate,
        publishedAt: input.status === 'published' ? new Date() : undefined,
      }

      localAssignments = [newAssignment, ...localAssignments]

      return { success: true, assignment: newAssignment }
    } catch (error) {
      return { success: false, error: 'Không thể tạo bài tập' }
    }
  },

  /**
   * Update assignment
   */
  async updateAssignment(input: UpdateAssignmentInput): Promise<AssignmentActionResponse> {
    await simulateDelay()

    try {
      const index = localAssignments.findIndex((a) => a.id === input.id)
      if (index === -1) {
        return { success: false, error: 'Không tìm thấy bài tập' }
      }

      const existing = localAssignments[index]
      const updated: Assignment = {
        ...existing,
        title: input.title ?? existing.title,
        titleVi: input.titleVi ?? existing.titleVi,
        description: input.description ?? existing.description,
        descriptionVi: input.descriptionVi ?? existing.descriptionVi,
        classId: input.classId ?? existing.classId,
        className: input.className ?? existing.className,
        status: input.status ?? existing.status,
        dueDate: input.dueDate ?? existing.dueDate,
      }

      if (input.status === 'published' && existing.status !== 'published') {
        updated.publishedAt = new Date()
      }

      localAssignments = [
        ...localAssignments.slice(0, index),
        updated,
        ...localAssignments.slice(index + 1),
      ]

      return { success: true, assignment: updated }
    } catch (error) {
      return { success: false, error: 'Không thể cập nhật bài tập' }
    }
  },

  /**
   * Delete assignment
   */
  async deleteAssignment(id: string): Promise<AssignmentActionResponse> {
    await simulateDelay()

    try {
      localAssignments = localAssignments.filter((a) => a.id !== id)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Không thể xóa bài tập' }
    }
  },

  /**
   * Publish assignment
   */
  async publishAssignment(id: string): Promise<AssignmentActionResponse> {
    return assignmentService.updateAssignment({ id, status: 'published' })
  },

  /**
   * Archive assignment
   */
  async archiveAssignment(id: string): Promise<AssignmentActionResponse> {
    return assignmentService.updateAssignment({ id, status: 'archived' })
  },

  /**
   * Duplicate assignment
   */
  async duplicateAssignment(id: string): Promise<AssignmentActionResponse> {
    await simulateDelay()

    try {
      const original = localAssignments.find((a) => a.id === id)
      if (!original) {
        return { success: false, error: 'Không tìm thấy bài tập' }
      }

      const duplicate: Assignment = {
        ...original,
        id: generateId(),
        title: `${original.titleVi || original.title} (Bản sao)`,
        titleVi: original.titleVi ? `${original.titleVi} (Bản sao)` : original.title,
        status: 'draft',
        completionCount: 0,
        createdAt: new Date(),
        dueDate: undefined,
        publishedAt: undefined,
      }

      localAssignments = [duplicate, ...localAssignments]

      return { success: true, assignment: duplicate }
    } catch (error) {
      return { success: false, error: 'Không thể sao chép bài tập' }
    }
  },

  /**
   * Get assignments snapshot
   */
  getAssignmentsSnapshot(): Assignment[] {
    return [...localAssignments]
  },

  /**
   * Reset to mock data
   */
  resetToMockData,
}

export default assignmentService
