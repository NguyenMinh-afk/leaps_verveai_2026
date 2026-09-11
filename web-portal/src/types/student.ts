// ============================================
// VERVE AI Design System - Student Portal Types
// ============================================

/**
 * Student profile data
 */
export interface StudentProfile {
  id: string
  name: string
  nameVi: string
  email: string
  avatar?: string
  classId: string
  className: string
  grade: number
}

/**
 * Topic mastery for student view
 */
export interface StudentTopicMastery {
  topicId: string
  topicName: string
  topicNameVi: string
  subject: string
  subjectVi: string
  pKnown: number
  masteryLevel: 'mastered' | 'learning' | 'needs-support' | 'unknown'
  evidenceCount: number
  lastActivity: Date | string
  trend?: 'up' | 'down' | 'stable'
}

/**
 * Subject mastery
 */
export interface SubjectMastery {
  subjectId: string
  subjectName: string
  subjectNameVi: string
  overallMastery: number
  masteryLevel: 'mastered' | 'learning' | 'needs-support' | 'unknown'
  topicCount: number
  masteredTopics: number
  learningTopics: number
  needsSupportTopics: number
}

/**
 * Learning recommendation
 */
export interface LearningRecommendation {
  id: string
  topicId: string
  topicName: string
  topicNameVi: string
  priority: 'high' | 'medium' | 'low'
  reason: string
  reasonVi: string
  currentMastery: number
  recommendedAction: 'practice' | 'review' | 'assessment' | 'continue'
  estimatedMinutes?: number
  status: 'pending' | 'in-progress' | 'completed'
}

/**
 * Evidence item for learning chain
 */
export interface EvidenceItem {
  id: string
  type: 'assessment' | 'assignment' | 'practice' | 'topic-complete'
  title: string
  titleVi: string
  description: string
  descriptionVi: string
  topicId: string
  topicName: string
  topicNameVi: string
  score?: number
  maxScore?: number
  percentage?: number
  completedAt: Date | string
  impact: 'positive' | 'neutral' | 'negative'
}

/**
 * Student assignment
 */
export interface StudentAssignment {
  id: string
  title: string
  titleVi: string
  description: string
  descriptionVi: string
  topicId?: string
  topicName?: string
  topicNameVi?: string
  classId: string
  className: string
  teacherName: string
  status: 'assigned' | 'in-progress' | 'completed' | 'overdue'
  dueDate?: Date | string
  startedAt?: Date | string
  completedAt?: Date | string
  progress: number
  questionCount: number
  answeredCount: number
  score?: number
}

/**
 * Student exam/assessment
 */
export interface StudentExam {
  id: string
  title: string
  titleVi: string
  description: string
  descriptionVi: string
  topicId?: string
  topicName?: string
  topicNameVi?: string
  classId: string
  className: string
  teacherName: string
  status: 'available' | 'upcoming' | 'in-progress' | 'completed' | 'expired'
  availableFrom?: Date | string
  availableUntil?: Date | string
  durationMinutes?: number
  questionCount: number
  attempts?: number
  maxAttempts?: number
  bestScore?: number
  lastScore?: number
  completedAt?: Date | string
}

/**
 * Exam/Assessment result
 */
export interface ExamResult {
  id: string
  examId: string
  examTitle: string
  examTitleVi: string
  topicId?: string
  topicName?: string
  topicNameVi?: string
  classId: string
  className: string
  status: 'completed' | 'reviewed'
  score: number
  maxScore: number
  percentage: number
  timeSpentMinutes?: number
  completedAt: Date | string
  masteryImpact?: number
  strengths: string[]
  strengthsVi: string[]
  areasForImprovement: string[]
  areasForImprovementVi: string[]
}

/**
 * Student dashboard stats
 */
export interface StudentDashboardStats {
  overallMastery: number
  masteryLevel: 'mastered' | 'learning' | 'needs-support' | 'unknown'
  topicsCompleted: number
  topicsInProgress: number
  assignmentsPending: number
  assignmentsCompleted: number
  examsCompleted: number
  averageScore: number
}

/**
 * Learning activity entry
 */
export interface LearningActivity {
  id: string
  type: 'assignment' | 'exam' | 'practice' | 'topic'
  title: string
  titleVi: string
  description: string
  descriptionVi: string
  topicId?: string
  topicName?: string
  topicNameVi?: string
  timestamp: Date | string
  status: 'completed' | 'in-progress' | 'upcoming'
  score?: number
}
