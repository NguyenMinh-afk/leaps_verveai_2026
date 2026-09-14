// ============================================
// VERVE AI - Create Question Page
// ============================================

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
} from '@/components/layout'
import {
  Card,
  Button,
  Badge,
  Input,
} from '@/components/ui'
import { questionService } from '@/services/question'
import type {
  CreateQuestionInput,
  QuestionType,
  QuestionDifficulty,
  QuestionValidationError,
} from '@/services/question'
import { validateQuestionInput } from '@/services/question'
import type { UserRole, BreadcrumbItem } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'

/**
 * Question type options
 */
const questionTypes: { value: QuestionType; label: string; labelVi: string; description: string }[] = [
  {
    value: 'multiple-choice',
    label: 'Multiple Choice',
    labelVi: 'Trắc nghiệm',
    description: 'Câu hỏi với nhiều lựa chọn',
  },
  {
    value: 'true-false',
    label: 'True/False',
    labelVi: 'Đúng/Sai',
    description: 'Câu hỏi đúng hoặc sai',
  },
  {
    value: 'short-answer',
    label: 'Short Answer',
    labelVi: 'Tự luận',
    description: 'Câu hỏi trả lời ngắn',
  },
]

/**
 * Difficulty options
 */
const difficultyOptions: { value: QuestionDifficulty; label: string; labelVi: string; color: string }[] = [
  { value: 'easy', label: 'Easy', labelVi: 'Dễ', color: 'text-success-600' },
  { value: 'medium', label: 'Medium', labelVi: 'Trung bình', color: 'text-amber-600' },
  { value: 'hard', label: 'Hard', labelVi: 'Khó', color: 'text-error-600' },
]

/**
 * Create Question Page
 */
export default function CreateQuestionPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('teacher')

  // User display object with fallback for null user
  const userDisplay = {
    name: user?.name || 'Teacher',
    email: user?.email || '',
    role: 'teacher' as UserRole,
  }

  // Form state
  const [content, setContent] = React.useState('')
  const [contentVi, setContentVi] = React.useState('')
  const [questionType, setQuestionType] = React.useState<QuestionType>('multiple-choice')
  const [difficulty, setDifficulty] = React.useState<QuestionDifficulty>('medium')
  const [explanation, setExplanation] = React.useState('')
  const [explanationVi, setExplanationVi] = React.useState('')
  const [topicName, setTopicName] = React.useState('')
  const [topicNameVi, setTopicNameVi] = React.useState('')

  // Options for multiple choice
  const [options, setOptions] = React.useState<{ id: string; content: string; contentVi: string }[]>([
    { id: '1', content: '', contentVi: '' },
    { id: '2', content: '', contentVi: '' },
    { id: '3', content: '', contentVi: '' },
    { id: '4', content: '', contentVi: '' },
  ])
  const [correctOptionIndex, setCorrectOptionIndex] = React.useState<number>(0)

  // Short answer
  const [correctAnswer, setCorrectAnswer] = React.useState('')

  // True/False
  const [trueFalseAnswer, setTrueFalseAnswer] = React.useState<boolean | undefined>(undefined)

  // UI state
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<QuestionValidationError[]>([])
  const [submitSuccess, setSubmitSuccess] = React.useState(false)

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: t('questions.questionBank') || 'Ngân hàng câu hỏi', labelVi: t('questions.questionBank') || 'Ngân hàng câu hỏi', href: '/teacher/questions' },
    { label: t('questions.create') || 'Tạo câu hỏi', labelVi: t('questions.create') || 'Tạo câu hỏi' },
  ]

  const handleRoleChange = (newRole: UserRole) => {
    router.push('/')
  }

  const handleSignOut = () => {
    router.push('/')
  }

  const handleSettings = () => {
    // Navigate to settings
  }

  /**
   * Add option for multiple choice
   */
  const addOption = () => {
    if (options.length < 6) {
      setOptions([
        ...options,
        { id: String(Date.now()), content: '', contentVi: '' },
      ])
    }
  }

  /**
   * Remove option
   */
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
      if (correctOptionIndex >= newOptions.length) {
        setCorrectOptionIndex(newOptions.length - 1)
      }
    }
  }

  /**
   * Update option content
   */
  const updateOption = (index: number, field: 'content' | 'contentVi', value: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setOptions(newOptions)
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    const input: CreateQuestionInput = {
      content,
      contentVi: contentVi || content,
      type: questionType,
      difficulty,
      explanation,
      explanationVi: explanationVi || explanation,
      topicName,
      topicNameVi: topicNameVi || topicName,
    }

    if (questionType === 'multiple-choice') {
      input.options = options.map((opt) => ({
        content: opt.content,
        contentVi: opt.contentVi || opt.content,
      }))
      input.correctOptionIndex = correctOptionIndex
    } else if (questionType === 'true-false') {
      input.correctAnswer = trueFalseAnswer ? 'true' : 'false'
    } else {
      input.correctAnswer = correctAnswer
    }

    const validationErrors = validateQuestionInput(input)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors([])
    setIsSubmitting(true)

    try {
      const result = await questionService.createQuestion(input)

      if (result.success) {
        setSubmitSuccess(true)
        setTimeout(() => {
          router.push('/teacher/questions')
        }, 1500)
      } else {
        setErrors([{ field: 'general', message: result.error || (t('errors.genericError') || 'Đã xảy ra lỗi') }])
      }
    } catch (error) {
      setErrors([{ field: 'general', message: t('questions.createError') || 'Đã xảy ra lỗi khi tạo câu hỏi' }])
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    router.push('/teacher/questions')
  }

  const getFieldError = (field: string) => {
    return errors.find((e) => e.field === field)?.message
  }

  return (
    <DashboardLayoutWrapper
      user={userDisplay}
      breadcrumbs={breadcrumbs}
      onRoleChange={handleRoleChange}
      onSignOut={handleSignOut}
      onSettings={handleSettings}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Create Question"
          titleVi={t('questions.create') || 'Tạo Câu hỏi'}
          description="Create a new question for your assessments"
          descriptionVi={t('questions.createDescription') || 'Tạo câu hỏi mới cho bài kiểm tra của bạn'}
          actions={
            <Button variant="outline" onClick={handleCancel}>
              {t('common.cancel') || 'Hủy'}
            </Button>
          }
        />

        {/* Success Message */}
        {submitSuccess && (
          <Card variant="default" padding="md" className="border-l-4 border-success-500 bg-success-50 dark:bg-success-900/20">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-success-700 dark:text-success-300 font-medium">
                {t('questions.createdSuccess') || 'Câu hỏi đã được tạo thành công! Đang chuyển hướng...'}
              </p>
            </div>
          </Card>
        )}

        {/* General Error */}
        {getFieldError('general') && (
          <Card variant="default" padding="md" className="border-l-4 border-error-500 bg-error-50 dark:bg-error-900/20">
            <p className="text-error-700 dark:text-error-300">{getFieldError('general')}</p>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Content */}
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Nội dung câu hỏi
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Câu hỏi (Tiếng Việt) <span className="text-error-500">*</span>
                </label>
                <textarea
                  value={contentVi}
                  onChange={(e) => setContentVi(e.target.value)}
                  placeholder="Nhập nội dung câu hỏi..."
                  rows={4}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                {getFieldError('content') && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{getFieldError('content')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Câu hỏi (English)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter question content (optional)..."
                  rows={3}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </Card>

          {/* Question Type & Difficulty */}
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Loại câu hỏi & Độ khó
            </h3>

            <div className="space-y-6">
              {/* Question Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Loại câu hỏi <span className="text-error-500">*</span>
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {questionTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setQuestionType(type.value)}
                      className={cn(
                        'flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all',
                        questionType === type.value
                          ? 'border-verve-600 bg-verve-50 dark:border-verve-500 dark:bg-verve-900/30'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                      )}
                    >
                      <span className={cn(
                        'font-medium',
                        questionType === type.value ? 'text-verve-700 dark:text-verve-300' : 'text-slate-900 dark:text-slate-100'
                      )}>
                        {type.labelVi}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">{type.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Độ khó <span className="text-error-500">*</span>
                </label>
                <div className="flex gap-3">
                  {difficultyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDifficulty(option.value)}
                      className={cn(
                        'flex-1 rounded-lg border-2 py-3 text-center font-medium transition-all',
                        difficulty === option.value
                          ? 'border-verve-600 bg-verve-50 dark:border-verve-500 dark:bg-verve-900/30'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                      )}
                    >
                      <span className={difficulty === option.value ? 'text-verve-700 dark:text-verve-300' : 'text-slate-700 dark:text-slate-300'}>
                        {option.labelVi}
                      </span>
                    </button>
                  ))}
                </div>
                {getFieldError('difficulty') && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{getFieldError('difficulty')}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Answer Options */}
          {questionType === 'multiple-choice' && (
            <Card variant="default" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Các lựa chọn
                </h3>
                {options.length < 6 && (
                  <Button variant="outline" size="sm" onClick={addOption}>
                    + Thêm lựa chọn
                  </Button>
                )}
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Nhấp vào lựa chọn để đánh dấu là đáp án đúng
              </p>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div
                    key={option.id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all',
                      correctOptionIndex === index
                        ? 'border-success-500 bg-success-50 dark:bg-success-900/20'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                    )}
                    onClick={() => setCorrectOptionIndex(index)}
                  >
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all',
                      correctOptionIndex === index
                        ? 'bg-success-500 text-white'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    )}>
                      {String.fromCharCode(65 + index)}
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        value={option.contentVi}
                        onChange={(e) => updateOption(index, 'contentVi', e.target.value)}
                        placeholder={`Lựa chọn ${index + 1} (Tiếng Việt)`}
                        className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {correctOptionIndex === index && (
                      <Badge variant="success" size="sm">Đáp án đúng</Badge>
                    )}

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeOption(index)
                        }}
                        className="p-1 text-slate-400 hover:text-error-600 dark:hover:text-error-400"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {getFieldError('options') && (
                <p className="mt-2 text-sm text-error-600 dark:text-error-400">{getFieldError('options')}</p>
              )}
              {getFieldError('correctOptionIndex') && (
                <p className="mt-2 text-sm text-error-600 dark:text-error-400">{getFieldError('correctOptionIndex')}</p>
              )}
            </Card>
          )}

          {/* True/False */}
          {questionType === 'true-false' && (
            <Card variant="default" padding="lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Đáp án đúng
              </h3>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setTrueFalseAnswer(true)}
                  className={cn(
                    'flex-1 rounded-lg border-2 py-4 text-center font-medium transition-all',
                    trueFalseAnswer === true
                      ? 'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                  )}
                >
                  <span className="text-2xl mb-2 block">✓</span>
                  Đúng
                </button>
                <button
                  type="button"
                  onClick={() => setTrueFalseAnswer(false)}
                  className={cn(
                    'flex-1 rounded-lg border-2 py-4 text-center font-medium transition-all',
                    trueFalseAnswer === false
                      ? 'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                  )}
                >
                  <span className="text-2xl mb-2 block">✗</span>
                  Sai
                </button>
              </div>

              {getFieldError('correctAnswer') && (
                <p className="mt-2 text-sm text-error-600 dark:text-error-400">{getFieldError('correctAnswer')}</p>
              )}
            </Card>
          )}

          {/* Short Answer */}
          {questionType === 'short-answer' && (
            <Card variant="default" padding="lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Đáp án đúng
              </h3>

              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Nhập đáp án đúng..."
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
              />

              {getFieldError('correctAnswer') && (
                <p className="mt-2 text-sm text-error-600 dark:text-error-400">{getFieldError('correctAnswer')}</p>
              )}
            </Card>
          )}

          {/* Explanation */}
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Giải thích (tùy chọn)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Giải thích (Tiếng Việt)
                </label>
                <textarea
                  value={explanationVi}
                  onChange={(e) => setExplanationVi(e.target.value)}
                  placeholder="Giải thích đáp án..."
                  rows={3}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Explanation (English)
                </label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Enter explanation (optional)..."
                  rows={2}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </Card>

          {/* Topic */}
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Chủ đề (tùy chọn)
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Chủ đề (Tiếng Việt)
                </label>
                <Input
                  value={topicNameVi}
                  onChange={(e) => setTopicNameVi(e.target.value)}
                  placeholder="VD: Toán học, Ngữ văn..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Topic (English)
                </label>
                <Input
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="VD: Mathematics, Literature..."
                />
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              {t('common.cancel') || 'Hủy'}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting || submitSuccess}
            >
              {isSubmitting ? (t('common.creating') || 'Đang tạo...') : (t('questions.create') || 'Tạo câu hỏi')}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayoutWrapper>
  )
}
