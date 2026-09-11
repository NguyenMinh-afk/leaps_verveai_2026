// ============================================
// VERVE AI - Course Types
// ============================================

import type { AdminCourse } from '@/types'

/**
 * Course filter input
 */
export interface CourseFiltersInput {
  search?: string
  status?: AdminCourse['status']
  subject?: string
}

/**
 * Create course input
 */
export interface CreateCourseInput {
  name: string
  nameVi?: string
  description: string
  descriptionVi?: string
  code: string
  subject: string
  grade?: number
}

/**
 * Update course input
 */
export interface UpdateCourseInput extends Partial<CreateCourseInput> {
  id: string
  status?: 'active' | 'archived' | 'draft'
}

/**
 * Course action response
 */
export interface CourseActionResponse {
  success: boolean
  course?: AdminCourse
  error?: string
}
