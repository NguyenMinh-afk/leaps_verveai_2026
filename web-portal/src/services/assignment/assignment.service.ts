// ============================================
// VERVE AI - Assignment Service
// Integrated with real backend API
// ============================================

import {
  listAssignments as apiListAssignments,
  listStudentAssignments as apiListStudentAssignments,
  getAssignment as apiGetAssignment,
  createAssignment as apiCreateAssignment,
  updateAssignment as apiUpdateAssignment,
  deleteAssignment as apiDeleteAssignment,
  type AssignmentRecord,
  type CreateAssignmentInput,
  type UpdateAssignmentInput,
  type AssignmentStatus,
} from '@/lib/api/assignment';
import type { StudentAssignment } from '@/types/student';
import type { Assignment } from '@/types/teacher';

/**
 * Mappers between backend AssignmentRecord and frontend Assignment/StudentAssignment types
 */

// Convert backend AssignmentRecord to frontend Assignment (teacher view)
function toTeacherAssignment(record: AssignmentRecord, className?: string): Assignment {
  const now = new Date();
  const dueDate = record.dueAt ? new Date(record.dueAt) : null;
  
  return {
    id: record.id,
    title: record.title,
    titleVi: record.title,
    description: record.description || '',
    descriptionVi: record.description || '',
    classId: record.classId,
    className: className || 'Class',
    status: record.status as 'draft' | 'published' | 'archived',
    questionCount: 0,
    studentCount: 0,
    completionCount: 0,
    createdAt: new Date(record.createdAt),
    dueDate: dueDate || undefined,
  };
}

// Convert backend AssignmentRecord to frontend StudentAssignment
function toStudentAssignment(record: AssignmentRecord): StudentAssignment {
  const now = new Date();
  const dueDate = record.dueAt ? new Date(record.dueAt) : null;
  const isOverdue = dueDate && dueDate < now && record.status === 'PUBLISHED';
  
  return {
    id: record.id,
    title: record.title,
    titleVi: record.title,
    description: record.description || '',
    descriptionVi: record.description || '',
    classId: record.classId,
    className: 'Class',
    teacherName: 'Teacher',
    status: isOverdue ? 'overdue' : (record.status === 'PUBLISHED' ? 'assigned' : 'in-progress'),
    questionCount: 0,
    progress: 0,
    answeredCount: 0,
    dueDate: dueDate || undefined,
  };
}

// ============================================
// Service Functions
// ============================================

export interface AssignmentFiltersInput {
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  classId?: string;
  page?: number;
  limit?: number;
}

export interface AssignmentListResponse {
  assignments: Assignment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface StudentAssignmentListResponse {
  assignments: StudentAssignment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AssignmentActionResponse {
  success: boolean;
  assignment?: Assignment;
  error?: string;
}

/**
 * Get all assignments with optional filters (teacher view)
 */
export async function getAssignments(filters?: AssignmentFiltersInput): Promise<AssignmentListResponse> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  // Convert frontend status filter to backend status
  let backendStatus: AssignmentStatus | undefined;
  if (filters?.status && ['draft', 'published', 'archived'].includes(filters.status)) {
    backendStatus = filters.status.toUpperCase() as AssignmentStatus;
  }

  const result = await apiListAssignments({
    skip,
    take: limit,
    classId: filters?.classId,
    status: backendStatus,
  });

  // Filter by search if provided
  let assignments = result.items.map((item) => toTeacherAssignment(item));

  if (filters?.search) {
    const query = filters.search.toLowerCase();
    assignments = assignments.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.titleVi?.toLowerCase().includes(query) ||
        a.className?.toLowerCase().includes(query)
    );
  }

  return {
    assignments,
    total: result.total,
    page,
    totalPages: Math.ceil(result.total / limit),
  };
}

/**
 * Get assignments for the current student
 */
export async function getStudentAssignments(filters?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<StudentAssignmentListResponse> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const result = await apiListStudentAssignments({ skip, take: limit });

  // Map to frontend type (student assignments are always published/assigned status)
  let assignments = result.items.map((item): StudentAssignment => {
    const now = new Date();
    const dueDate = item.dueAt ? new Date(item.dueAt) : null;
    const isOverdue = dueDate && dueDate < now;

    return {
      id: item.id,
      title: item.title,
      titleVi: item.title,
      description: item.description || '',
      descriptionVi: item.description || '',
      classId: item.classId,
      className: 'Class',
      teacherName: 'Teacher',
      status: isOverdue ? 'overdue' : 'assigned',
      questionCount: 0,
      progress: 0,
      answeredCount: 0,
      dueDate: dueDate || undefined,
    };
  });

  // Filter by search if provided
  if (filters?.search) {
    const query = filters.search.toLowerCase();
    assignments = assignments.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.titleVi?.toLowerCase().includes(query) ||
        a.className.toLowerCase().includes(query)
    );
  }

  return {
    assignments,
    total: result.total,
    page,
    totalPages: Math.ceil(result.total / limit),
  };
}

/**
 * Get assignment by ID
 */
export async function getAssignmentById(id: string): Promise<Assignment | null> {
  try {
    const record = await apiGetAssignment(id);
    return toTeacherAssignment(record);
  } catch {
    return null;
  }
}

/**
 * Create new assignment (teacher only)
 */
export async function createAssignment(input: {
  title: string;
  titleVi?: string;
  description: string;
  descriptionVi?: string;
  classId: string;
  className: string;
  questionIds: string[];
  dueDate?: Date;
  status?: 'draft' | 'published';
}): Promise<AssignmentActionResponse> {
  try {
    const backendInput: CreateAssignmentInput = {
      title: input.title,
      description: input.description,
      classId: input.classId,
      startsAt: undefined,
      dueAt: input.dueDate?.toISOString(),
      maxAttempts: 1,
    };

    const record = await apiCreateAssignment(backendInput);
    const assignment = toTeacherAssignment(record, input.className);

    return { success: true, assignment };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create assignment';
    return { success: false, error: message };
  }
}

/**
 * Update assignment
 */
export async function updateAssignment(input: {
  id: string;
  title?: string;
  titleVi?: string;
  description?: string;
  descriptionVi?: string;
  classId?: string;
  className?: string;
  questionIds?: string[];
  dueDate?: Date;
  status?: 'draft' | 'published' | 'archived';
}): Promise<AssignmentActionResponse> {
  try {
    const backendInput: UpdateAssignmentInput = {};
    if (input.title !== undefined) backendInput.title = input.title;
    if (input.description !== undefined) backendInput.description = input.description;
    if (input.classId !== undefined) backendInput.classId = input.classId;
    if (input.dueDate !== undefined) backendInput.dueAt = input.dueDate.toISOString();
    if (input.status !== undefined) {
      backendInput.status = input.status.toUpperCase() as AssignmentStatus;
    }

    const record = await apiUpdateAssignment(input.id, backendInput);
    const assignment = toTeacherAssignment(record, input.className);

    return { success: true, assignment };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update assignment';
    return { success: false, error: message };
  }
}

/**
 * Delete assignment
 */
export async function deleteAssignment(id: string): Promise<AssignmentActionResponse> {
  try {
    await apiDeleteAssignment(id);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete assignment';
    return { success: false, error: message };
  }
}

/**
 * Publish assignment
 */
export async function publishAssignment(id: string): Promise<AssignmentActionResponse> {
  return updateAssignment({ id, status: 'published' });
}

/**
 * Duplicate assignment (not supported by backend)
 */
export async function duplicateAssignment(id: string): Promise<AssignmentActionResponse> {
  return { success: false, error: 'Duplicate functionality is not yet available in the backend' };
}

/**
 * Archive assignment
 */
export async function archiveAssignment(id: string): Promise<AssignmentActionResponse> {
  return updateAssignment({ id, status: 'archived' });
}

export default {
  getAssignments,
  getStudentAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
  archiveAssignment,
  duplicateAssignment,
};
