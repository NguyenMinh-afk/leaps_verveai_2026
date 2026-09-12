// ============================================
// VERVE AI - Teacher Portal Mock Data
// ============================================
// This data is for development purposes only.
// Replace with real API calls when backend is ready.

import type {
  TeacherClass,
  TeacherStudent,
  Question,
  Assignment,
  ActivityLogEntry,
  TeacherDashboardStats,
  MasteryDistribution,
  InterventionGroup,
} from '@/types';

/**
 * Mock dashboard statistics
 */
export const mockDashboardStats: TeacherDashboardStats = {
  totalStudents: 156,
  activeClasses: 5,
  averageMastery: 0.72,
  studentsNeedingIntervention: 23,
  pendingQuestions: 47,
  pendingAssignments: 3,
};

/**
 * Mock mastery distribution
 */
export const mockMasteryDistribution: MasteryDistribution = {
  mastered: 89,
  learning: 42,
  needsSupport: 25,
  unknown: 0,
  total: 156,
};

/**
 * Mock classes
 */
export const mockClasses: TeacherClass[] = [
  {
    id: 'class-1',
    name: 'Toán 6A',
    subject: 'math',
    grade: 6,
    studentCount: 32,
    averageMastery: 0.78,
    lastActivity: new Date(Date.now() - 1000 * 60 * 30),
    status: 'active',
  },
  {
    id: 'class-2',
    name: 'Toán 6B',
    subject: 'math',
    grade: 6,
    studentCount: 30,
    averageMastery: 0.65,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'active',
  },
  {
    id: 'class-3',
    name: 'Toán 7A',
    subject: 'math',
    grade: 7,
    studentCount: 35,
    averageMastery: 0.72,
    lastActivity: new Date(Date.now() - 1000 * 60 * 45),
    status: 'active',
  },
  {
    id: 'class-4',
    name: 'Toán 7B',
    subject: 'math',
    grade: 7,
    studentCount: 28,
    averageMastery: 0.81,
    lastActivity: new Date(Date.now() - 1000 * 60 * 15),
    status: 'active',
  },
  {
    id: 'class-5',
    name: 'Toán 8A',
    subject: 'math',
    grade: 8,
    studentCount: 31,
    averageMastery: 0.69,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: 'active',
  },
];

/**
 * Mock students
 */
export const mockStudents: TeacherStudent[] = [
  {
    id: 'student-1',
    code: 'ST001',
    name: 'Nguyễn Văn Minh',
    email: 'minh.nv@example.com',
    classId: 'class-1',
    overallMastery: 0.92,
    masteryLevel: 'mastered',
    lastActive: new Date(Date.now() - 1000 * 60 * 15),
    interventionCount: 0,
    assessmentCount: 24,
    topicMasteries: [
      { topicId: 't1', topicName: 'Phép cộng', topicNameVi: 'Phép cộng', pKnown: 0.95, masteryLevel: 'mastered', evidenceCount: 45, lastActivity: new Date() },
      { topicId: 't2', topicName: 'Phép trừ', topicNameVi: 'Phép trừ', pKnown: 0.88, masteryLevel: 'mastered', evidenceCount: 38, lastActivity: new Date() },
      { topicId: 't3', topicName: 'Phép nhân', topicNameVi: 'Phép nhân', pKnown: 0.91, masteryLevel: 'mastered', evidenceCount: 42, lastActivity: new Date() },
    ],
  },
  {
    id: 'student-2',
    code: 'ST002',
    name: 'Trần Thị Lan',
    email: 'lan.tt@example.com',
    classId: 'class-1',
    overallMastery: 0.75,
    masteryLevel: 'learning',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    interventionCount: 1,
    assessmentCount: 18,
    topicMasteries: [
      { topicId: 't1', topicName: 'Phép cộng', topicNameVi: 'Phép cộng', pKnown: 0.89, masteryLevel: 'mastered', evidenceCount: 35, lastActivity: new Date() },
      { topicId: 't2', topicName: 'Phép trừ', topicNameVi: 'Phép trừ', pKnown: 0.72, masteryLevel: 'learning', evidenceCount: 28, lastActivity: new Date() },
      { topicId: 't4', topicName: 'Phép chia', topicNameVi: 'Phép chia', pKnown: 0.65, masteryLevel: 'learning', evidenceCount: 22, lastActivity: new Date() },
    ],
  },
  {
    id: 'student-3',
    code: 'ST003',
    name: 'Lê Hoàng Nam',
    email: 'nam.lh@example.com',
    classId: 'class-1',
    overallMastery: 0.45,
    masteryLevel: 'needs-support',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
    interventionCount: 3,
    assessmentCount: 12,
    topicMasteries: [
      { topicId: 't1', topicName: 'Phép cộng', topicNameVi: 'Phép cộng', pKnown: 0.58, masteryLevel: 'needs-support', evidenceCount: 18, lastActivity: new Date() },
      { topicId: 't2', topicName: 'Phép trừ', topicNameVi: 'Phép trừ', pKnown: 0.42, masteryLevel: 'needs-support', evidenceCount: 15, lastActivity: new Date() },
      { topicId: 't4', topicName: 'Phép chia', topicNameVi: 'Phép chia', pKnown: 0.35, masteryLevel: 'needs-support', evidenceCount: 12, lastActivity: new Date() },
    ],
  },
  {
    id: 'student-4',
    code: 'ST004',
    name: 'Phạm Thu Hà',
    email: 'ha.pt@example.com',
    classId: 'class-2',
    overallMastery: 0.68,
    masteryLevel: 'learning',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 4),
    interventionCount: 1,
    assessmentCount: 20,
    topicMasteries: [
      { topicId: 't1', topicName: 'Phép cộng', topicNameVi: 'Phép cộng', pKnown: 0.82, masteryLevel: 'mastered', evidenceCount: 32, lastActivity: new Date() },
      { topicId: 't2', topicName: 'Phép trừ', topicNameVi: 'Phép trừ', pKnown: 0.65, masteryLevel: 'learning', evidenceCount: 25, lastActivity: new Date() },
      { topicId: 't3', topicName: 'Phép nhân', topicNameVi: 'Phép nhân', pKnown: 0.58, masteryLevel: 'needs-support', evidenceCount: 20, lastActivity: new Date() },
    ],
  },
  {
    id: 'student-5',
    code: 'ST005',
    name: 'Hoàng Đức Anh',
    email: 'anh.hd@example.com',
    classId: 'class-2',
    overallMastery: 0.55,
    masteryLevel: 'needs-support',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 48),
    interventionCount: 2,
    assessmentCount: 15,
    topicMasteries: [
      { topicId: 't1', topicName: 'Phép cộng', topicNameVi: 'Phép cộng', pKnown: 0.62, masteryLevel: 'learning', evidenceCount: 22, lastActivity: new Date() },
      { topicId: 't2', topicName: 'Phép trừ', topicNameVi: 'Phép trừ', pKnown: 0.48, masteryLevel: 'needs-support', evidenceCount: 18, lastActivity: new Date() },
      { topicId: 't4', topicName: 'Phép chia', topicNameVi: 'Phép chia', pKnown: 0.55, masteryLevel: 'needs-support', evidenceCount: 20, lastActivity: new Date() },
    ],
  },
];

/**
 * Mock interventions
 */
export const mockInterventions: InterventionGroup[] = [
  {
    id: 'int-1',
    rootCause: 'Multiplication facts not memorized',
    rootCauseVi: 'Chưa thuộc bảng nhân',
    studentIds: ['student-3', 'student-5'],
    severity: 'high',
    size: 2,
    evidenceSummary: 'Students consistently make errors in multiplication problems',
    evidenceSummaryVi: 'Học sinh liên tục mắc lỗi trong các bài toán nhân',
    skills: ['Phép nhân', 'Bảng cửu chương'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: 'int-2',
    rootCause: 'Difficulty with subtraction borrowing',
    rootCauseVi: 'Khó khăn khi trừ có mượn',
    studentIds: ['student-3', 'student-4'],
    severity: 'high',
    size: 2,
    evidenceSummary: 'Students struggle with borrowing in multi-digit subtraction',
    evidenceSummaryVi: 'Học sinh gặp khó khăn khi mượn trong phép trừ nhiều chữ số',
    skills: ['Phép trừ', 'Trừ có mượn'],
    status: 'in-progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: 'int-3',
    rootCause: 'Basic addition fluency',
    rootCauseVi: 'Tốc độ cộng cơ bản',
    studentIds: ['student-5'],
    severity: 'medium',
    size: 1,
    evidenceSummary: 'Student takes longer than expected to solve basic addition',
    evidenceSummaryVi: 'Học sinh mất nhiều thời gian hơn dự kiến để giải các bài cộng cơ bản',
    skills: ['Phép cộng', 'Tính nhanh'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
  {
    id: 'int-4',
    rootCause: 'Division concept understanding',
    rootCauseVi: 'Hiểu khái niệm chia',
    studentIds: ['student-4', 'student-5'],
    severity: 'medium',
    size: 2,
    evidenceSummary: 'Students confuse division with subtraction',
    evidenceSummaryVi: 'Học sinh nhầm lẫn phép chia với phép trừ',
    skills: ['Phép chia', 'Khái niệm chia'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
  },
  {
    id: 'int-5',
    rootCause: 'Fraction basics',
    rootCauseVi: 'Cơ bản về phân số',
    studentIds: ['student-2', 'student-4'],
    severity: 'low',
    size: 2,
    evidenceSummary: 'Students need reinforcement on fraction concepts',
    evidenceSummaryVi: 'Học sinh cần củng cố khái niệm phân số',
    skills: ['Phân số', 'So sánh phân số'],
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

/**
 * Mock questions
 */
export const mockQuestions: Question[] = [
  {
    id: 'q-1',
    content: 'What is 7 × 8?',
    contentVi: '7 nhân 8 bằng bao nhiêu?',
    options: [
      { id: 'o1', content: '54', contentVi: '54' },
      { id: 'o2', content: '56', contentVi: '56' },
      { id: 'o3', content: '58', contentVi: '58' },
      { id: 'o4', content: '48', contentVi: '48' },
    ],
    correctOptionIndex: 1,
    explanation: '7 multiplied by 8 equals 56.',
    explanationVi: '7 nhân 8 bằng 56.',
    topicId: 't3',
    topicName: 'Multiplication',
    topicNameVi: 'Phép nhân',
    difficulty: 'medium',
    type: 'multiple-choice',
    status: 'pending-review',
    createdBy: 'ai',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    source: 'Auto-generated based on curriculum',
  },
  {
    id: 'q-2',
    content: 'If you have 24 apples and give away 7, how many do you have left?',
    contentVi: 'Nếu bạn có 24 quả táo và cho đi 7 quả, bạn còn lại bao nhiêu quả?',
    options: [
      { id: 'o1', content: '15', contentVi: '15' },
      { id: 'o2', content: '17', contentVi: '17' },
      { id: 'o3', content: '18', contentVi: '18' },
      { id: 'o4', content: '16', contentVi: '16' },
    ],
    correctOptionIndex: 1,
    explanation: '24 - 7 = 17',
    explanationVi: '24 - 7 = 17',
    topicId: 't2',
    topicName: 'Subtraction',
    topicNameVi: 'Phép trừ',
    difficulty: 'easy',
    type: 'multiple-choice',
    status: 'approved',
    createdBy: 'teacher',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    reviewedBy: 'teacher-1',
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: 'q-3',
    content: 'Which of the following is equivalent to 3/4?',
    contentVi: 'Phân số nào sau đây tương đương với 3/4?',
    options: [
      { id: 'o1', content: '6/8', contentVi: '6/8' },
      { id: 'o2', content: '9/12', contentVi: '9/12' },
      { id: 'o3', content: 'Both A and B', contentVi: 'Cả A và B' },
      { id: 'o4', content: 'Neither A nor B', contentVi: 'Không A cũng không B' },
    ],
    correctOptionIndex: 2,
    explanation: 'Both 6/8 and 9/12 simplify to 3/4.',
    explanationVi: 'Cả 6/8 và 9/12 đều rút gọn về 3/4.',
    topicId: 't5',
    topicName: 'Fractions',
    topicNameVi: 'Phân số',
    difficulty: 'medium',
    type: 'multiple-choice',
    status: 'published',
    createdBy: 'ai',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    reviewedBy: 'teacher-1',
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    source: 'Auto-generated based on curriculum',
  },
  {
    id: 'q-4',
    content: 'Create a division problem where 42 is divided by 6.',
    contentVi: 'Tạo một bài toán chia với 42 chia cho 6.',
    options: [],
    correctOptionIndex: 0,
    explanation: 'This is a short-answer question about division.',
    explanationVi: 'Đây là câu hỏi tự luận về phép chia.',
    topicId: 't4',
    topicName: 'Division',
    topicNameVi: 'Phép chia',
    difficulty: 'easy',
    type: 'short-answer',
    status: 'draft',
    createdBy: 'teacher',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: 'q-5',
    content: 'True or False: 15 × 4 = 60',
    contentVi: 'Đúng hay sai: 15 × 4 = 60',
    options: [
      { id: 'o1', content: 'True', contentVi: 'Đúng' },
      { id: 'o2', content: 'False', contentVi: 'Sai' },
    ],
    correctOptionIndex: 0,
    explanation: '15 × 4 = 60 is correct.',
    explanationVi: '15 × 4 = 60 là đúng.',
    topicId: 't3',
    topicName: 'Multiplication',
    topicNameVi: 'Phép nhân',
    difficulty: 'easy',
    type: 'true-false',
    status: 'rejected',
    createdBy: 'ai',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    reviewedBy: 'teacher-1',
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

/**
 * Setter for mock questions (used by AI generation)
 */
let _mockQuestions: Question[] = mockQuestions

export function setMockQuestions(questions: Question[]): void {
  _mockQuestions = questions
}

export function getMockQuestions(): Question[] {
  return _mockQuestions
}

export function addMockQuestions(questions: Question[]): void {
  _mockQuestions = [...questions, ..._mockQuestions]
}

/**
 * Mock assignments
 */
export const mockAssignments: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Weekly Math Practice - Week 5',
    titleVi: 'Luyện tập Toán tuần 5',
    description: 'Practice problems covering multiplication and division',
    descriptionVi: 'Bài tập thực hành về phép nhân và phép chia',
    classId: 'class-1',
    className: 'Toán 6A',
    status: 'published',
    questionCount: 15,
    studentCount: 32,
    completionCount: 28,
    averageScore: 78,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: 'asg-2',
    title: 'Subtraction Quiz',
    titleVi: 'Bài kiểm tra Phép trừ',
    description: 'Quiz on subtraction with and without borrowing',
    descriptionVi: 'Kiểm tra về phép trừ có và không có mượn',
    classId: 'class-1',
    className: 'Toán 6A',
    status: 'published',
    questionCount: 10,
    studentCount: 32,
    completionCount: 32,
    averageScore: 82,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: 'asg-3',
    title: 'Addition Speed Test',
    titleVi: 'Kiểm tra tốc độ cộng',
    description: 'Timed test on basic addition facts',
    descriptionVi: 'Bài kiểm tra có thời gian về cộng cơ bản',
    classId: 'class-2',
    className: 'Toán 6B',
    status: 'draft',
    questionCount: 20,
    studentCount: 30,
    completionCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'asg-4',
    title: 'Chapter 3 Assessment',
    titleVi: 'Đánh giá Chương 3',
    description: 'Comprehensive assessment covering fractions',
    descriptionVi: 'Đánh giá toàn diện về phân số',
    classId: 'class-3',
    className: 'Toán 7A',
    status: 'published',
    questionCount: 25,
    studentCount: 35,
    completionCount: 30,
    averageScore: 71,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
];

/**
 * Mock activity log
 */
export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: 'act-1',
    type: 'assessment',
    title: 'New assessment submission',
    titleVi: 'Có bài nộp mới',
    description: 'Minh completed Weekly Math Practice',
    descriptionVi: 'Minh đã hoàn thành Luyện tập Toán tuần 5',
    studentId: 'student-1',
    studentName: 'Nguyễn Văn Minh',
    classId: 'class-1',
    className: 'Toán 6A',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 'act-2',
    type: 'intervention',
    title: 'New intervention recommended',
    titleVi: 'Có can thiệp mới được đề xuất',
    description: '3 students need support with multiplication',
    descriptionVi: '3 học sinh cần hỗ trợ về phép nhân',
    classId: 'class-1',
    className: 'Toán 6A',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: 'act-3',
    type: 'question',
    title: 'AI question generated',
    titleVi: 'Câu hỏi từ AI đã được tạo',
    description: '5 new questions ready for review',
    descriptionVi: '5 câu hỏi mới sẵn sàng để duyệt',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'act-4',
    type: 'mastery',
    title: 'Student mastery improved',
    titleVi: 'Mức độ thành thạo của học sinh được cải thiện',
    description: 'Lan improved from 65% to 75% in subtraction',
    descriptionVi: 'Lan đã cải thiện từ 65% lên 75% trong phép trừ',
    studentId: 'student-2',
    studentName: 'Trần Thị Lan',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: 'act-5',
    type: 'assignment',
    title: 'Assignment due soon',
    titleVi: 'Bài tập sắp đến hạn',
    description: 'Weekly Math Practice due in 2 days',
    descriptionVi: 'Luyện tập Toán tuần 5 đến hạn trong 2 ngày',
    classId: 'class-1',
    className: 'Toán 6A',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
];

/**
 * Helper function to get students by class
 */
export const getStudentsByClass = (classId: string): TeacherStudent[] => {
  return mockStudents.filter((s) => s.classId === classId);
};

/**
 * Helper function to get class by ID
 */
export const getClassById = (classId: string): TeacherClass | undefined => {
  return mockClasses.find((c) => c.id === classId);
};

/**
 * Helper function to get student by ID
 */
export const getStudentById = (studentId: string): TeacherStudent | undefined => {
  return mockStudents.find((s) => s.id === studentId);
};
