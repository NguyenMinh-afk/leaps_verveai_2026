'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
  EmptyState,
} from '@/components/layout'
import {
  Card,
  Button,
  Badge,
  Progress,
} from '@/components/ui'
import { assignmentService } from '@/services/assignment'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { StudentAssignment } from '@/types'

/**
 * Assignment Detail Page
 * Fetches assignment data from real backend API
 */
export default function AssignmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const assignmentId = params.id as string
  const { t } = useLanguage()
  const { user } = useAuth()

  // State
  const [assignment, setAssignment] = React.useState<StudentAssignment | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Load assignment data from backend
  React.useEffect(() => {
    loadAssignment()
  }, [assignmentId])

  const loadAssignment = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch all assignments and find the one with matching ID
      const result = await assignmentService.getStudentAssignments({ limit: 100 })
      const found = result.assignments.find(a => a.id === assignmentId)
      if (found) {
        setAssignment(found)
      } else {
        setError('Assignment not found')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assignment')
    } finally {
      setIsLoading(false)
    }
  }

  const userData = {
    name: user?.name || 'Student',
    email: user?.email || '',
    role: 'student' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', labelVi: 'Trang chủ', href: '/' },
    { label: 'Học sinh', labelVi: 'Học sinh', href: '/student' },
    { label: 'Bài tập', labelVi: 'Bài tập', href: '/student/assignments' },
    { label: assignment?.titleVi || 'Bài tập', labelVi: assignment?.titleVi || 'Bài tập' },
  ]

  const handleRoleChange = (newRole: UserRole) => {
    router.push('/')
  }

  const handleSignOut = () => {
    router.push('/')
  }

  const handleSettings = () => {
    router.push('/student/settings')
  }

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayoutWrapper
        user={userData}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <div className="flex items-center justify-center py-12">
          <svg className="h-8 w-8 animate-spin text-verve-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </DashboardLayoutWrapper>
    )
  }

  // Error state
  if (error || !assignment) {
    return (
      <DashboardLayoutWrapper
        user={userData}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Assignment not found"
          titleVi="Không tìm thấy bài tập"
          description={error || "The assignment you're looking for doesn't exist"}
          descriptionVi={error || "Bài tập bạn đang tìm kiếm không tồn tại"}
          action={
            <Button variant="primary" onClick={() => router.push('/student/assignments')}>
              Quay lại Bài tập
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  const statusConfig = {
    assigned: { label: t('assignment.new') || 'Mới giao', variant: 'info' as const },
    'in-progress': { label: t('common.inProgress') || 'Đang làm', variant: 'warning' as const },
    completed: { label: t('common.completed') || 'Hoàn thành', variant: 'success' as const },
    overdue: { label: t('common.overdue') || 'Quá hạn', variant: 'error' as const },
  }

  const config = statusConfig[assignment.status] || statusConfig.assigned

  const isOverdue = assignment.status === 'overdue'

  return (
    <DashboardLayoutWrapper
      user={userData}
      breadcrumbs={breadcrumbs}
      onRoleChange={handleRoleChange}
      onSignOut={handleSignOut}
      onSettings={handleSettings}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title={assignment.titleVi}
          titleVi={assignment.titleVi}
          description={assignment.className}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/student/assignments')}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </Button>
              {assignment.status !== 'completed' && (
                <Button variant="primary" size="sm">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {assignment.status === 'in-progress' ? 'Tiếp tục' : 'Bắt đầu'}
                </Button>
              )}
            </div>
          }
        />

        {/* Status and Progress */}
        <Card variant="default" padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant={config.variant} size="lg">
                {config.label}
              </Badge>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t('common.yourProgress') || 'Tiến độ của bạn'}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {assignment.progress || 0}%
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {assignment.answeredCount || 0}/{assignment.questionCount} {t('exam.questions') || 'câu hỏi'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={assignment.progress || 0} />
          </div>
          {assignment.score !== undefined && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-success-50 p-4 dark:bg-success-900/20">
              <div>
                <p className="text-sm font-medium text-success-700 dark:text-success-300">
                  {t('common.yourScore') || 'Điểm của bạn'}
                </p>
                <p className="text-xs text-success-600 dark:text-success-400">
                  {assignment.score >= 80 ? t('common.excellent') || 'Xuất sắc!' :
                   assignment.score >= 60 ? t('common.goodJob') || 'Tốt lắm!' : t('common.keepTrying') || 'Cần cố gắng hơn'}
                </p>
              </div>
              <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                {assignment.score}%
              </p>
            </div>
          )}
        </Card>

        {/* Assignment Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('common.assignmentDetails') || 'Chi tiết bài tập'}
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.description') || 'Mô tả'}</p>
                <p className="mt-1 text-slate-900 dark:text-slate-100">
                  {assignment.descriptionVi}
                </p>
              </div>
              {assignment.topicNameVi && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('mastery.topics') || 'Chủ đề'}</p>
                  <p className="mt-1 text-slate-900 dark:text-slate-100">
                    {assignment.topicNameVi}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.class') || 'Lớp'}</p>
                <p className="mt-1 text-slate-900 dark:text-slate-100">
                  {assignment.className}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.teacher') || 'Giáo viên'}</p>
                <p className="mt-1 text-slate-900 dark:text-slate-100">
                  {assignment.teacherName}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('common.timeInfo') || 'Thông tin thời gian'}
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.assignedDate') || 'Ngày giao'}</p>
                <p className="mt-1 text-slate-900 dark:text-slate-100">
                  {formatDate(assignment.dueDate || new Date())}
                </p>
              </div>
              {assignment.dueDate && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.dueDate') || 'Hạn nộp'}</p>
                  <p className={cn(
                    'mt-1 font-medium',
                    isOverdue ? 'text-error-600 dark:text-error-400' : 'text-slate-900 dark:text-slate-100'
                  )}>
                    {formatDate(assignment.dueDate)}
                    {isOverdue && ` (${t('common.overdue') || 'Quá hạn'})`}
                  </p>
                </div>
              )}
              {assignment.startedAt && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.startedAt') || 'Bắt đầu làm'}</p>
                  <p className="mt-1 text-slate-900 dark:text-slate-100">
                    {formatRelativeTime(assignment.startedAt)}
                  </p>
                </div>
              )}
              {assignment.completedAt && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.completedAt') || 'Hoàn thành'}</p>
                  <p className="mt-1 text-slate-900 dark:text-slate-100">
                    {formatRelativeTime(assignment.completedAt)}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Questions Overview */}
        <Card variant="default" padding="lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t('common.questionsOverview') || 'Tổng quan câu hỏi'}
          </h3>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                {t('common.answered') || 'Đã trả lời'}: {assignment.answeredCount || 0}/{assignment.questionCount}
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {Math.round(((assignment.answeredCount || 0) / assignment.questionCount) * 100)}%
              </span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-verve-600 transition-all"
                style={{ width: `${((assignment.answeredCount || 0) / assignment.questionCount) * 100}%` }}
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {assignment.questionCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('common.totalQuestions') || 'Tổng câu'}</p>
            </div>
            <div className="rounded-lg bg-verve-50 p-3 text-center dark:bg-verve-900/20">
              <p className="text-2xl font-bold text-verve-600 dark:text-verve-400">
                {assignment.answeredCount || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('common.answered') || 'Đã trả lời'}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-900/20">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {assignment.questionCount - (assignment.answeredCount || 0)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('common.unanswered') || 'Chưa trả lời'}</p>
            </div>
            <div className="rounded-lg bg-success-50 p-3 text-center dark:bg-success-900/20">
              <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                {assignment.score !== undefined ? assignment.score : '-'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('common.score') || 'Điểm'}</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayoutWrapper>
  )
}
