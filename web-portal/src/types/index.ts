// Design System Types
export * from './design-system'
// Teacher Portal Types
export * from './teacher'
// Student Portal Types
export * from './student'
// Admin Portal Types
export * from './admin'

// Re-export commonly used types for convenience
export type {
  UserRole,
  MasteryLevel,
  SeverityLevel,
  ButtonVariant,
  ButtonSize,
  BadgeVariant,
  CardVariant,
  ToastType,
  Toast,
  NavItem,
  InterventionGroup,
  Student,
  Skill,
  KpiCard,
  BreadcrumbItem,
} from './design-system'
export type {
  TeacherClass,
  TeacherStudent,
  Question,
  Assignment,
  ActivityLogEntry,
  TeacherExam,
  CreateExamInput,
  UpdateExamInput,
} from './teacher'
export type {
  TeacherDashboardStats,
  MasteryDistribution,
  TopicMastery,
  QuestionOption,
  QuestionFilters,
  AssignmentFilters,
  TeacherExamStatus,
} from './teacher'
export type {
  StudentProfile,
  StudentTopicMastery,
  SubjectMastery,
  LearningRecommendation,
  EvidenceItem,
  StudentAssignment,
  StudentExam,
  ExamResult,
  StudentDashboardStats,
  LearningActivity,
} from './student'
export type {
  AdminUser,
  AdminCourse,
  AdminQuestion,
  AIGenerationJob,
  AuditLogEntry,
  ModerationItem,
  SystemHealthStatus,
  AdminDashboardStats,
  Role,
  Permission,
  RolePermission,
  SettingsGroup,
  Setting,
} from './admin'

// ===== Types from feature branch (temporary) =====
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'reviewer' | 'admin' | 'TEACHER' | 'ADMIN' | 'SUPERVISOR' | 'STUDENT' | 'PARENT';
}

export interface ClassSummary {
  id: string;
  name: string;
  subject: string | null;
  teacherId: string;
  studentCount?: number;
  averageMastery?: number | null;
}

export interface StudentSummary {
  id: string;
  name: string;
  email: string | null;
  externalId: string | null;
}

export type ContentType = 'QUESTION' | 'EXPLANATION' | 'EXAMPLE' | 'EXERCISE';
export type ContentStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  body: string;
  difficulty: number;
  status: ContentStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  classCount: number;
  studentCount: number;
  pendingInterventions: number;
  skillCount: number;
}