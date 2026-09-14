// ============================================
// VERVE AI - Assignments Service
// ============================================

export {
  getAssignments,
  getStudentAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
  archiveAssignment,
  duplicateAssignment,
} from './assignment.service'
export { default as assignmentService } from './assignment.service'
export type {
  AssignmentFiltersInput,
  AssignmentListResponse,
  StudentAssignmentListResponse,
  AssignmentActionResponse,
} from './assignment.service'
export type {
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from './assignment.types'
