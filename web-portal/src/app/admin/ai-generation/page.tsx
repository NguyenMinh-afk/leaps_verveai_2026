'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  Input,
} from '@/components/ui'
import { formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { AIGenerationJob } from '@/types'
import { api } from '@/lib/api/apiClient'

// Backend AI generation job response type
interface BackendAIGenerationResponse {
  items: Array<{
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
  }>
  total: number
  skip: number
  take: number
}

/**
 * Job Card Component
 */
interface JobCardProps {
  job: AIGenerationJob
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { t } = useLanguage()
  const statusConfig = {
    pending: { label: t('common.pending'), variant: 'default' as const, color: 'text-slate-600 dark:text-slate-400' },
    processing: { label: t('admin.processing'), variant: 'info' as const, color: 'text-info-600 dark:text-info-400' },
    completed: { label: t('admin.completed'), variant: 'success' as const, color: 'text-success-600 dark:text-success-400' },
    failed: { label: t('admin.failed'), variant: 'error' as const, color: 'text-error-600 dark:text-error-400' },
    cancelled: { label: t('admin.cancelled'), variant: 'default' as const, color: 'text-slate-600 dark:text-slate-400' },
  }

  const config = statusConfig[job.status] || statusConfig.pending

  return (
    <Link href={`/admin/ai-generation/${job.id}`}>
      <Card variant="interactive" padding="lg" className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {job.courseNameVi}
              </h4>
              <Badge variant={config.variant} size="sm">
                {config.label}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {job.topicNameVi}
            </p>
          </div>
        </div>

        {job.sourceDocument && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {t('admin.sourceDocument')}: {job.sourceDocument}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {job.generatedCount}/{job.requestedCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('admin.generated')}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
            <p className="text-lg font-bold text-success-600 dark:text-success-400">
              {job.approvedCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('questions.approved')}</p>
          </div>
        </div>

        {job.errorMessage && (
          <div className="mt-3 rounded-lg bg-error-50 p-2 text-xs text-error-700 dark:bg-error-900/20 dark:text-error-300">
            {t('common.error')}: {job.errorMessage}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{t('common.requestedBy')}: {job.requestedByName}</span>
        </div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span>{formatRelativeTime(new Date(job.createdAt))}</span>
          {job.completedAt && (
            <span> • {t('admin.completed')}: {formatRelativeTime(new Date(job.completedAt))}</span>
          )}
        </div>
      </Card>
    </Link>
  )
}

/**
 * AI Generation Page
 */
export default function AIGenerationPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('admin')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [jobs, setJobs] = React.useState<AIGenerationJob[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  // Fetch AI generation jobs from real API
  const fetchJobs = React.useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      params.set('take', '50')
      
      const query = params.toString()
      try {
        const response = await api.get<BackendAIGenerationResponse>(`/api/ai/jobs${query ? `?${query}` : ''}`)
        
        // Map backend response to frontend type
        const mappedJobs: AIGenerationJob[] = response.items.map((item) => ({
          id: item.id,
          status: item.status as AIGenerationJob['status'],
          courseId: item.course_id,
          courseName: item.course_name,
          courseNameVi: item.course_name,
          topicId: item.topic_id,
          topicName: item.topic_name,
          topicNameVi: item.topic_name,
          sourceDocument: item.source_document,
          requestedCount: item.requested_count,
          generatedCount: item.generated_count,
          approvedCount: item.approved_count,
          rejectedCount: item.rejected_count,
          errorMessage: item.error_message,
          requestedBy: item.requested_by,
          requestedByName: item.requested_by_name,
          createdAt: new Date(item.created_at),
          startedAt: item.started_at ? new Date(item.started_at) : undefined,
          completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
        }))
        
        setJobs(mappedJobs)
      } catch {
        // API endpoint might not exist - show empty state
        setJobs([])
      }
    } catch (err) {
      setLoadError('Không thể tải danh sách công việc AI')
      setJobs([])
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter])

  React.useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Filter jobs
  const filteredJobs = React.useMemo(() => {
    let result = [...jobs]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(j =>
        j.courseName.toLowerCase().includes(query) ||
        j.courseNameVi.toLowerCase().includes(query) ||
        j.topicName.toLowerCase().includes(query) ||
        j.requestedByName.toLowerCase().includes(query)
      )
    }

    // Status filter (already done in API call, but keep for client-side)
    if (statusFilter !== 'all') {
      result = result.filter(j => j.status === statusFilter)
    }

    return result
  }, [jobs, searchQuery, statusFilter])

  // Stats
  const stats = React.useMemo(() => ({
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    processing: jobs.filter(j => j.status === 'processing').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  }), [jobs])

  const userDisplay = {
    name: user?.name || 'Admin',
    email: user?.email || '',
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'AI Generation', labelVi: 'Tạo AI' },
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
          title="AI Generation Monitoring"
          titleVi="Giám sát Tạo AI"
          description="Monitor AI question generation jobs"
          descriptionVi="Giám sát công việc tạo câu hỏi bằng AI"
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.totalJobs')}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.pending')}</p>
            <p className="mt-1 text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.pending}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.processing')}</p>
            <p className="mt-1 text-2xl font-bold text-info-600 dark:text-info-400">{stats.processing}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.completed')}</p>
            <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{stats.completed}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.failed')}</p>
            <p className="mt-1 text-2xl font-bold text-error-600 dark:text-error-400">{stats.failed}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="default" padding="md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Input
              placeholder={t('common.search') + '...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="all">{t('common.all')} {t('common.status')}</option>
                <option value="pending">{t('common.pending')}</option>
                <option value="processing">{t('admin.processing')}</option>
                <option value="completed">{t('admin.completed')}</option>
                <option value="failed">{t('admin.failed')}</option>
                <option value="cancelled">{t('admin.cancelled')}</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Jobs Grid */}
        {isLoading ? (
          <Card variant="default" padding="lg">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-verve-200 border-t-verve-600"></div>
              <p className="mt-4 text-sm text-slate-500">Đang tải công việc AI...</p>
            </div>
          </Card>
        ) : loadError ? (
          <Card variant="default" padding="lg" className="border-error-200 dark:border-error-800">
            <div className="flex flex-col items-center justify-center py-8">
              <svg className="h-12 w-12 text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-4 text-sm text-error-600 dark:text-error-400">{loadError}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={fetchJobs}>
                Thử lại
              </Button>
            </div>
          </Card>
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No jobs found"
            titleVi="Không tìm thấy công việc"
            description="No AI generation jobs match your criteria"
            descriptionVi="Không có công việc nào phù hợp với tiêu chí của bạn"
          />
        )}
      </div>
    </DashboardLayoutWrapper>
  )
}
