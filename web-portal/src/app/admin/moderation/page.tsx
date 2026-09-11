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
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import {
  mockAdminProfile,
  mockModerationItems,
} from '@/data/admin-mock-data'
import { formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { ModerationItem } from '@/types'

/**
 * Moderation Card Component
 */
interface ModerationCardProps {
  item: ModerationItem
}

const ModerationCard: React.FC<ModerationCardProps> = ({ item }) => {
  const { t } = useLanguage()
  const statusConfig = {
    pending: { label: t('common.pending'), variant: 'warning' as const },
    approved: { label: t('questions.approved'), variant: 'success' as const },
    rejected: { label: t('questions.rejected'), variant: 'error' as const },
    'changes-requested': { label: t('admin.changesRequested'), variant: 'default' as const },
  }

  const typeConfig = {
    question: { label: t('questions.title'), icon: '?' },
    'ai-generation': { label: t('nav.aiGeneration'), icon: 'AI' },
    content: { label: t('common.details'), icon: 'C' },
  }

  const status = statusConfig[item.status]
  const type = typeConfig[item.type]

  return (
    <Card variant="default" padding="lg" className="h-full">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {type.icon}
          </div>
          <div>
            <Badge variant={item.source === 'ai-generated' ? 'info' : 'default'} size="sm">
              {item.source === 'ai-generated' ? 'AI' : item.creatorRole === 'teacher' ? t('auth.teacher') : t('common.other')}
            </Badge>
          </div>
        </div>
        <Badge variant={status.variant} size="sm">
          {status.label}
        </Badge>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {item.contentVi}
        </p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {t('mastery.topics')}: {item.topicNameVi}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{t('common.createdBy')}: {item.creatorName}</span>
        <span>{formatRelativeTime(new Date(item.createdAt))}</span>
      </div>

      {item.reason && (
        <div className="mt-3 rounded-lg bg-error-50 p-2 text-xs text-error-700 dark:bg-error-900/20 dark:text-error-300">
          {t('interventions.reason')}: {item.reasonVi || item.reason}
        </div>
      )}

      {item.status === 'pending' && (
        <div className="mt-4 flex gap-2">
          <Button variant="primary" size="sm" className="flex-1">
            {t('questions.approve')}
          </Button>
          <Button variant="destructive" size="sm" className="flex-1">
            {t('questions.reject')}
          </Button>
        </div>
      )}

      {!item.reviewedAt && item.status === 'pending' && (
        <Button variant="ghost" size="sm" className="mt-2 w-full">
          {t('common.details')}
        </Button>
      )}
    </Card>
  )
}

/**
 * Moderation Page
 */
export default function ModerationPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentRole] = React.useState<UserRole>('admin')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('pending')

  const admin = mockAdminProfile
  const items = mockModerationItems

  // Filter items
  const filteredItems = React.useMemo(() => {
    let result = [...items]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(i =>
        i.content.toLowerCase().includes(query) ||
        i.contentVi.toLowerCase().includes(query) ||
        i.creatorName.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(i => i.status === statusFilter)
    }

    return result
  }, [items, searchQuery, statusFilter])

  // Stats
  const stats = React.useMemo(() => ({
    pending: items.filter(i => i.status === 'pending').length,
    approved: items.filter(i => i.status === 'approved').length,
    rejected: items.filter(i => i.status === 'rejected').length,
    changesRequested: items.filter(i => i.status === 'changes-requested').length,
  }), [items])

  const user = {
    name: admin.name,
    email: admin.email,
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'Moderation', labelVi: 'Kiểm duyệt' },
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
      user={user}
      breadcrumbs={breadcrumbs}
      onRoleChange={handleRoleChange}
      onSignOut={handleSignOut}
      onSettings={handleSettings}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Content Moderation"
          titleVi="Kiểm duyệt Nội dung"
          description="Review and moderate content"
          descriptionVi="Xem xét và kiểm duyệt nội dung"
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="default" padding="md" className="border-l-4 border-l-amber-500">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.pending')}</p>
            <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
          </Card>
          <Card variant="default" padding="md" className="border-l-4 border-l-success-500">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('questions.approved')}</p>
            <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{stats.approved}</p>
          </Card>
          <Card variant="default" padding="md" className="border-l-4 border-l-error-500">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('questions.rejected')}</p>
            <p className="mt-1 text-2xl font-bold text-error-600 dark:text-error-400">{stats.rejected}</p>
          </Card>
          <Card variant="default" padding="md" className="border-l-4 border-l-slate-500">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.changesRequested')}</p>
            <p className="mt-1 text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.changesRequested}</p>
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
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  statusFilter === 'pending'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                )}
              >
                {t('questions.pending')} ({stats.pending})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('approved')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  statusFilter === 'approved'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                )}
              >
                {t('questions.approved')} ({stats.approved})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('rejected')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  statusFilter === 'rejected'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                )}
              >
                {t('questions.rejected')} ({stats.rejected})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                )}
              >
                {t('common.all')}
              </button>
            </div>
          </div>
        </Card>

        {/* Moderation Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <ModerationCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No items to moderate"
            titleVi="Không có mục nào cần kiểm duyệt"
            description="All content has been moderated"
            descriptionVi="Tất cả nội dung đã được kiểm duyệt"
          />
        )}
      </div>
    </DashboardLayoutWrapper>
  )
}
