/**
 * VERVEAI — BKT (Bayesian Knowledge Tracing) API surface (through Gateway → svc-bkt).
 *
 * TYPE ALIGNMENT NOTES (BKT-3):
 * - Backend returns ACTIVE/RESOLVED/CANCELLED for intervention status
 * - Backend returns PENDING/DIAGNOSED/MASTERED/STRUGGLING for mastery status
 * - Backend evidence does NOT include studentId, skillId directly (embedded in diagnosisId)
 * - Backend diagnosis returns array with skillCode, skillName, evidenceCount
 */

import { api } from './apiClient';

// ============================================
// Types
// ============================================

export interface BKTSkill {
  id: string
  code: string
  name: string
  difficulty: number
  description: string | null
  prerequisites?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface DiagnosisSkillResult {
  skillId: string
  skillName: string
  pKnown: number
  confidence: 'high' | 'medium' | 'low'
}

export interface Diagnosis {
  studentId: string
  skills: DiagnosisSkillResult[]
  interventions: unknown[]
}

/**
 * Backend Diagnosis DTO structure
 */
export interface DiagnosisDto {
  id: string
  studentId: string
  skillId: string
  skillCode: string | null
  skillName: string | null
  pKnown: number
  confidence: number
  status: MasteryStatus
  evidenceCount: number
  createdAt: string
  updatedAt: string
}

export type MasteryStatus = 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING'

/**
 * Evidence from BKT backend
 * NOTE: Does NOT include studentId or skillName directly - those come from diagnosis
 */
export interface Evidence {
  id: string
  diagnosisId: string
  itemId: string
  extractedAnswer: string | null
  correct: boolean | null
  confidence: number
  quality: EvidenceQuality
  createdAt: string
}

export type EvidenceQuality = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN'

/**
 * Frontend-friendly Evidence item with denormalized data
 * Created by mapper from backend Evidence + Diagnosis
 */
export interface EvidenceItem {
  id: string
  diagnosisId: string
  itemId: string
  studentId: string
  skillId: string
  skillName: string
  correct: boolean | null
  confidence: number
  quality: EvidenceQuality
  createdAt: string
}

/**
 * Backend Intervention DTO
 */
export interface Intervention {
  id: string
  studentId: string
  skillId: string
  priority: number
  status: InterventionStatus
  teacherId: string | null
  notes: string | null
  createdAt: string
  resolvedAt: string | null
  notes_list?: InterventionNote[]
}

export type InterventionStatus = 'ACTIVE' | 'RESOLVED' | 'CANCELLED'

export interface InterventionNote {
  id: string
  interventionId: string
  teacherId: string
  content: string
  createdAt: string
}

export interface SkillTreeNode {
  id: string
  code: string
  name: string
  difficulty: number
  children?: SkillTreeNode[]
}

// ============================================
// Skills API
// ============================================

export interface ListSkillsResponse {
  data: BKTSkill[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export async function listSkills(page = 1, pageSize = 20): Promise<ListSkillsResponse> {
  return api.get<ListSkillsResponse>(`/api/bkt/skills?page=${page}&pageSize=${pageSize}`)
}

export async function getSkill(id: string): Promise<BKTSkill> {
  return api.get<BKTSkill>(`/api/bkt/skills/${encodeURIComponent(id)}`)
}

export async function getSkillTree(): Promise<SkillTreeNode[]> {
  return api.get<SkillTreeNode[]>('/api/bkt/skills/tree')
}

export async function getSkillPrerequisites(id: string): Promise<BKTSkill[]> {
  return api.get<BKTSkill[]>(`/api/bkt/skills/${encodeURIComponent(id)}/prerequisites`)
}

// ============================================
// Diagnosis API
// ============================================

export interface RunDiagnosisRequest {
  studentId: string
  skillId: string
}

export interface BatchDiagnosisRequest {
  studentId: string
  skillIds: string[]
}

/**
 * Run diagnosis - backend returns the diagnosis as nested data
 */
export async function runDiagnosis(studentId: string, skillId: string): Promise<DiagnosisDto> {
  const data = await api.post<{ success: boolean; data: DiagnosisDto }>(
    '/api/bkt/diagnosis/run',
    { studentId, skillId }
  )
  return data.data
}

/**
 * Run batch diagnosis - returns multiple diagnoses
 */
export async function runBatchDiagnosis(studentId: string, skillIds: string[]): Promise<{
  studentId: string
  results: DiagnosisDto[]
  totalMastered: number
  totalDiagnosed: number
}> {
  const data = await api.post<{ success: boolean; data: {
    studentId: string
    results: DiagnosisDto[]
    totalMastered: number
    totalDiagnosed: number
  } }>(
    '/api/bkt/diagnosis/batch',
    { studentId, skillIds }
  )
  return data.data
}

/**
 * Get all diagnoses for a student - backend returns DiagnosisDto[]
 */
export async function getStudentDiagnoses(studentId: string): Promise<DiagnosisDto[]> {
  const data = await api.get<{ success: boolean; data: DiagnosisDto[] }>(
    `/api/bkt/diagnosis/student/${encodeURIComponent(studentId)}`
  )
  return data.data
}

/**
 * Get all diagnoses for a class - backend returns DiagnosisDto[]
 */
export async function getClassDiagnoses(classId: string): Promise<DiagnosisDto[]> {
  const data = await api.get<{ success: boolean; data: DiagnosisDto[] }>(
    `/api/bkt/diagnosis/class/${encodeURIComponent(classId)}`
  )
  return data.data
}

// ============================================
// Evidence API
// ============================================

export interface RecordEvidenceRequest {
  diagnosisId: string
  itemId: string
  extractedAnswer?: string
  correct: boolean
  confidence?: number
  quality?: EvidenceQuality
}

export async function recordEvidence(request: RecordEvidenceRequest): Promise<Evidence> {
  const data = await api.post<{ success: boolean; data: Evidence }>('/api/bkt/evidence', request)
  return data.data
}

/**
 * Get evidence for a student - backend returns Evidence[]
 * NOTE: Does not include studentId, need to join with diagnosis
 */
export async function getStudentEvidence(studentId: string): Promise<Evidence[]> {
  const data = await api.get<{ success: boolean; data: Evidence[] }>(
    `/api/bkt/evidence/student/${encodeURIComponent(studentId)}`
  )
  return data.data
}

export async function getEvidence(id: string): Promise<Evidence> {
  const data = await api.get<{ success: boolean; data: Evidence }>(
    `/api/bkt/evidence/${encodeURIComponent(id)}`
  )
  return data.data
}

export interface EvidenceChainStep {
  evidenceId: string
  itemId: string
  correct: boolean | null
  pKnownBefore: number
  pKnownAfter: number
  confidenceBefore: number
  confidenceAfter: number
  quality: EvidenceQuality
  createdAt: string
}

export interface EvidenceChain {
  diagnosisId: string
  studentId: string
  skillId: string
  currentPKnown: number
  currentStatus: MasteryStatus
  steps: EvidenceChainStep[]
}

export async function getEvidenceChain(evidenceId: string): Promise<EvidenceChain> {
  const data = await api.get<{ success: boolean; data: EvidenceChain }>(
    `/api/bkt/evidence/${encodeURIComponent(evidenceId)}/chain`
  )
  return data.data
}

// ============================================
// Intervention API
// ============================================

export interface ListInterventionsParams {
  status?: InterventionStatus
  classId?: string
  studentId?: string
  skillId?: string
  page?: number
  pageSize?: number
}

export interface ListInterventionsResponse {
  data: Intervention[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export async function listInterventions(params: ListInterventionsParams = {}): Promise<ListInterventionsResponse> {
  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set('status', params.status)
  if (params.classId) searchParams.set('classId', params.classId)
  if (params.studentId) searchParams.set('studentId', params.studentId)
  if (params.skillId) searchParams.set('skillId', params.skillId)
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  const query = searchParams.toString()
  const path = query ? `/api/bkt/interventions?${query}` : '/api/bkt/interventions'
  return api.get<ListInterventionsResponse>(path)
}

export async function getClassInterventions(classId: string, page = 1, pageSize = 20): Promise<ListInterventionsResponse> {
  return api.get<ListInterventionsResponse>(
    `/api/bkt/interventions/class/${encodeURIComponent(classId)}?page=${page}&pageSize=${pageSize}`
  )
}

export async function getIntervention(id: string): Promise<Intervention> {
  const data = await api.get<{ success: boolean; data: Intervention }>(
    `/api/bkt/interventions/${encodeURIComponent(id)}`
  )
  return data.data
}

export interface UpdateInterventionRequest {
  status?: InterventionStatus
  priority?: number
  notes?: string
}

export async function updateIntervention(id: string, request: UpdateInterventionRequest): Promise<Intervention> {
  const data = await api.put<{ success: boolean; data: Intervention }>(
    `/api/bkt/interventions/${encodeURIComponent(id)}`,
    request
  )
  return data.data
}

export interface OverrideInterventionRequest {
  reason: string
  newStatus: InterventionStatus
}

export async function overrideIntervention(id: string, request: OverrideInterventionRequest): Promise<Intervention> {
  const data = await api.put<{ success: boolean; data: Intervention }>(
    `/api/bkt/interventions/${encodeURIComponent(id)}/override`,
    request
  )
  return data.data
}

export interface AddNoteRequest {
  content: string
}

export async function addInterventionNote(id: string, content: string): Promise<InterventionNote> {
  const data = await api.post<{ success: boolean; data: InterventionNote }>(
    `/api/bkt/interventions/${encodeURIComponent(id)}/note`,
    { content }
  )
  return data.data
}

export async function resolveIntervention(id: string): Promise<Intervention> {
  const data = await api.post<{ success: boolean; data: Intervention }>(
    `/api/bkt/interventions/${encodeURIComponent(id)}/resolve`
  )
  return data.data
}
