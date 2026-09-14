/**
 * VERVEAI — Teacher Dashboard Service
 *
 * Aggregates real data from multiple backend services for the teacher dashboard.
 * NO MOCK DATA - production uses real APIs only.
 */

import { classService } from '@/services/class'
import { bktService } from '@/services/bkt'
import type { TeacherClass, InterventionGroup, TeacherDashboardStats, MasteryDistribution, ActivityLogEntry } from '@/types'

/**
 * Teacher Dashboard Data Types
 */
export interface TeacherDashboardData {
  stats: TeacherDashboardStats
  classes: TeacherClass[]
  interventions: InterventionGroup[]
  activityLog: ActivityLogEntry[]
  masteryDistribution: MasteryDistribution
}

/**
 * Activity log entry for frontend
 */
export interface DashboardActivity {
  id: string
  type: 'assessment' | 'intervention' | 'question' | 'mastery' | 'assignment'
  title: string
  titleVi: string
  description: string
  descriptionVi: string
  studentName?: string
  className?: string
  timestamp: Date
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
 * Teacher Dashboard Service
 * 
 * Aggregates data from:
 * - classService (classes, students)
 * - bktService (interventions)
 */
export const teacherDashboardService = {
  /**
   * Get complete teacher dashboard data
   */
  async getDashboardData(): Promise<{
    success: boolean
    data?: TeacherDashboardData
    error?: string
  }> {
    try {
      // Fetch all data in parallel
      const [classesResult, interventionsResult] = await Promise.allSettled([
        classService.getClasses(),
        bktService.getInterventions(),
      ])

      // Handle classes
      let classes: TeacherClass[] = []
      if (classesResult.status === 'fulfilled') {
        classes = classesResult.value
      }

      // Handle interventions
      let interventions: InterventionGroup[] = []
      if (interventionsResult.status === 'fulfilled') {
        interventions = interventionsResult.value
      }

      // Calculate stats from real data
      const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0)
      const activeClasses = classes.filter(c => c.status === 'active').length
      const averageMastery = classes.length > 0
        ? classes.reduce((sum, c) => sum + c.averageMastery, 0) / classes.length
        : 0
      const studentsNeedingIntervention = interventions.filter(
        i => i.severity === 'high' || i.severity === 'medium'
      ).length

      // Build mastery distribution from class masteries
      const masteryDistribution = calculateMasteryDistribution(classes)

      // Build activity log from recent interventions
      const activityLog = buildActivityLog(interventions)

      return {
        success: true,
        data: {
          stats: {
            totalStudents,
            activeClasses,
            averageMastery,
            studentsNeedingIntervention,
            pendingQuestions: 0,
            pendingAssignments: 0,
          },
          classes,
          interventions,
          activityLog,
          masteryDistribution,
        },
      }
    } catch (error) {
      console.error('Failed to fetch teacher dashboard data:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load dashboard',
      }
    }
  },

  /**
   * Get classes for teacher
   */
  async getClasses(): Promise<{
    success: boolean
    data?: TeacherClass[]
    error?: string
  }> {
    try {
      const classes = await classService.getClasses()
      return { success: true, data: classes }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load classes',
      }
    }
  },

  /**
   * Get interventions for teacher
   */
  async getInterventions(): Promise<{
    success: boolean
    data?: InterventionGroup[]
    error?: string
  }> {
    try {
      const interventions = await bktService.getInterventions()
      return { success: true, data: interventions }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load interventions',
      }
    }
  },
}

/**
 * Calculate mastery distribution from classes
 */
function calculateMasteryDistribution(classes: TeacherClass[]): MasteryDistribution {
  // Aggregate mastery data from all classes
  let totalMastered = 0
  let totalLearning = 0
  let totalNeedsSupport = 0
  let totalUnknown = 0
  let totalStudents = 0

  for (const cls of classes) {
    const mastery = cls.averageMastery
    totalStudents += cls.studentCount

    if (mastery >= 0.8) {
      totalMastered += cls.studentCount
    } else if (mastery >= 0.5) {
      totalLearning += cls.studentCount
    } else if (mastery > 0) {
      totalNeedsSupport += cls.studentCount
    } else {
      totalUnknown += cls.studentCount
    }
  }

  return {
    mastered: totalMastered,
    learning: totalLearning,
    needsSupport: totalNeedsSupport,
    unknown: totalUnknown,
    total: totalStudents,
  }
}

/**
 * Build activity log from interventions
 */
function buildActivityLog(interventions: InterventionGroup[]): ActivityLogEntry[] {
  return interventions
    .slice(0, 10) // Take most recent 10
    .map((intervention) => ({
      id: `activity-${intervention.id}`,
      type: 'intervention' as const,
      title: 'New intervention',
      titleVi: 'Có can thiệp mới',
      description: intervention.rootCauseVi || intervention.rootCause,
      descriptionVi: intervention.rootCauseVi || intervention.rootCause,
      className: intervention.skills.join(', '),
      timestamp: intervention.createdAt,
    }))
}

export default teacherDashboardService
