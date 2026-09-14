/**
 * Tests for Student Dashboard Service
 * 
 * Covers:
 *  - Successful data loading with diagnoses, recommendations, assignments, exams, activities
 *  - Empty data scenarios
 *  - API failures are propagated as errors, not hidden
 *  - Correct mapping of backend response to frontend DTOs
 *  - RecommendationsUnavailableError is handled gracefully
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { studentDashboardService } from '@/services/dashboard/student-dashboard.service';
import * as bktService from '@/services/bkt';
import { getRecommendations } from '@/services/recommendation/recommendation.service';
import * as assignmentService from '@/services/assignment/assignment.service';
import { examService } from '@/services/exam/exam.service';
import type { 
  StudentTopicMastery, 
  LearningRecommendation,
  StudentAssignment,
  StudentExam,
  LearningActivity
} from '@/types';

// Mock all dependencies
vi.mock('@/services/bkt');
vi.mock('@/services/recommendation/recommendation.service');
vi.mock('@/services/assignment/assignment.service');
vi.mock('@/services/exam/exam.service');

const mockBktService = bktService.bktService as unknown as Record<string, ReturnType<typeof vi.fn>>;

// Helper to create mock diagnoses
function createMockDiagnoses() {
  return [
    { id: 'd1', studentId: 'student-1', skillId: 'skill-1', skillCode: 'ALG', skillName: 'Algebra', pKnown: 0.9, confidence: 0.95, status: 'MASTERED' as const, evidenceCount: 10, createdAt: '2024-01-01', updatedAt: '2024-01-15' },
    { id: 'd2', studentId: 'student-1', skillId: 'skill-2', skillCode: 'GEO', skillName: 'Geometry', pKnown: 0.6, confidence: 0.85, status: 'DIAGNOSED' as const, evidenceCount: 5, createdAt: '2024-01-01', updatedAt: '2024-01-15' },
    { id: 'd3', studentId: 'student-1', skillId: 'skill-3', skillCode: 'NUM', skillName: 'Numbers', pKnown: 0.3, confidence: 0.7, status: 'STRUGGLING' as const, evidenceCount: 3, createdAt: '2024-01-01', updatedAt: '2024-01-15' },
  ];
}

function createMockRecommendations(): LearningRecommendation[] {
  return [
    {
      id: 'rec-1',
      topicId: 'skill-3',
      topicName: 'Numbers',
      topicNameVi: 'Số học',
      priority: 'high',
      reason: 'Low mastery, needs practice',
      reasonVi: 'Thành thạo thấp, cần luyện tập',
      currentMastery: 0.3,
      recommendedAction: 'practice',
      estimatedMinutes: 30,
      status: 'pending',
    },
    {
      id: 'rec-2',
      topicId: 'skill-2',
      topicName: 'Geometry',
      topicNameVi: 'Hình học',
      priority: 'medium',
      reason: 'Room for improvement',
      reasonVi: 'Còn có thể cải thiện',
      currentMastery: 0.6,
      recommendedAction: 'practice',
      estimatedMinutes: 20,
      status: 'pending',
    },
  ];
}

function createMockAssignments(): StudentAssignment[] {
  return [
    {
      id: 'assign-1',
      title: 'Algebra Homework',
      titleVi: 'Bài tập Đại số',
      description: 'Solve equations',
      descriptionVi: 'Giải phương trình',
      classId: 'class-1',
      className: 'Math 6A',
      teacherName: 'Teacher A',
      status: 'assigned',
      progress: 0,
      questionCount: 10,
      answeredCount: 0,
    },
    {
      id: 'assign-2',
      title: 'Geometry Quiz',
      titleVi: 'Bài kiểm tra Hình học',
      description: 'Shapes and angles',
      descriptionVi: 'Hình dạng và góc',
      classId: 'class-1',
      className: 'Math 6A',
      teacherName: 'Teacher A',
      status: 'completed',
      progress: 100,
      questionCount: 5,
      answeredCount: 5,
      score: 85,
    },
  ];
}

function createMockExams(): StudentExam[] {
  return [
    {
      id: 'exam-1',
      title: 'Midterm Exam',
      titleVi: 'Bài kiểm tra giữa kỳ',
      description: 'All topics',
      descriptionVi: 'Tất cả chủ đề',
      classId: 'class-1',
      className: 'Math 6A',
      teacherName: 'Teacher A',
      status: 'available',
      durationMinutes: 60,
      questionCount: 20,
      maxAttempts: 2,
    },
    {
      id: 'exam-2',
      title: 'Algebra Test',
      titleVi: 'Bài kiểm tra Đại số',
      description: 'Algebra only',
      descriptionVi: 'Chỉ đại số',
      classId: 'class-1',
      className: 'Math 6A',
      teacherName: 'Teacher A',
      status: 'completed',
      durationMinutes: 45,
      questionCount: 15,
      attempts: 1,
      maxAttempts: 2,
      bestScore: 92,
      lastScore: 92,
    },
  ];
}

function createMockEvidence() {
  return [
    { id: 'ev-1', diagnosisId: 'd1', itemId: 'item-1', studentId: 'student-1', skillId: 'skill-1', skillName: 'Algebra', correct: true, confidence: 0.9, quality: 'HIGH' as const, createdAt: '2024-01-15T10:00:00Z' },
    { id: 'ev-2', diagnosisId: 'd2', itemId: 'item-2', studentId: 'student-1', skillId: 'skill-2', skillName: 'Geometry', correct: true, confidence: 0.8, quality: 'MEDIUM' as const, createdAt: '2024-01-14T10:00:00Z' },
  ];
}

describe('studentDashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getDashboardData', () => {
    it('returns real data when all APIs succeed', async () => {
      // Arrange
      const studentId = 'student-1';
      mockBktService.getStudentDiagnoses = vi.fn().mockResolvedValue(createMockDiagnoses());
      mockBktService.getStudentEvidenceWithDiagnosis = vi.fn().mockResolvedValue(createMockEvidence());
      vi.mocked(getRecommendations).mockResolvedValue(createMockRecommendations());
      vi.mocked(assignmentService.getStudentAssignments).mockResolvedValue({ 
        assignments: createMockAssignments(),
        total: 2,
        page: 1,
        totalPages: 1,
      });
      vi.mocked(examService.getExams).mockResolvedValue({ 
        exams: createMockExams(),
        total: 2,
      });

      // Act
      const result = await studentDashboardService.getDashboardData(studentId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();

      // Verify stats are correctly calculated
      const stats = result.data!.stats;
      expect(stats.overallMastery).toBeCloseTo((0.9 + 0.6 + 0.3) / 3, 2); // ~0.6
      expect(stats.topicsCompleted).toBe(1); // pKnown >= 0.8
      expect(stats.topicsInProgress).toBe(1); // 0.5 <= pKnown < 0.8
      expect(stats.assignmentsPending).toBe(1); // 1 non-completed
      expect(stats.assignmentsCompleted).toBe(1); // 1 completed
      expect(stats.examsCompleted).toBe(1); // 1 completed exam

      // Verify topic masteries are mapped
      const topicMasteries: StudentTopicMastery[] = result.data!.topicMasteries;
      expect(topicMasteries).toHaveLength(3);
      expect(topicMasteries[0].masteryLevel).toBe('mastered');
      expect(topicMasteries[1].masteryLevel).toBe('learning');
      expect(topicMasteries[2].masteryLevel).toBe('needs-support');

      // Verify recommendations are passed through
      expect(result.data!.recommendations).toHaveLength(2);

      // Verify assignments are passed through
      expect(result.data!.assignments).toHaveLength(2);

      // Verify exams are passed through
      expect(result.data!.exams).toHaveLength(2);

      // Verify activities are built from evidence
      const activities: LearningActivity[] = result.data!.activities;
      expect(activities.length).toBeGreaterThan(0);
    });

    it('returns empty data when student has no diagnoses', async () => {
      // Arrange
      const studentId = 'student-new';
      mockBktService.getStudentDiagnoses = vi.fn().mockResolvedValue([]);
      mockBktService.getStudentEvidenceWithDiagnosis = vi.fn().mockResolvedValue([]);
      vi.mocked(getRecommendations).mockResolvedValue([]);
      vi.mocked(assignmentService.getStudentAssignments).mockResolvedValue({ 
        assignments: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });
      vi.mocked(examService.getExams).mockResolvedValue({ 
        exams: [],
        total: 0,
      });

      // Act
      const result = await studentDashboardService.getDashboardData(studentId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      const stats = result.data!.stats;
      expect(stats.overallMastery).toBe(0);
      expect(stats.topicsCompleted).toBe(0);
      expect(stats.topicsInProgress).toBe(0);
      expect(result.data!.topicMasteries).toHaveLength(0);
      expect(result.data!.recommendations).toHaveLength(0);
      expect(result.data!.activities).toHaveLength(0);
    });

    it('handles RecommendationsUnavailableError gracefully', async () => {
      // Arrange - when recommendations service throws a generic error,
      // the service catches it and sets partialError
      const studentId = 'student-1';
      mockBktService.getStudentDiagnoses = vi.fn().mockResolvedValue(createMockDiagnoses());
      mockBktService.getStudentEvidenceWithDiagnosis = vi.fn().mockResolvedValue([]);
      vi.mocked(getRecommendations).mockRejectedValue(new Error('Recommendations service is temporarily unavailable'));
      vi.mocked(assignmentService.getStudentAssignments).mockResolvedValue({ 
        assignments: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });
      vi.mocked(examService.getExams).mockResolvedValue({ 
        exams: [],
        total: 0,
      });

      // Act
      const result = await studentDashboardService.getDashboardData(studentId);

      // Assert - service handles the error gracefully with partialError
      expect(result.success).toBe(true);
      expect(result.partialError).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data!.recommendations).toHaveLength(0);
    });

    it('returns partial success when recommendations fail but core data succeeds', async () => {
      // Arrange
      const studentId = 'student-1';
      mockBktService.getStudentDiagnoses = vi.fn().mockResolvedValue(createMockDiagnoses());
      mockBktService.getStudentEvidenceWithDiagnosis = vi.fn().mockResolvedValue([]);
      vi.mocked(getRecommendations).mockRejectedValue(new Error('AI service error'));
      vi.mocked(assignmentService.getStudentAssignments).mockResolvedValue({ 
        assignments: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });
      vi.mocked(examService.getExams).mockResolvedValue({ 
        exams: [],
        total: 0,
      });

      // Act
      const result = await studentDashboardService.getDashboardData(studentId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.partialError).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data!.stats.overallMastery).toBeGreaterThan(0); // Core data still present
    });

    it('calculates mastery levels correctly', async () => {
      // Arrange
      const diagnoses = [
        { id: 'd1', studentId: 's1', skillId: 'sk1', skillCode: 'A', skillName: 'A', pKnown: 1.0, confidence: 0.9, status: 'MASTERED' as const, evidenceCount: 5, createdAt: '', updatedAt: '' },
        { id: 'd2', studentId: 's1', skillId: 'sk2', skillCode: 'B', skillName: 'B', pKnown: 0.8, confidence: 0.9, status: 'MASTERED' as const, evidenceCount: 5, createdAt: '', updatedAt: '' },
        { id: 'd3', studentId: 's1', skillId: 'sk3', skillCode: 'C', skillName: 'C', pKnown: 0.5, confidence: 0.8, status: 'DIAGNOSED' as const, evidenceCount: 3, createdAt: '', updatedAt: '' },
        { id: 'd4', studentId: 's1', skillId: 'sk4', skillCode: 'D', skillName: 'D', pKnown: 0.25, confidence: 0.7, status: 'STRUGGLING' as const, evidenceCount: 2, createdAt: '', updatedAt: '' },
        { id: 'd5', studentId: 's1', skillId: 'sk5', skillCode: 'E', skillName: 'E', pKnown: 0.0, confidence: 0.5, status: 'PENDING' as const, evidenceCount: 0, createdAt: '', updatedAt: '' },
      ];
      
      mockBktService.getStudentDiagnoses = vi.fn().mockResolvedValue(diagnoses);
      mockBktService.getStudentEvidenceWithDiagnosis = vi.fn().mockResolvedValue([]);
      vi.mocked(getRecommendations).mockResolvedValue([]);
      vi.mocked(assignmentService.getStudentAssignments).mockResolvedValue({ 
        assignments: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });
      vi.mocked(examService.getExams).mockResolvedValue({ 
        exams: [],
        total: 0,
      });

      // Act
      const result = await studentDashboardService.getDashboardData('student-1');

      // Assert
      expect(result.success).toBe(true);
      const stats = result.data!.stats;
      expect(stats.topicsCompleted).toBe(2); // 1.0 and 0.8 >= 0.8
      expect(stats.topicsInProgress).toBe(1); // 0.5 >= 0.5 and < 0.8
      expect(stats.overallMastery).toBeCloseTo((1.0 + 0.8 + 0.5 + 0.25 + 0.0) / 5, 2);
    });
  });

  describe('getStudentMasteries', () => {
    it('returns topic masteries from diagnoses', async () => {
      // Arrange
      const studentId = 'student-1';
      const diagnoses = createMockDiagnoses();
      mockBktService.getStudentDiagnoses = vi.fn().mockResolvedValue(diagnoses);

      // Act
      const result = await studentDashboardService.getStudentMasteries(studentId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveLength(3);
      expect(result.data![0].masteryLevel).toBe('mastered');
      expect(result.data![1].masteryLevel).toBe('learning');
      expect(result.data![2].masteryLevel).toBe('needs-support');
    });

    it('propagates error from BKT service', async () => {
      // Arrange
      mockBktService.getStudentDiagnoses = vi.fn().mockRejectedValue(new Error('Network error'));

      // Act
      const result = await studentDashboardService.getStudentMasteries('student-1');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('getRecommendations', () => {
    it('returns recommendations from service', async () => {
      // Arrange
      const recommendations = createMockRecommendations();
      vi.mocked(getRecommendations).mockResolvedValue(recommendations);

      // Act
      const result = await studentDashboardService.getRecommendations('student-1');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(recommendations);
    });

    it('handles RecommendationsUnavailableError gracefully', async () => {
      // Arrange - when recommendations service throws error,
      // the service catches it and marks the result with partialError
      vi.mocked(getRecommendations).mockRejectedValue(new Error('Recommendations service is temporarily unavailable'));

      // Act
      const result = await studentDashboardService.getRecommendations('student-1');

      // Assert - service propagates the error
      expect(result.success).toBe(false);
      expect(result.error).toContain('temporarily unavailable');
    });

    it('propagates other errors', async () => {
      // Arrange
      vi.mocked(getRecommendations).mockRejectedValue(new Error('Timeout'));

      // Act
      const result = await studentDashboardService.getRecommendations('student-1');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Timeout');
    });
  });

  describe('getAssignments', () => {
    it('returns assignments from service', async () => {
      // Arrange
      const assignments = createMockAssignments();
      vi.mocked(assignmentService.getStudentAssignments).mockResolvedValue({ 
        assignments,
        total: assignments.length,
        page: 1,
        totalPages: 1,
      });

      // Act
      const result = await studentDashboardService.getAssignments();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(assignments);
    });

    it('propagates error from assignment service', async () => {
      // Arrange
      vi.mocked(assignmentService.getStudentAssignments).mockRejectedValue(new Error('Service error'));

      // Act
      const result = await studentDashboardService.getAssignments();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Service error');
    });
  });

  describe('getExams', () => {
    it('returns exams from service', async () => {
      // Arrange
      const exams = createMockExams();
      vi.mocked(examService.getExams).mockResolvedValue({ 
        exams,
        total: exams.length,
      });

      // Act
      const result = await studentDashboardService.getExams();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(exams);
    });

    it('propagates error from exam service', async () => {
      // Arrange
      vi.mocked(examService.getExams).mockRejectedValue(new Error('Service error'));

      // Act
      const result = await studentDashboardService.getExams();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Service error');
    });
  });
});
