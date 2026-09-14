/**
 * VERVE AI - AI Recommendations Service
 *
 * Provides real API integration for personalized recommendations.
 * NO MOCK FALLBACK - production must use real data only.
 *
 * Real API: /api/ai/recommendations/student/:studentId
 */

import type { LearningRecommendation } from '@/types'
import { getStudentRecommendations, type RecommendationsResponse } from '@/lib/api/ai'

/**
 * Custom error for recommendation service unavailability.
 * Used to signal to the UI that recommendations are unavailable.
 */
export class RecommendationsUnavailableError extends Error {
  constructor(message: string = 'Recommendations service is temporarily unavailable') {
    super(message)
    this.name = 'RecommendationsUnavailableError'
  }
}

/**
 * Convert API response to frontend LearningRecommendation type
 */
function toLearningRecommendation(
  apiRec: {
    skillId: string
    skillName: string
    priority: number
    reason: string
    aiExplanation?: string
    suggestedContent?: Array<{
      contentId: string
      contentTitle: string
      contentType: string
      difficulty: number
    }>
    prerequisites?: string[]
  },
  language: 'vi' | 'en' = 'vi'
): LearningRecommendation {
  // Determine priority from priority score
  let priority: 'high' | 'medium' | 'low' = 'medium'
  if (apiRec.priority >= 0.7) {
    priority = 'high'
  } else if (apiRec.priority >= 0.4) {
    priority = 'medium'
  } else {
    priority = 'low'
  }

  // Map to recommendation status (no status in API response, default to pending)
  const status = 'pending' as const

  // Determine recommended action based on priority
  const recommendedAction = priority === 'high' ? 'practice' : priority === 'medium' ? 'review' : 'continue'

  return {
    id: `rec-${apiRec.skillId}`,
    topicId: apiRec.skillId,
    topicName: apiRec.skillName,
    topicNameVi: apiRec.skillName, // API doesn't distinguish
    priority,
    currentMastery: 1 - apiRec.priority, // Inverse of priority (lower mastery = higher priority)
    reason: apiRec.reason,
    reasonVi: apiRec.reason,
    recommendedAction,
    status,
    estimatedMinutes: apiRec.suggestedContent?.length
      ? Math.max(15, apiRec.suggestedContent.length * 10)
      : undefined,
  }
}

/**
 * Get personalized recommendations for a student.
 * 
 * Uses real API only - NO MOCK FALLBACK.
 * 
 * @param studentId - Student's ID
 * @param options - Query options
 * @returns Array of recommendations (may be empty)
 * @throws {RecommendationsUnavailableError} When service is unavailable
 */
export async function getRecommendations(
  studentId: string,
  options?: {
    limit?: number
    language?: 'vi' | 'en'
  }
): Promise<LearningRecommendation[]> {
  const response = await getStudentRecommendations(studentId, {
    limit: options?.limit ?? 10,
    language: options?.language ?? 'vi',
  })

  // Handle different response statuses from API
  // NO_RECOMMENDATION_AVAILABLE: Student has no weak skills
  // INSUFFICIENT_DATA: BKT has no diagnoses for this student
  // SUCCESS/PARTIAL: Real recommendations available
  
  // Return empty array for no-data states - UI should handle empty state
  if (
    response.status === 'NO_RECOMMENDATION_AVAILABLE' ||
    response.status === 'INSUFFICIENT_DATA' ||
    response.recommendations.length === 0
  ) {
    return []
  }

  // Convert API response to frontend format
  return response.recommendations.map(rec =>
    toLearningRecommendation(rec, options?.language ?? 'vi')
  )
}

/**
 * Check if recommendations are available for a student.
 * 
 * @param studentId - Student's ID
 * @returns true if recommendations are available
 * @throws {RecommendationsUnavailableError} When service is unavailable
 */
export async function hasRecommendations(studentId: string): Promise<boolean> {
  const response = await getStudentRecommendations(studentId, {
    limit: 1,
  })
  return response.recommendations.length > 0
}

export const recommendationsService = {
  getRecommendations,
  hasRecommendations,
}

export default recommendationsService
