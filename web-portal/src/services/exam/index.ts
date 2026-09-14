// ============================================
// VERVE AI - Exam Service Index
// ============================================

export { examService, default } from './exam.service'
export type { ExamSession, ExamQuestion } from './exam.service'

export { teacherExamService, default as teacherExamServiceDefault } from './teacher-exam.service'
export type { ExamListResult, ExamOperationResult } from './teacher-exam.service'
