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
  Input,
} from '@/components/ui'
import { listQuestions, type QuestionListPage, type QuestionStatus, type QuestionDifficulty } from '@/lib/api/content'
import { listExams, type ExamRecord, type ExamStatus } from '@/lib/api/exam'
import { listAssignments, type AssignmentRecord, type AssignmentStatus } from '@/lib/api/assignment'
import { authService } from '@/services/auth'
import type { UserRole, BreadcrumbItem } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'

// Helper to check if current language is Vietnamese
function useIsVietnamese() {
  const { language } = useLanguage()
  return language === 'vi'
}

/**
 * Content Statistics Card
 */
interface StatsCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color }) => (
  <Card variant="default" padding="md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      </div>
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', color)}>
        {icon}
      </div>
    </div>
  </Card>
)

/**
 * Quick Link Card
 */
interface QuickLinkCardProps {
  title: string
  titleVi: string
  description: string
  descriptionVi: string
  href: string
  icon: React.ReactNode
  count?: number
  badge?: string
  badgeVariant?: 'success' | 'warning' | 'error' | 'default'
  isVietnamese?: boolean
}

const QuickLinkCard: React.FC<QuickLinkCardProps> = ({
  title,
  titleVi,
  description,
  descriptionVi,
  href,
  icon,
  count,
  badge,
  badgeVariant = 'default',
  isVietnamese = true,
}) => {
  return (
    <Link href={href}>
      <Card variant="interactive" padding="md" className="h-full">
        <div className="flex items-start justify-between">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            'bg-verve-100 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400'
          )}>
            {icon}
          </div>
          {badge && (
            <Badge variant={badgeVariant} size="sm">{badge}</Badge>
          )}
        </div>
        <h4 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
          {isVietnamese ? titleVi : title}
        </h4>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isVietnamese ? descriptionVi : description}
        </p>
        {count !== undefined && (
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {count} {isVietnamese ? 'mục' : 'items'}
          </p>
        )}
      </Card>
    </Link>
  )
}

/**
 * Recent Content Item
 */
interface RecentItemProps {
  type: 'question' | 'exam' | 'assignment'
  title: string
  status: string
  statusVariant: 'success' | 'warning' | 'error' | 'default'
  updatedAt: string
  href: string
}

const RecentItem: React.FC<RecentItemProps> = ({ type, title, status, statusVariant, updatedAt, href }) => {
  const typeIcons = {
    question: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    exam: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    assignment: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Link href={href} className="flex items-center justify-between py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-2 px-2 rounded">
      <div className="flex items-center gap-3">
        <div className="text-slate-400 dark:text-slate-500">
          {typeIcons[type]}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{title}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(updatedAt)}</p>
        </div>
      </div>
      <Badge variant={statusVariant} size="sm">{status}</Badge>
    </Link>
  )
}

/**
 * Teacher Content Hub Page
 */
export default function TeacherContentPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const isVietnamese = useIsVietnamese()
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentUser, setCurrentUser] = React.useState<{ id: string; name: string; email: string; role: UserRole } | null>(null)
  const [stats, setStats] = React.useState({
    questions: 0,
    exams: 0,
    assignments: 0,
    pendingReview: 0,
  })
  const [recentItems, setRecentItems] = React.useState<RecentItemProps[]>([])
  const [filter, setFilter] = React.useState<'all' | 'draft' | 'pending' | 'approved'>('all')
  const [error, setError] = React.useState<string | null>(null)

  // Fetch data from real APIs
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

        // Fetch content stats in parallel
        const [questionsData, examsData, assignmentsData] = await Promise.all([
          listQuestions({ authorId: session.user.id, pageSize: 1 }).catch(() => ({ pagination: { total: 0 } })),
          listExams({ teacherId: session.user.id, take: 1 }).catch(() => ({ total: 0 })),
          listAssignments({ teacherId: session.user.id, take: 1 }).catch(() => ({ total: 0 })),
        ])

        setStats({
          questions: questionsData.pagination?.total || 0,
          exams: examsData.total || 0,
          assignments: assignmentsData.total || 0,
          pendingReview: 0, // TODO: Get from review API
        })

        // Fetch recent content
        const recentQuestions = await listQuestions({ 
          authorId: session.user.id, 
          pageSize: 3 
        }).catch(() => ({ items: [] }))

        const recentExams = await listExams({ 
          teacherId: session.user.id, 
          take: 3 
        }).catch(() => ({ items: [] }))

        const recentAssignments = await listAssignments({ 
          teacherId: session.user.id, 
          take: 3 
        }).catch(() => ({ items: [] }))

        // Combine and sort by updated date
        const combined: RecentItemProps[] = [
          ...recentQuestions.items.map((q): RecentItemProps => ({
            type: 'question',
            title: q.title || q.body.substring(0, 50),
            status: q.status,
            statusVariant: getStatusVariant(q.status),
            updatedAt: q.createdAt,
            href: `/teacher/questions/edit?id=${q.id}`,
          })),
          ...recentExams.items.map((e): RecentItemProps => ({
            type: 'exam',
            title: e.title,
            status: e.status,
            statusVariant: getStatusVariant(e.status),
            updatedAt: e.updatedAt,
            href: `/teacher/exams/${e.id}`,
          })),
          ...recentAssignments.items.map((a): RecentItemProps => ({
            type: 'assignment',
            title: a.title,
            status: a.status,
            statusVariant: getStatusVariant(a.status),
            updatedAt: a.updatedAt,
            href: `/teacher/assignments`,
          })),
        ]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)

        setRecentItems(combined)
      } catch (err) {
        console.error('Failed to load content data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [router])

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
      case 'PUBLISHED':
        return 'success'
      case 'PENDING_REVIEW':
      case 'IN_REVIEW':
        return 'warning'
      case 'REJECTED':
        return 'error'
      default:
        return 'default'
    }
  }

  // User display object for DashboardLayoutWrapper
  const userDisplay = currentUser ? {
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
  } : { name: 'Teacher', email: '', role: 'teacher' as UserRole }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: 'Content Hub', labelVi: 'Quản lý nội dung', href: '/teacher/content' },
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
    router.push('/teacher/settings')
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

  if (error) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Error loading content"
          titleVi="Lỗi khi tải nội dung"
          description={error}
          descriptionVi={error}
          action={
            <Button variant="primary" onClick={() => window.location.reload()}>
              {t('common.retry') || 'Thử lại'}
            </Button>
          }
        />
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
          title="Content Hub"
          titleVi="Quản lý nội dung"
          description="Manage your questions, exams, and assignments"
          descriptionVi="Quản lý câu hỏi, bài kiểm tra và bài tập"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/teacher/questions/create')}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t('questions.create') || 'Tạo câu hỏi'}
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push('/teacher/exams/create')}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {t('exam.create') || 'Tạo bài kiểm tra'}
              </Button>
            </div>
          }
        />

        {/* Statistics */}
        <PageSection title="Content Statistics" titleVi="Thống kê nội dung">
          <PageGrid columns={4} gap="md">
            <StatsCard
              label={isVietnamese ? 'Tổng câu hỏi' : 'Total Questions'}
              value={stats.questions}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-verve-600"
            />
            <StatsCard
              label={isVietnamese ? 'Bài kiểm tra' : 'Exams'}
              value={stats.exams}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              color="bg-info-600"
            />
            <StatsCard
              label={isVietnamese ? 'Bài tập' : 'Assignments'}
              value={stats.assignments}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              color="bg-success-600"
            />
            <StatsCard
              label={isVietnamese ? 'Chờ duyệt' : 'Pending Review'}
              value={stats.pendingReview}
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-warning-600"
            />
          </PageGrid>
        </PageSection>

        {/* Quick Links */}
        <PageSection title="Quick Access" titleVi="Truy cập nhanh">
          <PageGrid columns={4} gap="md">
            <QuickLinkCard
              title="Question Library"
              titleVi="Thư viện câu hỏi"
              description="Browse and manage your questions"
              descriptionVi="Xem và quản lý câu hỏi của bạn"
              href="/teacher/questions"
              count={stats.questions}
              isVietnamese={isVietnamese}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
            />
            <QuickLinkCard
              title="Create Question"
              titleVi="Tạo câu hỏi mới"
              description="Add a new question to the library"
              descriptionVi="Thêm câu hỏi mới vào thư viện"
              href="/teacher/questions/create"
              isVietnamese={isVietnamese}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            />
            <QuickLinkCard
              title="Exams"
              titleVi="Bài kiểm tra"
              description="Manage and create exams"
              descriptionVi="Quản lý và tạo bài kiểm tra"
              href="/teacher/exams"
              count={stats.exams}
              isVietnamese={isVietnamese}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
            />
            <QuickLinkCard
              title="Assignments"
              titleVi="Bài tập"
              description="Create and manage assignments"
              descriptionVi="Tạo và quản lý bài tập"
              href="/teacher/assignments"
              count={stats.assignments}
              isVietnamese={isVietnamese}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
          </PageGrid>
        </PageSection>

        {/* Content by Status */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Content */}
          <PageSection title="Recent Content" titleVi="Nội dung gần đây">
            <Card variant="default" padding="none">
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {recentItems.length > 0 ? (
                  recentItems.map((item, idx) => (
                    <RecentItem key={idx} {...item} />
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    {isVietnamese ? 'Chưa có nội dung nào' : 'No content yet'}
                  </div>
                )}
              </div>
              {recentItems.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push('/teacher/questions')}
                  >
                    {isVietnamese ? 'Xem tất cả' : 'View all'}
                  </Button>
                </div>
              )}
            </Card>
          </PageSection>

          {/* Content by Status */}
          <PageSection title="Content by Status" titleVi="Nội dung theo trạng thái">
            <div className="space-y-4">
              <Link href="/teacher/questions?status=DRAFT">
                <Card variant="interactive" padding="md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                          {isVietnamese ? 'Bản nháp' : 'Drafts'}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {isVietnamese ? 'Câu hỏi chưa hoàn thành' : 'Questions not yet completed'}
                        </p>
                      </div>
                    </div>
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              </Link>

              <Link href="/teacher/questions?status=PENDING_REVIEW">
                <Card variant="interactive" padding="md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                          {isVietnamese ? 'Chờ duyệt' : 'Pending Review'}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {isVietnamese ? 'Đang chờ phản hồi từ quản trị viên' : 'Awaiting admin feedback'}
                        </p>
                      </div>
                    </div>
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              </Link>

              <Link href="/teacher/questions?status=APPROVED">
                <Card variant="interactive" padding="md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                          {isVietnamese ? 'Đã duyệt' : 'Approved'}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {isVietnamese ? 'Sẵn sàng sử dụng' : 'Ready to use in exams'}
                        </p>
                      </div>
                    </div>
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              </Link>
            </div>
          </PageSection>
        </div>
      </div>
    </DashboardLayoutWrapper>
  )
}
