// ============================================
// VERVE AI - AI Generation Service (Mock)
// ============================================

import type { Question, QuestionOption } from '@/types'
import type { AIGenerationOptions } from '@/components/teacher/ai-create-question-modal'

/**
 * Mock AI Generation Service
 * This is a mock implementation for development only
 * Replace with real AI API calls when ready
 */

const MOCK_DELAY = 2000 // 2 seconds delay for mock

/**
 * Generate unique ID
 */
function generateId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate option ID
 */
function generateOptionId(): string {
  return `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Sample Vietnamese question templates by topic
 */
const QUESTION_TEMPLATES = {
  't1': { // Phép cộng
    easy: [
      { contentVi: '5 + 3 = ?', content: '5 + 3 = ?', topicNameVi: 'Phép cộng' },
      { contentVi: '12 + 7 = ?', content: '12 + 7 = ?', topicNameVi: 'Phép cộng' },
      { contentVi: 'Hai số có tổng là 15, một số là 8. Số còn lại là bao nhiêu?', content: 'Two numbers have a sum of 15, one number is 8. What is the other number?', topicNameVi: 'Phép cộng' },
    ],
    medium: [
      { contentVi: '34 + 28 = ?', content: '34 + 28 = ?', topicNameVi: 'Phép cộng' },
      { contentVi: 'Tìm x: x + 15 = 42', content: 'Find x: x + 15 = 42', topicNameVi: 'Phép cộng' },
      { contentVi: 'Một cửa hàng buổi sáng bán được 125kg gạo, buổi chiều bán được 89kg. Hỏi cả ngày bán được bao nhiêu kg?', content: 'A store sold 125kg of rice in the morning and 89kg in the afternoon. How many kg were sold in total?', topicNameVi: 'Phép cộng' },
    ],
    hard: [
      { contentVi: '247 + 358 + 169 = ?', content: '247 + 358 + 169 = ?', topicNameVi: 'Phép cộng' },
      { contentVi: 'Tổng của ba số là 156. Số thứ nhất là 47, số thứ hai là 58. Tìm số thứ ba.', content: 'The sum of three numbers is 156. The first number is 47, the second is 58. Find the third number.', topicNameVi: 'Phép cộng' },
    ],
  },
  't2': { // Phép trừ
    easy: [
      { contentVi: '8 - 3 = ?', content: '8 - 3 = ?', topicNameVi: 'Phép trừ' },
      { contentVi: '15 - 6 = ?', content: '15 - 6 = ?', topicNameVi: 'Phép trừ' },
      { contentVi: 'Hai số có hiệu là 5, số lớn là 12. Số bé là bao nhiêu?', content: 'Two numbers have a difference of 5, the larger number is 12. What is the smaller number?', topicNameVi: 'Phép trừ' },
    ],
    medium: [
      { contentVi: '42 - 17 = ?', content: '42 - 17 = ?', topicNameVi: 'Phép trừ' },
      { contentVi: 'Tìm x: x - 23 = 45', content: 'Find x: x - 23 = 45', topicNameVi: 'Phép trừ' },
      { contentVi: 'Lan có 50 cái kẹo, Lan cho Mai 18 cái. Hỏi Lan còn lại bao nhiêu cái kẹo?', content: 'Lan has 50 candies, she gives Mai 18. How many candies does Lan have left?', topicNameVi: 'Phép trừ' },
    ],
    hard: [
      { contentVi: '234 - 156 = ?', content: '234 - 156 = ?', topicNameVi: 'Phép trừ' },
      { contentVi: 'Tìm x: 100 - x = 37', content: 'Find x: 100 - x = 37', topicNameVi: 'Phép trừ' },
      { contentVi: 'Một cửa hàng có 345kg đường, sau khi bán một số kg đường thì còn lại 128kg. Hỏi cửa hàng đã bán bao nhiêu kg đường?', content: 'A store has 345kg of sugar, after selling some they have 128kg left. How many kg were sold?', topicNameVi: 'Phép trừ' },
    ],
  },
  't3': { // Phép nhân
    easy: [
      { contentVi: '4 × 5 = ?', content: '4 × 5 = ?', topicNameVi: 'Phép nhân' },
      { contentVi: '7 × 3 = ?', content: '7 × 3 = ?', topicNameVi: 'Phép nhân' },
      { contentVi: 'Mỗi hộp có 6 cái bút. Hỏi 3 hộp có bao nhiêu cái bút?', content: 'Each box has 6 pens. How many pens are in 3 boxes?', topicNameVi: 'Phép nhân' },
    ],
    medium: [
      { contentVi: '12 × 8 = ?', content: '12 × 8 = ?', topicNameVi: 'Phép nhân' },
      { contentVi: 'Mỗi ngày Nam đọc được 15 trang sách. Hỏi trong 7 ngày, Nam đọc được bao nhiêu trang?', content: 'Nam reads 15 pages per day. How many pages does he read in 7 days?', topicNameVi: 'Phép nhân' },
      { contentVi: 'Tìm x: x × 6 = 72', content: 'Find x: x × 6 = 72', topicNameVi: 'Phép nhân' },
    ],
    hard: [
      { contentVi: '25 × 16 = ?', content: '25 × 16 = ?', topicNameVi: 'Phép nhân' },
      { contentVi: 'Một xe chở được 45 bao gạo, mỗi bao nặng 50kg. Hỏi xe đó chở được bao nhiêu kg gạo?', content: 'A truck carries 45 bags of rice, each bag weighs 50kg. How many kg does the truck carry?', topicNameVi: 'Phép nhân' },
      { contentVi: 'Tìm x: 14 × x = 364', content: 'Find x: 14 × x = 364', topicNameVi: 'Phép nhân' },
    ],
  },
  't4': { // Phép chia
    easy: [
      { contentVi: '12 ÷ 3 = ?', content: '12 ÷ 3 = ?', topicNameVi: 'Phép chia' },
      { contentVi: '20 ÷ 4 = ?', content: '20 ÷ 4 = ?', topicNameVi: 'Phép chia' },
      { contentVi: 'Có 15 cái kẹo chia đều cho 3 bạn. Hỏi mỗi bạn được bao nhiêu cái?', content: 'There are 15 candies to share equally among 3 friends. How many does each get?', topicNameVi: 'Phép chia' },
    ],
    medium: [
      { contentVi: '56 ÷ 7 = ?', content: '56 ÷ 7 = ?', topicNameVi: 'Phép chia' },
      { contentVi: 'Tìm x: x ÷ 5 = 8', content: 'Find x: x ÷ 5 = 8', topicNameVi: 'Phép chia' },
      { contentVi: 'Một công nhân làm được 48 sản phẩm trong 6 giờ. Hỏi mỗi giờ công nhân đó làm được bao nhiêu sản phẩm?', content: 'A worker makes 48 products in 6 hours. How many products per hour?', topicNameVi: 'Phép chia' },
    ],
    hard: [
      { contentVi: '156 ÷ 12 = ?', content: '156 ÷ 12 = ?', topicNameVi: 'Phép chia' },
      { contentVi: 'Một trường có 234 học sinh, xếp đều vào 6 lớp. Hỏi mỗi lớp có bao nhiêu học sinh?', content: 'A school has 234 students, divided equally into 6 classes. How many students per class?', topicNameVi: 'Phép chia' },
      { contentVi: 'Tìm x: 288 ÷ x = 12', content: 'Find x: 288 ÷ x = 12', topicNameVi: 'Phép chia' },
    ],
  },
  't5': { // Phân số
    easy: [
      { contentVi: 'Phân số nào lớn hơn: 1/2 hay 1/3?', content: 'Which fraction is greater: 1/2 or 1/3?', topicNameVi: 'Phân số' },
      { contentVi: 'Viết phân số chỉ phần đã tô màu khi chia hình thành 4 phần và tô 1 phần.', content: 'Write the fraction for the shaded part when dividing a shape into 4 parts and shading 1.', topicNameVi: 'Phân số' },
      { contentVi: 'So sánh: 2/4 và 1/2', content: 'Compare: 2/4 and 1/2', topicNameVi: 'Phân số' },
    ],
    medium: [
      { contentVi: 'Rút gọn phân số 6/9', content: 'Simplify the fraction 6/9', topicNameVi: 'Phân số' },
      { contentVi: 'Quy đồng mẫu số: 1/3 và 1/4', content: 'Find common denominator: 1/3 and 1/4', topicNameVi: 'Phân số' },
      { contentVi: '1/2 + 1/4 = ?', content: '1/2 + 1/4 = ?', topicNameVi: 'Phân số' },
    ],
    hard: [
      { contentVi: 'Tính: 2/3 + 3/4', content: 'Calculate: 2/3 + 3/4', topicNameVi: 'Phân số' },
      { contentVi: 'Tìm x: 3/5 + x = 1', content: 'Find x: 3/5 + x = 1', topicNameVi: 'Phân số' },
      { contentVi: 'Một hình chữ nhật có chiều dài 3/4 m, chiều rộng 1/2 m. Tính chu vi.', content: 'A rectangle has length 3/4 m and width 1/2 m. Calculate the perimeter.', topicNameVi: 'Phân số' },
    ],
  },
  'default': { // Default templates for any topic
    easy: [
      { contentVi: 'Đâu là đáp án đúng cho câu hỏi này?', content: 'What is the correct answer?', topicNameVi: 'Chủ đề chung' },
      { contentVi: 'Chọn phương án đúng nhất.', content: 'Choose the most correct option.', topicNameVi: 'Chủ đề chung' },
      { contentVi: 'Kết quả của phép tính là bao nhiêu?', content: 'What is the result of this calculation?', topicNameVi: 'Chủ đề chung' },
    ],
    medium: [
      { contentVi: 'Giải bài toán sau và chọn đáp án đúng.', content: 'Solve the following problem and choose the correct answer.', topicNameVi: 'Chủ đề chung' },
      { contentVi: 'Trong các phương án dưới đây, đâu là kết quả chính xác?', content: 'Among the options below, which is the correct result?', topicNameVi: 'Chủ đề chung' },
      { contentVi: 'Bài toán yêu cầu tính giá trị nào?', content: 'What value does the problem ask to calculate?', topicNameVi: 'Chủ đề chung' },
    ],
    hard: [
      { contentVi: 'Để giải bài toán này, cần thực hiện những bước nào?', content: 'What steps are needed to solve this problem?', topicNameVi: 'Chủ đề chung' },
      { contentVi: 'Phân tích và chọn đáp án phù hợp nhất.', content: 'Analyze and choose the most appropriate answer.', topicNameVi: 'Chủ đề chung' },
      { contentVi: 'Tính giá trị của biểu thức và chọn kết quả đúng.', content: 'Calculate the value of the expression and choose the correct result.', topicNameVi: 'Chủ đề chung' },
    ],
  },
}

/**
 * Sample options for questions
 */
const OPTION_TEMPLATES = [
  { correct: 'Đáp án đúng', wrong: ['Đáp án sai 1', 'Đáp án sai 2', 'Đáp án sai 3'] },
  { correct: 'A', wrong: ['B', 'C', 'D'] },
  { correct: 'Có', wrong: ['Không', 'Có thể', 'Không chắc chắn'] },
  { correct: 'Tăng', wrong: ['Giảm', 'Không đổi', 'Biến động'] },
]

/**
 * Generate mock AI questions
 */
export async function generateAIQuestions(options: AIGenerationOptions): Promise<Question[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))

  const questions: Question[] = []
  const topicId = options.topicId || 'default'
  const templates = QUESTION_TEMPLATES[topicId as keyof typeof QUESTION_TEMPLATES] || QUESTION_TEMPLATES['default']

  // Determine difficulty distribution if mixed
  const getDifficulty = (): 'easy' | 'medium' | 'hard' => {
    if (options.difficulty === 'mixed') {
      const rand = Math.random()
      if (rand < 0.33) return 'easy'
      if (rand < 0.66) return 'medium'
      return 'hard'
    }
    return options.difficulty as 'easy' | 'medium' | 'hard'
  }

  // Determine question type
  const getQuestionType = (): 'multiple-choice' | 'true-false' | 'short-answer' => {
    if (options.questionType === 'mixed') {
      const rand = Math.random()
      if (rand < 0.6) return 'multiple-choice'
      if (rand < 0.85) return 'true-false'
      return 'short-answer'
    }
    return options.questionType as 'multiple-choice' | 'true-false' | 'short-answer'
  }

  // Generate questions
  for (let i = 0; i < options.questionCount; i++) {
    const difficulty = getDifficulty()
    const questionType = getQuestionType()
    const templateSet = templates[difficulty]
    const template = templateSet[i % templateSet.length]

    // Create source text
    let sourceText = 'Generated by AI'
    if (options.mode === 'document' && options.files) {
      sourceText = `Tài liệu: ${options.files.map((f) => f.name).join(', ')}`
    } else if (options.topicId && options.topicNameVi) {
      sourceText = `Chủ đề: ${options.topicNameVi}`
    }

    const question: Question = {
      id: generateId(),
      content: template.content,
      contentVi: template.contentVi,
      topicId: options.topicId || topicId,
      topicName: template.topicNameVi || 'Chủ đề chung',
      topicNameVi: template.topicNameVi || 'Chủ đề chung',
      difficulty,
      type: questionType,
      status: 'pending-review',
      createdBy: 'ai',
      source: sourceText,
      createdAt: new Date(),
      updatedAt: new Date(),
      options: [],
      correctOptionIndex: 0,
      explanation: '',
      explanationVi: '',
    }

    // Add options for multiple-choice
    if (questionType === 'multiple-choice') {
      const optionTemplate = OPTION_TEMPLATES[Math.floor(Math.random() * OPTION_TEMPLATES.length)]
      const wrongCount = 3
      const correctIndex = Math.floor(Math.random() * (wrongCount + 1))

      const optionsArray: QuestionOption[] = []
      const wrongIndices = [0, 1, 2].filter((_, idx) => idx !== correctIndex)

      for (let j = 0; j <= wrongCount; j++) {
        if (j === correctIndex) {
          optionsArray.push({
            id: generateOptionId(),
            content: optionTemplate.correct,
            contentVi: optionTemplate.correct,
          })
        } else {
          const wrongIdx = wrongIndices.shift() ?? j
          optionsArray.push({
            id: generateOptionId(),
            content: optionTemplate.wrong[wrongIdx % optionTemplate.wrong.length],
            contentVi: optionTemplate.wrong[wrongIdx % optionTemplate.wrong.length],
          })
        }
      }

      question.options = optionsArray
      question.correctOptionIndex = correctIndex
      question.explanation = `The correct answer is ${String.fromCharCode(65 + correctIndex)}.`
      question.explanationVi = `Đáp án đúng là ${String.fromCharCode(65 + correctIndex)}.`
    }

    // Add true/false options
    if (questionType === 'true-false') {
      question.options = [
        { id: generateOptionId(), content: 'True', contentVi: 'Đúng' },
        { id: generateOptionId(), content: 'False', contentVi: 'Sai' },
      ]
      question.correctOptionIndex = Math.random() > 0.5 ? 0 : 1
      question.explanation = question.correctOptionIndex === 0
        ? 'Statement is true based on the given information.'
        : 'Statement is false based on the given information.'
      question.explanationVi = question.correctOptionIndex === 0
        ? 'Phát biểu đúng dựa trên thông tin đã cho.'
        : 'Phát biểu sai dựa trên thông tin đã cho.'
    }

    // Short answer
    if (questionType === 'short-answer') {
      question.correctAnswer = 'Answer will be determined by teacher'
      question.explanation = 'This is a short-answer question. Teacher will provide the answer key.'
      question.explanationVi = 'Đây là câu hỏi tự luận. Giáo viên sẽ cung cấp đáp án.'
    }

    questions.push(question)
  }

  return questions
}

/**
 * AI Generation Service
 */
export const aiGenerationService = {
  generateQuestions: generateAIQuestions,
}

export default aiGenerationService
