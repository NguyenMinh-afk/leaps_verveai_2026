/**
 * VERVEAI — Assignment API surface (through Gateway → svc-assignment).
 *
 * Backend endpoints:
 * - GET    /api/assignment          - List assignments with optional filters
 * - POST   /api/assignment          - Create assignment (teacher only)
 * - GET    /api/assignment/:id     - Get single assignment
 * - PUT    /api/assignment/:id     - Update assignment
 * - DELETE /api/assignment/:id     - Delete assignment
 * - GET    /api/assignment/student - List student assignments
 */

import { api } from './apiClient';

// ============================================
// Types
// ============================================

export type AssignmentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface AssignmentRecord {
  id: string;
  title: string;
  description: string | null;
  teacherId: string;
  classId: string;
  status: AssignmentStatus;
  dueAt: string | null;
  startsAt: string | null;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentListPage {
  items: AssignmentRecord[];
  total: number;
  skip: number;
  take: number;
}

export interface ListAssignmentsParams {
  skip?: number;
  take?: number;
  teacherId?: string;
  classId?: string;
  status?: AssignmentStatus;
}

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  classId: string;
  startsAt?: string;
  dueAt?: string;
  maxAttempts?: number;
}

export interface UpdateAssignmentInput {
  title?: string;
  description?: string | null;
  classId?: string;
  status?: AssignmentStatus;
  startsAt?: string | null;
  dueAt?: string | null;
  maxAttempts?: number;
}

// ============================================
// API Functions
// ============================================

/**
 * List assignments (teacher/admin view)
 */
export async function listAssignments(params: ListAssignmentsParams = {}): Promise<AssignmentListPage> {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params.take !== undefined) searchParams.set('take', String(params.take));
  if (params.teacherId) searchParams.set('teacherId', params.teacherId);
  if (params.classId) searchParams.set('classId', params.classId);
  if (params.status) searchParams.set('status', params.status);
  
  const query = searchParams.toString();
  const path = query ? `/api/assignment?${query}` : '/api/assignment';
  return api.get<AssignmentListPage>(path);
}

/**
 * Create a new assignment (teacher only)
 */
export async function createAssignment(input: CreateAssignmentInput): Promise<AssignmentRecord> {
  return api.post<AssignmentRecord>('/api/assignment', input);
}

/**
 * Get a single assignment by ID
 */
export async function getAssignment(id: string): Promise<AssignmentRecord> {
  return api.get<AssignmentRecord>(`/api/assignment/${encodeURIComponent(id)}`);
}

/**
 * Update an existing assignment
 */
export async function updateAssignment(id: string, input: UpdateAssignmentInput): Promise<AssignmentRecord> {
  return api.put<AssignmentRecord>(`/api/assignment/${encodeURIComponent(id)}`, input);
}

/**
 * Delete an assignment (soft delete)
 */
export async function deleteAssignment(id: string): Promise<void> {
  return api.delete(`/api/assignment/${encodeURIComponent(id)}`);
}

/**
 * List assignments for the current student
 * Only returns PUBLISHED assignments for enrolled classes
 */
export async function listStudentAssignments(params: { skip?: number; take?: number } = {}): Promise<AssignmentListPage> {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params.take !== undefined) searchParams.set('take', String(params.take));
  
  const query = searchParams.toString();
  const path = query ? `/api/assignment/student?${query}` : '/api/assignment/student';
  return api.get<AssignmentListPage>(path);
}
