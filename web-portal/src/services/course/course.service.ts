// ============================================
// VERVE AI - Course Service - Real API Implementation
// ============================================
//
// Connects to the real backend through the Gateway.
// All course management uses real database data.
//
// Backend: service-class -> Gateway /api/class/*
//

import { api } from '@/lib/api/apiClient'
import type { AdminCourse } from '@/types'

// Backend API response types
interface BackendClassResponse {
  id: string
  name: string
  subject: string
  teacherId: string
  createdAt: Date
  updatedAt: Date
}

interface BackendClassWithStats extends BackendClassResponse {
  studentCount: number
  averageProgress: number
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  take: number
}

// Map backend response to frontend type
function mapToAdminCourse(row: BackendClassWithStats): AdminCourse {
  return {
    id: row.id,
    name: row.name,
    nameVi: row.name,
    code: '',
    description: '',
    descriptionVi: '',
    status: 'active',
    teacherCount: 0,
    studentCount: row.studentCount,
    questionCount: 0,
    topicCount: 0,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }
}

/**
 * Course service using real backend API
 */
export const courseService = {
  /**
   * Get all courses (admin sees all)
   * Calls: GET /api/class/classes
   */
  async getCourses(): Promise<AdminCourse[]> {
    try {
      const result = await api.get<PaginatedResponse<BackendClassWithStats>>('/api/class/classes?take=100')
      return result.items.map(mapToAdminCourse)
    } catch {
      return []
    }
  },

  /**
   * Get course by ID
   * Calls: GET /api/class/classes/:id
   */
  async getCourseById(id: string): Promise<AdminCourse | null> {
    try {
      const result = await api.get<BackendClassWithStats>(`/api/class/classes/${id}`)
      return mapToAdminCourse(result)
    } catch {
      return null
    }
  },

  /**
   * Create new course
   * Calls: POST /api/class/classes
   */
  async createCourse(input: {
    name: string
    nameVi?: string
    description?: string
    descriptionVi?: string
    code?: string
    subject: string
    grade?: number
  }): Promise<{ success: boolean; course?: AdminCourse; error?: string }> {
    try {
      const result = await api.post<BackendClassResponse>('/api/class/classes', {
        name: input.nameVi || input.name,
        subject: input.subject,
      })
      return {
        success: true,
        course: mapToAdminCourse({
          ...result,
          studentCount: 0,
          averageProgress: 0,
        }),
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create course'
      return { success: false, error: message }
    }
  },

  /**
   * Update course
   * Calls: PUT /api/class/classes/:id
   */
  async updateCourse(
    id: string,
    input: Partial<{
      name: string
      nameVi: string
      description: string
      descriptionVi: string
      code: string
      subject: string
      grade: number
      status: 'active' | 'archived' | 'draft'
    }>
  ): Promise<{ success: boolean; course?: AdminCourse; error?: string }> {
    try {
      const result = await api.put<BackendClassResponse>(`/api/class/classes/${id}`, {
        name: input.nameVi || input.name,
        subject: input.subject,
      })
      const existing = await this.getCourseById(id)
      return {
        success: true,
        course: mapToAdminCourse({
          ...result,
          studentCount: existing?.studentCount ?? 0,
          averageProgress: existing?.questionCount ?? 0,
        }),
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update course'
      return { success: false, error: message }
    }
  },

  /**
   * Delete course (soft delete)
   * Calls: DELETE /api/class/classes/:id
   */
  async deleteCourse(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await api.delete(`/api/class/classes/${id}`)
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete course'
      return { success: false, error: message }
    }
  },

  /**
   * Archive course
   */
  async archiveCourse(id: string): Promise<{ success: boolean; course?: AdminCourse; error?: string }> {
    return this.updateCourse(id, { status: 'archived' })
  },

  /**
   * Activate course
   */
  async activateCourse(id: string): Promise<{ success: boolean; course?: AdminCourse; error?: string }> {
    return this.updateCourse(id, { status: 'active' })
  },

  /**
   * Get courses snapshot
   */
  getCoursesSnapshot(): AdminCourse[] {
    return []
  },

  /**
   * Reset - not applicable for real API
   */
  resetToMockData(): void {
    // No-op for real API
  },
}

export default courseService
