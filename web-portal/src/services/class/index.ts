// ============================================
// VERVE AI - Classes Service (Real API Integration)
// ============================================

import type { TeacherClass, TeacherStudent, TopicMastery } from '@/types'
import { ApiError } from '@/lib/api/apiClient'
import {
  listClasses,
  getClass,
  getClassStats,
  getStudent,
  type ClassSummary,
  type StudentDetail,
  type ProgressHistory,
  getProgressHistory,
  getStudentSkills as getStudentSkillsFromApi,
  listClassStudents,
  createClass as createClassApi,
  updateClass as updateClassApi,
  deleteClass as deleteClassApi,
  type CreateClassInput,
  type UpdateClassInput,
} from '@/lib/api/classes'

/**
 * Map Backend ClassSummary to TeacherClass
 */
function mapClassSummary(source: ClassSummary): TeacherClass {
  return {
    id: source.id,
    name: source.name,
    subject: source.subject || 'math',
    grade: 6, // Backend doesn't provide grade - using default
    studentCount: source.studentCount ?? 0,
    averageMastery: source.averageMastery ?? 0,
    lastActivity: new Date(),
    status: 'active',
  }
}

/**
 * Map Backend StudentDetail to TeacherStudent
 */
function mapStudentDetail(source: StudentDetail): TeacherStudent {
  return {
    id: source.id,
    code: source.externalId || source.id.slice(0, 8),
    name: source.name,
    email: source.email || undefined,
    classId: '', // Will be set by caller
    overallMastery: source.progressSummary.averagePKnown,
    masteryLevel: getMasteryLevel(source.progressSummary.averagePKnown),
    lastActive: new Date(),
    interventionCount: 0,
    assessmentCount: source.progressSummary.totalAttempts,
    topicMasteries: source.progressSummary.skills?.map((skill) => ({
      topicId: skill.skillId || skill.skillName || 'unknown',
      topicName: skill.skillName || 'Unknown',
      topicNameVi: skill.skillName || 'Không xác định',
      pKnown: skill.pKnown ?? 0,
      masteryLevel: getMasteryLevel(skill.pKnown ?? 0),
      evidenceCount: skill.evidenceCount ?? 0,
      lastActivity: new Date(),
    })) || [],
  }
}

/**
 * Get mastery level from pKnown value
 */
function getMasteryLevel(pKnown: number): 'mastered' | 'learning' | 'needs-support' | 'unknown' {
  if (pKnown >= 0.8) return 'mastered'
  if (pKnown >= 0.5) return 'learning'
  if (pKnown > 0) return 'needs-support'
  return 'unknown'
}

/**
 * Classes service - Real API integration
 * Uses Backend: /api/class/*
 */
export const classService = {
  /**
   * Get all classes for the current teacher
   */
  async getClasses(teacherId?: string): Promise<TeacherClass[]> {
    try {
      const classes = await listClasses({ teacherId })
      return classes.map(mapClassSummary)
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      throw error
    }
  },

  /**
   * Get class by ID with stats
   */
  async getClassById(id: string): Promise<TeacherClass | null> {
    try {
      const [classDetail, stats] = await Promise.all([
        getClass(id),
        getClassStats(id),
      ])

      return {
        id: classDetail.id,
        name: classDetail.name,
        subject: classDetail.subject || 'math',
        grade: 6,
        studentCount: stats.studentCount,
        averageMastery: stats.averageMastery ?? 0,
        lastActivity: new Date(classDetail.updatedAt),
        status: 'active',
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null
      }
      console.error('Failed to fetch class:', error)
      throw error
    }
  },

  /**
   * Get students for a class
   */
  async getClassStudents(classId: string): Promise<TeacherStudent[]> {
    try {
      const entries = await listClassStudents(classId)
      return entries.map((entry) => ({
        id: entry.id,
        code: entry.externalId || entry.id.slice(0, 8),
        name: entry.name,
        email: entry.email ?? undefined,
        classId,
        overallMastery: 0,
        masteryLevel: 'unknown' as const,
        lastActive: entry.enrolledAt ? new Date(entry.enrolledAt) : new Date(),
        interventionCount: 0,
        assessmentCount: 0,
        topicMasteries: [],
      }))
    } catch (error) {
      console.error('Failed to fetch class students:', error)
      throw error
    }
  },

  /**
   * Get student by ID with progress
   */
  async getStudentById(id: string): Promise<TeacherStudent | null> {
    try {
      const student = await getStudent(id)
      return mapStudentDetail(student)
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null
      }
      console.error('Failed to fetch student:', error)
      throw error
    }
  },

  /**
   * Create new class (Backend API)
   * Note: This endpoint exists in gateway but requires backend implementation
   */
  async createClass(input: {
    name: string
    subject: string
    grade: number
  }): Promise<{ success: boolean; class?: TeacherClass; error?: string }> {
    try {
      const apiInput: CreateClassInput = {
        name: input.name,
        subject: input.subject,
      }
      const result = await createClassApi(apiInput)
      return {
        success: true,
        class: {
          id: result.id,
          name: result.name,
          subject: result.subject || input.subject,
          grade: input.grade,
          studentCount: result.studentCount ?? 0,
          averageMastery: result.averageMastery ?? 0,
          lastActivity: new Date(),
          status: 'active',
        },
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to create class'
      console.error('Failed to create class:', error)
      return { success: false, error: message }
    }
  },

  /**
   * Update class
   * Note: Backend has PUT /classes/:id but implementation may vary
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
    try {
      const apiInput: UpdateClassInput = {}
      if (input.name !== undefined) apiInput.name = input.name
      if (input.subject !== undefined) apiInput.subject = input.subject
      const result = await updateClassApi(id, apiInput)
      return {
        success: true,
        class: {
          id: result.id,
          name: result.name,
          subject: result.subject || 'math',
          grade: input.grade ?? 6,
          studentCount: result.studentCount ?? 0,
          averageMastery: result.averageMastery ?? 0,
          lastActivity: new Date(),
          status: input.status ?? 'active',
        },
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to update class'
      console.error('Failed to update class:', error)
      return { success: false, error: message }
    }
  },

  async deleteClass(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await deleteClassApi(id)
      return { success: true }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to delete class'
      console.error('Failed to delete class:', error)
      return { success: false, error: message }
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
   * Get student progress
   */
  async getStudentProgress(studentId: string): Promise<{
    totalSkills: number
    averagePKnown: number
    masteredSkills: number
    totalAttempts: number
  } | null> {
    try {
      const student = await getStudent(studentId)
      return student.progressSummary
    } catch (error) {
      console.error('Failed to fetch student progress:', error)
      return null
    }
  },

  /**
   * Get student skills mastery
   */
  async getStudentSkills(studentId: string): Promise<TopicMastery[]> {
    try {
      const student = await getStudent(studentId)
      return student.progressSummary.skills?.map((skill) => ({
        topicId: skill.skillId || skill.skillName || 'unknown',
        topicName: skill.skillName || 'Unknown',
        topicNameVi: skill.skillName || 'Không xác định',
        pKnown: skill.pKnown ?? 0,
        masteryLevel: getMasteryLevel(skill.pKnown ?? 0),
        evidenceCount: skill.evidenceCount ?? 0,
        lastActivity: new Date(),
      })) || []
    } catch (error) {
      console.error('Failed to fetch student skills:', error)
      return []
    }
  },

  /**
   * Get progress history for a student's skill
   * Uses backend: GET /api/class/progress/:studentId/history
   */
  async getProgressHistory(
    studentId: string,
    skillId: string,
    days: number = 30
  ): Promise<ProgressHistory | null> {
    try {
      return await getProgressHistory(studentId, { skillId, days });
    } catch (error) {
      console.error('Failed to fetch progress history:', error);
      return null;
    }
  },

  /**
   * Get all skill progress summaries for a student
   * Uses backend: GET /api/class/progress/:studentId/skills
   */
  async getStudentSkillSummaries(
    studentId: string
  ): Promise<{
    skillId: string;
    pKnown: number;
    attemptCount: number;
    updatedAt: string;
    masteryStatus: 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';
  }[]> {
    try {
      return await getStudentSkillsFromApi(studentId);
    } catch (error) {
      console.error('Failed to fetch student skill summaries:', error);
      return [];
    }
  },
}

export default classService
