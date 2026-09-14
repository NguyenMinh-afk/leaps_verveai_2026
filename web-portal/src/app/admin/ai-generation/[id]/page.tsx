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
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import { api } from '@/lib/api/apiClient'

// Backend AI generation job detail response type
interface BackendAIGenerationDetailResponse {
  id: string
  status: string
  course_id: string
  course_name: string
  topic_id: string
  topic_name: string
  source_document?: string
  requested_count: number
  generated_count: number
  approved_count: number
  rejected_count: number
  error_message?: string
  requested_by: string
  requested_by_name: string
  created_at: string
  started_at?: string
  completed_at?: string
}

/**
 * AI Generation Job Detail Page
 */
export default function AIGenerationJobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('admin')
  const [job, setJob] = React.useState<BackendAIGenerationDetailResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  // Fetch job from real API
  React.useEffect(() => {
    async function fetchJob() {
      setIsLoading(true)
      setLoadError(null)
      try {
        const response = await api.get<BackendAIGenerationDetailResponse>(`/api/ai/jobs/${jobId}`)
        setJob(response)
      } catch {
        setLoadError('Không thể tải thông tin công việc')
        setJob(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (jobId) {
      fetchJob()
    }
  }, [jobId])

  const userDisplay = {
    name: user?.name || 'Admin',
    email: user?.email || '',
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'AI Generation', labelVi: 'Tạo AI', href: '/admin/ai-generation' },
    { label: job?.id || 'Job', labelVi: job?.id || 'Công việc' },
  ]

  const handleRoleChange = (newRole: UserRole) => {
    router.push('/')
  }

  const handleSignOut = () => {
    router.push('/')
  }

  const handleSettings = () => {
    router.push('/admin/settings')
  }

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-verve-200 border-t-verve-600"></div>
            <p className="text-sm text-slate-500">Đang tải thông tin công việc...</p>
          </div>
        </div>
      </DashboardLayoutWrapper>
    )
  }

  // Error state
  if (loadError || !job) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Job not found"
          titleVi="Không tìm thấy công việc"
          description={loadError || "The job you're looking for doesn't exist"}
          descriptionVi={loadError || 'Công việc bạn đang tìm kiếm không tồn tại'}
          action={
            <Button variant="primary" onClick={() => router.push('/admin/ai-generation')}>
              Quay lại AI Generation
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  const statusConfig = {
    pending: { label: 'Đang chờ', variant: 'default' as const, color: 'border-slate-500' },
    processing: { label: 'Đang xử lý', variant: 'info' as const, color: 'border-info-500' },
    completed: { label: 'Hoàn thành', variant: 'success' as const, color: 'border-success-500' },
    failed: { label: 'Thất bại', variant: 'error' as const, color: 'border-error-500' },
    cancelled: { label: 'Đã hủy', variant: 'default' as const, color: 'border-slate-500' },
  }

  const config = statusConfig[job.status as keyof typeof statusConfig] || statusConfig.pending

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
          title={`AI Generation Job: ${job.id}`}
          titleVi={`Công việc Tạo AI: ${job.id}`}
          description={job.course_name}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/ai-generation')}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </Button>
              {job.status === 'pending' && (
                <Button variant="destructive" size="sm">
                  Hủy công việc
                </Button>
              )}
            </div>
          }
        />

        {/* Status Banner */}
        <Card variant="default" padding="lg" className={cn('border-l-4', config.color)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={config.variant} size="lg">
                {config.label}
              </Badge>
              {job.status === 'processing' && (
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-info-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm text-info-600 dark:text-info-400">Đang xử lý...</span>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Yêu cầu bởi: {job.requested_by_name}
            </p>
          </div>
        </Card>

        {/* Error Message */}
        {job.error_message && (
          <Card variant="default" padding="lg" className="border-l-4 border-error-500">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-medium text-error-900 dark:text-error-100">Lỗi xảy ra</h4>
                <p className="mt-1 text-sm text-error-700 dark:text-error-300">{job.error_message}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Details Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Job Information */}
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Thông tin công việc
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">ID</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{job.id}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Khóa học</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{job.course_name}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Chủ đề</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{job.topic_name}</p>
              </div>
              {job.source_document && (
                <div className="flex justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tài liệu nguồn</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{job.source_document}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Timing Information */}
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Thông tin thời gian
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Ngày tạo</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatDate(new Date(job.created_at))}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Bắt đầu</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {job.started_at ? formatRelativeTime(new Date(job.started_at)) : 'Chưa bắt đầu'}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Hoàn thành</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {job.completed_at ? formatRelativeTime(new Date(job.completed_at)) : 'Chưa hoàn thành'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <Card variant="default" padding="lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Kết quả
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800/50">
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{job.requested_count}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Yêu cầu</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800/50">
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{job.generated_count}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Đã tạo</p>
            </div>
            <div className="rounded-lg bg-success-50 p-4 text-center dark:bg-success-900/20">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">{job.approved_count}</p>
              <p className="mt-1 text-sm text-success-700 dark:text-success-300">Đã duyệt</p>
            </div>
            <div className="rounded-lg bg-error-50 p-4 text-center dark:bg-error-900/20">
              <p className="text-3xl font-bold text-error-600 dark:text-error-400">{job.rejected_count}</p>
              <p className="mt-1 text-sm text-error-700 dark:text-error-300">Từ chối</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayoutWrapper>
  )
}
