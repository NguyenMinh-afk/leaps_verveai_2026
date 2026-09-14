/**
 * VERVEAI — Classes + Students API surface (through Gateway → svc-class).
 */

import { api } from './apiClient';

export interface ClassSummary {
  id: string;
  name: string;
  subject: string | null;
  teacherId: string;
  studentCount?: number;
  averageMastery?: number | null;
}

export interface ClassDetail extends ClassSummary {
  createdAt: string;
  updatedAt: string;
}

export interface StudentSummary {
  id: string;
  name: string;
  email: string | null;
  externalId: string | null;
  enrolledAt?: string;
}

export interface StudentSkill {
  skillId: string;
  skillName: string;
  pKnown?: number;
  evidenceCount?: number;
}

export interface StudentDetail extends StudentSummary {
  classes: { id: string; className: string; subject: string | null }[];
  progressSummary: {
    totalSkills: number;
    averagePKnown: number;
    masteredSkills: number;
    totalAttempts: number;
    skills?: StudentSkill[];
  };
}

// ============================================
// Progress History Types (from svc-class)
// ============================================

export interface ProgressPoint {
  pKnown: number;
  attemptCount: number;
  timestamp: string;
}

export interface ProgressHistory {
  studentId: string;
  skillId: string;
  windowDays: number;
  current: ProgressPoint;
  previous: ProgressPoint | null;
  delta: number;
}export interface ListClassesParams {
  teacherId?: string;
}

export async function listClasses(params: ListClassesParams = {}): Promise<ClassSummary[]> {
  const search = new URLSearchParams();
  if (params.teacherId) search.set('teacherId', params.teacherId);
  const query = search.toString();
  const path = query ? `/api/class/classes?${query}` : '/api/class/classes';
  return api.get<ClassSummary[]>(path);
}

export async function getClass(id: string): Promise<ClassDetail> {
  return api.get<ClassDetail>(`/api/class/classes/${encodeURIComponent(id)}`);
}

export async function getClassStats(id: string): Promise<{
  studentCount: number;
  averageMastery: number | null;
}> {
  return api.get<{ studentCount: number; averageMastery: number | null }>(
    `/api/class/classes/${encodeURIComponent(id)}/stats`,
  );
}

export async function getStudent(id: string): Promise<StudentDetail> {
  return api.get<StudentDetail>(`/api/class/students/${encodeURIComponent(id)}`);
}

/**
 * Student entry from GET /api/class/classes/:classId/students
 */
export interface ClassStudentEntry {
  id: string;
  name: string;
  email: string | null;
  enrolledAt: string;
}

export async function listClassStudents(classId: string): Promise<StudentSummary[]> {
  const entries = await api.get<ClassStudentEntry[]>(
    `/api/class/classes/${encodeURIComponent(classId)}/students`,
  );
  // Map the backend entry to the StudentSummary shape the UI expects.
  return entries.map((entry) => ({
    id: entry.id,
    name: entry.name,
    email: entry.email,
    externalId: null,
    enrolledAt: entry.enrolledAt,
  }));
}

// ============================================
// Class CRUD API (from svc-class)
// ============================================

export interface CreateClassInput {
  name: string;
  subject?: string;
}

export interface UpdateClassInput {
  name?: string;
  subject?: string;
  teacherId?: string;
}

export async function createClass(input: CreateClassInput): Promise<ClassSummary> {
  return api.post<ClassSummary>('/api/class/classes', input);
}

export async function updateClass(
  id: string,
  input: UpdateClassInput
): Promise<ClassSummary> {
  return api.put<ClassSummary>(
    `/api/class/classes/${encodeURIComponent(id)}`,
    input,
  );
}

export async function deleteClass(id: string): Promise<void> {
  return api.delete<void>(`/api/class/classes/${encodeURIComponent(id)}`);
}

// ============================================
// Progress History API (from svc-class)
// ============================================

export interface ProgressHistoryParams {
  skillId: string;
  days?: number;
}

export async function getProgressHistory(
  studentId: string,
  params: ProgressHistoryParams
): Promise<ProgressHistory> {
  const { skillId, days = 30 } = params;
  const query = new URLSearchParams({
    skillId,
    days: String(days),
  });
  return api.get<ProgressHistory>(
    `/api/class/progress/${encodeURIComponent(studentId)}/history?${query}`
  );
}

export async function getStudentSkills(studentId: string): Promise<{
  skillId: string;
  pKnown: number;
  attemptCount: number;
  updatedAt: string;
  masteryStatus: 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';
}[]> {
  return api.get<{
    skillId: string;
    pKnown: number;
    attemptCount: number;
    updatedAt: string;
    masteryStatus: 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';
  }[]>(
    `/api/class/progress/${encodeURIComponent(studentId)}/skills`
  );
}
