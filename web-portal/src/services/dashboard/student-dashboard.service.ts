/**
 * VERVEAI — Student Dashboard Service
 *
 * Aggregates real data from multiple backend services for the student dashboard.
 * NO MOCK DATA - production uses real APIs only.
 */

import { bktService } from '@/services/bkt'
import { getRecommendations, RecommendationsUnavailableError } from '@/services/recommendation/recommendation.service'
import * as assignmentService from '@/services/assignment/assignment.service'
import { examService } from '@/services/exam/exam.service'
import type { 
  StudentProfile, 
  StudentDashboardStats, 
  StudentTopicMastery, 
  LearningRecommendation,
  StudentAssignment,
  StudentExam,
  LearningActivity
} from '@/types'

/**
 * Student Dashboard Data Types
 */
export interface StudentDashboardData {
  profile: StudentProfile | null
  stats: StudentDashboardStats
  topicMasteries: StudentTopicMastery[]
  recommendations: LearningRecommendation[]
  assignments: StudentAssignment[]
  exams: StudentExam[]
  activities: LearningActivity[]
}

/**
 * Student Dashboard Service
 * 
 * Aggregates data from:
 * - bktService (diagnoses, evidence)
 * - recommendationService (recommendations)
 * - assignmentService (assignments)
 * - examService (exams)
 */
export const studentDashboardService = {
  /**
   * Get complete student dashboard data
   * 
   * @param studentId - Student's ID (from authenticated session)
   */
  async getDashboardData(studentId: string): Promise<{
    success: boolean
    data?: StudentDashboardData
    error?: string
    partialError?: string // If some data failed but core data succeeded
  }> {
    try {
      // Fetch all data in parallel
      const [
        diagnosesResult,
        recommendationsResult,
        assignmentsResult,
        examsResult,
        evidenceResult,
      ] = await Promise.allSettled([
        bktService.getStudentDiagnoses(studentId),
        getRecommendations(studentId, { limit: 5 }),
        assignmentService.getStudentAssignments({ limit: 10 }),
        examService.getExams({ take: 10 }),
        bktService.getStudentEvidenceWithDiagnosis(studentId),
      ])

      // Build profile (minimal - auth provides user info)
      const profile: StudentProfile | null = null

      // Process diagnoses for stats and masteries
      let topicMasteries: StudentTopicMastery[] = []
      let averageMastery = 0
      let masteredCount = 0
      let learningCount = 0
      let needsSupportCount = 0
      let totalDiagnoses = 0

      if (diagnosesResult.status === 'fulfilled') {
        const diagnoses = diagnosesResult.value
        totalDiagnoses = diagnoses.length
        
        topicMasteries = diagnoses.map(d => ({
          topicId: d.skillId,
          topicName: d.skillName || 'Unknown Skill',
          topicNameVi: d.skillName || 'Kỹ năng không xác định',
          subject: 'Mathematics',
          subjectVi: 'Toán học',
          pKnown: d.pKnown,
          masteryLevel: d.pKnown >= 0.8 ? 'mastered' : d.pKnown >= 0.5 ? 'learning' : d.pKnown > 0 ? 'needs-support' : 'unknown',
          evidenceCount: 0,
          lastActivity: new Date(),
          trend: 'stable' as const,
        }))

        if (diagnoses.length > 0) {
          averageMastery = diagnoses.reduce((sum, d) => sum + d.pKnown, 0) / diagnoses.length
          masteredCount = diagnoses.filter(d => d.pKnown >= 0.8).length
          learningCount = diagnoses.filter(d => d.pKnown >= 0.5 && d.pKnown < 0.8).length
          needsSupportCount = diagnoses.filter(d => d.pKnown > 0 && d.pKnown < 0.5).length
        }
      }

      // Process recommendations
      let recommendations: LearningRecommendation[] = []
      let recommendationsError: string | undefined

      if (recommendationsResult.status === 'fulfilled') {
        recommendations = recommendationsResult.value
      } else if (recommendationsResult.reason instanceof RecommendationsUnavailableError) {
        recommendationsError = 'Recommendations temporarily unavailable'
      } else {
        recommendationsError = 'Failed to load recommendations'
      }

      // Process assignments
      let assignments: StudentAssignment[] = []
      if (assignmentsResult.status === 'fulfilled') {
        assignments = assignmentsResult.value.assignments
      }

      // Process exams
      let exams: StudentExam[] = []
      if (examsResult.status === 'fulfilled') {
        exams = examsResult.value.exams
      }

      // Build stats from real data
      const stats: StudentDashboardStats = {
        overallMastery: averageMastery,
        masteryLevel: averageMastery >= 0.8 ? 'mastered' : averageMastery >= 0.5 ? 'learning' : averageMastery > 0 ? 'needs-support' : 'unknown',
        topicsCompleted: masteredCount,
        topicsInProgress: learningCount,
        assignmentsPending: assignments.filter(a => a.status !== 'completed').length,
        assignmentsCompleted: assignments.filter(a => a.status === 'completed').length,
        examsCompleted: exams.filter(e => e.status === 'completed').length,
        averageScore: 0, // Not available from this endpoint
      }

      // Build activities from evidence
      const activities: LearningActivity[] = []
      if (evidenceResult.status === 'fulfilled') {
        const evidence = evidenceResult.value.slice(0, 10)
        for (const ev of evidence) {
          activities.push({
            id: ev.id,
            type: 'assignment', // evidence type maps to assignment
            title: ev.skillName || 'Learning Activity',
            titleVi: ev.skillName || 'Hoạt động học tập',
            description: ev.correct ? 'Completed activity' : 'Needs more practice',
            descriptionVi: ev.correct ? 'Hoàn thành hoạt động' : 'Cần luyện thêm',
            topicId: ev.skillId,
            topicName: ev.skillName || 'Unknown',
            topicNameVi: ev.skillName || 'Không xác định',
            timestamp: new Date(ev.createdAt),
            status: ev.correct ? 'completed' : 'in-progress',
          })
        }
      }

      return {
        success: true,
        data: {
          profile,
          stats,
          topicMasteries,
          recommendations,
          assignments,
          exams,
          activities,
        },
        partialError: recommendationsError,
      }
    } catch (error) {
      console.error('Failed to fetch student dashboard data:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load dashboard',
      }
    }
  },

  /**
   * Get student diagnoses (skill masteries)
   */
  async getStudentMasteries(studentId: string): Promise<{
    success: boolean
    data?: StudentTopicMastery[]
    error?: string
  }> {
    try {
      const diagnoses = await bktService.getStudentDiagnoses(studentId)
      const masteries: StudentTopicMastery[] = diagnoses.map(d => ({
        topicId: d.skillId,
        topicName: d.skillName || 'Unknown Skill',
        topicNameVi: d.skillName || 'Kỹ năng không xác định',
        subject: 'Mathematics',
        subjectVi: 'Toán học',
        pKnown: d.pKnown,
        masteryLevel: d.pKnown >= 0.8 ? 'mastered' : d.pKnown >= 0.5 ? 'learning' : d.pKnown > 0 ? 'needs-support' : 'unknown',
        evidenceCount: 0,
        lastActivity: new Date(),
        trend: 'stable' as const,
      }))
      return { success: true, data: masteries }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load masteries',
      }
    }
  },

  /**
   * Get student recommendations
   */
  async getRecommendations(studentId: string): Promise<{
    success: boolean
    data?: LearningRecommendation[]
    error?: string
    unavailable?: boolean
  }> {
    try {
      const recommendations = await getRecommendations(studentId, { limit: 5 })
      return { success: true, data: recommendations }
    } catch (error) {
      if (error instanceof RecommendationsUnavailableError) {
        return { success: false, error: error.message, unavailable: true }
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load recommendations',
      }
    }
  },

  /**
   * Get student assignments
   */
  async getAssignments(): Promise<{
    success: boolean
    data?: StudentAssignment[]
    error?: string
  }> {
    try {
      const result = await assignmentService.getStudentAssignments({ limit: 10 })
      return { success: true, data: result.assignments }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load assignments',
      }
    }
  },

  /**
   * Get available exams
   */
  async getExams(): Promise<{
    success: boolean
    data?: StudentExam[]
    error?: string
  }> {
    try {
      const result = await examService.getExams({ take: 10 })
      return { success: true, data: result.exams }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load exams',
      }
    }
  },
}

export default studentDashboardService
