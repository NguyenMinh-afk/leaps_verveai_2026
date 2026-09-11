// ============================================
// VERVE AI - Student Portal Mock Data
// ============================================
// This data is for development purposes only.
// Replace with real API calls when backend is ready.

import type {
  StudentProfile,
  StudentTopicMastery,
  SubjectMastery,
  LearningRecommendation,
  EvidenceItem,
  StudentAssignment,
  StudentExam,
  ExamResult,
  StudentDashboardStats,
  LearningActivity,
} from '@/types';

/**
 * Mock student profile
 */
export const mockStudentProfile: StudentProfile = {
  id: 'student-demo',
  name: 'Nguyễn Minh Anh',
  nameVi: 'Nguyễn Minh Anh',
  email: 'anh.nm@student.example.com',
  classId: 'class-1',
  className: 'Toán 6A',
  grade: 6,
};

/**
 * Mock dashboard stats
 */
export const mockStudentDashboardStats: StudentDashboardStats = {
  overallMastery: 0.73,
  masteryLevel: 'learning',
  topicsCompleted: 12,
  topicsInProgress: 5,
  assignmentsPending: 3,
  assignmentsCompleted: 18,
  examsCompleted: 8,
  averageScore: 78,
};

/**
 * Mock subject masteries
 */
export const mockSubjectMasteries: SubjectMastery[] = [
  {
    subjectId: 'math',
    subjectName: 'Mathematics',
    subjectNameVi: 'Toán học',
    overallMastery: 0.73,
    masteryLevel: 'learning',
    topicCount: 8,
    masteredTopics: 4,
    learningTopics: 3,
    needsSupportTopics: 1,
  },
  {
    subjectId: 'algebra',
    subjectName: 'Algebra',
    subjectNameVi: 'Đại số',
    overallMastery: 0.82,
    masteryLevel: 'mastered',
    topicCount: 5,
    masteredTopics: 3,
    learningTopics: 2,
    needsSupportTopics: 0,
  },
  {
    subjectId: 'geometry',
    subjectName: 'Geometry',
    subjectNameVi: 'Hình học',
    overallMastery: 0.65,
    masteryLevel: 'learning',
    topicCount: 4,
    masteredTopics: 1,
    learningTopics: 2,
    needsSupportTopics: 1,
  },
];

/**
 * Mock topic masteries
 */
export const mockTopicMasteries: StudentTopicMastery[] = [
  {
    topicId: 't1',
    topicName: 'Addition',
    topicNameVi: 'Phép cộng',
    subject: 'Mathematics',
    subjectVi: 'Toán học',
    pKnown: 0.95,
    masteryLevel: 'mastered',
    evidenceCount: 45,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
    trend: 'up',
  },
  {
    topicId: 't2',
    topicName: 'Subtraction',
    topicNameVi: 'Phép trừ',
    subject: 'Mathematics',
    subjectVi: 'Toán học',
    pKnown: 0.88,
    masteryLevel: 'mastered',
    evidenceCount: 38,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5),
    trend: 'stable',
  },
  {
    topicId: 't3',
    topicName: 'Multiplication',
    topicNameVi: 'Phép nhân',
    subject: 'Mathematics',
    subjectVi: 'Toán học',
    pKnown: 0.72,
    masteryLevel: 'learning',
    evidenceCount: 28,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24),
    trend: 'up',
  },
  {
    topicId: 't4',
    topicName: 'Division',
    topicNameVi: 'Phép chia',
    subject: 'Mathematics',
    subjectVi: 'Toán học',
    pKnown: 0.58,
    masteryLevel: 'needs-support',
    evidenceCount: 22,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 48),
    trend: 'down',
  },
  {
    topicId: 't5',
    topicName: 'Fractions',
    topicNameVi: 'Phân số',
    subject: 'Mathematics',
    subjectVi: 'Toán học',
    pKnown: 0.65,
    masteryLevel: 'learning',
    evidenceCount: 25,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 12),
    trend: 'up',
  },
  {
    topicId: 't6',
    topicName: 'Decimals',
    topicNameVi: 'Số thập phân',
    subject: 'Mathematics',
    subjectVi: 'Toán học',
    pKnown: 0.42,
    masteryLevel: 'needs-support',
    evidenceCount: 15,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 72),
    trend: 'stable',
  },
  {
    topicId: 't7',
    topicName: 'Word Problems',
    topicNameVi: 'Bài toán có lời văn',
    subject: 'Mathematics',
    subjectVi: 'Toán học',
    pKnown: 0.78,
    masteryLevel: 'learning',
    evidenceCount: 30,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 8),
    trend: 'up',
  },
  {
    topicId: 't8',
    topicName: 'Measurement',
    topicNameVi: 'Đo lường',
    subject: 'Mathematics',
    subjectVi: 'Toán học',
    pKnown: 0.82,
    masteryLevel: 'mastered',
    evidenceCount: 35,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    trend: 'stable',
  },
];

/**
 * Mock learning recommendations
 */
export const mockRecommendations: LearningRecommendation[] = [
  {
    id: 'rec-1',
    topicId: 't4',
    topicName: 'Division',
    topicNameVi: 'Phép chia',
    priority: 'high',
    reason: 'Your performance has been declining in division problems',
    reasonVi: 'Kết quả của bạn đang giảm trong các bài toán chia',
    currentMastery: 0.58,
    recommendedAction: 'practice',
    estimatedMinutes: 15,
    status: 'pending',
  },
  {
    id: 'rec-2',
    topicId: 't6',
    topicName: 'Decimals',
    topicNameVi: 'Số thập phân',
    priority: 'high',
    reason: 'You need more practice with decimal operations',
    reasonVi: 'Bạn cần luyện thêm các phép tính số thập phân',
    currentMastery: 0.42,
    recommendedAction: 'review',
    estimatedMinutes: 20,
    status: 'pending',
  },
  {
    id: 'rec-3',
    topicId: 't3',
    topicName: 'Multiplication',
    topicNameVi: 'Phép nhân',
    priority: 'medium',
    reason: 'Keep practicing to master multiplication facts',
    reasonVi: 'Tiếp tục luyện tập để thành thạo bảng nhân',
    currentMastery: 0.72,
    recommendedAction: 'practice',
    estimatedMinutes: 10,
    status: 'in-progress',
  },
  {
    id: 'rec-4',
    topicId: 't5',
    topicName: 'Fractions',
    topicNameVi: 'Phân số',
    priority: 'medium',
    reason: 'Continue your progress with fraction concepts',
    reasonVi: 'Tiếp tục tiến bộ với các khái niệm phân số',
    currentMastery: 0.65,
    recommendedAction: 'continue',
    estimatedMinutes: 15,
    status: 'in-progress',
  },
  {
    id: 'rec-5',
    topicId: 't7',
    topicName: 'Word Problems',
    topicNameVi: 'Bài toán có lời văn',
    priority: 'low',
    reason: 'Good progress! Keep solving word problems',
    reasonVi: 'Tiến bộ tốt! Tiếp tục giải bài toán có lời văn',
    currentMastery: 0.78,
    recommendedAction: 'assessment',
    estimatedMinutes: 20,
    status: 'pending',
  },
];

/**
 * Mock evidence items
 */
export const mockEvidenceItems: EvidenceItem[] = [
  {
    id: 'ev-1',
    type: 'assessment',
    title: 'Multiplication Quiz',
    titleVi: 'Kiểm tra Phép nhân',
    description: 'Completed with score 85%',
    descriptionVi: 'Hoàn thành với điểm 85%',
    topicId: 't3',
    topicName: 'Multiplication',
    topicNameVi: 'Phép nhân',
    score: 85,
    maxScore: 100,
    percentage: 85,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    impact: 'positive',
  },
  {
    id: 'ev-2',
    type: 'assignment',
    title: 'Division Practice Set',
    titleVi: 'Bài tập Phép chia',
    description: 'Completed with score 62%',
    descriptionVi: 'Hoàn thành với điểm 62%',
    topicId: 't4',
    topicName: 'Division',
    topicNameVi: 'Phép chia',
    score: 62,
    maxScore: 100,
    percentage: 62,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    impact: 'negative',
  },
  {
    id: 'ev-3',
    type: 'practice',
    title: 'Decimal Operations Practice',
    titleVi: 'Luyện tập Số thập phân',
    description: 'Completed 10 decimal problems',
    descriptionVi: 'Hoàn thành 10 bài toán số thập phân',
    topicId: 't6',
    topicName: 'Decimals',
    topicNameVi: 'Số thập phân',
    score: 6,
    maxScore: 10,
    percentage: 60,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    impact: 'neutral',
  },
  {
    id: 'ev-4',
    type: 'topic-complete',
    title: 'Addition Topic Completed',
    titleVi: 'Hoàn thành Chủ đề Phép cộng',
    description: 'You demonstrated mastery of addition facts',
    descriptionVi: 'Bạn đã thể hiện sự thành thạo với các phép cộng cơ bản',
    topicId: 't1',
    topicName: 'Addition',
    topicNameVi: 'Phép cộng',
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    impact: 'positive',
  },
  {
    id: 'ev-5',
    type: 'assessment',
    title: 'Fraction Basics Quiz',
    titleVi: 'Kiểm tra Cơ bản Phân số',
    description: 'Completed with score 72%',
    descriptionVi: 'Hoàn thành với điểm 72%',
    topicId: 't5',
    topicName: 'Fractions',
    topicNameVi: 'Phân số',
    score: 72,
    maxScore: 100,
    percentage: 72,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    impact: 'positive',
  },
  {
    id: 'ev-6',
    type: 'practice',
    title: 'Subtraction Speed Practice',
    titleVi: 'Luyện tập tốc độ Phép trừ',
    description: 'Completed 20 subtraction problems',
    descriptionVi: 'Hoàn thành 20 bài toán trừ',
    topicId: 't2',
    topicName: 'Subtraction',
    topicNameVi: 'Phép trừ',
    score: 18,
    maxScore: 20,
    percentage: 90,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    impact: 'positive',
  },
];

/**
 * Mock student assignments
 */
export const mockStudentAssignments: StudentAssignment[] = [
  {
    id: 'asg-s-1',
    title: 'Weekly Math Practice - Week 6',
    titleVi: 'Luyện tập Toán tuần 6',
    description: 'Practice problems covering multiplication and division',
    descriptionVi: 'Bài tập thực hành về phép nhân và phép chia',
    topicId: 't3',
    topicName: 'Multiplication',
    topicNameVi: 'Phép nhân',
    classId: 'class-1',
    className: 'Toán 6A',
    teacherName: 'Giáo viên Demo',
    status: 'assigned',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    progress: 0,
    questionCount: 15,
    answeredCount: 0,
  },
  {
    id: 'asg-s-2',
    title: 'Division Exercises',
    titleVi: 'Bài tập Phép chia',
    description: 'Practice division with and without remainders',
    descriptionVi: 'Luyện chia có và không có dư',
    topicId: 't4',
    topicName: 'Division',
    topicNameVi: 'Phép chia',
    classId: 'class-1',
    className: 'Toán 6A',
    teacherName: 'Giáo viên Demo',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    progress: 60,
    questionCount: 10,
    answeredCount: 6,
  },
  {
    id: 'asg-s-3',
    title: 'Decimal Operations Quiz',
    titleVi: 'Kiểm tra Phép tính Số thập phân',
    description: 'Test your decimal operation skills',
    descriptionVi: 'Kiểm tra kỹ năng tính toán số thập phân',
    topicId: 't6',
    topicName: 'Decimals',
    topicNameVi: 'Số thập phân',
    classId: 'class-1',
    className: 'Toán 6A',
    teacherName: 'Giáo viên Demo',
    status: 'assigned',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    progress: 0,
    questionCount: 12,
    answeredCount: 0,
  },
  {
    id: 'asg-s-4',
    title: 'Fraction Basics',
    titleVi: 'Cơ bản về Phân số',
    description: 'Introduction to fractions and basic operations',
    descriptionVi: 'Giới thiệu về phân số và các phép tính cơ bản',
    classId: 'class-1',
    className: 'Toán 6A',
    teacherName: 'Giáo viên Demo',
    status: 'completed',
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    progress: 100,
    questionCount: 10,
    answeredCount: 10,
    score: 78,
  },
  {
    id: 'asg-s-5',
    title: 'Addition and Subtraction Review',
    titleVi: 'Ôn tập Phép cộng và Phép trừ',
    description: 'Review of addition and subtraction concepts',
    descriptionVi: 'Ôn tập các khái niệm cộng và trừ',
    classId: 'class-1',
    className: 'Toán 6A',
    teacherName: 'Giáo viên Demo',
    status: 'completed',
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    progress: 100,
    questionCount: 20,
    answeredCount: 20,
    score: 92,
  },
  {
    id: 'asg-s-6',
    title: 'Word Problems Set 3',
    titleVi: 'Bài toán có lời văn - Tập 3',
    description: 'Solve real-world math problems',
    descriptionVi: 'Giải các bài toán thực tế',
    classId: 'class-1',
    className: 'Toán 6A',
    teacherName: 'Giáo viên Demo',
    status: 'overdue',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    progress: 30,
    questionCount: 8,
    answeredCount: 2,
  },
];

/**
 * Mock student exams
 */
export const mockStudentExams: StudentExam[] = [
  {
    id: 'exam-s-1',
    title: 'Multiplication Assessment',
    titleVi: 'Đánh giá Phép nhân',
    description: 'Comprehensive test on multiplication skills',
    descriptionVi: 'Bài kiểm tra toàn diện về kỹ năng nhân',
    topicId: 't3',
    topicName: 'Multiplication',
    topicNameVi: 'Phép nhân',
    classId: 'class-1',
    className: 'Toán 6A',
    teacherName: 'Giáo viên Demo',
    status: 'available',
    durationMinutes: 30,
    questionCount: 20,
    attempts: 0,
    maxAttempts: 2,
  },
  {
    id: 'exam-s-2',
    title: 'Division Test',
    titleVi: 'Kiểm tra Phép chia',
    description: 'Test your division knowledge',
    descriptionVi: 'Kiểm tra kiến thức về phép chia',
    topicId: 't4',
    topicName: 'Division',
    topicNameVi: 'Phép chia',
    classId: 'class-1',
    className: 'Toán 6A',
    teacherName: 'Giáo viên Demo',
    status: 'available',
    durationMinutes: 25,
    questionCount: 15,
    attempts: 1,
    maxAttempts: 2,
    lastScore: 68,
  },
  {
    id: 'exam-s-3',
    title: 'Chapter 3 Exam',
    titleVi: 'Kiểm tra Chương 3',
    description: 'Comprehensive exam covering fractions and decimals',
    descriptionVi: 'Bài kiểm tra toàn diện về phân số và số thập phân',
    classId: 'class-1',
    className: 'Toán 6A',
    teacherName: 'Giáo viên Demo',
    status: 'upcoming',
    availableFrom: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    availableUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    durationMinutes: 45,
    questionCount: 25,
    attempts: 0,
    maxAttempts: 1,
  },
  {
    id: 'exam-s-4',
    title: 'Addition and Subtraction Quiz',
    titleVi: 'Kiểm tra Cộng và Trừ',
    description: 'Quick quiz on basic operations',
    descriptionVi: 'Bài kiểm tra nhanh về các phép tính cơ bản',
    classId: 'class-1',
    className: 'Toán 6A',
    teacherName: 'Giáo viên Demo',
    status: 'completed',
    durationMinutes: 20,
    questionCount: 15,
    attempts: 1,
    maxAttempts: 1,
    bestScore: 92,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: 'exam-s-5',
    title: 'Weekly Math Quiz',
    titleVi: 'Kiểm tra Toán tuần',
    description: 'Regular weekly assessment',
    descriptionVi: 'Đánh giá định kỳ hàng tuần',
    classId: 'class-1',
    className: 'Toán 6A',
    teacherName: 'Giáo viên Demo',
    status: 'completed',
    durationMinutes: 30,
    questionCount: 18,
    attempts: 1,
    maxAttempts: 1,
    bestScore: 78,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
];

/**
 * Mock exam results
 */
export const mockExamResults: ExamResult[] = [
  {
    id: 'result-1',
    examId: 'exam-s-4',
    examTitle: 'Addition and Subtraction Quiz',
    examTitleVi: 'Kiểm tra Cộng và Trừ',
    classId: 'class-1',
    className: 'Toán 6A',
    status: 'reviewed',
    score: 92,
    maxScore: 100,
    percentage: 92,
    timeSpentMinutes: 18,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    masteryImpact: 0.05,
    strengths: ['Quick mental calculations', 'Accurate borrowing in subtraction'],
    strengthsVi: ['Tính nhẩm nhanh', 'Trừ có mượn chính xác'],
    areasForImprovement: ['Word problem interpretation'],
    areasForImprovementVi: ['Diễn giải bài toán có lời văn'],
  },
  {
    id: 'result-2',
    examId: 'exam-s-5',
    examTitle: 'Weekly Math Quiz',
    examTitleVi: 'Kiểm tra Toán tuần',
    classId: 'class-1',
    className: 'Toán 6A',
    status: 'reviewed',
    score: 78,
    maxScore: 100,
    percentage: 78,
    timeSpentMinutes: 25,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    masteryImpact: 0.02,
    strengths: ['Strong multiplication basics'],
    strengthsVi: ['Nền tảng nhân vững'],
    areasForImprovement: ['Division with remainders', 'Decimal operations'],
    areasForImprovementVi: ['Chia có dư', 'Phép tính số thập phân'],
  },
];

/**
 * Mock learning activities
 */
export const mockLearningActivities: LearningActivity[] = [
  {
    id: 'act-s-1',
    type: 'assignment',
    title: 'Division Exercises',
    titleVi: 'Bài tập Phép chia',
    description: 'Started working on division practice',
    descriptionVi: 'Bắt đầu làm bài tập phép chia',
    topicId: 't4',
    topicName: 'Division',
    topicNameVi: 'Phép chia',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'in-progress',
  },
  {
    id: 'act-s-2',
    type: 'practice',
    title: 'Decimal Practice',
    titleVi: 'Luyện tập Số thập phân',
    description: 'Completed decimal operations practice',
    descriptionVi: 'Hoàn thành luyện tập số thập phân',
    topicId: 't6',
    topicName: 'Decimals',
    topicNameVi: 'Số thập phân',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    status: 'completed',
    score: 60,
  },
  {
    id: 'act-s-3',
    type: 'topic',
    title: 'Addition Mastered',
    titleVi: 'Hoàn thành Phép cộng',
    description: 'You demonstrated mastery of addition',
    descriptionVi: 'Bạn đã thể hiện sự thành thạo với phép cộng',
    topicId: 't1',
    topicName: 'Addition',
    topicNameVi: 'Phép cộng',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: 'completed',
  },
  {
    id: 'act-s-4',
    type: 'exam',
    title: 'Weekly Math Quiz',
    titleVi: 'Kiểm tra Toán tuần',
    description: 'Scored 78% on weekly quiz',
    descriptionVi: 'Đạt 78% trong bài kiểm tra tuần',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    status: 'completed',
    score: 78,
  },
  {
    id: 'act-s-5',
    type: 'practice',
    title: 'Multiplication Practice',
    titleVi: 'Luyện tập Phép nhân',
    description: 'Started multiplication practice session',
    descriptionVi: 'Bắt đầu buổi luyện tập phép nhân',
    topicId: 't3',
    topicName: 'Multiplication',
    topicNameVi: 'Phép nhân',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    status: 'in-progress',
  },
  {
    id: 'act-s-6',
    type: 'assignment',
    title: 'Weekly Math Practice Week 6',
    titleVi: 'Luyện tập Toán tuần 6',
    description: 'New assignment available',
    descriptionVi: 'Bài tập mới đã được giao',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    status: 'upcoming',
  },
];

/**
 * Helper function to get topic by ID
 */
export const getTopicById = (topicId: string): StudentTopicMastery | undefined => {
  return mockTopicMasteries.find((t) => t.topicId === topicId)
};

/**
 * Helper function to get evidence by topic
 */
export const getEvidenceByTopic = (topicId: string): EvidenceItem[] => {
  return mockEvidenceItems.filter((e) => e.topicId === topicId)
};

/**
 * Helper function to get assignment by ID
 */
export const getAssignmentById = (assignmentId: string): StudentAssignment | undefined => {
  return mockStudentAssignments.find((a) => a.id === assignmentId)
};

/**
 * Helper function to get exam by ID
 */
export const getExamById = (examId: string): StudentExam | undefined => {
  return mockStudentExams.find((e) => e.id === examId)
};

/**
 * Helper function to get result by ID
 */
export const getResultById = (resultId: string): ExamResult | undefined => {
  return mockExamResults.find((r) => r.id === resultId)
};
