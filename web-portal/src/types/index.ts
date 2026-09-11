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
} from './teacher'

export type {
  TeacherDashboardStats,
  MasteryDistribution,
  TopicMastery,
  QuestionOption,
  QuestionFilters,
  AssignmentFilters,
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
