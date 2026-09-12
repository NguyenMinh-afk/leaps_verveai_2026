// ============================================
// VERVE AI - AI Diagnostic Mock Data
// ============================================
// Mock data for the 3-layer AI diagnostic UI
// Layer 1: Extraction (LLM)
// Layer 2: Decision (BKT + Root Cause + Abstention)
// Layer 3: Expression (Teacher explanation)

import type {
  Diagnosis,
  DiagnosisEvidence,
  DiagnosticInterventionGroup,
  TeacherOverride,
  TeacherExplanation,
  DiagnosisStatus,
  NonKnowledgeCause,
  AbstentionReason,
  ConfidenceLevel,
  StudentDiagnosisSummary,
} from '@/types';

/**
 * Helper to get confidence level
 */
function getConfLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.4) return 'medium';
  return 'low';
}

// ============================================
// EVIDENCE ITEMS
// ============================================

export const mockDiagnosisEvidence: DiagnosisEvidence[] = [
  // Evidence for student-3 "Multiplication" diagnosis
  {
    id: 'ev-1',
    itemId: 'item-101',
    itemContent: 'What is 7 × 8?',
    itemContentVi: '7 nhân 8 bằng bao nhiêu?',
    studentResponse: '54',
    correct: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    contextMode: 'in-class',
    latencyMs: 12000,
    skillId: 'skill-mult',
    skillName: 'Multiplication',
    skillNameVi: 'Phép nhân',
    confidenceWeight: 0.95,
    selectedDistractor: 'Near-miss (56 → 54)',
    extractionStatus: 'completed',
    extractionConfidence: 0.92,
  },
  {
    id: 'ev-2',
    itemId: 'item-102',
    itemContent: 'What is 9 × 6?',
    itemContentVi: '9 nhân 6 bằng bao nhiêu?',
    studentResponse: '54',
    correct: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
    contextMode: 'in-class',
    latencyMs: 8500,
    skillId: 'skill-mult',
    skillName: 'Multiplication',
    skillNameVi: 'Phép nhân',
    confidenceWeight: 0.92,
    selectedDistractor: 'Near-miss (54 → 54)',
    extractionStatus: 'completed',
    extractionConfidence: 0.88,
  },
  {
    id: 'ev-3',
    itemId: 'item-103',
    itemContent: 'What is 6 × 7?',
    itemContentVi: '6 nhân 7 bằng bao nhiêu?',
    studentResponse: '42',
    correct: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
    contextMode: 'in-class',
    latencyMs: 15200,
    skillId: 'skill-mult',
    skillName: 'Multiplication',
    skillNameVi: 'Phép nhân',
    confidenceWeight: 0.90,
    selectedDistractor: 'Near-miss (42 → 42)',
    extractionStatus: 'completed',
    extractionConfidence: 0.85,
  },
  {
    id: 'ev-4',
    itemId: 'item-104',
    itemContent: 'What is 8 × 4?',
    itemContentVi: '8 nhân 4 bằng bao nhiêu?',
    studentResponse: '32',
    correct: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    contextMode: 'out-of-class',
    latencyMs: 22000,
    skillId: 'skill-mult',
    skillName: 'Multiplication',
    skillNameVi: 'Phép nhân',
    confidenceWeight: 0.70,
    extractionStatus: 'completed',
    extractionConfidence: 0.78,
  },
  // Evidence for student-3 "Subtraction Borrowing" diagnosis
  {
    id: 'ev-5',
    itemId: 'item-201',
    itemContent: 'Calculate: 52 - 27 = ?',
    itemContentVi: 'Tính: 52 - 27 = ?',
    studentResponse: '33',
    correct: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
    contextMode: 'in-class',
    latencyMs: 45000,
    skillId: 'skill-sub-borrow',
    skillName: 'Subtraction with Borrowing',
    skillNameVi: 'Phép trừ có mượn',
    confidenceWeight: 0.88,
    selectedDistractor: 'Forgot to borrow from tens place',
    extractionStatus: 'completed',
    extractionConfidence: 0.91,
  },
  {
    id: 'ev-6',
    itemId: 'item-202',
    itemContent: 'Calculate: 83 - 45 = ?',
    itemContentVi: 'Tính: 83 - 45 = ?',
    studentResponse: '38',
    correct: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 19),
    contextMode: 'in-class',
    latencyMs: 38000,
    skillId: 'skill-sub-borrow',
    skillName: 'Subtraction with Borrowing',
    skillNameVi: 'Phép trừ có mượn',
    confidenceWeight: 0.85,
    selectedDistractor: 'Borrowing error in tens place',
    extractionStatus: 'completed',
    extractionConfidence: 0.89,
  },
  // Evidence with non-knowledge cause (carelessness)
  {
    id: 'ev-7',
    itemId: 'item-301',
    itemContent: 'What is 5 × 9?',
    itemContentVi: '5 nhân 9 bằng bao nhiêu?',
    studentResponse: '54',
    correct: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    contextMode: 'in-class',
    latencyMs: 3000, // Very fast - suggests careless error
    skillId: 'skill-mult',
    skillName: 'Multiplication',
    skillNameVi: 'Phép nhân',
    confidenceWeight: 0.40, // Low weight due to speed
    nonKnowledgeCause: 'carelessness',
    extractionStatus: 'completed',
    extractionConfidence: 0.95,
  },
  // Evidence with abstention (insufficient evidence)
  {
    id: 'ev-8',
    itemId: 'item-401',
    itemContent: 'What is 234 + 567?',
    itemContentVi: 'Tính: 234 + 567 = ?',
    studentResponse: '801',
    correct: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96),
    contextMode: 'out-of-class',
    latencyMs: 180000,
    skillId: 'skill-add',
    skillName: 'Addition',
    skillNameVi: 'Phép cộng',
    confidenceWeight: 0.65,
    extractionStatus: 'completed',
    extractionConfidence: 0.72,
  },
];

// ============================================
// TEACHER EXPLANATIONS (Layer 3)
// ============================================

const explanationMultiplication: TeacherExplanation = {
  summary: 'Học sinh chưa thuộc bảng cửu chương 6, 7, 8, 9. Cần ôn luyện ghi nhớ.',
  summaryVi: 'Học sinh chưa thuộc bảng cửu chương 6, 7, 8, 9. Cần ôn luyện ghi nhớ.',
  reasoning: 'Based on the evidence chain, the student consistently struggles with multiplication facts for numbers 6-9. The pattern shows near-miss errors (56→54, 54→54, 42→42), suggesting the student has the general multiplication concept but lacks automatic recall of specific facts.',
  reasoningVi: 'Dựa trên chuỗi bằng chứng, học sinh liên tục gặp khó khăn với bảng nhân 6, 7, 8, 9. Mô hình lỗi gần đúng (56→54, 54→54, 42→42) cho thấy học sinh có khái niệm nhân chung nhưng thiếu khả năng nhớ tự động.',
  affectedSkills: ['Multiplication facts (6-9)', 'Mental math speed'],
  recommendedActions: [
    'Use multiplication flashcards for daily practice',
    'Play multiplication games to increase engagement',
    'Start with easier tables (2, 5, 10) before progressing',
  ],
  recommendedActionsVi: [
    'Sử dụng thẻ ghi nhớ cửu chương để luyện tập hàng ngày',
    'Chơi trò chơi nhân để tăng sự hứng thú',
    'Bắt đầu với bảng dễ hơn (2, 5, 10) trước khi tiến bộ',
  ],
  evidenceHighlights: [
    '3 incorrect responses on 6-9 multiplication (high confidence)',
    '1 correct response on 8×4 (lower weight - out-of-class)',
    'Near-miss pattern suggests conceptual understanding but poor recall',
  ],
  generatedAt: new Date(),
  isFactChecked: true,
};

const explanationSubtractionBorrowing: TeacherExplanation = {
  summary: 'Học sinh hiểu khái niệm trừ nhưng nhầm lẫn quy trình mượn. Cần thực hành có hướng dẫn.',
  summaryVi: 'Học sinh hiểu khái niệm trừ nhưng nhầm lẫn quy trình mượn. Cần thực hành có hướng dẫn.',
  reasoning: 'The student demonstrates understanding of basic subtraction concepts but consistently makes errors in the borrowing process. The errors show a pattern of forgetting to adjust the minuend after borrowing, rather than misunderstanding the concept.',
  reasoningVi: 'Học sinh thể hiện sự hiểu biết về khái niệm trừ cơ bản nhưng liên tục mắc lỗi trong quy trình mượn. Các lỗi cho thấy mô hình quên điều chỉnh số bị trừ sau khi mượn, thay vì hiểu sai khái niệm.',
  affectedSkills: ['Subtraction with borrowing', 'Place value understanding', 'Mental arithmetic'],
  recommendedActions: [
    'Use base-ten blocks to visualize borrowing',
    'Practice with step-by-step guided problems',
    'Build a checklist for subtraction with borrowing',
  ],
  recommendedActionsVi: [
    'Sử dụng khối hình thập phân để trực quan hóa việc mượn',
    'Luyện tập với bài toán có hướng dẫn từng bước',
    'Xây dựng danh sách kiểm tra cho phép trừ có mượn',
  ],
  evidenceHighlights: [
    '2 incorrect responses on borrowing problems',
    'Error pattern: forgot to borrow from tens place',
    'High latency (38-45 seconds) suggests uncertainty',
  ],
  generatedAt: new Date(),
  isFactChecked: true,
};

const explanationAbstention: TeacherExplanation = {
  summary: 'Chưa đủ bằng chứng để kết luận. Cần thu thập thêm dữ liệu.',
  summaryVi: 'Chưa đủ bằng chứng để kết luận. Cần thu thập thêm dữ liệu.',
  reasoning: 'The system cannot reach a confident conclusion with the current evidence. Additional diagnostic items are needed to differentiate between potential root causes.',
  reasoningVi: 'Hệ thống không thể đưa ra kết luận chắc chắn với bằng chứng hiện tại. Cần thêm các mục chẩn đoán để phân biệt giữa các nguyên nhân gốc rễ tiềm năng.',
  affectedSkills: ['To be determined'],
  recommendedActions: [
    'Administer additional diagnostic assessment',
    'Observe student during class activities',
    'Review previous assessment history',
  ],
  recommendedActionsVi: [
    'Thực hiện đánh giá chẩn đoán bổ sung',
    'Quan sát học sinh trong hoạt động lớp học',
    'Xem xét lịch sử đánh giá trước đó',
  ],
  evidenceHighlights: [
    'Only 1 assessment item completed',
    'Confidence below threshold (0.35)',
    'High latency suggests student uncertainty',
  ],
  generatedAt: new Date(),
  isFactChecked: true,
};

// ============================================
// DIAGNOSES
// ============================================

export const mockDiagnoses: Diagnosis[] = [
  // Diagnosis for student-3 - Multiplication
  {
    id: 'diag-1',
    studentId: 'student-3',
    studentName: 'Lê Hoàng Nam',
    skillId: 'skill-mult',
    skillName: 'Multiplication',
    skillNameVi: 'Phép nhân',
    rootCause: 'Multiplication facts not memorized',
    rootCauseVi: 'Chưa thuộc bảng cửu chương',
    rootCauseCode: 'RC-MULT-001',
    confidence: 0.82,
    abstain: false,
    status: 'pending_review',
    evidenceIds: ['ev-1', 'ev-2', 'ev-3', 'ev-7'],
    evidenceItems: [mockDiagnosisEvidence[0], mockDiagnosisEvidence[1], mockDiagnosisEvidence[2], mockDiagnosisEvidence[6]],
    pKnown: 0.35,
    explanation: explanationMultiplication,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
  },
  // Diagnosis for student-3 - Subtraction Borrowing
  {
    id: 'diag-2',
    studentId: 'student-3',
    studentName: 'Lê Hoàng Nam',
    skillId: 'skill-sub-borrow',
    skillName: 'Subtraction with Borrowing',
    skillNameVi: 'Phép trừ có mượn',
    rootCause: 'Difficulty with subtraction borrowing',
    rootCauseVi: 'Khó khăn khi trừ có mượn',
    rootCauseCode: 'RC-SUB-001',
    confidence: 0.78,
    abstain: false,
    status: 'pending_review',
    evidenceIds: ['ev-5', 'ev-6'],
    evidenceItems: [mockDiagnosisEvidence[4], mockDiagnosisEvidence[5]],
    pKnown: 0.42,
    explanation: explanationSubtractionBorrowing,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 19),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 19),
  },
  // Diagnosis with abstention
  {
    id: 'diag-3',
    studentId: 'student-5',
    studentName: 'Hoàng Đức Anh',
    skillId: 'skill-add',
    skillName: 'Addition',
    skillNameVi: 'Phép cộng',
    rootCause: 'Unable to determine',
    rootCauseVi: 'Chưa xác định được',
    rootCauseCode: undefined,
    confidence: 0.35,
    abstain: true,
    abstainReason: 'insufficient_evidence',
    status: 'abstained',
    evidenceIds: ['ev-8'],
    evidenceItems: [mockDiagnosisEvidence[7]],
    pKnown: 0.62,
    explanation: explanationAbstention,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
  },
  // Diagnosis with teacher override (accepted)
  {
    id: 'diag-4',
    studentId: 'student-4',
    studentName: 'Phạm Thu Hà',
    skillId: 'skill-mult',
    skillName: 'Multiplication',
    skillNameVi: 'Phép nhân',
    rootCause: 'Multiplication facts not memorized',
    rootCauseVi: 'Chưa thuộc bảng cửu chương',
    rootCauseCode: 'RC-MULT-001',
    confidence: 0.65,
    abstain: false,
    status: 'accepted',
    evidenceIds: ['ev-1', 'ev-2'],
    evidenceItems: [mockDiagnosisEvidence[0], mockDiagnosisEvidence[1]],
    pKnown: 0.58,
    teacherOverride: {
      originalDiagnosis: 'Multiplication facts not memorized',
      originalDiagnosisVi: 'Chưa thuộc bảng cửu chương',
      originalConfidence: 0.65,
      newConclusion: 'Multiplication facts not memorized',
      newConclusionVi: 'Chưa thuộc bảng cửu chương',
      overrideType: 'accept',
      reason: 'correct_conclusion',
      reasonDetail: 'I agree with this assessment. I have also observed similar difficulties in class.',
      teacherId: 'teacher-1',
      teacherName: 'Giáo viên Demo',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  // Diagnosis with teacher override (adjusted)
  {
    id: 'diag-5',
    studentId: 'student-2',
    studentName: 'Trần Thị Lan',
    skillId: 'skill-sub-borrow',
    skillName: 'Subtraction with Borrowing',
    skillNameVi: 'Phép trừ có mượn',
    rootCause: 'Difficulty with subtraction borrowing',
    rootCauseVi: 'Khó khăn khi trừ có mượn',
    rootCauseCode: 'RC-SUB-001',
    confidence: 0.58,
    abstain: false,
    status: 'adjusted',
    evidenceIds: ['ev-5'],
    evidenceItems: [mockDiagnosisEvidence[4]],
    pKnown: 0.68,
    teacherOverride: {
      originalDiagnosis: 'Difficulty with subtraction borrowing',
      originalDiagnosisVi: 'Khó khăn khi trừ có mượn',
      originalConfidence: 0.58,
      newConclusion: 'Confusion between subtraction and borrowing process',
      newConclusionVi: 'Nhầm lẫn giữa phép trừ và quy trình mượn',
      overrideType: 'adjust',
      reason: 'missing_context',
      reasonDetail: 'This student actually understands borrowing when explained one-on-one. The issue seems more related to reading comprehension of the problem wording.',
      teacherId: 'teacher-1',
      teacherName: 'Giáo viên Demo',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

// ============================================
// DIAGNOSTIC INTERVENTION GROUPS
// ============================================

export const mockDiagnosticInterventions: DiagnosticInterventionGroup[] = [
  {
    id: 'dint-1',
    rootCause: 'Multiplication facts not memorized',
    rootCauseVi: 'Chưa thuộc bảng cửu chương',
    rootCauseCode: 'RC-MULT-001',
    studentIds: ['student-3', 'student-5'],
    students: [
      { id: 'student-3', name: 'Lê Hoàng Nam', code: 'ST003' },
      { id: 'student-5', name: 'Hoàng Đức Anh', code: 'ST005' },
    ],
    severity: 'high',
    size: 2,
    evidenceSummary: 'Students consistently make errors in multiplication problems for numbers 6-9',
    evidenceSummaryVi: 'Học sinh liên tục mắc lỗi trong các bài toán nhân với số 6-9',
    skills: ['Phép nhân', 'Bảng cửu chương', 'Tính nhẩm'],
    averageConfidence: 0.82,
    confidenceLevel: 'high',
    diagnoses: [mockDiagnoses[0], mockDiagnoses[3]],
    hasNonKnowledgeCases: true,
    nonKnowledgeCount: 1,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: 'dint-2',
    rootCause: 'Difficulty with subtraction borrowing',
    rootCauseVi: 'Khó khăn khi trừ có mượn',
    rootCauseCode: 'RC-SUB-001',
    studentIds: ['student-3', 'student-4', 'student-2'],
    students: [
      { id: 'student-3', name: 'Lê Hoàng Nam', code: 'ST003' },
      { id: 'student-4', name: 'Phạm Thu Hà', code: 'ST004' },
      { id: 'student-2', name: 'Trần Thị Lan', code: 'ST002' },
    ],
    severity: 'high',
    size: 3,
    evidenceSummary: 'Students struggle with borrowing in multi-digit subtraction',
    evidenceSummaryVi: 'Học sinh gặp khó khăn khi mượn trong phép trừ nhiều chữ số',
    skills: ['Phép trừ', 'Trừ có mượn', 'Giá trị vị trí'],
    averageConfidence: 0.68,
    confidenceLevel: 'medium',
    diagnoses: [mockDiagnoses[1], mockDiagnoses[4]],
    hasNonKnowledgeCases: false,
    status: 'in-progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: 'dint-3',
    rootCause: 'Basic addition fluency',
    rootCauseVi: 'Tốc độ cộng cơ bản',
    rootCauseCode: 'RC-ADD-001',
    studentIds: ['student-5'],
    students: [
      { id: 'student-5', name: 'Hoàng Đức Anh', code: 'ST005' },
    ],
    severity: 'medium',
    size: 1,
    evidenceSummary: 'Student needs more practice for automatic addition recall',
    evidenceSummaryVi: 'Học sinh cần luyện tập thêm để nhớ tự động phép cộng',
    skills: ['Phép cộng', 'Tính nhanh'],
    averageConfidence: 0.45,
    confidenceLevel: 'low',
    diagnoses: [mockDiagnoses[2]],
    hasNonKnowledgeCases: false,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
  },
];

// ============================================
// STUDENT DIAGNOSIS SUMMARIES
// ============================================

export const mockStudentDiagnoses: StudentDiagnosisSummary[] = [
  {
    studentId: 'student-3',
    studentName: 'Lê Hoàng Nam',
    studentCode: 'ST003',
    diagnoses: [mockDiagnoses[0], mockDiagnoses[1]],
    overallStatus: 'pending_review',
    highPriorityCount: 2,
    abstentionCount: 0,
    pendingReviewCount: 2,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 19),
  },
  {
    studentId: 'student-4',
    studentName: 'Phạm Thu Hà',
    studentCode: 'ST004',
    diagnoses: [mockDiagnoses[3]],
    overallStatus: 'accepted',
    highPriorityCount: 0,
    abstentionCount: 0,
    pendingReviewCount: 0,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    studentId: 'student-2',
    studentName: 'Trần Thị Lan',
    studentCode: 'ST002',
    diagnoses: [mockDiagnoses[4]],
    overallStatus: 'adjusted',
    highPriorityCount: 0,
    abstentionCount: 0,
    pendingReviewCount: 0,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    studentId: 'student-5',
    studentName: 'Hoàng Đức Anh',
    studentCode: 'ST005',
    diagnoses: [mockDiagnoses[2]],
    overallStatus: 'abstained',
    highPriorityCount: 0,
    abstentionCount: 1,
    pendingReviewCount: 0,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 96),
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get diagnoses for a specific student
 */
export function getDiagnosesByStudent(studentId: string): Diagnosis[] {
  return mockDiagnoses.filter(d => d.studentId === studentId);
}

/**
 * Get diagnostic intervention groups
 */
export function getDiagnosticInterventions(): DiagnosticInterventionGroup[] {
  return mockDiagnosticInterventions;
}

/**
 * Get evidence items by IDs
 */
export function getEvidenceByIds(evidenceIds: string[]): DiagnosisEvidence[] {
  return mockDiagnosisEvidence.filter(e => evidenceIds.includes(e.id));
}

/**
 * Get student diagnosis summary
 */
export function getStudentDiagnosisSummary(studentId: string): StudentDiagnosisSummary | undefined {
  return mockStudentDiagnoses.find(s => s.studentId === studentId);
}

/**
 * Get status display info
 */
export function getStatusDisplayInfo(status: DiagnosisStatus): { label: string; labelVi: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'; } {
  switch (status) {
    case 'system_conclusion':
      return { label: 'System', labelVi: 'Hệ thống', variant: 'info' };
    case 'pending_review':
      return { label: 'Pending', labelVi: 'Chờ duyệt', variant: 'warning' };
    case 'accepted':
      return { label: 'Accepted', labelVi: 'Đã chấp nhận', variant: 'success' };
    case 'adjusted':
      return { label: 'Adjusted', labelVi: 'Đã điều chỉnh', variant: 'primary' };
    case 'rejected':
      return { label: 'Rejected', labelVi: 'Đã từ chối', variant: 'error' };
    case 'abstained':
      return { label: 'Abstained', labelVi: 'Chưa đủ dữ liệu', variant: 'default' };
    default:
      return { label: 'Unknown', labelVi: 'Không xác định', variant: 'default' };
  }
}

/**
 * Get non-knowledge cause display info
 */
export function getNonKnowledgeDisplayInfo(cause: NonKnowledgeCause): { label: string; labelVi: string; variant: 'warning' | 'error' | 'info'; } {
  switch (cause) {
    case 'carelessness':
      return { label: 'Carelessness', labelVi: 'Bất cẩn', variant: 'warning' };
    case 'guessing':
      return { label: 'Guessing', labelVi: 'Đoán ngẫu nhiên', variant: 'warning' };
    case 'language_barrier':
      return { label: 'Language barrier', labelVi: 'Rào cản ngôn ngữ', variant: 'warning' };
    case 'test_anxiety':
      return { label: 'Test anxiety', labelVi: 'Lo lắng khi thi', variant: 'info' };
    default:
      return { label: 'Other', labelVi: 'Khác', variant: 'info' };
  }
}

/**
 * Get confidence color class
 */
export function getConfidenceColorClass(level: ConfidenceLevel): string {
  switch (level) {
    case 'high':
      return 'text-success-600 dark:text-success-400';
    case 'medium':
      return 'text-amber-600 dark:text-amber-400';
    case 'low':
      return 'text-error-600 dark:text-error-400';
    default:
      return 'text-slate-600 dark:text-slate-400';
  }
}
