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
  Progress,
} from '@/components/ui'
import {
  mockStudentProfile,
  getAssignmentById,
} from '@/data/student-mock-data'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'

/**
 * Assignment Detail Page
 */
export default function AssignmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const assignmentId = params.id as string
  const [currentRole] = React.useState<UserRole>('student')
  const { t } = useLanguage()

  const student = mockStudentProfile
  const assignment = getAssignmentById(assignmentId)

  const user = {
    name: student.name,
    email: student.email,
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
    // Navigate to settings
  }

  if (!assignment) {
    return (
      <DashboardLayoutWrapper
        user={user}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Assignment not found"
          titleVi="Không tìm thấy bài tập"
          description="The assignment you're looking for doesn't exist"
          descriptionVi="Bài tập bạn đang tìm kiếm không tồn tại"
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

  const config = statusConfig[assignment.status]

  const isOverdue = assignment.status === 'overdue'

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
                {assignment.progress}%
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {assignment.answeredCount}/{assignment.questionCount} {t('exam.questions') || 'câu hỏi'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={assignment.progress} />
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
                {t('common.answered') || 'Đã trả lời'}: {assignment.answeredCount}/{assignment.questionCount}
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {Math.round((assignment.answeredCount / assignment.questionCount) * 100)}%
              </span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-verve-600 transition-all"
                style={{ width: `${(assignment.answeredCount / assignment.questionCount) * 100}%` }}
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
                {assignment.answeredCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('common.answered') || 'Đã trả lời'}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-900/20">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {assignment.questionCount - assignment.answeredCount}
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
