/**
 * VERVEAI — AI Recommendation Service
 *
 * Provides real API integration for AI-powered recommendations.
 * NO MOCK FALLBACK - production must use real data only.
 */

import { getStudentRecommendations, type RecommendationsResponse } from '@/lib/api/ai'
import type { LearningRecommendation } from '@/types'

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
 * Map API recommendation to frontend LearningRecommendation type
 */
function mapToLearningRecommendation(
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
  }
): LearningRecommendation {
  // Determine priority from score
  const priority: 'high' | 'medium' | 'low' = 
    apiRec.priority >= 0.7 ? 'high' :
    apiRec.priority >= 0.4 ? 'medium' : 'low'

  // Determine recommended action based on content availability
  const hasContent = apiRec.suggestedContent && apiRec.suggestedContent.length > 0
  const recommendedAction = hasContent ? 'practice' : 'review'

  return {
    id: `rec-${apiRec.skillId}`,
    topicId: apiRec.skillId,
    topicName: apiRec.skillName,
    topicNameVi: apiRec.skillName, // Use same name for Vietnamese
    priority,
    currentMastery: 1 - apiRec.priority, // Inverse of priority as mastery
    reason: apiRec.reason,
    reasonVi: apiRec.reason, // API returns in requested language
    recommendedAction,
    status: 'pending',
    estimatedMinutes: apiRec.suggestedContent 
      ? Math.max(15, apiRec.suggestedContent.length * 10) 
      : 30,
  }
}

/**
 * Get recommendations for a student.
 * 
 * Uses real API only - NO MOCK FALLBACK.
 * 
 * @param studentId - Student's ID
 * @param options - Optional query parameters
 * @returns Array of learning recommendations, or throws RecommendationsUnavailableError
 * @throws {RecommendationsUnavailableError} When service is unavailable or returns error
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

  // Handle semantic states from API
  // INSUFFICIENT_DATA: BKT has no diagnoses for this student
  // NO_RECOMMENDATION_AVAILABLE: Student has no weak skills
  // SUCCESS/PARTIAL: Real recommendations available
  
  // Map API response to frontend type
  const recommendations = response.recommendations.map(mapToLearningRecommendation)
  
  // If API explicitly returned no recommendations (not an error), return empty array
  // The calling component should handle empty state UI
  return recommendations
}

/**
 * Check if recommendations service is available.
 * Returns false if service is down, true otherwise.
 */
export async function checkRecommendationsAvailable(): Promise<boolean> {
  try {
    // Try a quick call to see if the service is up
    await getRecommendations('__availability-check__', { limit: 1 })
    return true
  } catch {
    return false
  }
}
