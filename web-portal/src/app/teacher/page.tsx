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
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Avatar,
} from '@/components/ui'
import {
  MasteryBar,
  MasteryBadge,
  InterventionCard,
} from '@/components/ui'
import { teacherDashboardService } from '@/services/dashboard'
import { formatRelativeTime } from '@/lib/utils'
import { authService } from '@/services/auth'
import type { UserRole, BreadcrumbItem, TeacherDashboardStats, MasteryDistribution, TeacherClass, InterventionGroup, ActivityLogEntry } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'

/**
 * Stat Card Component
 */
interface StatCardProps {
  label: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color: string
  t: (key: string) => string
}

const StatCard: React.FC<StatCardProps> = ({ label, value, change, icon, color, t }) => (
  <Card variant="default" padding="md">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        {change !== undefined && (
          <p className={cn(
            'mt-1 text-xs font-medium',
            change > 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
          )}>
            {change > 0 ? '+' : ''}{change}% {t('common.vsLastWeek')}
          </p>
        )}
      </div>
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', color)}>
        {icon}
      </div>
    </div>
  </Card>
)

/**
 * Class Card Component
 */
interface ClassCardProps {
  classData: {
    id: string
    name: string
    studentCount: number
    averageMastery: number
    lastActivity: Date | string
  }
  t: (key: string) => string
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, t }) => {
  const masteryLevel = classData.averageMastery >= 0.8 ? 'mastered'
    : classData.averageMastery >= 0.5 ? 'learning'
    : 'needs-support'

  return (
    <Link href={`/teacher/class/${classData.id}`}>
      <Card variant="interactive" padding="md" className="h-full">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{classData.name}</h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {classData.studentCount} {t('class.students')}
            </p>
          </div>
          <Badge variant={masteryLevel === 'mastered' ? 'success' : masteryLevel === 'learning' ? 'warning' : 'error'} size="sm">
            {Math.round(classData.averageMastery * 100)}%
          </Badge>
        </div>
        <div className="mt-4">
          <MasteryBar pKnown={classData.averageMastery} size="sm" />
        </div>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          {t('teacher.recentActivity')} {formatRelativeTime(classData.lastActivity)}
        </p>
      </Card>
    </Link>
  )
}

/**
 * Activity Item Component
 */
interface ActivityItemProps {
  activity: {
    id: string
    type: string
    titleVi: string
    descriptionVi: string
    studentName?: string
    className?: string
    timestamp: Date | string
  }
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const typeIcons = {
    assessment: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    intervention: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    question: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    mastery: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    assignment: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  }

  const typeColors = {
    assessment: 'text-verve-600 dark:text-verve-400 bg-verve-100 dark:bg-verve-900/30',
    intervention: 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/30',
    question: 'text-info-600 dark:text-info-400 bg-info-100 dark:bg-info-900/30',
    mastery: 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30',
    assignment: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
  }

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', typeColors[activity.type as keyof typeof typeColors])}>
        {typeIcons[activity.type as keyof typeof typeIcons]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {activity.titleVi}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
          {activity.descriptionVi}
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {formatRelativeTime(activity.timestamp)}
        </p>
      </div>
    </div>
  )
}

/**
 * Mastery Distribution Component
 */
interface MasteryDistributionCardProps {
  masteryDistribution: MasteryDistribution
}

const MasteryDistributionCard: React.FC<MasteryDistributionCardProps> = ({ masteryDistribution }) => {
  const { t } = useLanguage()
  const { mastered, learning, needsSupport, total } = masteryDistribution

  const items = [
    { label: t('mastery.mastered') || 'Đã thành thạo', value: mastered, color: 'bg-success-500', percent: total > 0 ? Math.round((mastered / total) * 100) : 0 },
    { label: t('mastery.learning') || 'Đang học', value: learning, color: 'bg-amber-500', percent: total > 0 ? Math.round((learning / total) * 100) : 0 },
    { label: t('mastery.needsSupport') || 'Cần hỗ trợ', value: needsSupport, color: 'bg-error-500', percent: total > 0 ? Math.round((needsSupport / total) * 100) : 0 },
  ]

  return (
    <Card variant="default" padding="md">
      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
        {t('mastery.skillsBreakdown') || 'Phân bổ mức độ thành thạo'}
      </h4>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {item.value} ({item.percent}%)
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={cn('h-full rounded-full transition-all', item.color)}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

/**
 * Teacher Dashboard Page
 */
export default function TeacherDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentRole] = React.useState<UserRole>('teacher')
  const [currentUser, setCurrentUser] = React.useState<{ name: string; email: string; role: UserRole } | null>(null)
  const [dashboardData, setDashboardData] = React.useState<{
    stats: TeacherDashboardStats
    classes: TeacherClass[]
    interventions: InterventionGroup[]
    activityLog: ActivityLogEntry[]
    masteryDistribution: MasteryDistribution
  } | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const { t } = useLanguage()

  // Fetch current user and dashboard data
  React.useEffect(() => {
    async function loadData() {
      try {
        // Get current session
        const session = await authService.getSession()
        if (!session?.user) {
          // No session - redirect to login
          router.push('/login')
          return
        }
        
        setCurrentUser({
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        })

        // Fetch dashboard data from real APIs
        const result = await teacherDashboardService.getDashboardData()
        if (result.success && result.data) {
          setDashboardData(result.data)
        } else {
          setError(result.error || 'Failed to load dashboard')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [router])

  // User data is loaded from session - no fake fallbacks
  const user = currentUser || { name: 'Teacher', email: '', role: 'teacher' as UserRole }

  // User display object for DashboardLayoutWrapper
  const userDisplay = {
    name: user?.name || 'Teacher',
    email: user?.email || '',
    role: 'teacher' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title') },
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
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <LoadingState />
      </DashboardLayoutWrapper>
    )
  }

  if (error || !dashboardData) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Error loading dashboard"
          titleVi="Lỗi khi tải dashboard"
          description={error || 'Something went wrong'}
          descriptionVi={error || 'Đã xảy ra lỗi'}
          action={
            <Button variant="primary" onClick={() => window.location.reload()}>
              {t('common.retry') || 'Thử lại'}
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  const stats = dashboardData.stats
  const classes = dashboardData.classes
  const interventions = dashboardData.interventions.filter((i) => i.severity === 'high').slice(0, 3)
  const activities = dashboardData.activityLog.slice(0, 5)

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
          title="Teacher Dashboard"
          titleVi={t('teacher.title') || 'Giáo viên'}
          description="Overview of your classes, students, and recent activity"
          descriptionVi={t('teacher.description') || 'Tổng quan về lớp học, học sinh và hoạt động gần đây'}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {t('common.export') || 'Xuất báo cáo'}
              </Button>
              <Button variant="primary" size="sm">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t('exam.create') || 'Tạo bài kiểm tra'}
              </Button>
            </div>
          }
        />

        {/* Statistics */}
        <PageSection title="Overview Statistics" titleVi={t('teacher.statsTitle')}>
          <PageGrid columns={4} gap="md">
            <StatCard
              label={t('teacher.totalStudents')}
              value={stats.totalStudents}
              t={t}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              color="bg-verve-600"
            />
            <StatCard
              label={t('teacher.activeClasses')}
              value={stats.activeClasses}
              t={t}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              color="bg-info-600"
            />
            <StatCard
              label={t('teacher.avgMastery')}
              value={`${Math.round(stats.averageMastery * 100)}%`}
              t={t}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
              color="bg-success-600"
            />
            <StatCard
              label={t('teacher.needsIntervention')}
              value={stats.studentsNeedingIntervention}
              t={t}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              color="bg-warning-600"
            />
          </PageGrid>
        </PageSection>

        {/* Classes and Mastery */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Classes */}
          <div className="lg:col-span-2">
            <PageSection title="My Classes" titleVi={t('teacher.myClasses')}>
              {classes.length > 0 ? (
                <PageGrid columns={3} gap="md">
                  {classes.map((classItem) => (
                    <ClassCard key={classItem.id} classData={classItem} t={t} />
                  ))}
                </PageGrid>
              ) : (
                <EmptyState
                  title="No classes yet"
                  titleVi={t('class.noClasses') || 'Không có lớp học nào'}
                  description="Create your first class to get started"
                  descriptionVi={t('class.createFirst') || 'Tạo lớp học đầu tiên để bắt đầu'}
                  action={
                    <Button variant="primary" size="sm" onClick={() => router.push('/teacher/class')}>
                      {t('class.addClass') || 'Tạo lớp học mới'}
                    </Button>
                  }
                />
              )}
            </PageSection>
          </div>

          {/* Mastery Distribution */}
          <div>
            <PageSection title="Mastery Overview" titleVi={t('teacher.masteryOverview') || 'Tổng quan thành thạo'}>
              <MasteryDistributionCard masteryDistribution={dashboardData.masteryDistribution} />
            </PageSection>
          </div>
        </div>

        {/* Interventions and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* High Priority Interventions */}
          <PageSection title={t('interventions.needsImmediate') || 'Cần can thiệp ngay'} titleVi={t('interventions.needsImmediate') || 'Cần can thiệp ngay'}>
            {interventions.length > 0 ? (
              <div className="space-y-3">
                {interventions.map((intervention) => (
                  <InterventionCard
                    key={intervention.id}
                    intervention={intervention}
                    onViewDetails={() => router.push(`/teacher/interventions`)}
                    onAssign={() => router.push(`/teacher/interventions`)}
                  />
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/teacher/interventions')}
                  className="w-full"
                >
                  {t('teacher.viewAllInterventions') || 'Xem tất cả can thiệp'}
                </Button>
              </div>
            ) : (
              <EmptyState
                title="No interventions needed"
                titleVi={t('teacher.noInterventions') || 'Không có can thiệp nào'}
                description="All students are doing well"
                descriptionVi={t('teacher.studentsProgressing') || 'Tất cả học sinh đều đang tiến bộ tốt'}
              />
            )}
          </PageSection>

          {/* Recent Activity */}
          <PageSection title={t('teacher.recentActivity') || 'Hoạt động gần đây'} titleVi={t('teacher.recentActivity') || 'Hoạt động gần đây'}>
            <Card variant="default" padding="none">
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              {activities.length === 0 && (
                <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  {t('common.noActivity') || 'Chưa có hoạt động nào'}
                </div>
              )}
            </Card>
          </PageSection>
        </div>
      </div>
    </DashboardLayoutWrapper>
  )
}
