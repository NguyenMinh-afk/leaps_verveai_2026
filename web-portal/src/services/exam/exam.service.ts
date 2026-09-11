// ============================================
// VERVE AI - Exam Service Mock Implementation
// ============================================

import type { StudentExam, ExamResult, Question, QuestionOption } from '@/types'

/**
 * Development exam service
 * This is a mock implementation for development only
 */

// Exam questions data (mock questions for exam taking)
export interface ExamQuestion {
  id: string
  examId: string
  questionId: string
  question: Question
}

/**
 * Exam session state
 */
export interface ExamSession {
  examId: string
  exam: StudentExam
  questions: ExamQuestion[]
  answers: Record<string, number> // questionId -> selectedOptionIndex
  startedAt: Date
  timeLimit?: number // minutes
  isSubmitted: boolean
  submittedAt?: Date
}

/**
 * Mock questions for exams
 */
const mockExamQuestions: Record<string, ExamQuestion[]> = {
  'exam-s-1': [
    {
      id: 'eq-1-1',
      examId: 'exam-s-1',
      questionId: 'q-multi-1',
      question: {
        id: 'q-multi-1',
        content: 'What is 12 × 8?',
        contentVi: '12 nhân 8 bằng bao nhiêu?',
        options: [
          { id: 'opt-1', content: '86', contentVi: '86' },
          { id: 'opt-2', content: '96', contentVi: '96' },
          { id: 'opt-3', content: '106', contentVi: '106' },
          { id: 'opt-4', content: '98', contentVi: '98' },
        ],
        correctOptionIndex: 1,
        explanation: '12 × 8 = 96',
        explanationVi: '12 nhân 8 bằng 96',
        topicId: 't3',
        topicName: 'Multiplication',
        topicNameVi: 'Phép nhân',
        difficulty: 'easy',
        type: 'multiple-choice',
        status: 'published',
        createdBy: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: 'eq-1-2',
      examId: 'exam-s-1',
      questionId: 'q-multi-2',
      question: {
        id: 'q-multi-2',
        content: 'What is 7 × 9?',
        contentVi: '7 nhân 9 bằng bao nhiêu?',
        options: [
          { id: 'opt-1', content: '63', contentVi: '63' },
          { id: 'opt-2', content: '72', contentVi: '72' },
          { id: 'opt-3', content: '54', contentVi: '54' },
          { id: 'opt-4', content: '81', contentVi: '81' },
        ],
        correctOptionIndex: 0,
        explanation: '7 × 9 = 63',
        explanationVi: '7 nhân 9 bằng 63',
        topicId: 't3',
        topicName: 'Multiplication',
        topicNameVi: 'Phép nhân',
        difficulty: 'easy',
        type: 'multiple-choice',
        status: 'published',
        createdBy: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: 'eq-1-3',
      examId: 'exam-s-1',
      questionId: 'q-multi-3',
      question: {
        id: 'q-multi-3',
        content: 'What is 15 × 6?',
        contentVi: '15 nhân 6 bằng bao nhiêu?',
        options: [
          { id: 'opt-1', content: '80', contentVi: '80' },
          { id: 'opt-2', content: '90', contentVi: '90' },
          { id: 'opt-3', content: '85', contentVi: '85' },
          { id: 'opt-4', content: '95', contentVi: '95' },
        ],
        correctOptionIndex: 1,
        explanation: '15 × 6 = 90',
        explanationVi: '15 nhân 6 bằng 90',
        topicId: 't3',
        topicName: 'Multiplication',
        topicNameVi: 'Phép nhân',
        difficulty: 'medium',
        type: 'multiple-choice',
        status: 'published',
        createdBy: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: 'eq-1-4',
      examId: 'exam-s-1',
      questionId: 'q-multi-4',
      question: {
        id: 'q-multi-4',
        content: 'What is 24 × 5?',
        contentVi: '24 nhân 5 bằng bao nhiêu?',
        options: [
          { id: 'opt-1', content: '110', contentVi: '110' },
          { id: 'opt-2', content: '120', contentVi: '120' },
          { id: 'opt-3', content: '130', contentVi: '130' },
          { id: 'opt-4', content: '100', contentVi: '100' },
        ],
        correctOptionIndex: 1,
        explanation: '24 × 5 = 120',
        explanationVi: '24 nhân 5 bằng 120',
        topicId: 't3',
        topicName: 'Multiplication',
        topicNameVi: 'Phép nhân',
        difficulty: 'medium',
        type: 'multiple-choice',
        status: 'published',
        createdBy: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: 'eq-1-5',
      examId: 'exam-s-1',
      questionId: 'q-multi-5',
      question: {
        id: 'q-multi-5',
        content: 'If 8 × x = 64, what is x?',
        contentVi: 'Nếu 8 nhân x bằng 64, thì x là bao nhiêu?',
        options: [
          { id: 'opt-1', content: '7', contentVi: '7' },
          { id: 'opt-2', content: '8', contentVi: '8' },
          { id: 'opt-3', content: '9', contentVi: '9' },
          { id: 'opt-4', content: '6', contentVi: '6' },
        ],
        correctOptionIndex: 1,
        explanation: '8 × 8 = 64, so x = 8',
        explanationVi: '8 nhân 8 bằng 64, vậy x = 8',
        topicId: 't3',
        topicName: 'Multiplication',
        topicNameVi: 'Phép nhân',
        difficulty: 'medium',
        type: 'multiple-choice',
        status: 'published',
        createdBy: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ],
  'exam-s-2': [
    {
      id: 'eq-2-1',
      examId: 'exam-s-2',
      questionId: 'q-div-1',
      question: {
        id: 'q-div-1',
        content: 'What is 56 ÷ 7?',
        contentVi: '56 chia 7 bằng bao nhiêu?',
        options: [
          { id: 'opt-1', content: '7', contentVi: '7' },
          { id: 'opt-2', content: '8', contentVi: '8' },
          { id: 'opt-3', content: '6', contentVi: '6' },
          { id: 'opt-4', content: '9', contentVi: '9' },
        ],
        correctOptionIndex: 1,
        explanation: '56 ÷ 7 = 8',
        explanationVi: '56 chia 7 bằng 8',
        topicId: 't4',
        topicName: 'Division',
        topicNameVi: 'Phép chia',
        difficulty: 'easy',
        type: 'multiple-choice',
        status: 'published',
        createdBy: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: 'eq-2-2',
      examId: 'exam-s-2',
      questionId: 'q-div-2',
      question: {
        id: 'q-div-2',
        content: 'What is 81 ÷ 9?',
        contentVi: '81 chia 9 bằng bao nhiêu?',
        options: [
          { id: 'opt-1', content: '8', contentVi: '8' },
          { id: 'opt-2', content: '9', contentVi: '9' },
          { id: 'opt-3', content: '7', contentVi: '7' },
          { id: 'opt-4', content: '10', contentVi: '10' },
        ],
        correctOptionIndex: 1,
        explanation: '81 ÷ 9 = 9',
        explanationVi: '81 chia 9 bằng 9',
        topicId: 't4',
        topicName: 'Division',
        topicNameVi: 'Phép chia',
        difficulty: 'easy',
        type: 'multiple-choice',
        status: 'published',
        createdBy: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: 'eq-2-3',
      examId: 'exam-s-2',
      questionId: 'q-div-3',
      question: {
        id: 'q-div-3',
        content: 'What is 72 ÷ 8?',
        contentVi: '72 chia 8 bằng bao nhiêu?',
        options: [
          { id: 'opt-1', content: '8', contentVi: '8' },
          { id: 'opt-2', content: '9', contentVi: '9' },
          { id: 'opt-3', content: '7', contentVi: '7' },
          { id: 'opt-4', content: '10', contentVi: '10' },
        ],
        correctOptionIndex: 1,
        explanation: '72 ÷ 8 = 9',
        explanationVi: '72 chia 8 bằng 9',
        topicId: 't4',
        topicName: 'Division',
        topicNameVi: 'Phép chia',
        difficulty: 'easy',
        type: 'multiple-choice',
        status: 'published',
        createdBy: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ],
}

// Current active session (in-memory for development)
let activeSession: ExamSession | null = null

// Completed results storage (in-memory for development)
const completedResults: ExamResult[] = []

/**
 * Generate unique ID
 */
function generateId(): string {
  return `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get exam questions
 */
function getExamQuestions(examId: string): ExamQuestion[] {
  return mockExamQuestions[examId] || []
}

/**
 * Calculate exam result
 */
function calculateResult(session: ExamSession): { score: number; total: number; percentage: number; correct: number; incorrect: number; unanswered: number } {
  let correct = 0
  let incorrect = 0
  let unanswered = 0

  session.questions.forEach((eq) => {
    const selectedIndex = session.answers[eq.questionId]
    if (selectedIndex === undefined) {
      unanswered++
    } else if (selectedIndex === eq.question.correctOptionIndex) {
      correct++
    } else {
      incorrect++
    }
  })

  const total = session.questions.length
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

  return { score: correct, total, percentage, correct, incorrect, unanswered }
}

/**
 * Exam service
 */
export const examService = {
  /**
   * Start exam session
   */
  async startExam(examId: string, exam: StudentExam): Promise<{ success: boolean; session?: ExamSession; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const questions = getExamQuestions(examId)
      
      if (questions.length === 0) {
        // Generate mock questions if none exist
        const mockQuestions: ExamQuestion[] = []
        for (let i = 0; i < (exam.questionCount || 5); i++) {
          mockQuestions.push({
            id: `eq-${examId}-${i}`,
            examId,
            questionId: `q-${examId}-${i}`,
            question: {
              id: `q-${examId}-${i}`,
              content: `Question ${i + 1} for ${exam.titleVi}`,
              contentVi: `Câu hỏi ${i + 1} - ${exam.titleVi}`,
              options: [
                { id: `opt-${i}-0`, content: 'Option A', contentVi: 'Phương án A' },
                { id: `opt-${i}-1`, content: 'Option B', contentVi: 'Phương án B' },
                { id: `opt-${i}-2`, content: 'Option C', contentVi: 'Phương án C' },
                { id: `opt-${i}-3`, content: 'Option D', contentVi: 'Phương án D' },
              ],
              correctOptionIndex: i % 4,
              explanation: 'This is the correct answer.',
              explanationVi: 'Đây là đáp án đúng.',
              topicId: exam.topicId || 't1',
              topicName: exam.topicName || 'Topic',
              topicNameVi: exam.topicNameVi || 'Chủ đề',
              difficulty: 'medium',
              type: 'multiple-choice',
              status: 'published',
              createdBy: 'teacher',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        }
        activeSession = {
          examId,
          exam,
          questions: mockQuestions,
          answers: {},
          startedAt: new Date(),
          timeLimit: exam.durationMinutes,
          isSubmitted: false,
        }
      } else {
        activeSession = {
          examId,
          exam,
          questions,
          answers: {},
          startedAt: new Date(),
          timeLimit: exam.durationMinutes,
          isSubmitted: false,
        }
      }

      return { success: true, session: activeSession }
    } catch (error) {
      return { success: false, error: 'Không thể bắt đầu bài kiểm tra' }
    }
  },

  /**
   * Get current exam session
   */
  getSession(): ExamSession | null {
    return activeSession
  },

  /**
   * Select answer for a question
   */
  selectAnswer(questionId: string, optionIndex: number): void {
    if (activeSession && !activeSession.isSubmitted) {
      activeSession.answers[questionId] = optionIndex
    }
  },

  /**
   * Clear answer for a question
   */
  clearAnswer(questionId: string): void {
    if (activeSession && !activeSession.isSubmitted) {
      delete activeSession.answers[questionId]
    }
  },

  /**
   * Submit exam
   */
  async submitExam(): Promise<{ success: boolean; result?: ExamResult; error?: string }> {
    if (!activeSession) {
      return { success: false, error: 'Không có phiên làm bài' }
    }

    if (activeSession.isSubmitted) {
      return { success: false, error: 'Bài kiểm tra đã được nộp' }
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const { score, total, percentage, correct, incorrect, unanswered } = calculateResult(activeSession)
      
      activeSession.isSubmitted = true
      activeSession.submittedAt = new Date()

      const result: ExamResult = {
        id: generateId(),
        examId: activeSession.examId,
        examTitle: activeSession.exam.title,
        examTitleVi: activeSession.exam.titleVi,
        topicId: activeSession.exam.topicId,
        topicName: activeSession.exam.topicName,
        topicNameVi: activeSession.exam.topicNameVi,
        classId: activeSession.exam.classId,
        className: activeSession.exam.className,
        status: 'completed',
        score,
        maxScore: total,
        percentage,
        timeSpentMinutes: Math.round((Date.now() - activeSession.startedAt.getTime()) / 60000),
        completedAt: new Date(),
        masteryImpact: percentage >= 80 ? 0.05 : percentage >= 60 ? 0.02 : 0,
        strengths: correct > incorrect ? ['Multiple choice', 'Problem solving'] : [],
        strengthsVi: correct > incorrect ? ['Trắc nghiệm', 'Giải toán'] : [],
        areasForImprovement: incorrect > 0 ? ['Need more practice', 'Review concepts'] : [],
        areasForImprovementVi: incorrect > 0 ? ['Cần luyện thêm', 'Ôn lại kiến thức'] : [],
      }

      completedResults.push(result)

      return { success: true, result }
    } catch (error) {
      return { success: false, error: 'Không thể nộp bài kiểm tra' }
    }
  },

  /**
   * Get completed result
   */
  getCompletedResult(): ExamResult | null {
    const lastResult = completedResults[completedResults.length - 1]
    return lastResult || null
  },

  /**
   * Clear session
   */
  clearSession(): void {
    activeSession = null
  },
}

export default examService
