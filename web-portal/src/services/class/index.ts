// ============================================
// VERVE AI - Classes Service Mock Implementation
// ============================================

import type { TeacherClass } from '@/types'
import { mockClasses } from '@/data/teacher-mock-data'

/**
 * Development classes service
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
  return `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Local state for classes (simulates backend storage)
 */
let localClasses: TeacherClass[] = [...mockClasses]

/**
 * Reset to mock data
 */
function resetToMockData(): void {
  localClasses = [...mockClasses]
}

/**
 * Classes service
 */
export const classService = {
  /**
   * Get all classes
   */
  async getClasses(): Promise<TeacherClass[]> {
    await simulateDelay()
    return [...localClasses]
  },

  /**
   * Get class by ID
   */
  async getClassById(id: string): Promise<TeacherClass | null> {
    await simulateDelay()
    return localClasses.find((c) => c.id === id) || null
  },

  /**
   * Create new class
   */
  async createClass(input: {
    name: string
    subject: string
    grade: number
  }): Promise<{ success: boolean; class?: TeacherClass; error?: string }> {
    await simulateDelay()

    try {
      const newClass: TeacherClass = {
        id: generateId(),
        name: input.name,
        subject: input.subject,
        grade: input.grade,
        studentCount: 0,
        averageMastery: 0,
        lastActivity: new Date(),
        status: 'active',
      }

      localClasses = [newClass, ...localClasses]

      return { success: true, class: newClass }
    } catch (error) {
      return { success: false, error: 'Không thể tạo lớp học' }
    }
  },

  /**
   * Update class
   */
  async updateClass(
    id: string,
    input: Partial<{
      name: string
      subject: string
      grade: number
      status: 'active' | 'inactive' | 'archived'
    }>
  ): Promise<{ success: boolean; class?: TeacherClass; error?: string }> {
    await simulateDelay()

    try {
      const index = localClasses.findIndex((c) => c.id === id)
      if (index === -1) {
        return { success: false, error: 'Không tìm thấy lớp học' }
      }

      const updated: TeacherClass = {
        ...localClasses[index],
        ...input,
      }

      localClasses = [
        ...localClasses.slice(0, index),
        updated,
        ...localClasses.slice(index + 1),
      ]

      return { success: true, class: updated }
    } catch (error) {
      return { success: false, error: 'Không thể cập nhật lớp học' }
    }
  },

  /**
   * Delete class
   */
  async deleteClass(id: string): Promise<{ success: boolean; error?: string }> {
    await simulateDelay()

    try {
      localClasses = localClasses.filter((c) => c.id !== id)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Không thể xóa lớp học' }
    }
  },

  /**
   * Archive class
   */
  async archiveClass(id: string): Promise<{ success: boolean; class?: TeacherClass; error?: string }> {
    return classService.updateClass(id, { status: 'archived' })
  },

  /**
   * Restore class
   */
  async restoreClass(id: string): Promise<{ success: boolean; class?: TeacherClass; error?: string }> {
    return classService.updateClass(id, { status: 'active' })
  },

  /**
   * Get classes snapshot
   */
  getClassesSnapshot(): TeacherClass[] {
    return [...localClasses]
  },

  /**
   * Reset to mock data
   */
  resetToMockData,
}

export default classService
