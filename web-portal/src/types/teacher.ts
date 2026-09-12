// ============================================
// VERVE AI Design System - Teacher Portal Types
// ============================================

/**
 * Class data for teacher portal
 */
export interface TeacherClass {
  id: string
  name: string
  subject: string
  grade: number
  studentCount: number
  averageMastery: number
  lastActivity: Date | string
  status: 'active' | 'inactive' | 'archived'
}

/**
 * Student data for teacher view
 */
export interface TeacherStudent {
  id: string
  code: string
  name: string
  email?: string
  avatar?: string
  classId: string
  overallMastery: number
  masteryLevel: 'mastered' | 'learning' | 'needs-support' | 'unknown'
  lastActive: Date | string
  interventionCount: number
  assessmentCount: number
  topicMasteries: TopicMastery[]
}

/**
 * Topic mastery data
 */
export interface TopicMastery {
  topicId: string
  topicName: string
  topicNameVi: string
  pKnown: number
  masteryLevel: 'mastered' | 'learning' | 'needs-support' | 'unknown'
  evidenceCount: number
  lastActivity: Date | string
}

/**
 * Question data
 */
export interface Question {
  id: string
  content: string
  contentVi: string
  options: QuestionOption[]
  correctOptionIndex: number
  correctAnswer?: string
  explanation: string
  explanationVi: string
  topicId: string
  topicName: string
  topicNameVi: string
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  status: 'draft' | 'pending-review' | 'approved' | 'published' | 'rejected'
  createdBy: 'teacher' | 'ai'
  createdAt: Date | string
  updatedAt: Date | string
  reviewedBy?: string
  reviewedAt?: Date | string
  source?: string
  tags?: string[]
}

/**
 * Question option
 */
export interface QuestionOption {
  id: string
  content: string
  contentVi: string
}

/**
 * Assignment/Assessment data
 */
export interface Assignment {
  id: string
  title: string
  titleVi: string
  description: string
  descriptionVi: string
  classId: string
  className: string
  status: 'draft' | 'published' | 'archived'
  questionCount: number
  studentCount: number
  completionCount: number
  averageScore?: number
  createdAt: Date | string
  dueDate?: Date | string
  publishedAt?: Date | string
}

/**
 * Activity log entry
 */
export interface ActivityLogEntry {
  id: string
  type: 'assessment' | 'question' | 'assignment' | 'intervention' | 'mastery'
  title: string
  titleVi: string
  description: string
  descriptionVi: string
  studentId?: string
  studentName?: string
  classId?: string
  className?: string
  timestamp: Date | string
  metadata?: Record<string, unknown>
}

/**
 * Dashboard statistics
 */
export interface TeacherDashboardStats {
  totalStudents: number
  activeClasses: number
  averageMastery: number
  studentsNeedingIntervention: number
  pendingQuestions: number
  pendingAssignments: number
}

/**
 * Mastery distribution for visualization
 */
export interface MasteryDistribution {
  mastered: number
  learning: number
  needsSupport: number
  unknown: number
  total: number
}

/**
 * Question filter options
 */
export interface QuestionFilters {
  search?: string
  topic?: string
  difficulty?: 'easy' | 'medium' | 'hard' | 'all'
  type?: 'multiple-choice' | 'true-false' | 'short-answer' | 'all'
  status?: 'draft' | 'pending-review' | 'approved' | 'published' | 'rejected' | 'all'
  createdBy?: 'teacher' | 'ai' | 'all'
}

/**
 * Assignment filter options
 */
export interface AssignmentFilters {
  search?: string
  classId?: string
  status?: 'draft' | 'published' | 'archived' | 'all'
}
