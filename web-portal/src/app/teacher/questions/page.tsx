'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
  PageSection,
  EmptyState,
} from '@/components/layout'
import {
  Card,
  Button,
  Badge,
  Input,
} from '@/components/ui'
import { questionService } from '@/services/question'
import type { QuestionFiltersInput } from '@/services/question'
import { formatRelativeTime } from '@/lib/utils'
import type { UserRole, BreadcrumbItem, Question, QuestionFilters, QuestionOption } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'
import { AICreateQuestionModal } from '@/components/teacher/ai-create-question-modal'
import type { AIGenerationOptions } from '@/components/teacher/ai-create-question-modal'
import { aiGenerationService } from '@/services/aiGeneration'
import { useToast } from '@/components/ui/toast'
import { useAuth } from '@/lib/auth/AuthContext'

/**
 * Question Status Badge
 */
const QuestionStatusBadge: React.FC<{ status: Question['status'] }> = ({ status }) => {
  const { t } = useLanguage()
  const config: Record<Question['status'], { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
    draft: { label: t('common.draft') || 'Nháp', variant: 'default' },
    'pending-review': { label: t('questions.pending') || 'Chờ duyệt', variant: 'warning' },
    approved: { label: t('common.approved') || 'Đã duyệt', variant: 'success' },
    published: { label: t('common.published') || 'Đã xuất bản', variant: 'info' },
    rejected: { label: t('common.rejected') || 'Từ chối', variant: 'error' },
  }

  const { label, variant } = config[status]

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  )
}

/**
 * Difficulty Badge
 */
const DifficultyBadge: React.FC<{ difficulty: Question['difficulty'] }> = ({ difficulty }) => {
  const { t } = useLanguage()
  const config: Record<Question['difficulty'], { label: string; variant: 'success' | 'warning' | 'error' }> = {
    easy: { label: t('questions.easy') || 'Dễ', variant: 'success' },
    medium: { label: t('questions.medium') || 'Trung bình', variant: 'warning' },
    hard: { label: t('questions.hard') || 'Khó', variant: 'error' },
  }

  const { label, variant } = config[difficulty]

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  )
}

/**
 * Question Type Badge
 */
const QuestionTypeBadge: React.FC<{ type: Question['type'] }> = ({ type }) => {
  const { t } = useLanguage()
  const config: Record<Question['type'], { label: string; icon: string }> = {
    'multiple-choice': { label: t('questions.multipleChoice') || 'Trắc nghiệm', icon: 'A' },
    'true-false': { label: t('questions.trueFalse') || 'Đúng/Sai', icon: 'T/F' },
    'short-answer': { label: t('questions.shortAnswer') || 'Tự luận', icon: 'SA' },
  }

  const { label } = config[type]

  return (
    <Badge variant="outline" size="sm">
      {label}
    </Badge>
  )
}

/**
 * Source Badge (Teacher or AI)
 */
const SourceBadge: React.FC<{ source: Question['createdBy'] }> = ({ source }) => {
  const { t } = useLanguage()
  if (source === 'ai') {
    return (
      <Badge variant="info" size="sm">
        <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        AI
      </Badge>
    )
  }

  return (
    <Badge variant="default" size="sm">
      <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      {t('auth.teacher') || 'Giáo viên'}
    </Badge>
  )
}

/**
 * Question Row Component
 */
interface QuestionRowProps {
  question: Question
  onView: (question: Question) => void
  onEdit: (question: Question) => void
  onReview: (question: Question) => void
}

const QuestionRow: React.FC<QuestionRowProps> = ({ question, onView, onEdit, onReview }) => {
  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="px-4 py-3">
        <div className="max-w-md">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
            {question.contentVi || question.content}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {question.topicNameVi || question.topicName}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <QuestionTypeBadge type={question.type} />
      </td>
      <td className="px-4 py-3">
        <DifficultyBadge difficulty={question.difficulty} />
      </td>
      <td className="px-4 py-3">
        <SourceBadge source={question.createdBy} />
      </td>
      <td className="px-4 py-3">
        <QuestionStatusBadge status={question.status} />
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {formatRelativeTime(question.createdAt)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(question)}
          >
            Xem
          </Button>
          {question.status === 'pending-review' && question.createdBy === 'ai' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onReview(question)}
            >
              Duyệt
            </Button>
          )}
          {(question.status === 'draft' || question.status === 'rejected') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(question)}
            >
              Sửa
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
}

/**
 * Question Detail Modal
 */
interface QuestionDetailModalProps {
  question: Question | null
  isOpen: boolean
  onClose: () => void
  onReview: (question: Question) => void
  onEdit: (question: Question) => void
}

const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  question,
  isOpen,
  onClose,
  onReview,
  onEdit,
}) => {
  if (!isOpen || !question) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-xl bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Chi tiết câu hỏi
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              ID: {question.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Question Content */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Câu hỏi
              </h4>
              <p className="mt-2 text-slate-900 dark:text-slate-100">
                {question.contentVi || question.content}
              </p>
            </div>

            {/* Options (for multiple choice) */}
            {question.options.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Các lựa chọn
                </h4>
                <div className="mt-2 space-y-2">
                  {question.options.map((option: QuestionOption, index: number) => (
                    <div
                      key={option.id}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border p-3',
                        index === question.correctOptionIndex
                          ? 'border-success-300 bg-success-50 dark:border-success-700 dark:bg-success-900/20'
                          : 'border-slate-200 dark:border-slate-700'
                      )}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium dark:bg-slate-700">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className={cn(
                        'flex-1',
                        index === question.correctOptionIndex && 'font-medium text-success-700 dark:text-success-300'
                      )}>
                        {option.contentVi || option.content}
                      </span>
                      {index === question.correctOptionIndex && (
                        <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            {question.explanation && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Giải thích
                </h4>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  {question.explanationVi || question.explanation}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Chủ đề
                </h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {question.topicNameVi || question.topicName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Độ khó
                </h4>
                <div className="mt-1">
                  <DifficultyBadge difficulty={question.difficulty} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Loại câu hỏi
                </h4>
                <div className="mt-1">
                  <QuestionTypeBadge type={question.type} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nguồn
                </h4>
                <div className="mt-1">
                  <SourceBadge source={question.createdBy} />
                </div>
              </div>
            </div>

            {/* AI Source Reference */}
            {question.createdBy === 'ai' && question.source && (
              <div className="rounded-lg bg-info-50 p-4 dark:bg-info-900/20">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-info-600 dark:text-info-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-info-700 dark:text-info-300">
                      Nguồn AI
                    </h4>
                    <p className="mt-1 text-sm text-info-600 dark:text-info-400">
                      {question.source}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Review Info */}
            {question.reviewedBy && (
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Được duyệt bởi {question.reviewedBy} • {formatRelativeTime(question.reviewedAt!)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          {(question.status === 'draft' || question.status === 'rejected') && (
            <Button variant="primary" onClick={() => onEdit(question)}>
              Chỉnh sửa
            </Button>
          )}
          {question.status === 'pending-review' && question.createdBy === 'ai' && (
            <Button variant="primary" onClick={() => onReview(question)}>
              Duyệt câu hỏi
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Question Bank Page
 */
export default function QuestionBankPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [difficultyFilter, setDifficultyFilter] = React.useState<Question['difficulty'] | 'all'>('all')
  const [typeFilter, setTypeFilter] = React.useState<Question['type'] | 'all'>('all')
  const [statusFilter, setStatusFilter] = React.useState<Question['status'] | 'all'>('all')
  const [sourceFilter, setSourceFilter] = React.useState<Question['createdBy'] | 'all'>('all')
  const [selectedQuestion, setSelectedQuestion] = React.useState<Question | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isAICreateOpen, setIsAICreateOpen] = React.useState(false)
  const [questions, setQuestions] = React.useState<Question[]>([])
  const [currentRole] = React.useState<UserRole>('teacher')
  const [isLoading, setIsLoading] = React.useState(true)

  // User display object with fallback for null user
  const userDisplay = {
    name: user?.name || 'Teacher',
    email: user?.email || '',
    role: 'teacher' as UserRole,
  }
  const [error, setError] = React.useState<string | null>(null)
  const { success, error: showError } = useToast()

  // Load questions from API
  const loadQuestions = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const filters: QuestionFiltersInput = {
        search: searchQuery || undefined,
        difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: 1,
        limit: 100, // Get more for filtering on frontend
      }
      const response = await questionService.getQuestions(filters)
      setQuestions(response.questions)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải danh sách câu hỏi'
      setError(message)
      showError('Lỗi', message)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, difficultyFilter, typeFilter, statusFilter, showError])

  // Initial load and refresh
  React.useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  // Filter questions (client-side for remaining filters)
  const filteredQuestions = React.useMemo(() => {
    return questions.filter((question) => {
      // Source filter (not supported by backend, do client-side)
      if (sourceFilter !== 'all' && question.createdBy !== sourceFilter) {
        return false
      }
      return true
    })
  }, [questions, sourceFilter])

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: t('questions.questionBank') || 'Ngân hàng câu hỏi', labelVi: t('questions.questionBank') || 'Ngân hàng câu hỏi' },
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

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question)
    setIsModalOpen(true)
  }

  const handleEditQuestion = (question: Question) => {
    // Navigate to edit page
    router.push(`/teacher/questions/edit?id=${question.id}`)
  }

  const handleReviewQuestion = (question: Question) => {
    router.push(`/teacher/questions/review/${question.id}`)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedQuestion(null)
  }

  // Count pending questions
  const pendingCount = questions.filter(q => q.status === 'pending-review').length

  // Handle AI question generation
  const handleAIGenerate = async (options: AIGenerationOptions): Promise<Question[]> => {
    try {
      const generatedQuestions = await aiGenerationService.generateQuestions(options)
      
      // Refresh the questions list after generation
      await loadQuestions()
      
      // Show success message
      success(
        'Tạo câu hỏi thành công',
        `Đã tạo ${generatedQuestions.length} câu hỏi AI. Vui lòng xem xét và duyệt chúng.`
      )
      
      return generatedQuestions
    } catch (err) {
      showError('Lỗi', 'Không thể tạo câu hỏi. Vui lòng thử lại.')
      throw err
    }
  }

  return (
    <DashboardLayoutWrapper
      user={userDisplay}
      breadcrumbs={breadcrumbs}
      onRoleChange={handleRoleChange}
      onSignOut={handleSignOut}
      onSettings={handleSettings}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Question Bank"
          titleVi={t('questions.questionBank') || 'Ngân hàng Câu hỏi'}
          description="Manage and review questions for assessments"
          descriptionVi={t('questions.manageDescription') || 'Quản lý và xem xét câu hỏi cho bài kiểm tra'}
          actions={
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push('/teacher/questions/review')}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {pendingCount} {t('questions.pendingReview') || 'câu hỏi chờ duyệt'}
                </Button>
              )}
              <Button variant="outline" size="sm">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {t('questions.export') || 'Xuất'}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setIsAICreateOpen(true)}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('questions.createWithAI') || 'Tạo với AI'}
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push('/teacher/questions/create')}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t('questions.create') || 'Tạo câu hỏi'}
              </Button>
            </div>
          }
        />

        {/* Filters */}
        <Card variant="default" padding="md">
          <div className="flex flex-col gap-4 lg:items-center">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
              <Input
                placeholder={t('questions.searchPlaceholder') || 'Tìm kiếm câu hỏi...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />

              {/* Difficulty Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('questions.difficulty') || 'Độ khó'}:</span>
                <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                  {(['all', 'easy', 'medium', 'hard'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDifficultyFilter(value)}
                      className={cn(
                        'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                        difficultyFilter === value
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      )}
                    >
                      {value === 'all' ? (t('common.all') || 'Tất cả') : (value === 'easy' ? (t('questions.easy') || 'Dễ') : value === 'medium' ? (t('questions.medium') || 'Trung bình') : (t('questions.hard') || 'Khó'))}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('questions.type') || 'Loại'}:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as Question['type'] | 'all')}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
                >
                  <option value="all">{t('common.all') || 'Tất cả'}</option>
                  <option value="multiple-choice">{t('questions.multipleChoice') || 'Trắc nghiệm'}</option>
                  <option value="true-false">{t('questions.trueFalse') || 'Đúng/Sai'}</option>
                  <option value="short-answer">{t('questions.shortAnswer') || 'Tự luận'}</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('common.status') || 'Trạng thái'}:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Question['status'] | 'all')}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
                >
                  <option value="all">{t('common.all') || 'Tất cả'}</option>
                  <option value="draft">{t('common.draft') || 'Nháp'}</option>
                  <option value="pending-review">{t('questions.pending') || 'Chờ duyệt'}</option>
                  <option value="approved">{t('common.approved') || 'Đã duyệt'}</option>
                  <option value="published">{t('common.published') || 'Đã xuất bản'}</option>
                  <option value="rejected">{t('common.rejected') || 'Từ chối'}</option>
                </select>
              </div>

              {/* Source Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('questions.source') || 'Nguồn'}:</span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as Question['createdBy'] | 'all')}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
                >
                  <option value="all">{t('common.all') || 'Tất cả'}</option>
                  <option value="teacher">{t('auth.teacher') || 'Giáo viên'}</option>
                  <option value="ai">AI</option>
                </select>
              </div>

              <span className="text-sm text-slate-500 dark:text-slate-400">
                {filteredQuestions.length} {t('questions.title') || 'câu hỏi'}
              </span>
            </div>
          </div>
        </Card>

        {/* Question Table */}
        <Card variant="default" padding="none">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <svg className="h-8 w-8 animate-spin text-verve-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="ml-3 text-slate-500 dark:text-slate-400">Đang tải câu hỏi...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="rounded-full bg-error-100 p-3 dark:bg-error-900/30">
                <svg className="h-6 w-6 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="mt-3 text-error-600 dark:text-error-400">{error}</p>
              <Button variant="outline" size="sm" onClick={loadQuestions} className="mt-3">
                Thử lại
              </Button>
            </div>
          ) : filteredQuestions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('questions.questionText') || 'Câu hỏi'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('questions.type') || 'Loại'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('questions.difficulty') || 'Độ khó'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('questions.source') || 'Nguồn'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('common.status') || 'Trạng thái'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                      {t('common.createdAt') || 'Ngày tạo'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('common.actions') || 'Thao tác'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((question) => (
                    <QuestionRow
                      key={question.id}
                      question={question}
                      onView={handleViewQuestion}
                      onEdit={handleEditQuestion}
                      onReview={handleReviewQuestion}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <EmptyState
                title="No questions found"
                titleVi={t('questions.noQuestions') || 'Không tìm thấy câu hỏi nào'}
                description="Try adjusting your filters or search query"
                descriptionVi={t('questions.noQuestionsHint') || 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm'}
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setDifficultyFilter('all')
                      setTypeFilter('all')
                      setStatusFilter('all')
                      setSourceFilter('all')
                    }}
                  >
                    {t('common.clearFilters') || 'Xóa bộ lọc'}
                  </Button>
                }
              />
            </div>
          )}
        </Card>
      </div>

      {/* Question Detail Modal */}
      <QuestionDetailModal
        question={selectedQuestion}
        isOpen={isModalOpen}
        onClose={closeModal}
        onReview={handleReviewQuestion}
        onEdit={handleEditQuestion}
      />

      {/* AI Create Question Modal */}
      <AICreateQuestionModal
        isOpen={isAICreateOpen}
        onClose={() => setIsAICreateOpen(false)}
        onGenerate={handleAIGenerate}
      />
    </DashboardLayoutWrapper>
  )
}
