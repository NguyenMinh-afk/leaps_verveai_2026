// ============================================
// VERVE AI - Services
// ============================================

// Re-export all services
export { authService } from './auth'
export { questionService } from './question'
export { assignmentService } from './assignment'
export { classService } from './class'
export { courseService } from './course'
export { aiGenerationService } from './aiGeneration'
export { teacherExamService } from './exam'

// Auth types
export type { LoginInput, RegisterInput, AuthSession, AuthUser } from './auth/auth.types'

// Question types
export type {
  CreateQuestionInput,
  UpdateQuestionInput,
  QuestionFiltersInput,
  QuestionListResponse,
  QuestionActionResponse,
  QuestionDifficulty,
  QuestionType,
  QuestionStatus,
} from './question/question.types'

// Assignment types
export type {
  CreateAssignmentInput,
  UpdateAssignmentInput,
  AssignmentFiltersInput,
  AssignmentListResponse,
  AssignmentActionResponse,
} from './assignment/assignment.types'

// Course types
export type {
  CourseFiltersInput,
  CreateCourseInput,
  UpdateCourseInput,
  CourseActionResponse,
} from './course/course.types'

// AI Generation types
export type {
  AIGenerationJob,
  AIGenerationStatus,
  CreateAIGenerationInput,
  AIGenerationActionResponse,
  GeneratedQuestion,
  QuestionDifficulty as AIGenerationDifficulty,
  QuestionType as AIGenerationQuestionType,
} from './aiGeneration/aiGeneration.types'

// Exam types
export type { ExamListResult, ExamOperationResult } from './exam'
