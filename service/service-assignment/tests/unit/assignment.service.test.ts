/**
 * Unit tests for assignment.service.ts
 * 
 * Tests cover:
 * - Create assignment (authorized teacher)
 * - Create assignment (unauthorized non-teacher)
 * - Update own assignment
 * - Cannot modify another's assignment
 * - Student can see enrolled (published) assignment
 * - Pagination
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the prisma client
const mockPrisma = {
  assignment: {
    create: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn()
  }
};

// Mock the prisma client module
vi.mock('../src/prisma/client.js', () => ({
  prisma: mockPrisma
}));

// Mock the logger
vi.mock('../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }
}));

// Mock @verveai/error-types
vi.mock('@verveai/error-types', () => ({
  NotFoundError: class NotFoundError extends Error {
    constructor(resource: string, id?: string) {
      super(`${resource} ${id} not found`);
      this.name = 'NotFoundError';
    }
  },
  ValidationError: class ValidationError extends Error {
    public issues: unknown[];
    constructor(issues: unknown[], message = 'Validation failed') {
      super(message);
      this.name = 'ValidationError';
      this.issues = issues;
    }
  }
}));

// Mock local errors
vi.mock('../src/errors.js', () => ({
  ForbiddenError: class ForbiddenError extends Error {
    public code: string;
    constructor(code: string, message: string) {
      super(message);
      this.name = 'ForbiddenError';
      this.code = code;
    }
  }
}));

// Import after mocks are set up
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignment,
  listAssignments,
  listStudentAssignments
} from '../src/services/assignment.service.js';

describe('Assignment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper function to create a mock assignment row
  const createMockAssignmentRow = (overrides = {}) => ({
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Assignment',
    description: 'Test description',
    teacher_id: 'teacher-123',
    class_id: 'class-456',
    status: 'DRAFT' as const,
    due_at: null,
    starts_at: null,
    max_attempts: 1,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    ...overrides
  });

  describe('createAssignment', () => {
    it('should create an assignment for a teacher', async () => {
      const mockRow = createMockAssignmentRow();
      mockPrisma.assignment.create.mockResolvedValue(mockRow);

      const result = await createAssignment(
        {
          title: 'Test Assignment',
          description: 'Test description',
          classId: 'class-456'
        },
        'teacher-123',
        'TEACHER'
      );

      expect(result).toEqual({
        id: mockRow.id,
        title: mockRow.title,
        description: mockRow.description,
        teacherId: mockRow.teacher_id,
        classId: mockRow.class_id,
        status: mockRow.status,
        dueAt: mockRow.due_at,
        startsAt: mockRow.starts_at,
        maxAttempts: mockRow.max_attempts,
        createdAt: mockRow.created_at,
        updatedAt: mockRow.updated_at
      });

      expect(mockPrisma.assignment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Test Assignment',
          description: 'Test description',
          teacher_id: 'teacher-123',
          class_id: 'class-456'
        })
      });
    });

    it('should throw ForbiddenError when non-teacher tries to create', async () => {
      await expect(
        createAssignment(
          {
            title: 'Test Assignment',
            classId: 'class-456'
          },
          'student-123',
          'STUDENT'
        )
      ).rejects.toThrow('Only teachers can create assignments');
    });

    it('should throw ForbiddenError when admin tries to create (admin is not teacher)', async () => {
      await expect(
        createAssignment(
          {
            title: 'Test Assignment',
            classId: 'class-456'
          },
          'admin-123',
          'ADMIN'
        )
      ).rejects.toThrow('Only teachers can create assignments');
    });
  });

  describe('updateAssignment', () => {
    it('should update own assignment', async () => {
      const mockRow = createMockAssignmentRow({
        title: 'Original Title',
        teacher_id: 'teacher-123'
      });
      const updatedRow = { ...mockRow, title: 'Updated Title' };
      
      mockPrisma.assignment.findFirst.mockResolvedValue(mockRow);
      mockPrisma.assignment.update.mockResolvedValue(updatedRow);

      const result = await updateAssignment(
        mockRow.id,
        { title: 'Updated Title' },
        'teacher-123',
        'TEACHER'
      );

      expect(result.title).toBe('Updated Title');
    });

    it('should throw ForbiddenError when trying to update another teacher\'s assignment', async () => {
      const mockRow = createMockAssignmentRow({
        teacher_id: 'teacher-123'
      });
      mockPrisma.assignment.findFirst.mockResolvedValue(mockRow);

      await expect(
        updateAssignment(
          mockRow.id,
          { title: 'Updated Title' },
          'other-teacher-456',
          'TEACHER'
        )
      ).rejects.toThrow('Only the owning teacher or an admin can update this assignment');
    });

    it('should allow admin to update any assignment', async () => {
      const mockRow = createMockAssignmentRow({
        title: 'Original Title',
        teacher_id: 'teacher-123'
      });
      const updatedRow = { ...mockRow, title: 'Admin Updated Title' };
      
      mockPrisma.assignment.findFirst.mockResolvedValue(mockRow);
      mockPrisma.assignment.update.mockResolvedValue(updatedRow);

      const result = await updateAssignment(
        mockRow.id,
        { title: 'Admin Updated Title' },
        'admin-123',
        'ADMIN'
      );

      expect(result.title).toBe('Admin Updated Title');
    });

    it('should return existing record when no fields to update', async () => {
      const mockRow = createMockAssignmentRow({
        teacher_id: 'teacher-123'
      });
      mockPrisma.assignment.findFirst.mockResolvedValue(mockRow);

      const result = await updateAssignment(
        mockRow.id,
        {},
        'teacher-123',
        'TEACHER'
      );

      expect(result.title).toBe(mockRow.title);
      expect(mockPrisma.assignment.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteAssignment', () => {
    it('should soft delete own assignment', async () => {
      const mockRow = createMockAssignmentRow({
        teacher_id: 'teacher-123'
      });
      mockPrisma.assignment.findFirst.mockResolvedValue(mockRow);
      mockPrisma.assignment.update.mockResolvedValue({ ...mockRow, deleted_at: new Date() });

      await expect(
        deleteAssignment(mockRow.id, 'teacher-123', 'TEACHER')
      ).resolves.not.toThrow();

      expect(mockPrisma.assignment.update).toHaveBeenCalledWith({
        where: { id: mockRow.id },
        data: { deleted_at: expect.any(Date) }
      });
    });

    it('should throw ForbiddenError when non-owner tries to delete', async () => {
      const mockRow = createMockAssignmentRow({
        teacher_id: 'teacher-123'
      });
      mockPrisma.assignment.findFirst.mockResolvedValue(mockRow);

      await expect(
        deleteAssignment(mockRow.id, 'other-teacher-456', 'TEACHER')
      ).rejects.toThrow('Only the owning teacher or an admin can delete this assignment');
    });
  });

  describe('getAssignment', () => {
    it('should get own assignment as teacher', async () => {
      const mockRow = createMockAssignmentRow({
        teacher_id: 'teacher-123'
      });
      mockPrisma.assignment.findFirst.mockResolvedValue(mockRow);

      const result = await getAssignment(mockRow.id, 'teacher-123', 'TEACHER');

      expect(result.teacherId).toBe('teacher-123');
    });

    it('should get any assignment as admin', async () => {
      const mockRow = createMockAssignmentRow({
        teacher_id: 'teacher-123'
      });
      mockPrisma.assignment.findFirst.mockResolvedValue(mockRow);

      const result = await getAssignment(mockRow.id, 'admin-123', 'ADMIN');

      expect(result.teacherId).toBe('teacher-123');
    });

    it('should allow student to view published assignment', async () => {
      const mockRow = createMockAssignmentRow({
        teacher_id: 'teacher-123',
        status: 'PUBLISHED'
      });
      mockPrisma.assignment.findFirst.mockResolvedValue(mockRow);

      const result = await getAssignment(mockRow.id, 'student-123', 'STUDENT');

      expect(result.status).toBe('PUBLISHED');
    });

    it('should deny student from viewing non-published assignment', async () => {
      const mockRow = createMockAssignmentRow({
        teacher_id: 'teacher-123',
        status: 'DRAFT'
      });
      mockPrisma.assignment.findFirst.mockResolvedValue(mockRow);

      await expect(
        getAssignment(mockRow.id, 'student-123', 'STUDENT')
      ).rejects.toThrow('Students can only view published assignments');
    });
  });

  describe('listAssignments', () => {
    it('should list own assignments for teacher', async () => {
      const mockRows = [
        createMockAssignmentRow({ teacher_id: 'teacher-123' }),
        createMockAssignmentRow({ id: '222', teacher_id: 'teacher-123' })
      ];
      
      mockPrisma.assignment.findMany.mockResolvedValue(mockRows);
      mockPrisma.assignment.count.mockResolvedValue(2);

      const result = await listAssignments(
        {},
        { skip: 0, take: 20 },
        'teacher-123',
        'TEACHER'
      );

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockPrisma.assignment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            teacher_id: 'teacher-123',
            deleted_at: null
          })
        })
      );
    });

    it('should list all assignments for admin', async () => {
      const mockRows = [
        createMockAssignmentRow({ teacher_id: 'teacher-123' }),
        createMockAssignmentRow({ id: '222', teacher_id: 'teacher-456' })
      ];
      
      mockPrisma.assignment.findMany.mockResolvedValue(mockRows);
      mockPrisma.assignment.count.mockResolvedValue(2);

      const result = await listAssignments(
        {},
        { skip: 0, take: 20 },
        'admin-123',
        'ADMIN'
      );

      expect(result.items).toHaveLength(2);
      expect(mockPrisma.assignment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deleted_at: null
          })
        })
      );
    });

    it('should apply pagination correctly', async () => {
      mockPrisma.assignment.findMany.mockResolvedValue([]);
      mockPrisma.assignment.count.mockResolvedValue(100);

      const result = await listAssignments(
        {},
        { skip: 20, take: 10 },
        'teacher-123',
        'TEACHER'
      );

      expect(mockPrisma.assignment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10
        })
      );
      expect(result.skip).toBe(20);
      expect(result.take).toBe(10);
    });

    it('should filter by classId', async () => {
      mockPrisma.assignment.findMany.mockResolvedValue([]);
      mockPrisma.assignment.count.mockResolvedValue(0);

      await listAssignments(
        { classId: 'class-456' },
        { skip: 0, take: 20 },
        'teacher-123',
        'TEACHER'
      );

      expect(mockPrisma.assignment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            class_id: 'class-456'
          })
        })
      );
    });

    it('should filter by status', async () => {
      mockPrisma.assignment.findMany.mockResolvedValue([]);
      mockPrisma.assignment.count.mockResolvedValue(0);

      await listAssignments(
        { status: 'PUBLISHED' },
        { skip: 0, take: 20 },
        'teacher-123',
        'TEACHER'
      );

      expect(mockPrisma.assignment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'PUBLISHED'
          })
        })
      );
    });
  });

  describe('listStudentAssignments', () => {
    it('should list published assignments for students', async () => {
      const mockRows = [
        createMockAssignmentRow({ status: 'PUBLISHED' }),
        createMockAssignmentRow({ id: '222', status: 'PUBLISHED' })
      ];
      
      mockPrisma.assignment.findMany.mockResolvedValue(mockRows);
      mockPrisma.assignment.count.mockResolvedValue(2);

      const result = await listStudentAssignments('student-123', { skip: 0, take: 20 });

      expect(result.items).toHaveLength(2);
      expect(mockPrisma.assignment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'PUBLISHED',
            deleted_at: null
          })
        })
      );
    });

    it('should apply pagination', async () => {
      mockPrisma.assignment.findMany.mockResolvedValue([]);
      mockPrisma.assignment.count.mockResolvedValue(50);

      const result = await listStudentAssignments('student-123', { skip: 10, take: 5 });

      expect(result.skip).toBe(10);
      expect(result.take).toBe(5);
    });
  });
});
