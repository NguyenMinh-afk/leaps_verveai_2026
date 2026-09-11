// ============================================
// VERVE AI - Assignments Service Types
// ============================================

import type { Assignment } from '@/types'

/**
 * Create assignment input
 */
export interface CreateAssignmentInput {
  title: string
  titleVi?: string
  description: string
  descriptionVi?: string
  classId: string
  className: string
  questionIds: string[]
  dueDate?: Date
  status?: 'draft' | 'published'
}

/**
 * Update assignment input
 */
export interface UpdateAssignmentInput {
  id: string
  title?: string
  titleVi?: string
  description?: string
  descriptionVi?: string
  classId?: string
  className?: string
  questionIds?: string[]
  dueDate?: Date
  status?: 'draft' | 'published' | 'archived'
}

/**
 * Assignment filters
 */
export interface AssignmentFiltersInput {
  search?: string
  status?: 'draft' | 'published' | 'archived'
  classId?: string
  page?: number
  limit?: number
}

/**
 * Assignment list response
 */
export interface AssignmentListResponse {
  assignments: Assignment[]
  total: number
  page: number
  totalPages: number
}

/**
 * Assignment action response
 */
export interface AssignmentActionResponse {
  success: boolean
  assignment?: Assignment
  error?: string
}
