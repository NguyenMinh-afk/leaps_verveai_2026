/**
 * VERVEAI — Domain types shared by API + UI layers.
 */

export type UserRole = 'TEACHER' | 'ADMIN' | 'SUPERVISOR' | 'STUDENT' | 'PARENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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

export interface Skill {
  id: string;
  code: string;
  name: string;
  difficulty: number;
  description: string | null;
  prereqSkills: string[];
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
