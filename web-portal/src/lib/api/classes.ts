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

export interface StudentDetail extends StudentSummary {
  classes: { id: string; className: string; subject: string | null }[];
  progressSummary: {
    totalSkills: number;
    averagePKnown: number;
    masteredSkills: number;
    totalAttempts: number;
  };
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

export async function listClassStudents(classId: string): Promise<StudentSummary[]> {
  return api.get<StudentSummary[]>(
    `/api/class/classes/${encodeURIComponent(classId)}/students`,
  );
}
