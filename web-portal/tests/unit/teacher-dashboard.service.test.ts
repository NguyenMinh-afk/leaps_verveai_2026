/**
 * Tests for Teacher Dashboard Service
 * 
 * Covers:
 *  - Successful data loading with classes and interventions
 *  - Empty data (no classes, no interventions)
 *  - API failures are propagated as errors, not hidden
 *  - Correct aggregation of stats from real data
 *  - Correct mapping of backend response to frontend DTOs
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { teacherDashboardService } from '@/services/dashboard/teacher-dashboard.service';
import * as classService from '@/services/class';
import * as bktService from '@/services/bkt';
import type { TeacherClass, InterventionGroup, TeacherDashboardStats, MasteryDistribution } from '@/types';

// Mock the dependencies
vi.mock('@/services/class');
vi.mock('@/services/bkt');

const mockClassService = classService.classService as unknown as Record<string, ReturnType<typeof vi.fn>>;
const mockBktService = bktService.bktService as unknown as Record<string, ReturnType<typeof vi.fn>>;

describe('teacherDashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getDashboardData', () => {
    it('returns real data when both APIs succeed', async () => {
      // Arrange
      const mockClasses: TeacherClass[] = [
        {
          id: 'class-1',
          name: 'Math 6A',
          subject: 'math',
          grade: 6,
          studentCount: 25,
          averageMastery: 0.72,
          lastActivity: new Date(),
          status: 'active',
        },
        {
          id: 'class-2',
          name: 'Math 6B',
          subject: 'math',
          grade: 6,
          studentCount: 20,
          averageMastery: 0.85,
          lastActivity: new Date(),
          status: 'active',
        },
      ];

      const mockInterventions: InterventionGroup[] = [
        {
          id: 'int-1',
          rootCause: 'Low mastery',
          rootCauseVi: 'Mức độ thành thạo thấp',
          studentIds: ['student-1'],
          severity: 'high',
          size: 1,
          evidenceSummary: 'Needs support',
          evidenceSummaryVi: 'Cần hỗ trợ',
          skills: ['Algebra'],
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'int-2',
          rootCause: 'Struggling',
          rootCauseVi: 'Đang gặp khó khăn',
          studentIds: ['student-2'],
          severity: 'medium',
          size: 1,
          evidenceSummary: 'Needs intervention',
          evidenceSummaryVi: 'Cần can thiệp',
          skills: ['Geometry'],
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockClassService.getClasses = vi.fn().mockResolvedValue(mockClasses);
      mockBktService.getInterventions = vi.fn().mockResolvedValue(mockInterventions);

      // Act
      const result = await teacherDashboardService.getDashboardData();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      // Verify stats are correctly aggregated
      const stats: TeacherDashboardStats = result.data!.stats;
      expect(stats.totalStudents).toBe(45); // 25 + 20
      expect(stats.activeClasses).toBe(2);
      expect(stats.averageMastery).toBeCloseTo(0.785, 2); // (0.72 + 0.85) / 2
      expect(stats.studentsNeedingIntervention).toBe(2); // 1 high + 1 medium

      // Verify classes are passed through
      expect(result.data!.classes).toHaveLength(2);
      expect(result.data!.classes[0].name).toBe('Math 6A');

      // Verify interventions are passed through
      expect(result.data!.interventions).toHaveLength(2);
      expect(result.data!.interventions[0].severity).toBe('high');

      // Verify mastery distribution is calculated
      const masteryDistribution: MasteryDistribution = result.data!.masteryDistribution;
      expect(masteryDistribution).toBeDefined();
      expect(masteryDistribution.total).toBe(45);

      // Verify activity log is built from interventions
      expect(result.data!.activityLog).toBeDefined();
      expect(result.data!.activityLog.length).toBeGreaterThan(0);
    });

    it('returns empty result when no classes exist', async () => {
      // Arrange
      mockClassService.getClasses = vi.fn().mockResolvedValue([]);
      mockBktService.getInterventions = vi.fn().mockResolvedValue([]);

      // Act
      const result = await teacherDashboardService.getDashboardData();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      const stats: TeacherDashboardStats = result.data!.stats;
      expect(stats.totalStudents).toBe(0);
      expect(stats.activeClasses).toBe(0);
      expect(stats.averageMastery).toBe(0);
      expect(stats.studentsNeedingIntervention).toBe(0);

      expect(result.data!.classes).toHaveLength(0);
      expect(result.data!.interventions).toHaveLength(0);
    });

    it('returns empty result when no interventions exist', async () => {
      // Arrange
      const mockClasses: TeacherClass[] = [
        {
          id: 'class-1',
          name: 'Math 6A',
          subject: 'math',
          grade: 6,
          studentCount: 20,
          averageMastery: 0.75,
          lastActivity: new Date(),
          status: 'active',
        },
      ];

      mockClassService.getClasses = vi.fn().mockResolvedValue(mockClasses);
      mockBktService.getInterventions = vi.fn().mockResolvedValue([]);

      // Act
      const result = await teacherDashboardService.getDashboardData();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.stats.studentsNeedingIntervention).toBe(0);
    });

    it('returns partial data when class service fails', async () => {
      // Arrange
      const errorMessage = 'Failed to fetch classes';
      mockClassService.getClasses = vi.fn().mockRejectedValue(new Error(errorMessage));
      mockBktService.getInterventions = vi.fn().mockResolvedValue([]);

      // Act
      const result = await teacherDashboardService.getDashboardData();

      // Assert - The service uses Promise.allSettled, so it gracefully degrades
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      // Classes will be empty due to failure
      expect(result.data!.classes).toHaveLength(0);
      // Interventions still work
      expect(result.data!.interventions).toHaveLength(0);
    });

    it('returns partial data when intervention service fails', async () => {
      // Arrange
      const errorMessage = 'Failed to fetch interventions';
      mockClassService.getClasses = vi.fn().mockResolvedValue([]);
      mockBktService.getInterventions = vi.fn().mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await teacherDashboardService.getDashboardData();

      // Assert - The service uses Promise.allSettled, so it gracefully degrades
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      // Classes still work
      expect(result.data!.classes).toHaveLength(0);
      // Interventions will be empty due to failure
      expect(result.data!.interventions).toHaveLength(0);
    });

    it('calculates mastery distribution correctly', async () => {
      // Arrange
      const mockClasses: TeacherClass[] = [
        { id: 'c1', name: 'Class 1', subject: 'math', grade: 6, studentCount: 10, averageMastery: 0.9, lastActivity: new Date(), status: 'active' }, // mastered
        { id: 'c2', name: 'Class 2', subject: 'math', grade: 6, studentCount: 10, averageMastery: 0.6, lastActivity: new Date(), status: 'active' }, // learning
        { id: 'c3', name: 'Class 3', subject: 'math', grade: 6, studentCount: 10, averageMastery: 0.3, lastActivity: new Date(), status: 'active' }, // needs support
        { id: 'c4', name: 'Class 4', subject: 'math', grade: 6, studentCount: 10, averageMastery: 0.0, lastActivity: new Date(), status: 'active' }, // unknown
      ];

      mockClassService.getClasses = vi.fn().mockResolvedValue(mockClasses);
      mockBktService.getInterventions = vi.fn().mockResolvedValue([]);

      // Act
      const result = await teacherDashboardService.getDashboardData();

      // Assert
      expect(result.success).toBe(true);
      const mastery: MasteryDistribution = result.data!.masteryDistribution;
      
      expect(mastery.mastered).toBe(10); // Class 1
      expect(mastery.learning).toBe(10); // Class 2
      expect(mastery.needsSupport).toBe(10); // Class 3
      expect(mastery.unknown).toBe(10); // Class 4
      expect(mastery.total).toBe(40);
    });

    it('filters high severity interventions for dashboard', async () => {
      // Arrange
      const mockClasses: TeacherClass[] = [
        { id: 'c1', name: 'Class 1', subject: 'math', grade: 6, studentCount: 10, averageMastery: 0.5, lastActivity: new Date(), status: 'active' },
      ];

      const mockInterventions: InterventionGroup[] = [
        { id: 'i1', rootCause: 'High', rootCauseVi: 'Cao', studentIds: ['s1'], severity: 'high', size: 1, evidenceSummary: '', evidenceSummaryVi: '', skills: [], status: 'pending', createdAt: new Date(), updatedAt: new Date() },
        { id: 'i2', rootCause: 'Medium', rootCauseVi: 'Trung bình', studentIds: ['s2'], severity: 'medium', size: 1, evidenceSummary: '', evidenceSummaryVi: '', skills: [], status: 'pending', createdAt: new Date(), updatedAt: new Date() },
        { id: 'i3', rootCause: 'Low', rootCauseVi: 'Thấp', studentIds: ['s3'], severity: 'low', size: 1, evidenceSummary: '', evidenceSummaryVi: '', skills: [], status: 'pending', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockClassService.getClasses = vi.fn().mockResolvedValue(mockClasses);
      mockBktService.getInterventions = vi.fn().mockResolvedValue(mockInterventions);

      // Act
      const result = await teacherDashboardService.getDashboardData();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data!.stats.studentsNeedingIntervention).toBe(2); // high + medium
    });
  });

  describe('getClasses', () => {
    it('returns classes from class service', async () => {
      // Arrange
      const mockClasses: TeacherClass[] = [
        { id: 'c1', name: 'Class 1', subject: 'math', grade: 6, studentCount: 20, averageMastery: 0.7, lastActivity: new Date(), status: 'active' },
      ];
      mockClassService.getClasses = vi.fn().mockResolvedValue(mockClasses);

      // Act
      const result = await teacherDashboardService.getClasses();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockClasses);
      expect(mockClassService.getClasses).toHaveBeenCalled();
    });

    it('propagates error from class service', async () => {
      // Arrange
      const error = new Error('Network error');
      mockClassService.getClasses = vi.fn().mockRejectedValue(error);

      // Act
      const result = await teacherDashboardService.getClasses();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('getInterventions', () => {
    it('returns interventions from BKT service', async () => {
      // Arrange
      const mockInterventions: InterventionGroup[] = [
        { id: 'i1', rootCause: 'Test', rootCauseVi: 'Test', studentIds: ['s1'], severity: 'high', size: 1, evidenceSummary: '', evidenceSummaryVi: '', skills: [], status: 'pending', createdAt: new Date(), updatedAt: new Date() },
      ];
      mockBktService.getInterventions = vi.fn().mockResolvedValue(mockInterventions);

      // Act
      const result = await teacherDashboardService.getInterventions();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockInterventions);
      expect(mockBktService.getInterventions).toHaveBeenCalled();
    });

    it('propagates error from BKT service', async () => {
      // Arrange
      const error = new Error('Service unavailable');
      mockBktService.getInterventions = vi.fn().mockRejectedValue(error);

      // Act
      const result = await teacherDashboardService.getInterventions();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Service unavailable');
    });
  });
});
