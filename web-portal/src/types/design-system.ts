// ============================================
// VERVE AI Design System - TypeScript Types
// ============================================

/**
 * User roles in the system
 */
export type UserRole = 'student' | 'teacher' | 'reviewer' | 'admin'

// ============================================
// AI DIAGNOSTIC TYPES (3-Layer AI Architecture)
// ============================================

/**
 * Non-knowledge cause types (Layer 2 - BR-05)
 * When evidence suggests non-knowledge causes, system MUST NOT conclude knowledge gap
 */
export type NonKnowledgeCause = 
  | 'carelessness'      // Student made a mistake despite knowing
  | 'guessing'          // Student guessed without proper reasoning
  | 'language_barrier'   // Student struggled due to language comprehension
  | 'test_anxiety'      // Student performed poorly due to anxiety
  | 'other_non_knowledge';

/**
 * Abstention reasons when evidence is insufficient (BR-01)
 */
export type AbstentionReason = 
  | 'insufficient_evidence'     // Not enough evidence to conclude
  | 'conflicting_evidence'      // Evidence contradicts each other
  | 'low_confidence'           // Confidence below threshold
  | 'unknown_pattern';         // Pattern not recognized

/**
 * Diagnosis status - the state of a diagnosis conclusion
 */
export type DiagnosisStatus = 
  | 'system_conclusion'   // System has made a conclusion
  | 'pending_review'      // Awaiting teacher review
  | 'accepted'            // Teacher accepted system conclusion
  | 'adjusted'            // Teacher adjusted the conclusion
  | 'rejected'           // Teacher rejected the conclusion
  | 'abstained';         // System abstained (insufficient evidence)

/**
 * Confidence level thresholds for UI display
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Evidence item for the evidence chain (Layer 1 & 2)
 */
export interface DiagnosisEvidence {
  id: string;
  itemId: string;
  itemContent: string;
  itemContentVi?: string;
  studentResponse: string;
  correct: boolean;
  isAbstain?: boolean;       // Student chose "I don't know"
  timestamp: Date | string;
  contextMode: 'in-class' | 'out-of-class';
  latencyMs?: number;
  skillId: string;
  skillName: string;
  skillNameVi?: string;
  confidenceWeight: number;
  selectedDistractor?: string; // Type of misconception if wrong
  nonKnowledgeCause?: NonKnowledgeCause; // If flagged as non-knowledge
  extractionStatus?: 'pending' | 'completed' | 'failed';
  extractionConfidence?: number; // LLM extraction confidence (Layer 1)
}

/**
 * Extended Diagnosis data (Layer 2 output)
 */
export interface Diagnosis {
  id: string;
  studentId: string;
  studentName?: string;
  skillId: string;
  skillName: string;
  skillNameVi?: string;
  
  // Root cause identification
  rootCause: string;
  rootCauseVi: string;
  rootCauseCode?: string;     // Structured root cause ID (e.g., "RC-001")
  
  // Confidence and abstention
  confidence: number;         // 0.0 - 1.0
  abstain: boolean;           // True if system cannot conclude
  abstainReason?: AbstentionReason;
  
  // Status tracking
  status: DiagnosisStatus;
  
  // Evidence chain (Layer 1 output)
  evidenceIds: string[];
  evidenceItems?: DiagnosisEvidence[];
  
  // Non-knowledge flag (Layer 2 - BR-05)
  nonKnowledgeCause?: NonKnowledgeCause;
  nonKnowledgeFlag?: boolean;
  
  // pKnown from BKT (Layer 2)
  pKnown?: number;           // Mastery probability from BKT
  
  // Teacher override (after teacher decision)
  teacherOverride?: TeacherOverride;
  
  // Layer 3 - Teacher explanation
  explanation?: TeacherExplanation;
  
  // Timestamps
  createdAt: Date | string;
  updatedAt?: Date | string;
}

/**
 * Teacher Explanation (Layer 3 output)
 * BR-13: Skill-focused language, no ability labels
 */
export interface TeacherExplanation {
  summary: string;            // Short summary for display
  summaryVi?: string;        // Vietnamese summary
  reasoning: string;          // Detailed reasoning chain
  reasoningVi?: string;      // Vietnamese reasoning
  affectedSkills: string[];   // List of skills affected
  recommendedActions?: string[];
  recommendedActionsVi?: string[];
  evidenceHighlights?: string[]; // Key evidence points
  generatedAt?: Date | string;
  isFactChecked?: boolean;    // Whether fact_check_guard passed
}

/**
 * Teacher override data (BR-10, BR-12)
 * Teacher decision always overrides system conclusion
 * Original conclusion must be preserved for audit
 */
export interface TeacherOverride {
  originalDiagnosis: string;           // Original root cause
  originalDiagnosisVi?: string;
  originalConfidence: number;
  newConclusion: string;              // Teacher's conclusion
  newConclusionVi?: string;
  overrideType: 'accept' | 'adjust' | 'reject';
  reason: OverrideReason;
  reasonDetail?: string;              // Free-text explanation
  teacherId: string;
  teacherName?: string;
  createdAt: Date | string;
}

/**
 * Override reason options
 */
export type OverrideReason = 
  | 'correct_conclusion'       // Teacher confirms system was correct
  | 'wrong_cause'             // System identified wrong root cause
  | 'missing_context'         // Additional context not available to system
  | 'insufficient_evidence'   // Teacher has more information
  | 'student_knows_better'    // Teacher knows student understanding
  | 'other';

/**
 * Student Diagnosis summary for teacher view
 */
export interface StudentDiagnosisSummary {
  studentId: string;
  studentName: string;
  studentCode: string;
  diagnoses: Diagnosis[];
  overallStatus: DiagnosisStatus;
  highPriorityCount: number;
  abstentionCount: number;
  pendingReviewCount: number;
  lastUpdated: Date | string;
}

/**
 * Intervention Group with full AI diagnostic information
 */
export interface DiagnosticInterventionGroup {
  id: string;
  rootCause: string;
  rootCauseVi: string;
  rootCauseCode?: string;
  studentIds: string[];
  students: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  severity: SeverityLevel;
  size: number;
  evidenceSummary: string;
  evidenceSummaryVi: string;
  skills: string[];
  
  // AI Diagnostic info
  averageConfidence: number;
  confidenceLevel: ConfidenceLevel;
  diagnoses: Diagnosis[];
  
  // Non-knowledge stats
  hasNonKnowledgeCases: boolean;
  nonKnowledgeCount?: number;
  
  // Status
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Get confidence level from confidence value
 */
export function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.4) return 'medium';
  return 'low';
}

/**
 * Navigation item structure
 */
export interface NavItem {
  id: string
  label: string
  labelVi: string
  href: string
  icon: string
  badge?: string | number
  children?: NavItem[]
}

/**
 * Mastery levels for BKT visualization
 */
export type MasteryLevel = 'mastered' | 'learning' | 'needs-support' | 'unknown'

/**
 * Severity levels for interventions
 */
export type SeverityLevel = 'high' | 'medium' | 'low'

/**
 * Intervention group data (legacy - kept for backward compatibility)
 */
export interface InterventionGroup {
  id: string
  rootCause: string
  rootCauseVi: string
  studentIds: string[]
  severity: SeverityLevel
  size: number
  evidenceSummary: string
  evidenceSummaryVi: string
  skills: string[]
  status: 'pending' | 'in-progress' | 'resolved'
  createdAt: Date | string
  updatedAt: Date | string
}

/**
 * Student data for dashboard
 */
export interface Student {
  id: string
  code: string
  name: string
  classId: string
  deviceId?: string
  pKnown: Record<string, number>
  lastActive: Date | string
}

/**
 * Skill data
 */
export interface Skill {
  id: string
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  gradeLevel: number
  chapter: string
  topic: string
  prerequisiteSkillIds: string[]
  status: 'learning' | 'mastered' | 'needs_remediation'
}

/**
 * Evidence event data
 */
export interface EvidenceEvent {
  eventId: string
  studentId: string
  itemId: string
  response: 0 | 1
  latencyMs: number
  contextMode: 'in-class' | 'out-of-class'
  confidenceWeight: number
  logicalTimestamp: Date | string
  deviceId: string
  sessionId: string
  syncStatus: 'pending' | 'synced' | 'conflict'
}

/**
 * Diagnosis data
 */
export interface Diagnosis {
  id: string
  studentId: string
  skillId: string
  rootCause: string
  confidence: number
  abstain: boolean
  evidenceIds: string[]
  teacherOverride?: TeacherOverride
  createdAt: Date | string
}

/**
 * Teacher data
 */
export interface Teacher {
  id: string
  name: string
  email: string
  schoolId: string
  classIds: string[]
  role: 'teacher' | 'admin'
}

/**
 * Class data
 */
export interface Class {
  id: string
  name: string
  teacherId: string
  studentIds: string[]
  subject: 'math'
  grade: number
}

/**
 * Badge/Achievement data
 */
export interface Badge {
  id: string
  studentId: string
  type: 'streak' | 'mastery' | 'completion' | 'milestone'
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  earnedAt: Date | string
  icon: string
}

/**
 * KPI Card data for dashboard
 */
export interface KpiCard {
  id: string
  title: string
  titleVi: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: string
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
}

/**
 * Notification data
 */
export interface Notification {
  id: string
  title: string
  titleVi: string
  message: string
  messageVi: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date | string
  actionUrl?: string
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string
  labelVi?: string
  href?: string
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  language: 'vi' | 'en'
}

/**
 * Component variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'
export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline'
export type CardVariant = 'default' | 'elevated' | 'interactive' | 'bordered'
export type InputSize = 'sm' | 'md' | 'lg'

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}
