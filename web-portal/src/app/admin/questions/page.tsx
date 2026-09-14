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
import { adminService } from '@/services/admin'
import { formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { AdminQuestion } from '@/types'

/**
 * Question Row Component
 */
interface QuestionRowProps {
  question: AdminQuestion
}

const QuestionRow: React.FC<QuestionRowProps> = ({ question }) => {
  const { t } = useLanguage()
  const statusConfig = {
    'draft': { label: t('common.draft'), variant: 'default' as const },
    'pending-review': { label: t('questions.pending'), variant: 'warning' as const },
    'approved': { label: t('questions.approved'), variant: 'success' as const },
    'published': { label: t('common.published'), variant: 'info' as const },
    'rejected': { label: t('questions.rejected'), variant: 'error' as const },
  }

  const typeConfig = {
    'multiple-choice': t('questions.multipleChoice'),
    'short-answer': t('questions.shortAnswer'),
    'essay': t('questions.essay'),
    'fill-blank': t('questions.fillBlank'),
  }

  const difficultyConfig = {
    'easy': { label: t('questions.easy'), variant: 'success' as const },
    'medium': { label: t('questions.medium'), variant: 'warning' as const },
    'hard': { label: t('questions.hard'), variant: 'error' as const },
  }

  const status = statusConfig[question.status]
  const difficulty = difficultyConfig[question.difficulty]

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="px-4 py-3">
        <div className="max-w-md">
          <p className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
            {question.contentVi}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {question.topicNameVi || 'No topic'}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" size="sm">{typeConfig[question.type]}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={difficulty.variant} size="sm">{difficulty.label}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={status.variant} size="sm">{status.label}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={question.source === 'ai-generated' ? 'info' : 'default'} size="sm">
          {question.source === 'ai-generated' ? 'AI' : t('auth.teacher')}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {formatRelativeTime(new Date(question.createdAt))}
        </p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">{t('common.view')}</Button>
          {question.status === 'pending-review' && (
            <>
              <Button variant="primary" size="sm">{t('questions.approve')}</Button>
              <Button variant="destructive" size="sm">{t('questions.reject')}</Button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

/**
 * Questions Page
 */
export default function QuestionsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentRole] = React.useState<UserRole>('admin')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [sourceFilter, setSourceFilter] = React.useState('all')

  // Real data state
  const [questions, setQuestions] = React.useState<AdminQuestion[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch real questions
  React.useEffect(() => {
    async function fetchQuestions() {
      try {
        const result = await adminService.listQuestions({ take: 100 })
        setQuestions(result.items)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions')
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuestions()
  }, [])

  // Filter questions
  const filteredQuestions = React.useMemo(() => {
    let result = [...questions]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(q =>
        q.content.toLowerCase().includes(query) ||
        q.contentVi.toLowerCase().includes(query) ||
        (q.topicNameVi?.toLowerCase().includes(query) ?? false)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(q => q.status === statusFilter)
    }

    return result
  }, [questions, searchQuery, statusFilter])

  // Stats
  const stats = React.useMemo(() => ({
    total: questions.length,
    draft: questions.filter(q => q.status === 'draft').length,
    pendingReview: questions.filter(q => q.status === 'pending-review').length,
    published: questions.filter(q => q.status === 'published' || q.status === 'approved').length,
    rejected: questions.filter(q => q.status === 'rejected').length,
    aiGenerated: questions.filter(q => q.source === 'ai-generated').length,
  }), [questions])

  const user = {
    name: 'Admin',
    email: 'admin@verveai.local',
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'Questions', labelVi: 'Câu hỏi' },
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
        {/* Loading/Error States */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <p className="text-slate-500">Loading questions...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-lg bg-error-50 p-4 text-error-700 dark:bg-error-900/30 dark:text-error-300">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Page Header */}
            <PageHeader
              title="Question Governance"
              titleVi="Quản lý Câu hỏi"
              description="Content governance and moderation"
              descriptionVi="Quản trị nội dung và kiểm duyệt"
            />

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <Card variant="default" padding="md">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.all')}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
              </Card>
              <Card variant="default" padding="md">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.draft')}</p>
                <p className="mt-1 text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.draft}</p>
              </Card>
              <Card variant="default" padding="md">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('questions.pending')}</p>
                <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pendingReview}</p>
              </Card>
              <Card variant="default" padding="md">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.published')}</p>
                <p className="mt-1 text-2xl font-bold text-info-600 dark:text-info-400">{stats.published}</p>
              </Card>
              <Card variant="default" padding="md">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('questions.rejected')}</p>
                <p className="mt-1 text-2xl font-bold text-error-600 dark:text-error-400">{stats.rejected}</p>
              </Card>
              <Card variant="default" padding="md">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('questions.aiGenerated')}</p>
                <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.aiGenerated}</p>
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
                <div className="flex flex-wrap gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                  >
                    <option value="all">{t('common.all')} {t('common.status')}</option>
                    <option value="draft">{t('common.draft')}</option>
                    <option value="pending-review">{t('questions.pending')}</option>
                    <option value="approved">{t('questions.approved')}</option>
                    <option value="published">{t('common.published')}</option>
                    <option value="rejected">{t('questions.rejected')}</option>
                  </select>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                  >
                    <option value="all">{t('common.all')} {t('questions.source')}</option>
                    <option value="ai-generated">{t('questions.aiGenerated')}</option>
                    <option value="teacher-created">{t('questions.teacherCreated')}</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Questions Table */}
            <Card variant="default" padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('questions.title')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('questions.type')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('questions.difficulty')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('common.status')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('questions.source')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('common.date')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredQuestions.map((question) => (
                      <QuestionRow key={question.id} question={question} />
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredQuestions.length === 0 && (
                <div className="p-8">
                  <EmptyState
                    title="No questions found"
                    titleVi="Không tìm thấy câu hỏi"
                    description="Try adjusting your search or filters"
                    descriptionVi="Thử điều chỉnh tìm kiếm hoặc bộ lọc"
                  />
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </DashboardLayoutWrapper>
  )
}
