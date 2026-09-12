// ============================================
// VERVE AI Design System - Admin Portal Types
// ============================================

/**
 * Admin user account
 */
export interface AdminUser {
  id: string
  name: string
  nameVi: string
  email: string
  role: 'admin' | 'teacher' | 'student' | 'reviewer'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  createdAt: Date | string
  lastActiveAt?: Date | string
  classId?: string
  className?: string
  avatar?: string
}

/**
 * Course/Subject
 */
export interface AdminCourse {
  id: string
  name: string
  nameVi: string
  code: string
  description: string
  descriptionVi: string
  subject?: string
  grade?: number
  status: 'active' | 'archived' | 'draft'
  teacherCount: number
  studentCount: number
  questionCount: number
  topicCount: number
  createdAt: Date | string
  updatedAt: Date | string
}

/**
 * Question for governance
 */
export interface AdminQuestion {
  id: string
  content: string
  contentVi: string
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'fill-blank'
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'draft' | 'pending-review' | 'approved' | 'published' | 'rejected'
  source: 'ai-generated' | 'teacher-created'
  topicId: string
  topicName: string
  topicNameVi: string
  courseId: string
  courseName: string
  courseNameVi: string
  creatorId: string
  creatorName: string
  reviewerId?: string
  reviewerName?: string
  reviewNote?: string
  createdAt: Date | string
  updatedAt: Date | string
}

/**
 * AI Generation Job
 */
export interface AIGenerationJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  sourceDocument?: string
  courseId: string
  courseName: string
  courseNameVi: string
  topicId: string
  topicName: string
  topicNameVi: string
  requestedCount: number
  generatedCount: number
  approvedCount: number
  rejectedCount: number
  errorMessage?: string
  requestedBy: string
  requestedByName: string
  createdAt: Date | string
  startedAt?: Date | string
  completedAt?: Date | string
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id: string
  action: string
  actionVi: string
  entityType: 'user' | 'question' | 'course' | 'class' | 'ai-generation' | 'settings' | 'system'
  entityId: string
  entityName: string
  entityNameVi: string
  actorId: string
  actorName: string
  actorRole: 'admin' | 'teacher' | 'student' | 'reviewer' | 'system'
  status: 'success' | 'failure' | 'pending'
  details?: string
  detailsVi?: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date | string
}

/**
 * Moderation item
 */
export interface ModerationItem {
  id: string
  type: 'question' | 'ai-generation' | 'content'
  content: string
  contentVi: string
  source: 'ai-generated' | 'teacher-created'
  creatorId: string
  creatorName: string
  creatorRole: 'teacher' | 'ai'
  topicName: string
  topicNameVi: string
  status: 'pending' | 'approved' | 'rejected' | 'changes-requested'
  reason?: string
  reasonVi?: string
  reviewedBy?: string
  reviewedByName?: string
  reviewedAt?: Date | string
  createdAt: Date | string
}

/**
 * System health status
 */
export interface SystemHealthStatus {
  service: string
  serviceVi: string
  status: 'healthy' | 'degraded' | 'offline' | 'unknown'
  uptime?: string
  lastCheck: Date | string
  message?: string
  messageVi?: string
}

/**
 * Admin dashboard stats
 */
export interface AdminDashboardStats {
  totalUsers: number
  activeUsers: number
  teachers: number
  students: number
  totalCourses: number
  totalQuestions: number
  draftQuestions: number
  pendingReview: number
  approvedQuestions: number
  publishedQuestions: number
  rejectedQuestions: number
  aiJobsTotal: number
  aiJobsProcessing: number
  aiJobsCompleted: number
  aiJobsFailed: number
  aiJobsPending: number
}

/**
 * Permission/Roles
 */
export interface Role {
  id: string
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  permissions: Permission[]
  userCount: number
}

export interface Permission {
  id: string
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  group: string
  groupVi: string
}

/**
 * Role permission mapping
 */
export interface RolePermission {
  roleId: string
  permissionId: string
  granted: boolean
}

/**
 * Settings group
 */
export interface SettingsGroup {
  id: string
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  settings: Setting[]
}

export interface Setting {
  id: string
  key: string
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect'
  value: unknown
  defaultValue: unknown
  options?: { label: string; labelVi: string; value: unknown }[]
  required?: boolean
  sensitive?: boolean
}
