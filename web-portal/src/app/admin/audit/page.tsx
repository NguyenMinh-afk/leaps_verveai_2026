'use client'

import * as React from 'react'
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
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { AuditLogEntry } from '@/types'
import { api } from '@/lib/api/apiClient'

// Backend audit response type
interface BackendAuditResponse {
  items: Array<{
    id: string
    action: string
    entity_type: string
    entity_id: string
    entity_name: string
    actor_id: string
    actor_name: string
    actor_role: string
    status: string
    details?: string
    ip_address?: string
    created_at: string
  }>
  total: number
  skip: number
  take: number
}

/**
 * Audit Row Component
 */
interface AuditRowProps {
  entry: AuditLogEntry
}

const AuditRow: React.FC<AuditRowProps> = ({ entry }) => {
  const { t } = useLanguage()
  const statusConfig = {
    success: { label: t('common.success'), color: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300' },
    failure: { label: t('common.error'), color: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300' },
    pending: { label: t('common.pending'), color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  }

  const roleConfig = {
    admin: t('auth.admin'),
    teacher: t('auth.teacher'),
    student: t('auth.student'),
    reviewer: t('admin.reviewer'),
    system: t('admin.system'),
  }

  const status = statusConfig[entry.status]

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {entry.actorName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {roleConfig[entry.actorRole]}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-900 dark:text-slate-100">
          {entry.actionVi}
        </p>
        {entry.details && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {entry.detailsVi}
          </p>
        )}
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-900 dark:text-slate-100">
          {entry.entityNameVi}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {entry.entityType}
        </p>
      </td>
      <td className="px-4 py-3">
        <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', status.color)}>
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {formatRelativeTime(new Date(entry.timestamp))}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {formatDate(new Date(entry.timestamp))}
        </p>
      </td>
    </tr>
  )
}

/**
 * Audit Page
 */
export default function AuditPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('admin')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [actorFilter, setActorFilter] = React.useState('all')
  const [actionFilter, setActionFilter] = React.useState('all')
  const [entries, setEntries] = React.useState<AuditLogEntry[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  // Fetch audit entries from real API
  const fetchAuditEntries = React.useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const response = await api.get<BackendAuditResponse>('/api/auth/audit')
      const mappedEntries: AuditLogEntry[] = response.items.map((item) => ({
        id: item.id,
        action: item.action,
        actionVi: item.action,
        entityType: item.entity_type as AuditLogEntry['entityType'],
        entityId: item.entity_id,
        entityName: item.entity_name,
        entityNameVi: item.entity_name,
        actorId: item.actor_id,
        actorName: item.actor_name,
        actorRole: item.actor_role as AuditLogEntry['actorRole'],
        status: item.status as AuditLogEntry['status'],
        details: item.details,
        detailsVi: item.details,
        ipAddress: item.ip_address,
        timestamp: new Date(item.created_at),
      }))
      setEntries(mappedEntries)
    } catch (err) {
      setLoadError('Không thể tải nhật ký kiểm toán')
      setEntries([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchAuditEntries()
  }, [fetchAuditEntries])

  // Filter entries
  const filteredEntries = React.useMemo(() => {
    let result = [...entries]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(e =>
        e.actorName.toLowerCase().includes(query) ||
        e.action.toLowerCase().includes(query) ||
        e.actionVi?.toLowerCase().includes(query) ||
        e.entityName.toLowerCase().includes(query) ||
        e.entityNameVi?.toLowerCase().includes(query)
      )
    }

    // Actor filter
    if (actorFilter !== 'all') {
      result = result.filter(e => e.actorRole === actorFilter)
    }

    // Action filter
    if (actionFilter !== 'all') {
      result = result.filter(e => e.action.includes(actionFilter))
    }

    return result
  }, [entries, searchQuery, actorFilter, actionFilter])

  const userDisplay = {
    name: user?.name || 'Admin',
    email: user?.email || '',
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'Audit Log', labelVi: 'Nhật ký' },
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

  const handleRetry = () => {
    fetchAuditEntries()
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
          title="Audit Log"
          titleVi="Nhật ký Kiểm toán"
          description="System activity and audit trail"
          descriptionVi="Hoạt động hệ thống và nhật ký kiểm toán"
        />

        {/* Filters */}
        <Card variant="default" padding="md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Input
              placeholder={t('common.search') + '...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              <select
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="all">{t('common.all')} {t('common.role')}</option>
                <option value="admin">{t('auth.admin')}</option>
                <option value="teacher">{t('auth.teacher')}</option>
                <option value="student">{t('auth.student')}</option>
                <option value="reviewer">{t('admin.reviewer')}</option>
                <option value="system">{t('admin.system')}</option>
              </select>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="all">{t('common.all')} {t('common.actions')}</option>
                <option value="user_">{t('nav.users')}</option>
                <option value="question_">{t('questions.title')}</option>
                <option value="ai_generation">{t('nav.aiGeneration')}</option>
                <option value="settings_">{t('settings.title')}</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card variant="default" padding="lg">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-verve-200 border-t-verve-600"></div>
              <p className="mt-4 text-sm text-slate-500">Đang tải nhật ký kiểm toán...</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {!isLoading && loadError && (
          <Card variant="default" padding="lg" className="border-error-200 dark:border-error-800">
            <div className="flex flex-col items-center justify-center py-8">
              <svg className="h-12 w-12 text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-4 text-sm text-error-600 dark:text-error-400">{loadError}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={handleRetry}>
                Thử lại
              </Button>
            </div>
          </Card>
        )}

        {/* Audit Table */}
        {!isLoading && !loadError && (
          <Card variant="default" padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('admin.performer')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('common.actions')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('admin.target')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('common.status')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('common.time')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredEntries.map((entry) => (
                    <AuditRow key={entry.id} entry={entry} />
                  ))}
                </tbody>
              </table>
            </div>
            {filteredEntries.length === 0 && (
              <div className="p-8">
                <EmptyState
                  title="No entries found"
                  titleVi="Không tìm thấy mục nào"
                  description="No audit log entries match your criteria"
                  descriptionVi="Không có mục nào phù hợp với tiêu chí của bạn"
                />
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayoutWrapper>
  )
}
