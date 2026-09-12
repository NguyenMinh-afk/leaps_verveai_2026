// ============================================
// VERVE AI - Course Service Mock Implementation
// ============================================

import type { AdminCourse } from '@/types'
import { mockAdminCourses } from '@/data/admin-mock-data'

/**
 * Development course service
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
  return `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Local state for courses (simulates backend storage)
 */
let localCourses: AdminCourse[] = [...mockAdminCourses]

/**
 * Reset to mock data
 */
function resetToMockData(): void {
  localCourses = [...mockAdminCourses]
}

/**
 * Course service
 */
export const courseService = {
  /**
   * Get all courses
   */
  async getCourses(): Promise<AdminCourse[]> {
    await simulateDelay()
    return [...localCourses]
  },

  /**
   * Get course by ID
   */
  async getCourseById(id: string): Promise<AdminCourse | null> {
    await simulateDelay()
    return localCourses.find((c) => c.id === id) || null
  },

  /**
   * Create new course
   */
  async createCourse(input: {
    name: string
    nameVi?: string
    description: string
    descriptionVi?: string
    code: string
    subject: string
    grade?: number
  }): Promise<{ success: boolean; course?: AdminCourse; error?: string }> {
    await simulateDelay()

    try {
      const newCourse: AdminCourse = {
        id: generateId(),
        name: input.name,
        nameVi: input.nameVi || input.name,
        description: input.description,
        descriptionVi: input.descriptionVi || input.description,
        code: input.code,
        subject: input.subject,
        grade: input.grade,
        status: 'draft',
        teacherCount: 0,
        studentCount: 0,
        questionCount: 0,
        topicCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      localCourses = [newCourse, ...localCourses]

      return { success: true, course: newCourse }
    } catch (error) {
      return { success: false, error: 'Không thể tạo khóa học' }
    }
  },

  /**
   * Update course
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
    await simulateDelay()

    try {
      const index = localCourses.findIndex((c) => c.id === id)
      if (index === -1) {
        return { success: false, error: 'Không tìm thấy khóa học' }
      }

      const updated: AdminCourse = {
        ...localCourses[index],
        ...input,
        updatedAt: new Date(),
      }

      localCourses = [
        ...localCourses.slice(0, index),
        updated,
        ...localCourses.slice(index + 1),
      ]

      return { success: true, course: updated }
    } catch (error) {
      return { success: false, error: 'Không thể cập nhật khóa học' }
    }
  },

  /**
   * Delete course
   */
  async deleteCourse(id: string): Promise<{ success: boolean; error?: string }> {
    await simulateDelay()

    try {
      localCourses = localCourses.filter((c) => c.id !== id)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Không thể xóa khóa học' }
    }
  },

  /**
   * Archive course
   */
  async archiveCourse(id: string): Promise<{ success: boolean; course?: AdminCourse; error?: string }> {
    return courseService.updateCourse(id, { status: 'archived' })
  },

  /**
   * Activate course
   */
  async activateCourse(id: string): Promise<{ success: boolean; course?: AdminCourse; error?: string }> {
    return courseService.updateCourse(id, { status: 'active' })
  },

  /**
   * Get courses snapshot
   */
  getCoursesSnapshot(): AdminCourse[] {
    return [...localCourses]
  },

  /**
   * Reset to mock data
   */
  resetToMockData,
}

export default courseService
