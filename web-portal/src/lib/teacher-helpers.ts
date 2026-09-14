/**
 * Fallback utilities for teacher pages
 * 
 * These functions provide graceful degradation when APIs are unavailable.
 * They return empty arrays/defaults instead of throwing errors,
 * allowing the UI to render with empty states rather than crashing.
 * 
 * Usage: Import and use in .catch() blocks for API calls.
 * Example: api.getData().catch(() => getMockInterventions())
 */

import type { InterventionGroup } from '@/types'
import type { Diagnosis } from '@/types'

/**
 * Fallback for BKT API - returns empty array
 * Use when BKT service is unreachable
 */
export function getMockInterventions(): InterventionGroup[] {
  return []
}

/**
 * Fallback for AI diagnostic API - returns empty array
 * Use when AI diagnostic service is unreachable
 */
export function getMockDiagnoses(): Diagnosis[] {
  return []
}

/**
 * Fallback for evidence lookup - returns empty array
 * Use when evidence service is unreachable
 */
export function getEvidenceByIds(_evidenceIds: string[]) {
  return []
}

/**
 * Fallback for diagnosis summary - returns zero counts
 * Use when diagnostic summary service is unreachable
 */
export function getStudentDiagnosisSummary(_studentId: string) {
  return {
    totalDiagnoses: 0,
    pendingReview: 0,
    highConfidence: 0,
    abstainCount: 0,
  }
}
