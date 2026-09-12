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
  mockStudentExams,
} from '@/data/student-mock-data'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { StudentExam } from '@/types'

/**
 * Exam Card Component
 */
interface ExamCardProps {
  exam: StudentExam
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const { t } = useLanguage()
  
  const statusConfig = {
    available: { label: t('exam.available') || 'Sẵn sàng', variant: 'success' as const },
    upcoming: { label: t('exam.upcoming') || 'Sắp diễn ra', variant: 'info' as const },
    'in-progress': { label: t('common.inProgress') || 'Đang làm', variant: 'warning' as const },
    completed: { label: t('common.completed') || 'Hoàn thành', variant: 'default' as const },
    expired: { label: t('common.expired') || 'Đã hết hạn', variant: 'error' as const },
  }

  const config = statusConfig[exam.status]

  return (
    <Link href={`/student/exams/${exam.id}`}>
      <Card variant="interactive" padding="lg" className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {exam.titleVi}
            </h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {exam.className}
            </p>
          </div>
          <Badge variant={config.variant} size="sm">
            {config.label}
          </Badge>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {exam.descriptionVi}
        </p>

        {exam.topicNameVi && (
          <div className="mt-3">
            <Badge variant="outline" size="sm">
              {exam.topicNameVi}
            </Badge>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{exam.questionCount} {t('exam.questions') || 'câu hỏi'}</span>
          </div>
          {exam.durationMinutes && (
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{exam.durationMinutes} {t('mastery.minutes') || 'phút'}</span>
            </div>
          )}
          {exam.maxAttempts && (
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{exam.attempts || 0}/{exam.maxAttempts} {t('common.attempts') || 'lần'}</span>
            </div>
          )}
        </div>

        {exam.bestScore !== undefined && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">{t('common.bestScore') || 'Điểm cao nhất'}:</span>
            <span className="font-bold text-success-600 dark:text-success-400">
              {exam.bestScore}%
            </span>
          </div>
        )}

        {exam.availableFrom && exam.status === 'upcoming' && (
          <div className="mt-4 rounded-lg bg-info-50 p-3 dark:bg-info-900/20">
            <p className="text-xs text-info-600 dark:text-info-400">
              {t('common.availableFrom') || 'Có sẵn từ'}: {formatDate(exam.availableFrom)}
            </p>
          </div>
        )}

        {exam.status === 'available' && (
          <Button variant="primary" size="sm" className="mt-4 w-full">
            {t('common.startExam') || 'Bắt đầu làm bài'}
          </Button>
        )}

        {exam.status === 'completed' && (
          <Button variant="outline" size="sm" className="mt-4 w-full">
            {t('common.viewResults') || 'Xem kết quả'}
          </Button>
        )}
      </Card>
    </Link>
  )
}

/**
 * Exams Page
 */
export default function ExamsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentRole] = React.useState<UserRole>('student')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('available')

  const student = mockStudentProfile
  const exams = mockStudentExams

  // Filter exams
  const filteredExams = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let items = [...exams]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(e =>
        e.titleVi.toLowerCase().includes(query) ||
        e.descriptionVi.toLowerCase().includes(query) ||
        e.className.toLowerCase().includes(query)
      )
    }

    // Tab filter
    switch (activeTab) {
      case 'available':
        return items.filter(e => e.status === 'available')
      case 'upcoming':
        return items.filter(e => e.status === 'upcoming')
      case 'completed':
        return items.filter(e => e.status === 'completed')
      default:
        return items
    }
  }, [exams, searchQuery, activeTab])

  const user = {
    name: student.name,
    email: student.email,
    role: 'student' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', labelVi: 'Trang chủ', href: '/' },
    { label: 'Học sinh', labelVi: 'Học sinh', href: '/student' },
    { label: 'Bài kiểm tra', labelVi: 'Bài kiểm tra' },
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
    total: exams.length,
    available: exams.filter(e => e.status === 'available').length,
    upcoming: exams.filter(e => e.status === 'upcoming').length,
    completed: exams.filter(e => e.status === 'completed').length,
  }), [exams])

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
          title="My Exams"
          titleVi="Bài kiểm tra"
          description="View and take your assessments"
          descriptionVi="Xem và làm bài kiểm tra"
          actions={
            <Button variant="outline" size="sm" onClick={() => router.push('/student/results')}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Xem kết quả
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.totalExams') || 'Tổng bài kiểm tra'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.total}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.available') || 'Sẵn sàng'}</p>
            <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
              {stats.available}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.upcoming') || 'Sắp diễn ra'}</p>
            <p className="mt-1 text-2xl font-bold text-info-600 dark:text-info-400">
              {stats.upcoming}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.completed') || 'Hoàn thành'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-600 dark:text-slate-400">
              {stats.completed}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="default" padding="md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Input
              placeholder={t('common.searchExams') || 'Tìm kiếm bài kiểm tra...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="available">
                  {t('exam.available') || 'Sẵn sàng'} ({stats.available})
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  {t('exam.upcoming') || 'Sắp diễn ra'} ({stats.upcoming})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  {t('common.completed') || 'Hoàn thành'} ({stats.completed})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Card>

        {/* Exams List */}
        {filteredExams.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No exams found"
            titleVi="Không tìm thấy bài kiểm tra"
            description={
              activeTab === 'available'
                ? "You don't have any exams available right now."
                : activeTab === 'upcoming'
                  ? "You don't have any upcoming exams."
                  : "You haven't completed any exams yet."
            }
            descriptionVi={
              activeTab === 'available'
                ? "Bạn không có bài kiểm tra nào sẵn sàng."
                : activeTab === 'upcoming'
                  ? "Bạn không có bài kiểm tra sắp tới."
                  : "Bạn chưa hoàn thành bài kiểm tra nào."
            }
            action={
              searchQuery || activeTab !== 'available' ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveTab('available')
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
