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
} from '@/components/ui'
import { examService } from '@/services/exam'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { StudentExam } from '@/types'

/**
 * Exam Detail Page
 * Fetches exam data from real backend API
 */
export default function ExamDetailPage() {
  const router = useRouter()
  const params = useParams()
  const examId = params.id as string
  const [currentRole] = React.useState<UserRole>('student')
  const { t } = useLanguage()
  const { user } = useAuth()

  // State
  const [exam, setExam] = React.useState<StudentExam | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Load exam data from backend
  React.useEffect(() => {
    loadExam()
  }, [examId])

  const loadExam = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await examService.getExamById(examId)
      if (result) {
        setExam(result)
      } else {
        setError('Exam not found')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exam')
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
    { label: 'Bài kiểm tra', labelVi: 'Bài kiểm tra', href: '/student/exams' },
    { label: exam?.titleVi || 'Bài kiểm tra', labelVi: exam?.titleVi || 'Bài kiểm tra' },
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
  if (error || !exam) {
    return (
      <DashboardLayoutWrapper
        user={userData}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Exam not found"
          titleVi="Không tìm thấy bài kiểm tra"
          description={error || "The exam you're looking for doesn't exist"}
          descriptionVi={error || "Bài kiểm tra bạn đang tìm kiếm không tồn tại"}
          action={
            <Button variant="primary" onClick={() => router.push('/student/exams')}>
              Quay lại Bài kiểm tra
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  // Status configuration
  const statusConfig = {
    available: { label: t('exam.available') || 'Sẵn sàng', variant: 'success' as const },
    upcoming: { label: t('exam.upcoming') || 'Sắp diễn ra', variant: 'info' as const },
    'in-progress': { label: t('common.inProgress') || 'Đang làm', variant: 'warning' as const },
    completed: { label: t('common.completed') || 'Hoàn thành', variant: 'default' as const },
    expired: { label: t('common.expired') || 'Đã hết hạn', variant: 'error' as const },
  }

  const config = statusConfig[exam.status] || statusConfig.available

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
          title={exam.titleVi}
          titleVi={exam.titleVi}
          description={exam.className}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/student/exams')}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </Button>
              {exam.status === 'available' && (
                <Button variant="primary" size="sm" onClick={() => router.push(`/student/exams/${exam.id}/taking`)}>
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bắt đầu làm bài
                </Button>
              )}
              {exam.status === 'completed' && (
                <Button variant="primary" size="sm" onClick={() => router.push(`/student/results?exam=${exam.id}`)}>
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Xem kết quả
                </Button>
              )}
            </div>
          }
        />

        {/* Status Banner */}
        <Card variant="default" padding="lg" className={cn(
          'border-l-4',
          exam.status === 'available' ? 'border-l-success-500' :
          exam.status === 'upcoming' ? 'border-l-info-500' :
          exam.status === 'completed' ? 'border-l-slate-500' :
          'border-l-error-500'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={config.variant} size="lg">
                {config.label}
              </Badge>
              {exam.bestScore !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('common.bestScore') || 'Điểm cao nhất'}:</span>
                  <span className="text-lg font-bold text-success-600 dark:text-success-400">
                    {exam.bestScore}%
                  </span>
                </div>
              )}
              {exam.lastScore !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('common.lastAttempt') || 'Lần cuối'}:</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {exam.lastScore}%
                  </span>
                </div>
              )}
            </div>
            {exam.maxAttempts && (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {t('common.attempt') || 'Lần'} {exam.attempts || 0}/{exam.maxAttempts}
              </div>
            )}
          </div>
        </Card>

        {/* Exam Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('common.examInfo') || 'Thông tin bài kiểm tra'}
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.description') || 'Mô tả'}</p>
                <p className="mt-1 text-slate-900 dark:text-slate-100">
                  {exam.descriptionVi || t('common.noDescription') || 'Không có mô tả'}
                </p>
              </div>
              {exam.className && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.class') || 'Lớp'}</p>
                  <p className="mt-1 text-slate-900 dark:text-slate-100">
                    {exam.className}
                  </p>
                </div>
              )}
              {exam.teacherName && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.teacher') || 'Giáo viên'}</p>
                  <p className="mt-1 text-slate-900 dark:text-slate-100">
                    {exam.teacherName}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('common.technicalInfo') || 'Thông tin kỹ thuật'}
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.totalQuestions') || 'Số câu hỏi'}</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {exam.questionCount} {t('exam.questions') || 'câu'}
                </p>
              </div>
              {exam.durationMinutes && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.duration') || 'Thời gian'}</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {exam.durationMinutes} {t('mastery.minutes') || 'phút'}
                  </p>
                </div>
              )}
              {exam.maxAttempts && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.attempts') || 'Số lần làm'}</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {exam.maxAttempts} {t('common.maxAttempts') || 'lần tối đa'}
                  </p>
                </div>
              )}
              {exam.availableFrom && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.availableFrom') || 'Có sẵn từ'}</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {formatDate(exam.availableFrom)}
                  </p>
                </div>
              )}
              {exam.availableUntil && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.expiresAt') || 'Hết hạn'}</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {formatDate(exam.availableUntil)}
                  </p>
                </div>
              )}
              {exam.completedAt && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.completed') || 'Hoàn thành'}</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {formatRelativeTime(exam.completedAt)}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Instructions */}
        {exam.status === 'available' && (
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('common.instructions') || 'Hướng dẫn'}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('common.readCarefully') || 'Đọc kỹ đề bài trước khi trả lời'}
              </li>
              {exam.durationMinutes && (
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('common.manageTime') || 'Bài kiểm tra có'} {exam.durationMinutes} {t('mastery.minutes') || 'phút'}. {t('common.manageTimeHint') || 'Hãy quản lý thời gian hợp lý.'}
                </li>
              )}
              {exam.maxAttempts && (
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('common.canRetake') || 'Bạn có thể làm lại bài tối đa'} {exam.maxAttempts} {t('common.times') || 'lần.'}
                </li>
              )}
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('common.bestScoreRecorded') || 'Điểm cao nhất của bạn sẽ được ghi nhận.'}
              </li>
            </ul>
            <div className="mt-6">
              <Button variant="primary" size="lg" className="w-full sm:w-auto" onClick={() => router.push(`/student/exams/${exam.id}/taking`)}>
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bắt đầu làm bài
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayoutWrapper>
  )
}
