'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
  PageSection,
  PageGrid,
  EmptyState,
} from '@/components/layout'
import {
  Card,
  Button,
  Badge,
} from '@/components/ui'
import {
  mockAdminProfile,
  mockAdminDashboardStats,
  mockAuditLogEntries,
  mockAIGenerationJobs,
} from '@/data/admin-mock-data'
import { formatRelativeTime } from '@/lib/utils'
import { authService } from '@/services/auth'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'

/**
 * Stat Card Component
 */
interface StatCardProps {
  title: string
  titleVi: string
  value: string | number
  icon: React.ReactNode
  color: string
  trend?: 'up' | 'down'
  trendValue?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, titleVi, value, icon, color, trend, trendValue }) => {
  const { t } = useLanguage()
  return (
  <Card variant="default" padding="md">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{titleVi}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        {trendValue && (
          <p className={cn(
            'mt-1 text-xs font-medium',
            trend === 'up' ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
          )}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </p>
        )}
      </div>
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', color)}>
        {icon}
      </div>
    </div>
  </Card>
  )
}

/**
 * Activity Item Component
 */
interface ActivityItemProps {
  actorName: string
  action: string
  actionVi: string
  entity: string
  entityVi: string
  timestamp: Date
  status: 'success' | 'failure' | 'pending'
}

const ActivityItem: React.FC<ActivityItemProps> = ({ actorName, action, actionVi, entity, entityVi, timestamp, status }) => {
  const { t } = useLanguage()
  const statusColors = {
    success: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
    failure: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  }

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium', statusColors[status])}>
        {status === 'success' ? '✓' : status === 'failure' ? '✗' : '○'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900 dark:text-slate-100">
          <span className="font-medium">{actorName}</span>{' '}
          <span className="text-slate-600 dark:text-slate-400">{actionVi}</span>{' '}
          <span className="font-medium">{entityVi}</span>
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {formatRelativeTime(timestamp)}
        </p>
      </div>
    </div>
  )
}

/**
 * AI Job Status Component
 */
interface AIJobStatusProps {
  job: typeof mockAIGenerationJobs[0]
}

const AIJobStatus: React.FC<AIJobStatusProps> = ({ job }) => {
  const { t } = useLanguage()
  const statusConfig = {
    pending: { label: t('common.pending'), variant: 'default' as const, color: 'text-slate-600 dark:text-slate-400' },
    processing: { label: t('admin.processing'), variant: 'info' as const, color: 'text-info-600 dark:text-info-400' },
    completed: { label: t('admin.completed'), variant: 'success' as const, color: 'text-success-600 dark:text-success-400' },
    failed: { label: t('admin.failed'), variant: 'error' as const, color: 'text-error-600 dark:text-error-400' },
    cancelled: { label: t('admin.cancelled'), variant: 'default' as const, color: 'text-slate-600 dark:text-slate-400' },
  }

  const config = statusConfig[job.status]

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
          {job.courseNameVi}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {job.requestedCount} {t('questions.title').toLowerCase()} • {formatRelativeTime(job.createdAt)}
        </p>
      </div>
      <Badge variant={config.variant} size="sm">
        {config.label}
      </Badge>
    </div>
  )
}

/**
 * Admin Dashboard Page
 */
export default function AdminDashboardPage() {
  const router = useRouter()
  const [currentRole] = React.useState<UserRole>('admin')
  const { t } = useLanguage()

  const admin = mockAdminProfile
  const stats = mockAdminDashboardStats
  const recentActivity = mockAuditLogEntries.slice(0, 5)
  const activeJobs = mockAIGenerationJobs.filter(j => j.status === 'processing' || j.status === 'pending')

  const user = {
    name: admin.name,
    email: admin.email,
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị' },
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
    router.push('/admin/settings')
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
          title="Admin Dashboard"
          titleVi="Bảng điều khiển Quản trị"
          description="System overview and management"
          descriptionVi="Tổng quan và quản lý hệ thống"
        />

        {/* System Overview */}
        <PageSection title={t('admin.systemOverview')} titleVi={t('admin.systemOverview')}>
          <PageGrid columns={4} gap="md">
            <StatCard
              title="Total Users"
              titleVi={t('admin.totalUsers')}
              value={stats.totalUsers.toLocaleString()}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              color="bg-verve-600"
              trend="up"
              trendValue={t('admin.trendVsLastMonth')}
            />
            <StatCard
              title="Active Users"
              titleVi={t('admin.activeUsers')}
              value={stats.activeUsers.toLocaleString()}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              }
              color="bg-success-600"
            />
            <StatCard
              title="Teachers"
              titleVi={t('nav.teacher')}
              value={stats.teachers}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              color="bg-amber-600"
            />
            <StatCard
              title="Students"
              titleVi={t('nav.students')}
              value={stats.students.toLocaleString()}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.896 1.464 16 5.568 16 12s-5.104 10.536-12 10.536S4 18.432 4 12 9.104 1.464 12 1.464z" />
                </svg>
              }
              color="bg-info-600"
            />
          </PageGrid>
        </PageSection>

        {/* Content Overview */}
        <PageSection title={t('admin.contentOverview')} titleVi={t('admin.contentOverview')}>
          <PageGrid columns={4} gap="md">
            <StatCard
              title="Total Questions"
              titleVi={t('admin.totalQuestions')}
              value={stats.totalQuestions.toLocaleString()}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-purple-600"
            />
            <StatCard
              title="Pending Review"
              titleVi={t('questions.pending')}
              value={stats.pendingReview}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-amber-600"
            />
            <StatCard
              title="Published"
              titleVi={t('common.published')}
              value={stats.publishedQuestions.toLocaleString()}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-success-600"
            />
            <StatCard
              title="Courses"
              titleVi={t('nav.courses')}
              value={stats.totalCourses}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
              color="bg-cyan-600"
            />
          </PageGrid>
        </PageSection>

        {/* AI Generation Overview */}
        <PageSection title={t('admin.aiOverview')} titleVi={t('admin.aiOverview')}>
          <PageGrid columns={4} gap="md">
            <StatCard
              title="Total Jobs"
              titleVi={t('admin.totalJobs')}
              value={stats.aiJobsTotal}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
              color="bg-violet-600"
            />
            <StatCard
              title="Processing"
              titleVi={t('admin.processing')}
              value={stats.aiJobsProcessing}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              color="bg-info-600"
            />
            <StatCard
              title="Completed"
              titleVi={t('admin.completed')}
              value={stats.aiJobsCompleted}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-success-600"
            />
            <StatCard
              title="Failed"
              titleVi={t('admin.failed')}
              value={stats.aiJobsFailed}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              color="bg-error-600"
            />
          </PageGrid>
        </PageSection>

        {/* Recent Activity and AI Jobs */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <PageSection title={t('admin.recentActivity')} titleVi={t('admin.recentActivity')}>
            <Card variant="default" padding="md">
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {recentActivity.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    actorName={activity.actorName}
                    action={activity.action}
                    actionVi={activity.actionVi}
                    entity={activity.entityName}
                    entityVi={activity.entityNameVi}
                    timestamp={new Date(activity.timestamp)}
                    status={activity.status}
                  />
                ))}
              </div>
              {recentActivity.length === 0 && (
                <p className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  {t('admin.noActivity')}
                </p>
              )}
              <div className="mt-4">
                <Button variant="ghost" size="sm" onClick={() => router.push('/admin/audit')} className="w-full">
                  {t('admin.viewAllLogs')}
                </Button>
              </div>
            </Card>
          </PageSection>

          {/* Active AI Jobs */}
          <PageSection title={t('admin.activeAIJobs')} titleVi={t('admin.activeAIJobs')}>
            <Card variant="default" padding="md">
              <div className="space-y-3">
                {activeJobs.length > 0 ? (
                  activeJobs.map((job) => (
                    <AIJobStatus key={job.id} job={job} />
                  ))
                ) : (
                  <p className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    {t('admin.noActiveAIJobs')}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button variant="ghost" size="sm" onClick={() => router.push('/admin/ai-generation')} className="w-full">
                  {t('admin.viewAllJobs')}
                </Button>
              </div>
            </Card>
          </PageSection>
        </div>
      </div>
    </DashboardLayoutWrapper>
  )
}
