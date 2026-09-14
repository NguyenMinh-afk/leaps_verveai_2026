'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
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
import { useToast, ConfirmationDialog } from '@/components/ui/toast'
import { questionService } from '@/services/question'
import { formatRelativeTime } from '@/lib/utils'
import type { UserRole, BreadcrumbItem, Question, QuestionOption } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'
import { getReviewStats } from '@/lib/api/content'
import type { ReviewStats } from '@/lib/api/content'
import { useAuth } from '@/lib/auth/AuthContext'

/**
 * AI Question Review Card
 */
interface AIQuestionReviewCardProps {
  question: Question
  onApprove: (question: Question) => void
  onReject: (question: Question) => void
  onEdit: (question: Question) => void
}

const AIQuestionReviewCard: React.FC<AIQuestionReviewCardProps> = ({
  question,
  onApprove,
  onReject,
  onEdit,
}) => {
  return (
    <Card variant="default" padding="lg" className="border-l-4 border-l-info-500">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">
              <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              AI Generated
            </Badge>
            <Badge
              variant={
                question.difficulty === 'easy' ? 'success' :
                question.difficulty === 'medium' ? 'warning' : 'error'
              }
              size="sm"
            >
              {question.difficulty === 'easy' ? 'Dễ' :
               question.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
            </Badge>
            <Badge variant="outline" size="sm">
              {question.type === 'multiple-choice' ? 'Trắc nghiệm' :
               question.type === 'true-false' ? 'Đúng/Sai' : 'Tự luận'}
            </Badge>
          </div>
          <span className="text-xs text-slate-400">
            {formatRelativeTime(question.createdAt)}
          </span>
        </div>

        {/* Topic */}
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Chủ đề:</span>
          <span className="ml-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            {question.topicNameVi || question.topicName}
          </span>
        </div>

        {/* Question Content */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            {question.contentVi || question.content}
          </h3>
        </div>

        {/* Options */}
        {question.options.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Các lựa chọn:</p>
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
                  <Badge variant="success" size="sm">Đáp án đúng</Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Explanation */}
        {question.explanation && (
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Giải thích:
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {question.explanationVi || question.explanation}
            </p>
          </div>
        )}

        {/* Source Reference */}
        {question.source && (
          <div className="flex items-start gap-3 rounded-lg bg-info-50 p-4 dark:bg-info-900/20">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-info-600 dark:text-info-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-info-700 dark:text-info-300">
                Nguồn tham khảo
              </p>
              <p className="mt-1 text-sm text-info-600 dark:text-info-400">
                {question.source}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
          <Button variant="ghost" size="sm" onClick={() => onEdit(question)}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Chỉnh sửa
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={() => onReject(question)}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Từ chối
            </Button>
            <Button variant="success" size="sm" onClick={() => onApprove(question)}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Phê duyệt
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * AI Question Review Page
 */
export default function AIQuestionReviewPage() {
  const router = useRouter()
  const params = useParams()
  const questionId = params.id as string | undefined
  const { t } = useLanguage()
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('teacher')

  // User display object with fallback for null user
  const userDisplay = {
    name: user?.name || 'Teacher',
    email: user?.email || '',
    role: 'teacher' as UserRole,
  }

  // State for questions
  const [questions, setQuestions] = React.useState<Question[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Review statistics state
  const [reviewStats, setReviewStats] = React.useState<ReviewStats | null>(null)
  const [isStatsLoading, setIsStatsLoading] = React.useState(false)

  // Load questions from API
  const loadQuestions = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await questionService.getQuestions({
        status: 'pending-review',
        limit: 100,
      })
      setQuestions(response.questions)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải câu hỏi'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load review statistics from backend API
  const loadReviewStats = React.useCallback(async () => {
    setIsStatsLoading(true)
    try {
      const stats = await getReviewStats()
      setReviewStats(stats)
    } catch (err) {
      console.error('Failed to load review stats:', err)
    } finally {
      setIsStatsLoading(false)
    }
  }, [])

  // Initial load
  React.useEffect(() => {
    loadQuestions()
    loadReviewStats()
  }, [loadQuestions, loadReviewStats])

  // Get single question if ID is provided
  const singleQuestion = questionId
    ? questions.find((q) => q.id === questionId)
    : null

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: t('questions.questionBank') || 'Ngân hàng câu hỏi', labelVi: t('questions.questionBank') || 'Ngân hàng câu hỏi', href: '/teacher/questions' },
    { label: t('questions.review') || 'Duyệt câu hỏi AI', labelVi: t('questions.review') || 'Duyệt câu hỏi AI' },
  ]

  const { success, error: showError } = useToast()
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    variant: 'danger' | 'warning' | 'default'
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'default' })
  const [rejectReason, setRejectReason] = React.useState('')

  const handleRoleChange = (newRole: UserRole) => {
    router.push('/')
  }

  const handleSignOut = () => {
    router.push('/')
  }

  const handleSettings = () => {
    // Navigate to settings
  }

  const handleApprove = async (question: Question) => {
    setConfirmDialog({
      isOpen: true,
      title: t('questions.approve') || 'Phê duyệt câu hỏi',
      message: `${t('questions.approveConfirm') || 'Bạn có chắc muốn phê duyệt câu hỏi này?'}\n\n"${question.contentVi || question.content}"`,
      variant: 'default',
      onConfirm: async () => {
        try {
          const result = await questionService.approveQuestion(question.id, 'Approved')
          if (result.success) {
            success(t('common.success') || 'Thành công', `${t('questions.approvedSuccess') || 'Đã phê duyệt câu hỏi'}: ${question.contentVi || question.content}`)
            setConfirmDialog(prev => ({ ...prev, isOpen: false }))
            // Refresh questions
            await loadQuestions()
            router.push('/teacher/questions')
          } else {
            showError('Lỗi', result.error || 'Không thể phê duyệt câu hỏi')
            setConfirmDialog(prev => ({ ...prev, isOpen: false }))
          }
        } catch (err) {
          showError('Lỗi', 'Không thể phê duyệt câu hỏi')
          setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        }
      },
    })
  }

  const handleReject = (question: Question) => {
    setRejectReason('')
    setConfirmDialog({
      isOpen: true,
      title: t('questions.reject') || 'Từ chối câu hỏi',
      message: `${t('questions.rejectConfirm') || 'Bạn có chắc muốn từ chối câu hỏi này?'}\n\n"${question.contentVi || question.content}"\n\nLý do từ chối:`,
      variant: 'danger',
      onConfirm: async () => {
        if (!rejectReason.trim() || rejectReason.length < 5) {
          showError('Lỗi', 'Vui lòng nhập lý do từ chối (ít nhất 5 ký tự)')
          return
        }
        try {
          const result = await questionService.rejectQuestion(question.id, rejectReason)
          if (result.success) {
            success(t('common.success') || 'Thành công', `${t('questions.rejectedSuccess') || 'Đã từ chối câu hỏi'}: ${question.contentVi || question.content}`)
            setConfirmDialog(prev => ({ ...prev, isOpen: false }))
            // Refresh questions
            await loadQuestions()
            router.push('/teacher/questions')
          } else {
            showError('Lỗi', result.error || 'Không thể từ chối câu hỏi')
            setConfirmDialog(prev => ({ ...prev, isOpen: false }))
          }
        } catch (err) {
          showError('Lỗi', 'Không thể từ chối câu hỏi')
          setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        }
      },
    })
  }

  const handleEdit = (question: Question) => {
    router.push(`/teacher/questions/edit?id=${question.id}`)
  }

  // Filter to only show AI generated questions pending review
  const pendingQuestions = questions.filter(
    (q) => q.status === 'pending-review'
  )

  // Show single question view if ID is provided
  if (questionId) {
    if (isLoading) {
      return (
        <DashboardLayoutWrapper
          user={userDisplay}
          breadcrumbs={breadcrumbs}
          onRoleChange={handleRoleChange}
          onSignOut={handleSignOut}
          onSettings={handleSettings}
        >
          <div className="flex items-center justify-center p-8">
            <svg className="h-8 w-8 animate-spin text-verve-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="ml-3 text-slate-500 dark:text-slate-400">Đang tải...</span>
          </div>
        </DashboardLayoutWrapper>
      )
    }

    if (!singleQuestion) {
      return (
        <DashboardLayoutWrapper
          user={userDisplay}
          breadcrumbs={breadcrumbs}
          onRoleChange={handleRoleChange}
          onSignOut={handleSignOut}
          onSettings={handleSettings}
        >
          <div className="text-center p-8">
            <p className="text-slate-600 dark:text-slate-400">Không tìm thấy câu hỏi</p>
            <Button variant="primary" onClick={() => router.push('/teacher/questions')} className="mt-4">
              Quay lại danh sách
            </Button>
          </div>
        </DashboardLayoutWrapper>
      )
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
          <PageHeader
            title="AI Question Review"
            titleVi="Xem xét Câu hỏi AI"
            description="Review and approve AI-generated questions"
            descriptionVi="Xem xét và phê duyệt câu hỏi được tạo bởi AI"
            actions={
              <Button variant="outline" onClick={() => router.push('/teacher/questions')}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </Button>
            }
          />

          <AIQuestionReviewCard
            question={singleQuestion}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={handleEdit}
          />
        </div>
      </DashboardLayoutWrapper>
    )
  }

  // Show all pending questions
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
          title="AI Question Review"
          titleVi="Xem xét Câu hỏi AI"
          description="Review and approve AI-generated questions before publishing"
          descriptionVi="Xem xét và phê duyệt câu hỏi được tạo bởi AI trước khi xuất bản"
          actions={
            <div className="flex items-center gap-3">
              {/* Review Statistics from Backend API */}
              {!isStatsLoading && reviewStats && (
                <div className="flex items-center gap-3 mr-2">
                  <Badge variant="outline" size="sm">
                    <span className="text-amber-600 font-semibold">{reviewStats.pending}</span>
                    {' '}chờ duyệt
                  </Badge>
                  <Badge variant="outline" size="sm">
                    <span className="text-success-600 font-semibold">{reviewStats.approved}</span>
                    {' '}đã duyệt
                  </Badge>
                  <Badge variant="outline" size="sm">
                    <span className="text-error-600 font-semibold">{reviewStats.rejected}</span>
                    {' '}từ chối
                  </Badge>
                </div>
              )}
              {isStatsLoading && (
                <Badge variant="outline" size="sm">
                  Đang tải...
                </Badge>
              )}
              <Badge variant="warning" size="lg">
                {pendingQuestions.length} câu hỏi chờ duyệt
              </Badge>
            </div>
          }
        />

        {/* Review Statistics Section */}
        {!isStatsLoading && reviewStats && (
          <Card variant="default" padding="md">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verve-100 dark:bg-verve-900/30">
                <svg className="h-5 w-5 text-verve-600 dark:text-verve-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Thống kê duyệt câu hỏi
                </h4>
                <div className="mt-3 grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{reviewStats.total}</p>
                    <p className="text-xs text-slate-500">Tổng số</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">{reviewStats.pending}</p>
                    <p className="text-xs text-slate-500">Chờ duyệt</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success-600">{reviewStats.approved}</p>
                    <p className="text-xs text-slate-500">Đã duyệt</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-error-600">{reviewStats.rejected}</p>
                    <p className="text-xs text-slate-500">Từ chối</p>
                  </div>
                </div>
                {reviewStats.reviewerWorkload.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Khối lượng theo người duyệt:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {reviewStats.reviewerWorkload.slice(0, 5).map((workload) => (
                        <Badge key={workload.reviewerId} variant="outline" size="sm">
                          {workload.reviewerId.slice(0, 8)}...: {workload.pendingCount} chờ / {workload.totalCount} tổng
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Info Banner */}
        <Card variant="default" padding="md">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-info-100 dark:bg-info-900/30">
              <svg className="h-5 w-5 text-info-600 dark:text-info-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Câu hỏi AI cần được xem xét bởi giáo viên
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Tất cả câu hỏi được tạo bởi AI cần được bạn xem xét và phê duyệt trước khi xuất bản cho học sinh.
                Vui lòng kiểm tra nội dung, đáp án đúng và giải thích trước khi phê duyệt.
              </p>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <svg className="h-8 w-8 animate-spin text-verve-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="ml-3 text-slate-500 dark:text-slate-400">Đang tải câu hỏi...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card variant="default" padding="md" className="border-l-4 border-error-500 bg-error-50 dark:bg-error-900/20">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-error-700 dark:text-error-300">{error}</p>
              <Button variant="outline" size="sm" onClick={loadQuestions}>
                Thử lại
              </Button>
            </div>
          </Card>
        )}

        {/* Questions List */}
        {!isLoading && !error && pendingQuestions.length > 0 ? (
          <div className="space-y-6">
            {pendingQuestions.map((question) => (
              <AIQuestionReviewCard
                key={question.id}
                question={question}
                onApprove={handleApprove}
                onReject={handleReject}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : !isLoading && !error ? (
          <EmptyState
            title="No questions to review"
            titleVi="Không có câu hỏi nào cần duyệt"
            description="All AI-generated questions have been reviewed"
            descriptionVi="Tất cả câu hỏi AI đã được xem xét"
            action={
              <Button variant="outline" onClick={() => router.push('/teacher/questions')}>
                Quay lại ngân hàng câu hỏi
              </Button>
            }
          />
        ) : null}

        {/* Info Banner */}
        <Card variant="default" padding="md">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-info-100 dark:bg-info-900/30">
              <svg className="h-5 w-5 text-info-600 dark:text-info-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Câu hỏi AI cần được xem xét bởi giáo viên
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Tất cả câu hỏi được tạo bởi AI cần được bạn xem xét và phê duyệt trước khi xuất bản cho học sinh.
                Vui lòng kiểm tra nội dung, đáp án đúng và giải thích trước khi phê duyệt.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        variant={confirmDialog.variant}
        message={confirmDialog.message}
      />
    </DashboardLayoutWrapper>
  )
}
