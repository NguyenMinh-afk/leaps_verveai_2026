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
} from '@/components/ui'
import { authService } from '@/services/auth'
import { adminService, type ReportStats } from '@/services/admin/admin.service'
import type { UserRole, BreadcrumbItem } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'

// Helper to check if current language is Vietnamese
function useIsVietnamese() {
  const { language } = useLanguage()
  return language === 'vi'
}

// Types for reports - using the real API response structure
interface ReportStatsData {
  userStats: {
    total: number
    active: number
    inactive: number
    byRole: Record<string, number>
  }
  classStats: {
    total: number
    active: number
    archived: number
    totalStudents: number
    totalTeachers: number
  }
  questionStats: {
    total: number
    draft: number
    pendingReview: number
    approved: number
    rejected: number
    byDifficulty: Record<string, number>
    topicCount: number
  }
  examStats: {
    total: number
    draft: number
    published: number
    archived: number
    totalAttempts: number
    completedAttempts: number
  }
  diagnosisStats: {
    totalDiagnoses: number
    mastered: number
    diagnosed: number
    struggling: number
    pending: number
    averagePKnown: number
  }
  interventionStats: {
    total: number
    active: number
    resolved: number
  }
}

interface DeviceStats {
  totalDevices: number
  onlineDevices: number
  offlineDevices: number
  lastSync: string | null
}

// Default empty state
const EMPTY_STATS: ReportStatsData = {
  userStats: { total: 0, active: 0, inactive: 0, byRole: {} },
  classStats: { total: 0, active: 0, archived: 0, totalStudents: 0, totalTeachers: 0 },
  questionStats: { total: 0, draft: 0, pendingReview: 0, approved: 0, rejected: 0, byDifficulty: {}, topicCount: 0 },
  examStats: { total: 0, draft: 0, published: 0, archived: 0, totalAttempts: 0, completedAttempts: 0 },
  diagnosisStats: { totalDiagnoses: 0, mastered: 0, diagnosed: 0, struggling: 0, pending: 0, averagePKnown: 0 },
  interventionStats: { total: 0, active: 0, resolved: 0 },
}

const EMPTY_DEVICES: DeviceStats = {
  totalDevices: 0,
  onlineDevices: 0,
  offlineDevices: 0,
  lastSync: null,
}

/**
 * Stats Card Component
 */
interface ReportStatsCardProps {
  label: string
  labelVi: string
  value: number | string
  icon: React.ReactNode
  color: string
  trend?: number
}

const ReportStatsCard: React.FC<ReportStatsCardProps> = ({ 
  label, 
  labelVi, 
  value, 
  icon, 
  color,
  trend 
}) => {
  const isVietnamese = useIsVietnamese()

  return (
    <Card variant="default" padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isVietnamese ? labelVi : label}
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend !== undefined && (
            <p className={cn(
              'mt-1 text-xs font-medium',
              trend > 0 ? 'text-success-600 dark:text-success-400' : 
              trend < 0 ? 'text-error-600 dark:text-error-400' : 
              'text-slate-500'
            )}>
              {trend > 0 ? '+' : ''}{trend}% {isVietnamese ? 'so với tuần trước' : 'vs last week'}
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
 * Admin Reports Page
 * Fetches real statistics from the backend API
 */
export default function AdminReportsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const isVietnamese = useIsVietnamese()
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentUser, setCurrentUser] = React.useState<{ id: string; name: string; email: string; role: UserRole } | null>(null)
  const [stats, setStats] = React.useState<ReportStatsData | null>(null)
  const [deviceStats] = React.useState<DeviceStats>(EMPTY_DEVICES)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch report data from real API
  React.useEffect(() => {
    async function loadData() {
      try {
        // Get current session
        const session = await authService.getSession()
        if (!session?.user) {
          router.push('/login')
          return
        }
        
        setCurrentUser({
          id: session.user.id || '',
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        })

        // Check if user is admin
        if (session.user.role !== 'admin') {
          router.push('/')
          return
        }

        // Fetch real report statistics from the API
        const reportStats = await adminService.getReportStats()
        setStats(reportStats)
      } catch (err) {
        console.error('Failed to load reports:', err)
        setError(err instanceof Error ? err.message : 'Failed to load reports')
        // Still show empty stats on error
        setStats(EMPTY_STATS)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [router])

  // User display object for DashboardLayoutWrapper
  const userDisplay = currentUser ? {
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
  } : { name: 'Admin', email: '', role: 'admin' as UserRole }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/admin' },
    { label: isVietnamese ? 'Báo cáo' : 'Reports', labelVi: 'Báo cáo' },
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

  // Calculate effective stats (with fallback to 0)
  const effectiveStats = stats ?? EMPTY_STATS
  
  // Calculate average mastery from diagnoses
  const averageMastery = effectiveStats.diagnosisStats.averagePKnown || 0
  const studentsNeedingIntervention = effectiveStats.interventionStats.active || 0

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
          title="System Reports"
          titleVi="Báo cáo hệ thống"
          description="Overview of system usage and analytics"
          descriptionVi="Tổng quan về sử dụng và phân tích hệ thống"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {isVietnamese ? 'Xuất báo cáo' : 'Export Report'}
              </Button>
            </div>
          }
        />

        {error ? (
          <EmptyState
            title="Error loading reports"
            titleVi="Lỗi khi tải báo cáo"
            description={error}
            descriptionVi={error}
            action={
              <Button variant="primary" onClick={() => window.location.reload()}>
                {isVietnamese ? 'Thử lại' : 'Retry'}
              </Button>
            }
          />
        ) : (
          <>
            {/* System Overview Stats */}
            <PageSection 
              title="System Overview" 
              titleVi="Tổng quan hệ thống"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <ReportStatsCard
                  label="Total Classes"
                  labelVi="Tổng lớp học"
                  value={effectiveStats.classStats.total || 0}
                  icon={
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  }
                  color="bg-info-600"
                />
                <ReportStatsCard
                  label="Total Students"
                  labelVi="Tổng học sinh"
                  value={effectiveStats.classStats.totalStudents || 0}
                  icon={
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                  color="bg-verve-600"
                />
                <ReportStatsCard
                  label="Total Teachers"
                  labelVi="Tổng giáo viên"
                  value={effectiveStats.classStats.totalTeachers || 0}
                  icon={
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  color="bg-success-600"
                />
                <ReportStatsCard
                  label="Total Questions"
                  labelVi="Tổng câu hỏi"
                  value={effectiveStats.questionStats.total || 0}
                  icon={
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  color="bg-warning-600"
                />
                <ReportStatsCard
                  label="Avg. Mastery"
                  labelVi="Độ thành thạo TB"
                  value={`${Math.round(averageMastery * 100)}%`}
                  icon={
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                  color="bg-verve-500"
                />
                <ReportStatsCard
                  label="Needs Intervention"
                  labelVi="Cần can thiệp"
                  value={studentsNeedingIntervention}
                  icon={
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                  color="bg-error-600"
                />
              </div>
            </PageSection>

            {/* Report Types */}
            <PageSection 
              title="Report Types" 
              titleVi="Loại báo cáo"
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card variant="interactive" padding="md" onClick={() => router.push('/admin/classes')}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info-100 text-info-600 dark:bg-info-900/30 dark:text-info-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                        {isVietnamese ? 'Báo cáo lớp học' : 'Class Report'}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {isVietnamese ? 'Thông tin chi tiết về các lớp học và học sinh' : 'Detailed information about classes and students'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="interactive" padding="md" onClick={() => router.push('/admin/devices')}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                        {isVietnamese ? 'Báo cáo thiết bị' : 'Device Report'}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {isVietnamese ? 'Trạng thái đồng bộ và kết nối thiết bị' : 'Device sync status and connectivity'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="interactive" padding="md">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-verve-100 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                        {isVietnamese ? 'Báo cáo học tập' : 'Learning Report'}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {isVietnamese ? 'Phân tích tiến độ và thành tích học sinh' : 'Student progress and performance analysis'}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </PageSection>

            {/* Detailed Statistics */}
            <PageSection 
              title="Detailed Statistics" 
              titleVi="Thống kê chi tiết"
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Users */}
                <Card variant="default" padding="md">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    {isVietnamese ? 'Người dùng' : 'Users'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Tổng' : 'Total'}:</span>
                      <span className="font-medium">{effectiveStats.userStats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Đang hoạt động' : 'Active'}:</span>
                      <span className="font-medium text-success-600">{effectiveStats.userStats.active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Không hoạt động' : 'Inactive'}:</span>
                      <span className="font-medium">{effectiveStats.userStats.inactive}</span>
                    </div>
                  </div>
                </Card>

                {/* Questions */}
                <Card variant="default" padding="md">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    {isVietnamese ? 'Câu hỏi' : 'Questions'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Tổng' : 'Total'}:</span>
                      <span className="font-medium">{effectiveStats.questionStats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Đã duyệt' : 'Approved'}:</span>
                      <span className="font-medium text-success-600">{effectiveStats.questionStats.approved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Chờ duyệt' : 'Pending'}:</span>
                      <span className="font-medium text-warning-600">{effectiveStats.questionStats.pendingReview}</span>
                    </div>
                  </div>
                </Card>

                {/* Exams */}
                <Card variant="default" padding="md">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    {isVietnamese ? 'Bài thi' : 'Exams'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Tổng' : 'Total'}:</span>
                      <span className="font-medium">{effectiveStats.examStats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Đã xuất bản' : 'Published'}:</span>
                      <span className="font-medium text-success-600">{effectiveStats.examStats.published}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Lượt thi' : 'Attempts'}:</span>
                      <span className="font-medium">{effectiveStats.examStats.totalAttempts}</span>
                    </div>
                  </div>
                </Card>

                {/* Diagnosis */}
                <Card variant="default" padding="md">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    {isVietnamese ? 'Chẩn đoán' : 'Diagnosis'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Đã thành thạo' : 'Mastered'}:</span>
                      <span className="font-medium text-success-600">{effectiveStats.diagnosisStats.mastered}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Đã chẩn đoán' : 'Diagnosed'}:</span>
                      <span className="font-medium text-info-600">{effectiveStats.diagnosisStats.diagnosed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isVietnamese ? 'Cần cải thiện' : 'Struggling'}:</span>
                      <span className="font-medium text-error-600">{effectiveStats.diagnosisStats.struggling}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </PageSection>
          </>
        )}
      </div>
    </DashboardLayoutWrapper>
  )
}
