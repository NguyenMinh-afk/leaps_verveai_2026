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
} from '@/components/ui'
import { examService } from '@/services/exam'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { ExamResult } from '@/types'

/**
 * Result Card Component
 */
interface ResultCardProps {
  result: ExamResult
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { t } = useLanguage()
  
  const scoreLevel = result.percentage >= 80 ? 'excellent'
    : result.percentage >= 60 ? 'good'
    : 'needs-improvement'

  const levelConfig = {
    excellent: {
      label: t('common.excellent') || 'Xuất sắc',
      variant: 'success' as const,
      bg: 'bg-success-50 dark:bg-success-900/20',
      text: 'text-success-600 dark:text-success-400',
      icon: '🏆',
    },
    good: {
      label: t('common.good') || 'Tốt',
      variant: 'warning' as const,
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400',
      icon: '⭐',
    },
    'needs-improvement': {
      label: t('common.needsImprovement') || 'Cần cải thiện',
      variant: 'error' as const,
      bg: 'bg-error-50 dark:bg-error-900/20',
      text: 'text-error-600 dark:text-error-400',
      icon: '📚',
    },
  }

  const config = levelConfig[scoreLevel]

  return (
    <Link href={`/student/results/${result.id}`}>
      <Card variant="interactive" padding="lg" className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {result.examTitleVi}
            </h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {result.className}
            </p>
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg text-2xl', config.bg)}>
            {config.icon}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="text-center">
            <p className={cn('text-3xl font-bold', config.text)}>
              {result.percentage}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Điểm</p>
          </div>
          <div className="flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  scoreLevel === 'excellent' ? 'bg-success-500' :
                  scoreLevel === 'good' ? 'bg-amber-500' : 'bg-error-500'
                )}
                style={{ width: `${result.percentage}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {result.score}/{result.maxScore} điểm
            </p>
          </div>
        </div>

        {result.masteryImpact !== undefined && result.masteryImpact !== 0 && (
          <div className={cn(
            'mt-3 flex items-center gap-1 text-xs font-medium',
            result.masteryImpact > 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
          )}>
            {result.masteryImpact > 0 ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>
              {result.masteryImpact > 0 ? '+' : ''}{Math.round(result.masteryImpact * 100)}% thành thạo
            </span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{t('common.completed') || 'Hoàn thành'}: {formatRelativeTime(result.completedAt)}</span>
          <Badge variant={config.variant} size="sm">
            {config.label}
          </Badge>
        </div>

        {result.strengthsVi && result.strengthsVi.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {t('common.strengths') || 'Điểm mạnh'}:
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {result.strengthsVi[0]}
            </p>
          </div>
        )}
      </Card>
    </Link>
  )
}

/**
 * Results Page
 */
export default function ResultsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('student')
  const [results, setResults] = React.useState<ExamResult[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Load results from API
  React.useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const examResults = await examService.getStudentAttempts()
      setResults(examResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results')
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
    { label: 'Kết quả', labelVi: 'Kết quả' },
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

  // Stats
  const stats = React.useMemo(() => ({
    total: results.length,
    excellent: results.filter(r => r.percentage >= 80).length,
    good: results.filter(r => r.percentage >= 60 && r.percentage < 80).length,
    needsImprovement: results.filter(r => r.percentage < 60).length,
    averageScore: results.length > 0
      ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)
      : 0,
  }), [results])

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
          title="My Results"
          titleVi="Kết quả của tôi"
          description="View your assessment results and feedback"
          descriptionVi="Xem kết quả và phản hồi từ các bài kiểm tra"
          actions={
            <Button variant="outline" size="sm" onClick={() => router.push('/student/exams')}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Làm bài kiểm tra
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.averageScore') || 'Điểm trung bình'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.averageScore}%
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.totalResults') || 'Tổng kết quả'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.total}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.excellent') || 'Xuất sắc'}</p>
            <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
              {stats.excellent}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.good') || 'Tốt'}</p>
            <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.good}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.needsImprovement') || 'Cần cải thiện'}</p>
            <p className="mt-1 text-2xl font-bold text-error-600 dark:text-error-400">
              {stats.needsImprovement}
            </p>
          </Card>
        </div>

        {/* Results List */}
        <PageSection title="Lịch sử kết quả" titleVi="Lịch sử kết quả">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="h-8 w-8 animate-spin text-verve-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : error ? (
            <Card variant="default" padding="lg" className="text-center">
              <p className="text-error-600 dark:text-error-400">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={loadResults}>
                {t('common.retry') || 'Thử lại'}
              </Button>
            </Card>
          ) : results.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No results yet"
              titleVi="Chưa có kết quả"
              description="Complete an assessment to see your results here"
              descriptionVi="Hoàn thành một bài kiểm tra để xem kết quả ở đây"
              action={
                <Button variant="primary" onClick={() => router.push('/student/exams')}>
                  Làm bài kiểm tra
                </Button>
              }
            />
          )}
        </PageSection>
      </div>
    </DashboardLayoutWrapper>
  )
}
