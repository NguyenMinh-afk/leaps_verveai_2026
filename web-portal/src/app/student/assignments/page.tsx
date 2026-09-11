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
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui'
import {
  mockStudentProfile,
  mockStudentAssignments,
} from '@/data/student-mock-data'
import { formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { StudentAssignment } from '@/types'

/**
 * Assignment Card Component
 */
interface AssignmentCardProps {
  assignment: StudentAssignment
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const { t } = useLanguage()
  
  const statusConfig = {
    assigned: { label: t('assignment.new') || 'Mới giao', variant: 'info' as const },
    'in-progress': { label: t('common.inProgress') || 'Đang làm', variant: 'warning' as const },
    completed: { label: t('common.completed') || 'Hoàn thành', variant: 'success' as const },
    overdue: { label: t('common.overdue') || 'Quá hạn', variant: 'error' as const },
  }

  const config = statusConfig[assignment.status]

  const isOverdue = assignment.status === 'overdue'

  return (
    <Link href={`/student/assignments/${assignment.id}`}>
      <Card variant="interactive" padding="lg" className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {assignment.titleVi}
            </h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {assignment.className}
            </p>
          </div>
          <Badge variant={config.variant} size="sm">
            {config.label}
          </Badge>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {assignment.descriptionVi}
        </p>

        {assignment.topicNameVi && (
          <div className="mt-3">
            <Badge variant="outline" size="sm">
              {assignment.topicNameVi}
            </Badge>
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500 dark:text-slate-400">{t('common.progress') || 'Tiến độ'}</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {assignment.answeredCount}/{assignment.questionCount} {t('exam.questions') || 'câu'} ({assignment.progress}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                assignment.status === 'completed' ? 'bg-success-500' :
                isOverdue ? 'bg-error-500' : 'bg-verve-600'
              )}
              style={{ width: `${assignment.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {assignment.dueDate && (
            <span className={isOverdue ? 'text-error-600 dark:text-error-400 font-medium' : ''}>
              {t('common.dueDate') || 'Hạn'}: {formatRelativeTime(assignment.dueDate)}
            </span>
          )}
          {assignment.score !== undefined && (
            <span className="font-medium text-success-600 dark:text-success-400">
              {t('common.score') || 'Điểm'}: {assignment.score}%
            </span>
          )}
        </div>

        {assignment.status !== 'completed' && (
          <div className="mt-4">
            <Button
              variant={assignment.status === 'in-progress' ? 'primary' : 'outline'}
              size="sm"
              className="w-full"
            >
              {assignment.status === 'in-progress' ? t('common.continue') || 'Tiếp tục' : t('common.start') || 'Bắt đầu'}
            </Button>
          </div>
        )}

        {assignment.status === 'completed' && (
          <div className="mt-4">
            <Button variant="outline" size="sm" className="w-full">
              {t('common.viewResults') || 'Xem kết quả'}
            </Button>
          </div>
        )}
      </Card>
    </Link>
  )
}

/**
 * Assignments Page
 */
export default function AssignmentsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentRole] = React.useState<UserRole>('student')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('active')

  const student = mockStudentProfile
  const assignments = mockStudentAssignments

  // Filter assignments
  const filteredAssignments = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let items = [...assignments]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(a =>
        a.titleVi.toLowerCase().includes(query) ||
        a.descriptionVi.toLowerCase().includes(query) ||
        a.className.toLowerCase().includes(query)
      )
    }

    // Tab filter
    switch (activeTab) {
      case 'active':
        return items.filter(a => a.status === 'assigned' || a.status === 'in-progress')
      case 'overdue':
        return items.filter(a => a.status === 'overdue')
      case 'completed':
        return items.filter(a => a.status === 'completed')
      default:
        return items
    }
  }, [assignments, searchQuery, activeTab])

  const user = {
    name: student.name,
    email: student.email,
    role: 'student' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', labelVi: 'Trang chủ', href: '/' },
    { label: 'Học sinh', labelVi: 'Học sinh', href: '/student' },
    { label: 'Bài tập', labelVi: t('assignment.assignments') || 'Bài tập' },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    total: assignments.length,
    active: assignments.filter(a => a.status === 'assigned' || a.status === 'in-progress').length,
    overdue: assignments.filter(a => a.status === 'overdue').length,
    completed: assignments.filter(a => a.status === 'completed').length,
  }), [assignments])

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
          title="My Assignments"
          titleVi="Bài tập của tôi"
          description="View and complete your assignments"
          descriptionVi="Xem và hoàn thành bài tập của bạn"
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('assignment.totalAssignments') || 'Tổng bài tập'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.total}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.pending') || 'Đang chờ'}</p>
            <p className="mt-1 text-2xl font-bold text-verve-600 dark:text-verve-400">
              {stats.active}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.overdue') || 'Quá hạn'}</p>
            <p className="mt-1 text-2xl font-bold text-error-600 dark:text-error-400">
              {stats.overdue}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.completed') || 'Hoàn thành'}</p>
            <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
              {stats.completed}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="default" padding="md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Input
              placeholder={t('common.searchAssignments') || 'Tìm kiếm bài tập...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="active">
                  {t('common.pending') || 'Đang chờ'} ({stats.active})
                </TabsTrigger>
                <TabsTrigger value="overdue">
                  {t('common.overdue') || 'Quá hạn'} ({stats.overdue})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  {t('common.completed') || 'Hoàn thành'} ({stats.completed})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Card>

        {/* Assignments List */}
        {filteredAssignments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No assignments found"
            titleVi="Không tìm thấy bài tập"
            description={
              activeTab === 'active'
                ? "You don't have any pending assignments."
                : activeTab === 'overdue'
                  ? "Great! You don't have any overdue assignments."
                  : "You haven't completed any assignments yet."
            }
            descriptionVi={
              activeTab === 'active'
                ? "Bạn không có bài tập nào đang chờ."
                : activeTab === 'overdue'
                  ? "Tuyệt vời! Bạn không có bài tập quá hạn."
                  : "Bạn chưa hoàn thành bài tập nào."
            }
            action={
              searchQuery || activeTab !== 'active' ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveTab('active')
                  }}
                >
                  {t('common.clearFilters') || 'Xóa bộ lọc'}
                </Button>
              ) : undefined
            }
          />
        )}
      </div>
    </DashboardLayoutWrapper>
  )
}
