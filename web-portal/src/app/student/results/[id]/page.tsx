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
} from '@/components/ui'
import {
  mockStudentProfile,
  getResultById,
} from '@/data/student-mock-data'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'

/**
 * Result Detail Page
 */
export default function ResultDetailPage() {
  const router = useRouter()
  const params = useParams()
  const resultId = params.id as string
  const [currentRole] = React.useState<UserRole>('student')
  const { t } = useLanguage()

  const student = mockStudentProfile
  const result = getResultById(resultId)

  const user = {
    name: student.name,
    email: student.email,
    role: 'student' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', labelVi: 'Trang chủ', href: '/' },
    { label: 'Học sinh', labelVi: 'Học sinh', href: '/student' },
    { label: 'Kết quả', labelVi: 'Kết quả', href: '/student/results' },
    { label: result?.examTitleVi || 'Kết quả', labelVi: result?.examTitleVi || 'Kết quả' },
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

  if (!result) {
    return (
      <DashboardLayoutWrapper
        user={user}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Result not found"
          titleVi="Không tìm thấy kết quả"
          description="The result you're looking for doesn't exist"
          descriptionVi="Kết quả bạn đang tìm kiếm không tồn tại"
          action={
            <Button variant="primary" onClick={() => router.push('/student/results')}>
              Quay lại Kết quả
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  const scoreLevel = result.percentage >= 80 ? 'excellent'
    : result.percentage >= 60 ? 'good'
    : 'needs-improvement'

  const levelConfig = {
    excellent: {
      label: t('common.excellent') || 'Xuất sắc',
      variant: 'success' as const,
      bg: 'bg-success-50 dark:bg-success-900/20',
      text: 'text-success-600 dark:text-success-400',
      border: 'border-success-300 dark:border-success-700',
      message: t('common.greatJob') || 'Bạn đã làm rất tốt! Hãy tiếp tục phát huy!',
      emoji: '🏆',
    },
    good: {
      label: t('common.good') || 'Tốt',
      variant: 'warning' as const,
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-300 dark:border-amber-700',
      message: t('common.goodJobKeepGoing') || 'Bạn đã làm khá tốt! Cố gắng hơn nữa nhé!',
      emoji: '⭐',
    },
    'needs-improvement': {
      label: t('common.needsImprovement') || 'Cần cải thiện',
      variant: 'error' as const,
      bg: 'bg-error-50 dark:bg-error-900/20',
      text: 'text-error-600 dark:text-error-400',
      border: 'border-error-300 dark:border-error-700',
      message: t('common.dontGiveUp') || 'Đừng nản lòng! Với sự luyện tập, bạn sẽ tiến bộ!',
      emoji: '📚',
    },
  }

  const config = levelConfig[scoreLevel]

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
          title={result.examTitleVi}
          titleVi={result.examTitleVi}
          description={result.className}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/student/results')}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push('/student/recommendations')}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Xem đề xuất
              </Button>
            </div>
          }
        />

        {/* Score Banner */}
        <Card variant="default" padding="lg" className={cn('border-l-4', config.border)}>
          <div className="flex items-center gap-6">
            <div className={cn('flex h-20 w-20 items-center justify-center rounded-xl text-4xl', config.bg)}>
              {config.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className={cn('text-4xl font-bold', config.text)}>
                  {result.percentage}%
                </h2>
                <Badge variant={config.variant} size="lg">
                  {config.label}
                </Badge>
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {config.message}
              </p>
              {result.masteryImpact !== undefined && result.masteryImpact !== 0 && (
                <p className={cn(
                  'mt-1 text-sm font-medium',
                  result.masteryImpact > 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
                )}>
                  {result.masteryImpact > 0 ? '↑' : '↓'} {Math.abs(Math.round(result.masteryImpact * 100))}% thành thạo
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Score Breakdown */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('common.score') || 'Điểm số'}
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.scoreAchieved') || 'Điểm đạt được'}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {result.score}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.maxScore') || 'Điểm tối đa'}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {result.maxScore}
                </p>
              </div>
              {result.timeSpentMinutes && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.duration') || 'Thời gian'}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {result.timeSpentMinutes} {t('mastery.minutes') || 'phút'}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('common.examInfo') || 'Thông tin bài kiểm tra'}
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.exams') || 'Bài kiểm tra'}</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {result.examTitleVi}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.class') || 'Lớp'}</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {result.className}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.completed') || 'Hoàn thành'}</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {formatRelativeTime(result.completedAt)}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('common.status') || 'Trạng thái'}
            </h3>
            <div className="mt-4">
              <Badge
                variant={result.status === 'reviewed' ? 'success' : 'info'}
                size="lg"
              >
                {result.status === 'reviewed' ? t('common.reviewed') || 'Đã được duyệt' : t('common.pendingReview') || 'Chưa duyệt'}
              </Badge>
              {result.status === 'reviewed' && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {t('common.resultReviewed') || 'Kết quả đã được giáo viên xem xét'}
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Strengths and Areas for Improvement */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Strengths */}
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-100 dark:bg-success-900/30">
                <svg className="h-5 w-5 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Điểm mạnh
              </h3>
            </div>
            <div className="mt-4 space-y-3">
              {result.strengthsVi.length > 0 ? (
                result.strengthsVi.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/30">
                      <svg className="h-4 w-4 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {strength}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  Chưa có thông tin về điểm mạnh
                </p>
              )}
            </div>
          </Card>

          {/* Areas for Improvement */}
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Cần cải thiện
              </h3>
            </div>
            <div className="mt-4 space-y-3">
              {result.areasForImprovementVi.length > 0 ? (
                result.areasForImprovementVi.map((area, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <svg className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {area}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  Chưa có thông tin về những điểm cần cải thiện
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Next Steps */}
        <Card variant="default" padding="lg">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-verve-100 dark:bg-verve-900/30">
              <svg className="h-5 w-5 text-verve-600 dark:text-verve-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('common.nextSteps') || 'Bước tiếp theo'}
            </h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => router.push('/student/recommendations')}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {t('common.viewRecommendations') || 'Xem đề xuất học tập'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/student/mastery')}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              {t('common.viewMastery') || 'Xem mức độ thành thạo'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/student/exams')}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('common.takeAnotherExam') || 'Làm bài kiểm tra khác'}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayoutWrapper>
  )
}
