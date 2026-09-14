// ============================================
// VERVE AI - Admin Service
// ============================================
// Real admin API integration using existing domain services
// ============================================

import { api } from '@/lib/api/apiClient';
import type {
  AdminUser,
  AdminCourse,
  AdminQuestion,
  AIGenerationJob,
} from '@/types';

// Backend API response types
interface BackendUserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface BackendClassResponse {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendQuestionResponse {
  id: string;
  title?: string;
  body?: string;
  difficulty?: number;
  difficultyLabel?: string;
  type?: string;
  status?: string;
  authorId?: string;
  author_name?: string;
  topic?: string;
  topic_id?: string;
  createdAt: string;
  updatedAt: string;
  reviews?: Array<{
    id: string;
    reviewerId: string;
    status: string;
    comment?: string;
    createdAt: string;
  }>;
}

interface BackendExamResponse {
  id: string;
  classId?: string;
  class_id?: string;
  teacherId?: string;
  teacher_id?: string;
  title: string;
  description?: string;
  status?: string;
  timeLimitMinutes?: number;
  time_limit?: number;
  passingScore?: number;
  passing_score?: number;
  maxScore?: number;
  max_score?: number;
  createdAt: string;
}

export interface AdminExam {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  description?: string;
  status: string;
  timeLimitMinutes?: number;
  passingScore: number;
  maxScore: number;
  createdAt: Date;
}

export interface AdminAttempt {
  id: string;
  examId: string;
  studentId: string;
  status: string;
  score?: number;
  percentage?: number;
  startedAt: Date;
  submittedAt?: Date;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
}

export interface ClassStats {
  total: number;
  active: number;
  archived: number;
  totalStudents: number;
  totalTeachers: number;
}

export interface QuestionStats {
  total: number;
  draft: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  byDifficulty: Record<string, number>;
  topicCount: number;
  published: number;
}

export interface ExamStats {
  total: number;
  draft: number;
  published: number;
  archived: number;
  totalAttempts: number;
  completedAttempts: number;
}

export interface DiagnosisStats {
  totalDiagnoses: number;
  mastered: number;
  diagnosed: number;
  struggling: number;
  pending: number;
  averagePKnown: number;
}

export interface InterventionStats {
  total: number;
  active: number;
  resolved: number;
}

export interface DashboardStats {
  userStats: UserStats;
  classStats: ClassStats;
  questionStats: QuestionStats;
  examStats: ExamStats;
}

export interface ReportStats {
  userStats: UserStats;
  classStats: ClassStats;
  questionStats: QuestionStats;
  examStats: ExamStats;
  diagnosisStats: DiagnosisStats;
  interventionStats: InterventionStats;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  take: number;
}

// Admin Service
export const adminService = {
  // ─── Dashboard Stats ─────────────────────────────
  
  /**
   * Get dashboard statistics by aggregating from multiple services
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const [userStats, classStats, questionStats, examStats] = await Promise.all([
      adminService.getUserStats(),
      adminService.getClassStats(),
      adminService.getQuestionStats(),
      adminService.getExamStats(),
    ]);
    
    return { userStats, classStats, questionStats, examStats };
  },

  // ─── Admin Reports ──────────────────────────────
  
  /**
   * Get aggregated report statistics from all services (ADMIN only)
   * Fetches user, class, question, exam, diagnosis, and intervention stats
   * in a single API call to the gateway reports endpoint
   */
  async getReportStats(): Promise<ReportStats> {
    return api.get<ReportStats>('/api/reports');
  },

  // ─── User Management ─────────────────────────────
  
  /**
   * List users with filters (ADMIN only)
   */
  async listUsers(filters: {
    skip?: number;
    take?: number;
    role?: string;
    is_active?: boolean;
    search?: string;
  } = {}): Promise<PaginatedResponse<AdminUser>> {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set('skip', String(filters.skip));
    if (filters.take !== undefined) params.set('take', String(filters.take));
    if (filters.role) params.set('role', filters.role);
    if (filters.is_active !== undefined) params.set('is_active', String(filters.is_active));
    if (filters.search) params.set('search', filters.search);
    
    const query = params.toString();
    return api.get<PaginatedResponse<AdminUser>>(`/api/auth/users/admin/list${query ? `?${query}` : ''}`);
  },

  /**
   * Get single user by ID
   */
  async getUserById(id: string): Promise<AdminUser> {
    return api.get<AdminUser>(`/api/auth/users/${id}`);
  },

  /**
   * Update user role/status (ADMIN only)
   */
  async updateUser(id: string, data: { role?: string; is_active?: boolean }): Promise<AdminUser> {
    return api.patch<AdminUser>(`/api/auth/users/${id}`, data);
  },

  /**
   * Delete user (ADMIN only)
   */
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/api/auth/users/${id}`);
  },

  /**
   * Get user statistics (ADMIN only)
   */
  async getUserStats(): Promise<UserStats> {
    return api.get<UserStats>('/api/auth/users/admin/stats');
  },

  // ─── Class/Course Management ──────────────────────
  
  /**
   * List classes (ADMIN sees all, teachers see only their own)
   */
  async listClasses(filters: {
    skip?: number;
    take?: number;
    teacherId?: string;
  } = {}): Promise<PaginatedResponse<AdminCourse>> {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set('skip', String(filters.skip));
    if (filters.take !== undefined) params.set('take', String(filters.take));
    if (filters.teacherId) params.set('teacherId', filters.teacherId);
    
    const query = params.toString();
    return api.get<PaginatedResponse<AdminCourse>>(`/api/class/classes${query ? `?${query}` : ''}`);
  },

  /**
   * Get class stats (ADMIN only)
   */
  async getClassStats(): Promise<ClassStats> {
    return api.get<ClassStats>('/api/class/classes/admin/stats');
  },

  /**
   * Get class by ID
   */
  async getClassById(id: string): Promise<AdminCourse> {
    return api.get<AdminCourse>(`/api/class/classes/${id}`);
  },

  // ─── Question Management ─────────────────────────
  
  /**
   * List questions with filters
   */
  async listQuestions(filters: {
    skip?: number;
    take?: number;
    status?: string;
    difficulty?: string;
    topic?: string;
    search?: string;
    authorId?: string;
  } = {}): Promise<PaginatedResponse<AdminQuestion>> {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set('skip', String(filters.skip));
    if (filters.take !== undefined) params.set('take', String(filters.take));
    if (filters.status) params.set('status', filters.status);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    if (filters.topic) params.set('topic', filters.topic);
    if (filters.search) params.set('search', filters.search);
    if (filters.authorId) params.set('authorId', filters.authorId);
    
    const query = params.toString();
    return api.get<PaginatedResponse<AdminQuestion>>(`/api/content/questions${query ? `?${query}` : ''}`);
  },

  /**
   * Get question stats (ADMIN only)
   */
  async getQuestionStats(): Promise<QuestionStats> {
    return api.get<QuestionStats>('/api/content/questions/admin/stats');
  },

  /**
   * Get question by ID
   */
  async getQuestionById(id: string): Promise<AdminQuestion> {
    return api.get<AdminQuestion>(`/api/content/questions/${id}`);
  },

  /**
   * Approve question (ADMIN/REVIEWER only)
   */
  async approveQuestion(id: string, comment?: string): Promise<AdminQuestion> {
    return api.post<AdminQuestion>(`/api/content/questions/${id}/approve`, { comment });
  },

  /**
   * Reject question (ADMIN/REVIEWER only)
   */
  async rejectQuestion(id: string, reason: string): Promise<AdminQuestion> {
    return api.post<AdminQuestion>(`/api/content/questions/${id}/reject`, { comment: reason });
  },

  // ─── Moderation ──────────────────────────────────
  
  /**
   * List pending moderation items
   */
  async listPendingModeration(filters: {
    skip?: number;
    take?: number;
  } = {}): Promise<PaginatedResponse<AdminQuestion>> {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set('skip', String(filters.skip));
    if (filters.take !== undefined) params.set('take', String(filters.take));
    params.set('status', 'PENDING_REVIEW');
    
    const query = params.toString();
    return api.get<PaginatedResponse<AdminQuestion>>(`/api/content/questions?${query}`);
  },

  // ─── Exam Management ──────────────────────────────
  
  /**
   * List exams with filters
   */
  async listExams(filters: {
    skip?: number;
    take?: number;
    status?: string;
    teacherId?: string;
    classId?: string;
  } = {}): Promise<PaginatedResponse<AdminExam>> {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set('skip', String(filters.skip));
    if (filters.take !== undefined) params.set('take', String(filters.take));
    if (filters.status) params.set('status', filters.status);
    if (filters.teacherId) params.set('teacherId', filters.teacherId);
    if (filters.classId) params.set('classId', filters.classId);
    
    const query = params.toString();
    return api.get<PaginatedResponse<AdminExam>>(`/api/exam${query ? `?${query}` : ''}`);
  },

  /**
   * Get exam stats (ADMIN only)
   */
  async getExamStats(): Promise<ExamStats> {
    return api.get<ExamStats>('/api/exam/admin/stats');
  },

  /**
   * Get exam by ID
   */
  async getExamById(id: string): Promise<AdminExam> {
    return api.get<AdminExam>(`/api/exam/${id}`);
  },

  /**
   * Get exam results
   */
  async getExamResults(examId: string): Promise<Array<{
    attemptId: string;
    studentId: string;
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    status: string;
    submittedAt?: Date;
  }>> {
    return api.get(`/api/exam/${examId}/results`);
  },

  // ─── Review Queue ────────────────────────────────
  
  /**
   * List pending reviews
   */
  async listPendingReviews(filters: {
    skip?: number;
    take?: number;
  } = {}): Promise<PaginatedResponse<{
    id: string;
    contentId: string;
    status: string;
    reviewerId?: string;
    comment?: string;
    createdAt: Date;
  }>> {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set('skip', String(filters.skip));
    if (filters.take !== undefined) params.set('take', String(filters.take));
    
    const query = params.toString();
    return api.get(`/api/content/review${query ? `?${query}` : ''}`);
  },
};

export default adminService;
