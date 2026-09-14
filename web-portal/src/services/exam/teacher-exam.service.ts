// ============================================
// VERVE AI - Teacher Exams Service
// Handles teacher-specific exam operations with real backend API
// ============================================

import {
  listExams as apiListExams,
  getExam as apiGetExam,
  createExam as apiCreateExam,
  updateExam as apiUpdateExam,
  deleteExam as apiDeleteExam,
  type ExamRecord,
  type ExamDetail,
  type ExamStatus,
} from '@/lib/api/exam';
import type { TeacherExam, CreateExamInput, UpdateExamInput, TeacherExamStatus } from '@/types';
import { ApiError } from '@/lib/api/apiClient';

// ============================================
// Mappers
// ============================================

/**
 * Convert backend ExamRecord to TeacherExam
 */
function toTeacherExam(record: ExamRecord, questionCount: number = 0): TeacherExam {
  return {
    id: record.id,
    title: record.title,
    titleVi: record.title,
    description: record.description || '',
    descriptionVi: record.description || '',
    classId: record.classId,
    className: 'Class', // Will be populated if class info is needed
    status: record.status as TeacherExamStatus,
    timeLimitMinutes: record.timeLimitMinutes,
    passingScore: record.passingScore,
    maxScore: record.maxScore,
    maxAttempts: record.maxAttempts,
    shuffleQuestions: record.shuffleQuestions,
    showResultsImmediately: record.showResultsImmediately,
    questionCount,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Convert backend ExamDetail to TeacherExam
 */
function toTeacherExamFromDetail(detail: ExamDetail): TeacherExam {
  return {
    id: detail.id,
    title: detail.title,
    titleVi: detail.title,
    description: detail.description || '',
    descriptionVi: detail.description || '',
    classId: detail.classId,
    className: 'Class',
    status: detail.status as TeacherExamStatus,
    timeLimitMinutes: detail.timeLimitMinutes,
    passingScore: detail.passingScore,
    maxScore: detail.maxScore,
    maxAttempts: detail.maxAttempts,
    shuffleQuestions: detail.shuffleQuestions,
    showResultsImmediately: detail.showResultsImmediately,
    questionCount: detail.questions.length,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
  };
}

/**
 * Convert CreateExamInput to API format
 */
function toCreateExamInput(input: CreateExamInput) {
  return {
    classId: input.classId,
    title: input.title,
    description: input.description,
    timeLimitMinutes: input.timeLimitMinutes,
    passingScore: input.passingScore ?? 60,
    maxScore: input.maxScore ?? 100,
    maxAttempts: input.maxAttempts ?? 1,
    shuffleQuestions: input.shuffleQuestions ?? false,
    showResultsImmediately: input.showResultsImmediately ?? true,
  };
}

/**
 * Convert UpdateExamInput to API format
 */
function toUpdateExamInput(input: UpdateExamInput) {
  const result: Partial<ExamRecord> = {};
  
  if (input.title !== undefined) result.title = input.title;
  if (input.description !== undefined) result.description = input.description;
  if (input.status !== undefined) result.status = input.status;
  if (input.timeLimitMinutes !== undefined) result.timeLimitMinutes = input.timeLimitMinutes;
  if (input.passingScore !== undefined) result.passingScore = input.passingScore;
  if (input.maxAttempts !== undefined) result.maxAttempts = input.maxAttempts;
  if (input.shuffleQuestions !== undefined) result.shuffleQuestions = input.shuffleQuestions;
  if (input.showResultsImmediately !== undefined) result.showResultsImmediately = input.showResultsImmediately;
  
  return result;
}

// ============================================
// Service Interface
// ============================================

export interface ExamListResult {
  exams: TeacherExam[];
  total: number;
  skip: number;
  take: number;
}

export interface ExamOperationResult {
  success: boolean;
  exam?: TeacherExam;
  error?: string;
}

// ============================================
// Service Functions
// ============================================

export const teacherExamService = {
  /**
   * List exams for the teacher
   */
  async getExams(params?: {
    skip?: number;
    take?: number;
    classId?: string;
    status?: TeacherExamStatus;
  }): Promise<ExamListResult> {
    try {
      const statusMap: Record<TeacherExamStatus, ExamStatus> = {
        DRAFT: 'DRAFT',
        PUBLISHED: 'PUBLISHED',
        ARCHIVED: 'ARCHIVED',
      };

      const result = await apiListExams({
        skip: params?.skip,
        take: params?.take,
        classId: params?.classId,
        status: params?.status ? statusMap[params.status] : undefined,
      });

      return {
        exams: result.items.map((item) => toTeacherExam(item)),
        total: result.total,
        skip: result.skip,
        take: result.take,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  /**
   * Get a single exam by ID
   */
  async getExamById(id: string): Promise<TeacherExam> {
    try {
      const detail = await apiGetExam(id);
      return toTeacherExamFromDetail(detail);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          throw new Error('Exam not found');
        }
        throw new Error(error.message);
      }
      throw error;
    }
  },

  /**
   * Create a new exam
   */
  async createExam(input: CreateExamInput): Promise<ExamOperationResult> {
    try {
      const apiInput = toCreateExamInput(input);
      const detail = await apiCreateExam(apiInput);
      return {
        success: true,
        exam: toTeacherExamFromDetail(detail),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create exam',
      };
    }
  },

  /**
   * Update an existing exam
   */
  async updateExam(id: string, input: UpdateExamInput): Promise<ExamOperationResult> {
    try {
      const apiInput = toUpdateExamInput(input);
      const detail = await apiUpdateExam(id, apiInput);
      return {
        success: true,
        exam: toTeacherExamFromDetail(detail),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          return {
            success: false,
            error: 'Exam not found',
          };
        }
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update exam',
      };
    }
  },

  /**
   * Delete an exam
   */
  async deleteExam(id: string): Promise<ExamOperationResult> {
    try {
      await apiDeleteExam(id);
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          return {
            success: false,
            error: 'Exam not found',
          };
        }
        if (error.status === 403) {
          return {
            success: false,
            error: 'You do not have permission to delete this exam',
          };
        }
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete exam',
      };
    }
  },

  /**
   * Publish an exam (change status from DRAFT to PUBLISHED)
   */
  async publishExam(id: string): Promise<ExamOperationResult> {
    return this.updateExam(id, { status: 'PUBLISHED' });
  },

  /**
   * Archive an exam (change status to ARCHIVED)
   */
  async archiveExam(id: string): Promise<ExamOperationResult> {
    return this.updateExam(id, { status: 'ARCHIVED' });
  },

  /**
   * Restore an archived exam (change status to DRAFT)
   */
  async restoreExam(id: string): Promise<ExamOperationResult> {
    return this.updateExam(id, { status: 'DRAFT' });
  },
};

export default teacherExamService;
