'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
  PageSection,
  PageGrid,
  EmptyState,
  LoadingState,
} from '@/components/layout'
import {
  Card,
  Button,
  Badge,
  Avatar,
} from '@/components/ui'
import {
  MasteryBar,
  MasteryBadge,
  MasteryRingIndicator,
} from '@/components/ui'
import { studentDashboardService } from '@/services/dashboard'
import { formatRelativeTime, getMasteryLevel } from '@/lib/utils'
import { authService } from '@/services/auth'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { LearningRecommendation, StudentAssignment, StudentExam, LearningActivity } from '@/types'

/**
 * Progress Card Component
 */
interface ProgressCardProps {
  title: string
  titleVi: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'stable'
  color: string
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, titleVi, value, subtitle, icon, trend, color }) => (
  <Card variant="default" padding="md">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{titleVi}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
        )}
      </div>
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', color)}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-2 flex items-center gap-1">
        {trend === 'up' && (
          <svg className="h-4 w-4 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )}
        {trend === 'down' && (
          <svg className="h-4 w-4 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        {trend === 'stable' && (
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        )}
      </div>
    )}
  </Card>
)

/**
 * Recommended Learning Card
 */
interface RecommendationCardProps {
  recommendation: LearningRecommendation
  onStart: () => void
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onStart }) => {
  const { t } = useLanguage()
  
  const priorityColors = {
    high: 'border-l-4 border-l-error-500',
    medium: 'border-l-4 border-l-amber-500',
    low: 'border-l-4 border-l-info-500',
  }

  const actionLabels = {
    practice: t('common.practice') || 'Luyện tập',
    review: t('common.review') || 'Ôn tập',
    assessment: t('common.assessment') || 'Kiểm tra',
    continue: t('common.continue') || 'Tiếp tục',
  }

  return (
    <Card variant="default" padding="md" className={cn(priorityColors[recommendation.priority])}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">
            {recommendation.topicNameVi}
          </h4>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {recommendation.reasonVi}
          </p>
        </div>
        <Badge
          variant={
            recommendation.priority === 'high' ? 'error' :
            recommendation.priority === 'medium' ? 'warning' : 'info'
          }
          size="sm"
        >
          {recommendation.priority === 'high' ? 'Ưu tiên cao' :
           recommendation.priority === 'medium' ? 'Ưu tiên TB' : 'Ưu tiên thấp'}
        </Badge>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MasteryBadge pKnown={recommendation.currentMastery} size="sm" />
          {recommendation.estimatedMinutes && (
            <span className="text-xs text-slate-400">
              ~{recommendation.estimatedMinutes} {t('mastery.minutes') || 'phút'}
            </span>
          )}
        </div>
        <Button variant="primary" size="sm" onClick={onStart}>
          {actionLabels[recommendation.recommendedAction]}
        </Button>
      </div>
    </Card>
  )
}

/**
 * Assignment Card
 */
interface AssignmentCardProps {
  assignment: StudentAssignment
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const { t } = useLanguage()
  
  const statusConfig = {
    assigned: { label: t('assignment.new') || 'Mới', variant: 'info' as const },
    'in-progress': { label: t('common.inProgress') || 'Đang làm', variant: 'warning' as const },
    completed: { label: t('common.completed') || 'Hoàn thành', variant: 'success' as const },
    overdue: { label: t('common.overdue') || 'Quá hạn', variant: 'error' as const },
  }

  const config = statusConfig[assignment.status]

  return (
    <Link href={`/student/assignments/${assignment.id}`}>
      <Card variant="interactive" padding="md" className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
              {assignment.titleVi}
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {assignment.className}
            </p>
          </div>
          <Badge variant={config.variant} size="sm">
            {config.label}
          </Badge>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500 dark:text-slate-400">{t('common.progress') || 'Tiến độ'}</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{assignment.progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                assignment.status === 'completed' ? 'bg-success-500' : 'bg-verve-600'
              )}
              style={{ width: `${assignment.progress}%` }}
            />
          </div>
        </div>
        {assignment.dueDate && (
          <p className={cn(
            'mt-2 text-xs',
            assignment.status === 'overdue' ? 'text-error-600 dark:text-error-400' : 'text-slate-400'
          )}>
            {t('common.dueDate') || 'Hạn'}: {formatRelativeTime(assignment.dueDate)}
          </p>
        )}
      </Card>
    </Link>
  )
}

/**
 * Exam Card
 */
interface ExamCardProps {
  exam: StudentExam
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const { t } = useLanguage()
  
  const statusConfig = {
    available: { label: t('exam.available') || 'Sẵn sàng', variant: 'success' as const, color: 'text-success-600 dark:text-success-400' },
    upcoming: { label: t('exam.upcoming') || 'Sắp diễn ra', variant: 'info' as const, color: 'text-info-600 dark:text-info-400' },
    'in-progress': { label: t('common.inProgress') || 'Đang làm', variant: 'warning' as const, color: 'text-warning-600 dark:text-warning-400' },
    completed: { label: t('common.completed') || 'Hoàn thành', variant: 'default' as const, color: 'text-slate-600 dark:text-slate-400' },
    expired: { label: t('common.expired') || 'Đã hết hạn', variant: 'error' as const, color: 'text-error-600 dark:text-error-400' },
  }

  const config = statusConfig[exam.status]

  return (
    <Link href={`/student/exams/${exam.id}`}>
      <Card variant="interactive" padding="md" className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
              {exam.titleVi}
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {exam.className}
            </p>
          </div>
          <Badge variant={config.variant} size="sm">
            {config.label}
          </Badge>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>{exam.questionCount} {t('exam.questions') || 'câu'}</span>
          {exam.durationMinutes && <span>{exam.durationMinutes} {t('mastery.minutes') || 'phút'}</span>}
          {exam.bestScore !== undefined && (
            <span className="font-medium text-success-600 dark:text-success-400">
              {t('common.highest') || 'Cao nhất'}: {exam.bestScore}%
            </span>
          )}
        </div>
        {exam.status === 'available' && (
          <Button variant="primary" size="sm" className="mt-3 w-full">
            {t('common.start') || 'Bắt đầu'}
          </Button>
        )}
      </Card>
    </Link>
  )
}

/**
 * Activity Item
 */
interface ActivityItemProps {
  activity: LearningActivity
  t: (key: string) => string
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, t }) => {
  const typeIcons = {
    assignment: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    exam: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    practice: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    topic: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  }

  const typeColors = {
    assignment: 'text-verve-600 dark:text-verve-400 bg-verve-100 dark:bg-verve-900/30',
    exam: 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/30',
    practice: 'text-info-600 dark:text-info-400 bg-info-100 dark:bg-info-900/30',
    topic: 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30',
  }

  return (
    <div className="flex items-start gap-3 py-2">
      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', typeColors[activity.type])}>
        {typeIcons[activity.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {activity.titleVi}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
          {activity.descriptionVi}
        </p>
        {activity.score !== undefined && (
          <p className="mt-0.5 text-xs font-medium text-success-600 dark:text-success-400">
            {t('common.score') || 'Điểm'}: {activity.score}%
          </p>
        )}
      </div>
      <span className="text-xs text-slate-400 whitespace-nowrap">
        {formatRelativeTime(activity.timestamp)}
      </span>
    </div>
  )
}

/**
 * Student Dashboard Page
 */
export default function StudentDashboardPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentRole] = React.useState<UserRole>('student')
  const [currentUser, setCurrentUser] = React.useState<{ name: string; email: string; role: UserRole } | null>(null)
  const [dashboardData, setDashboardData] = React.useState<{
    profile: { id: string; name: string; email: string } | null
    stats: {
      overallMastery: number
      masteryLevel: 'mastered' | 'learning' | 'needs-support' | 'unknown'
      topicsCompleted: number
      topicsInProgress: number
      assignmentsPending: number
      assignmentsCompleted: number
      examsCompleted: number
      averageScore: number
    }
    recommendations: LearningRecommendation[]
    assignments: StudentAssignment[]
    exams: StudentExam[]
    activities: LearningActivity[]
  } | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [recommendationsUnavailable, setRecommendationsUnavailable] = React.useState(false)

  // Fetch current user and dashboard data
  React.useEffect(() => {
    async function loadData() {
      try {
        // Get current session
        const session = await authService.getSession()
        if (session?.user) {
          setCurrentUser({
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
          })

          // Fetch dashboard data from real APIs using the student's ID
          const result = await studentDashboardService.getDashboardData(session.user.id)
          if (result.success && result.data) {
            setDashboardData({
              profile: session.user,
              stats: result.data.stats,
              recommendations: result.data.recommendations,
              assignments: result.data.assignments,
              exams: result.data.exams,
              activities: result.data.activities,
            })
            if (result.partialError) {
              setRecommendationsUnavailable(true)
            }
          } else {
            setError(result.error || 'Failed to load dashboard')
          }
        } else {
          // No session - show error state
          setError('Please log in to view your dashboard')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Profile comes from session - no fake fallbacks
  const studentProfile = dashboardData?.profile || null

  // Use real data or safe defaults for stats
  const stats = dashboardData?.stats || {
    overallMastery: 0,
    masteryLevel: 'unknown' as const,
    topicsCompleted: 0,
    topicsInProgress: 0,
    assignmentsPending: 0,
    assignmentsCompleted: 0,
    examsCompleted: 0,
    averageScore: 0,
  }
  const recommendations = dashboardData?.recommendations.filter(r => r.priority === 'high').slice(0, 3) || []
  const pendingAssignments = dashboardData?.assignments.filter(a => a.status !== 'completed').slice(0, 3) || []
  const availableExams = dashboardData?.exams.filter(e => e.status === 'available').slice(0, 2) || []
  const recentActivities = dashboardData?.activities.slice(0, 5) || []

  const user = currentUser || { name: 'Student', email: '', role: 'student' as UserRole }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', labelVi: 'Trang chủ', href: '/' },
    { label: 'Học sinh', labelVi: 'Học sinh' },
  ]

  const handleRoleChange = (newRole: UserRole) => {
    router.push('/')
  }

  const handleSignOut = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Ignore logout errors
    }
    router.push('/login')
  }

  const handleSettings = () => {
    // Navigate to settings
  }

  if (isLoading) {
    return (
      <DashboardLayoutWrapper
        user={user}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <LoadingState />
      </DashboardLayoutWrapper>
    )
  }

  if (error) {
    return (
      <DashboardLayoutWrapper
        user={user}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Error loading dashboard"
          titleVi="Lỗi khi tải dashboard"
          description={error}
          descriptionVi={error}
          action={
            <Button variant="primary" onClick={() => window.location.reload()}>
              {t('common.retry') || 'Thử lại'}
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  const masteryLevel = getMasteryLevel(stats.overallMastery)

  const levelLabels = {
    mastered: 'Đã thành thạo',
    learning: 'Đang học',
    'needs-support': 'Cần luyện tập thêm',
    unknown: 'Chưa xác định',
  }

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
          title={`Chào ${studentProfile?.name.split(' ').pop() ?? 'bạn'}!`}
          titleVi={`Chào ${studentProfile?.name.split(' ').pop() ?? 'bạn'}!`}
          description="Tiếp tục hành trình học tập của bạn"
          actions={
            <Button variant="primary" size="sm" onClick={() => router.push('/student/recommendations')}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Bắt đầu học
            </Button>
          }
        />

        {/* Overall Progress */}
        <div className="grid gap-6 lg:grid-cols-4">
          <Card variant="default" padding="lg" className="lg:col-span-1">
            <div className="flex flex-col items-center">
              <MasteryRingIndicator
                pKnown={stats.overallMastery}
                size="xl"
                showLabel={false}
                showPercentage={true}
              />
              <div className="mt-4 text-center">
                <Badge
                  variant={
                    masteryLevel === 'mastered' ? 'success' :
                    masteryLevel === 'learning' ? 'warning' :
                    'error'
                  }
                >
                  {levelLabels[masteryLevel]}
                </Badge>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Mức độ thành thạo tổng thể
                </p>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-3">
            <PageGrid columns={4} gap="md">
              <ProgressCard
                title="Topics Completed"
                titleVi="Chủ đề đã hoàn thành"
                value={stats.topicsCompleted}
                subtitle={`${stats.topicsInProgress} đang tiến hành`}
                icon={
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                }
                color="bg-success-600"
              />
              <ProgressCard
                title="Assignments"
                titleVi="Bài tập"
                value={stats.assignmentsCompleted}
                subtitle={`${stats.assignmentsPending} đang chờ`}
                icon={
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                }
                color="bg-verve-600"
              />
              <ProgressCard
                title="Exams Completed"
                titleVi="Bài kiểm tra"
                value={stats.examsCompleted}
                subtitle={`Điểm TB: ${stats.averageScore}%`}
                icon={
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                color="bg-info-600"
              />
              <ProgressCard
                title="Overall Mastery"
                titleVi="Mức độ thành thạo"
                value={`${Math.round(stats.overallMastery * 100)}%`}
                subtitle="Tiến bộ tốt!"
                icon={
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                }
                trend="up"
                color="bg-amber-600"
              />
            </PageGrid>
          </div>
        </div>

        {/* Recommendations and Upcoming Work */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recommendations */}
          <PageSection title="Cần luyện tập" titleVi="Cần luyện tập">
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    onStart={() => router.push(`/student/mastery/${rec.topicId}`)}
                  />
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/student/recommendations')}
                  className="w-full"
                >
                  Xem tất cả đề xuất
                </Button>
              </div>
            ) : (
              <EmptyState
                title="No recommendations"
                titleVi="Không có đề xuất"
                description="You're doing great! Keep up the good work."
                descriptionVi="Bạn đang làm rất tốt! Tiếp tục phát huy."
              />
            )}
          </PageSection>

          {/* Upcoming Work */}
          <div className="space-y-6">
            <PageSection title="Bài tập cần làm" titleVi="Bài tập cần làm">
              {pendingAssignments.length > 0 ? (
                <PageGrid columns={1} gap="sm">
                  {pendingAssignments.map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                  ))}
                </PageGrid>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Không có bài tập nào đang chờ
                </p>
              )}
            </PageSection>

            {availableExams.length > 0 && (
              <PageSection title="Bài kiểm tra sẵn sàng" titleVi="Bài kiểm tra sẵn sàng">
                <PageGrid columns={1} gap="sm">
                  {availableExams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                  ))}
                </PageGrid>
              </PageSection>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <PageSection title="Hoạt động gần đây" titleVi="Hoạt động gần đây">
          <Card variant="default" padding="md">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} t={t} />
              ))}
            </div>
            {recentActivities.length === 0 && (
              <p className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                Chưa có hoạt động nào
              </p>
            )}
          </Card>
        </PageSection>
      </div>
    </DashboardLayoutWrapper>
  )
}
