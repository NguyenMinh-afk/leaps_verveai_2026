// ============================================
// VERVE AI - BKT Service (Real API Integration)
// ============================================
//
// TYPE ALIGNMENT (BKT-3):
// - Backend uses ACTIVE/RESOLVED/CANCELLED for intervention status
// - Backend uses PENDING/DIAGNOSED/MASTERED/STRUGGLING for mastery status
// - Evidence does not include studentId/skillName directly
// - Diagnosis returns array with skill metadata
//

import type { TopicMastery, InterventionGroup } from '@/types'
import * as bktApi from '@/lib/api/bkt'
import type { Intervention, InterventionStatus, DiagnosisDto, Evidence, EvidenceItem, MasteryStatus } from '@/lib/api/bkt'

/**
 * Map backend intervention status to frontend status
 */
function mapInterventionStatus(status: InterventionStatus): 'pending' | 'in-progress' | 'resolved' {
  switch (status) {
    case 'ACTIVE':
      return 'pending'
    case 'RESOLVED':
      return 'resolved'
    case 'CANCELLED':
      return 'resolved' // Map cancelled to resolved for UI purposes
    default:
      return 'pending'
  }
}

/**
 * Map backend mastery status to frontend mastery level
 */
function mapMasteryStatus(status: MasteryStatus): 'mastered' | 'learning' | 'needs-support' | 'unknown' {
  switch (status) {
    case 'MASTERED':
      return 'mastered'
    case 'DIAGNOSED':
      return 'learning'
    case 'STRUGGLING':
      return 'needs-support'
    case 'PENDING':
    default:
      return 'unknown'
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
 * Map backend Skill to TopicMastery
 */
function mapSkillToTopicMastery(skill: bktApi.BKTSkill): TopicMastery {
  return {
    topicId: skill.id,
    topicName: skill.name,
    topicNameVi: skill.name, // Backend doesn't provide Vietnamese name
    pKnown: 0.5, // Default, will be updated by diagnosis
    masteryLevel: 'learning',
    evidenceCount: 0,
    lastActivity: new Date(),
  }
}

/**
 * Map backend Intervention to InterventionGroup
 * NOTE: Backend does NOT provide skillName or rootCause - these need BKT computation
 */
function mapInterventionToGroup(intervention: Intervention): InterventionGroup {
  return {
    id: intervention.id,
    rootCause: 'Skill requires attention', // Placeholder - backend doesn't provide root cause
    rootCauseVi: 'Kỹ năng cần chú ý',
    studentIds: [intervention.studentId],
    severity: intervention.priority >= 0.7 ? 'high' : intervention.priority >= 0.4 ? 'medium' : 'low',
    size: 1,
    evidenceSummary: intervention.notes || 'Teacher intervention required',
    evidenceSummaryVi: intervention.notes || 'Cần can thiệp từ giáo viên',
    skills: ['Unknown'], // Backend doesn't provide skill names
    status: mapInterventionStatus(intervention.status),
    createdAt: new Date(intervention.createdAt),
    updatedAt: new Date(intervention.resolvedAt || intervention.createdAt),
  }
}

/**
 * Map backend Diagnosis to skill result format
 */
function mapDiagnosisToSkillResult(diagnosis: DiagnosisDto): bktApi.DiagnosisSkillResult {
  return {
    skillId: diagnosis.skillId,
    skillName: diagnosis.skillName || 'Unknown Skill',
    pKnown: diagnosis.pKnown,
    confidence: diagnosis.confidence >= 0.7 ? 'high' : diagnosis.confidence >= 0.4 ? 'medium' : 'low',
  }
}

/**
 * BKT Service - Real API integration
 * Uses Backend: /api/bkt/*
 */
export const bktService = {
  /**
   * Get all skills (topics)
   */
  async getSkills(page = 1, pageSize = 20): Promise<TopicMastery[]> {
    try {
      const response = await bktApi.listSkills(page, pageSize)
      return response.data.map(mapSkillToTopicMastery)
    } catch (error) {
      console.error('Failed to fetch skills:', error)
      throw error
    }
  },

  /**
   * Get skill by ID
   */
  async getSkill(id: string): Promise<TopicMastery | null> {
    try {
      const skill = await bktApi.getSkill(id)
      return mapSkillToTopicMastery(skill)
    } catch (error) {
      console.error('Failed to fetch skill:', error)
      return null
    }
  },

  /**
   * Get skill tree (hierarchical)
   */
  async getSkillTree(): Promise<bktApi.SkillTreeNode[]> {
    try {
      return await bktApi.getSkillTree()
    } catch (error) {
      console.error('Failed to fetch skill tree:', error)
      return []
    }
  },

  /**
   * Get skill prerequisites
   */
  async getSkillPrerequisites(skillId: string): Promise<TopicMastery[]> {
    try {
      const skills = await bktApi.getSkillPrerequisites(skillId)
      return skills.map(mapSkillToTopicMastery)
    } catch (error) {
      console.error('Failed to fetch prerequisites:', error)
      return []
    }
  },

  /**
   * Run diagnosis for a student and skill
   */
  async runDiagnosis(studentId: string, skillId: string): Promise<{
    pKnown: number
    confidence: 'high' | 'medium' | 'low'
  } | null> {
    try {
      const diagnosis = await bktApi.runDiagnosis(studentId, skillId)
      return {
        pKnown: diagnosis.pKnown,
        confidence: diagnosis.confidence >= 0.7 ? 'high' : diagnosis.confidence >= 0.4 ? 'medium' : 'low',
      }
    } catch (error) {
      console.error('Failed to run diagnosis:', error)
      return null
    }
  },

  /**
   * Run batch diagnosis for a student
   */
  async runBatchDiagnosis(studentId: string, skillIds: string[]): Promise<bktApi.DiagnosisSkillResult[]> {
    try {
      const result = await bktApi.runBatchDiagnosis(studentId, skillIds)
      return result.results.map(mapDiagnosisToSkillResult)
    } catch (error) {
      console.error('Failed to run batch diagnosis:', error)
      return []
    }
  },

  /**
   * Get all diagnoses for a student
   */
  async getStudentDiagnoses(studentId: string): Promise<DiagnosisDto[]> {
    try {
      return await bktApi.getStudentDiagnoses(studentId)
    } catch (error) {
      console.error('Failed to get student diagnoses:', error)
      throw error
    }
  },

  /**
   * Get diagnoses for all students in a class
   */
  async getClassDiagnoses(classId: string): Promise<DiagnosisDto[]> {
    try {
      return await bktApi.getClassDiagnoses(classId)
    } catch (error) {
      console.error('Failed to get class diagnoses:', error)
      return []
    }
  },

  /**
   * Get evidence for a student
   * NOTE: Returns raw evidence - does not include studentId/skillName
   */
  async getStudentEvidence(studentId: string): Promise<Evidence[]> {
    try {
      return await bktApi.getStudentEvidence(studentId)
    } catch (error) {
      console.error('Failed to get student evidence:', error)
      return []
    }
  },

  /**
   * Get evidence with diagnosis info for frontend use
   */
  async getStudentEvidenceWithDiagnosis(studentId: string): Promise<EvidenceItem[]> {
    try {
      const [evidence, diagnoses] = await Promise.all([
        bktApi.getStudentEvidence(studentId),
        bktApi.getStudentDiagnoses(studentId),
      ])

      // Build diagnosis lookup
      const diagnosisMap = new Map<string, DiagnosisDto>()
      diagnoses.forEach(d => diagnosisMap.set(d.id, d))

      // Map evidence with diagnosis info
      return evidence.map(ev => {
        const diagnosis = diagnosisMap.get(ev.diagnosisId)
        return {
          id: ev.id,
          diagnosisId: ev.diagnosisId,
          itemId: ev.itemId,
          studentId,
          skillId: diagnosis?.skillId || '',
          skillName: diagnosis?.skillName || 'Unknown',
          correct: ev.correct,
          confidence: ev.confidence,
          quality: ev.quality,
          createdAt: ev.createdAt,
        }
      })
    } catch (error) {
      console.error('Failed to get student evidence with diagnosis:', error)
      return []
    }
  },

  /**
   * Record new evidence
   */
  async recordEvidence(request: bktApi.RecordEvidenceRequest): Promise<Evidence | null> {
    try {
      return await bktApi.recordEvidence(request)
    } catch (error) {
      console.error('Failed to record evidence:', error)
      return null
    }
  },

  /**
   * Get evidence chain for a diagnosis
   * Uses backend: GET /api/bkt/evidence/:id/chain
   */
  async getEvidenceChain(diagnosisId: string): Promise<bktApi.EvidenceChain | null> {
    try {
      return await bktApi.getEvidenceChain(diagnosisId)
    } catch (error) {
      console.error('Failed to get evidence chain:', error)
      return null
    }
  },

  /**
   * Get interventions (optionally filtered)
   */
  async getInterventions(params: bktApi.ListInterventionsParams = {}): Promise<InterventionGroup[]> {
    try {
      const response = await bktApi.listInterventions(params)
      return response.data.map(mapInterventionToGroup)
    } catch (error) {
      console.error('Failed to get interventions:', error)
      return []
    }
  },

  /**
   * Get interventions for a class
   */
  async getClassInterventions(classId: string, page = 1, pageSize = 20): Promise<InterventionGroup[]> {
    try {
      const response = await bktApi.getClassInterventions(classId, page, pageSize)
      return response.data.map(mapInterventionToGroup)
    } catch (error) {
      console.error('Failed to get class interventions:', error)
      return []
    }
  },

  /**
   * Get interventions for a student
   */
  async getStudentInterventions(studentId: string): Promise<InterventionGroup[]> {
    try {
      const response = await bktApi.listInterventions({ studentId })
      return response.data.map(mapInterventionToGroup)
    } catch (error) {
      console.error('Failed to get student interventions:', error)
      return []
    }
  },

  /**
   * Get single intervention
   */
  async getIntervention(id: string): Promise<InterventionGroup | null> {
    try {
      const intervention = await bktApi.getIntervention(id)
      return mapInterventionToGroup(intervention)
    } catch (error) {
      console.error('Failed to get intervention:', error)
      return null
    }
  },

  /**
   * Update intervention status
   */
  async updateIntervention(
    id: string,
    request: bktApi.UpdateInterventionRequest
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await bktApi.updateIntervention(id, request)
      return { success: true }
    } catch (error) {
      console.error('Failed to update intervention:', error)
      return { success: false, error: 'Failed to update intervention' }
    }
  },

  /**
   * Override intervention (teacher override)
   */
  async overrideIntervention(
    id: string,
    reason: string,
    newStatus: 'pending' | 'in-progress' | 'resolved'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Map frontend status to backend status
      const backendStatus: InterventionStatus =
        newStatus === 'resolved' ? 'RESOLVED' :
        newStatus === 'in-progress' ? 'ACTIVE' : 'ACTIVE'
      await bktApi.overrideIntervention(id, { reason, newStatus: backendStatus })
      return { success: true }
    } catch (error) {
      console.error('Failed to override intervention:', error)
      return { success: false, error: 'Failed to override intervention' }
    }
  },

  /**
   * Add note to intervention
   */
  async addInterventionNote(id: string, content: string): Promise<{ success: boolean; error?: string }> {
    try {
      await bktApi.addInterventionNote(id, content)
      return { success: true }
    } catch (error) {
      console.error('Failed to add note:', error)
      return { success: false, error: 'Failed to add note' }
    }
  },

  /**
   * Resolve intervention
   */
  async resolveIntervention(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await bktApi.resolveIntervention(id)
      return { success: true }
    } catch (error) {
      console.error('Failed to resolve intervention:', error)
      return { success: false, error: 'Failed to resolve intervention' }
    }
  },
}

export default bktService
