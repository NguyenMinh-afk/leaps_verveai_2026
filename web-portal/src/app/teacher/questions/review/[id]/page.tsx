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
import { mockQuestions } from '@/data/teacher-mock-data'
import { formatRelativeTime } from '@/lib/utils'
import type { UserRole, BreadcrumbItem, Question, QuestionOption } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'

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
  const [currentRole] = React.useState<UserRole>('teacher')

  // Get questions pending review (AI generated)
  const pendingQuestions = mockQuestions.filter(
    (q) => q.status === 'pending-review' && q.createdBy === 'ai'
  )

  // Get single question if ID is provided
  const singleQuestion = questionId
    ? mockQuestions.find((q) => q.id === questionId)
    : null

  const user = {
    name: 'Giáo viên Demo',
    email: 'teacher@example.com',
    role: 'teacher' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: t('questions.questionBank') || 'Ngân hàng câu hỏi', labelVi: t('questions.questionBank') || 'Ngân hàng câu hỏi', href: '/teacher/questions' },
    { label: t('questions.review') || 'Duyệt câu hỏi AI', labelVi: t('questions.review') || 'Duyệt câu hỏi AI' },
  ]

  const { success } = useToast()
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    variant: 'danger' | 'warning' | 'default'
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'default' })

  const handleRoleChange = (newRole: UserRole) => {
    router.push('/')
  }

  const handleSignOut = () => {
    router.push('/')
  }

  const handleSettings = () => {
    // Navigate to settings
  }

  const handleApprove = (question: Question) => {
    setConfirmDialog({
      isOpen: true,
      title: t('questions.approve') || 'Phê duyệt câu hỏi',
      message: `${t('questions.approveConfirm') || 'Bạn có chắc muốn phê duyệt câu hỏi này?'}\n\n"${question.contentVi || question.content}"`,
      variant: 'default',
      onConfirm: () => {
        success(t('common.success') || 'Thành công', `${t('questions.approvedSuccess') || 'Đã phê duyệt câu hỏi'}: ${question.contentVi || question.content}`)
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        router.push('/teacher/questions')
      },
    })
  }

  const handleReject = (question: Question) => {
    setConfirmDialog({
      isOpen: true,
      title: t('questions.reject') || 'Từ chối câu hỏi',
      message: `${t('questions.rejectConfirm') || 'Bạn có chắc muốn từ chối câu hỏi này?'}\n\n"${question.contentVi || question.content}"`,
      variant: 'danger',
      onConfirm: () => {
        success(t('common.success') || 'Thành công', `${t('questions.rejectedSuccess') || 'Đã từ chối câu hỏi'}: ${question.contentVi || question.content}`)
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        router.push('/teacher/questions')
      },
    })
  }

  const handleEdit = (question: Question) => {
    router.push(`/teacher/questions/edit?id=${question.id}`)
  }

  // Show single question view if ID is provided
  if (singleQuestion) {
    return (
      <DashboardLayoutWrapper
        user={user}
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
      user={user}
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
            <div className="flex items-center gap-2">
              <Badge variant="warning" size="lg">
                {pendingQuestions.length} câu hỏi chờ duyệt
              </Badge>
            </div>
          }
        />

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

        {/* Questions List */}
        {pendingQuestions.length > 0 ? (
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
        ) : (
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
        )}
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
