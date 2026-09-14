'use client'

import * as React from 'react'
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
  Button,
  Badge,
  Input,
} from '@/components/ui'
import { useToast, ConfirmationDialog } from '@/components/ui/toast'
import { teacherExamService } from '@/services/exam'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { listClasses } from '@/lib/api/classes'
import type { UserRole, BreadcrumbItem, TeacherExam, TeacherExamStatus } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'

/**
 * Exam Status Badge
 */
const ExamStatusBadge: React.FC<{ status: TeacherExamStatus }> = ({ status }) => {
  const { t } = useLanguage()
  const config: Record<TeacherExamStatus, { label: string; labelVi: string; variant: 'default' | 'success' | 'warning' | 'error' }> = {
    DRAFT: { label: 'Draft', labelVi: 'Nháp', variant: 'default' },
    PUBLISHED: { label: 'Published', labelVi: 'Đã xuất bản', variant: 'success' },
    ARCHIVED: { label: 'Archived', labelVi: 'Đã lưu trữ', variant: 'warning' },
  }

  const { labelVi, variant } = config[status]

  return (
    <Badge variant={variant} size="sm">
      {labelVi}
    </Badge>
  )
}

/**
 * Exam Card Component
 */
interface ExamCardProps {
  exam: TeacherExam
  onView: (exam: TeacherExam) => void
  onEdit: (exam: TeacherExam) => void
  onDuplicate: (exam: TeacherExam) => void
  onArchive: (exam: TeacherExam) => void
  onRestore: (exam: TeacherExam) => void
  onDelete: (exam: TeacherExam) => void
}

const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onRestore,
  onDelete,
}) => {
  const { t } = useLanguage()

  return (
    <Card variant="default" padding="lg" className="hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {exam.titleVi || exam.title}
            </h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {exam.className}
            </p>
          </div>
          <ExamStatusBadge status={exam.status} />
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {exam.descriptionVi || exam.description || t('exam.noDescription') || 'Không có mô tả'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('exam.questions') || 'Câu hỏi'}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
              {exam.questionCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('exam.maxAttempts') || 'Lần thi'}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
              {exam.maxAttempts}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('exam.passingScore') || 'Điểm đạt'}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
              {exam.passingScore}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('exam.duration') || 'Thời gian'}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
              {exam.timeLimitMinutes ? `${exam.timeLimitMinutes} ${t('exam.minutes') || 'phút'}` : (t('exam.unlimited') || 'Không giới hạn')}
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-wrap gap-2">
          {exam.shuffleQuestions && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('exam.shuffle') || 'Xáo trộn'}
            </span>
          )}
          {exam.showResultsImmediately && (
            <span className="inline-flex items-center rounded-full bg-verve-100 px-2 py-0.5 text-xs text-verve-700 dark:bg-verve-900/30 dark:text-verve-400">
              <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t('exam.showResults') || 'Hiện kết quả'}
            </span>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('common.updated') || 'Cập nhật'}: {formatRelativeTime(exam.updatedAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
          <Button variant="ghost" size="sm" onClick={() => onView(exam)}>
            {t('common.view') || 'Xem chi tiết'}
          </Button>
          <div className="flex items-center gap-1">
            {exam.status === 'ARCHIVED' && (
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={() => onRestore(exam)} 
                title={t('exam.restore') || 'Khôi phục'}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Button>
            )}
            <Button variant="ghost" size="icon-sm" onClick={() => onDuplicate(exam)} title={t('common.duplicate') || 'Sao chép'}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onDelete(exam)} title={t('common.delete') || 'Xóa'} className="text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
            {exam.status !== 'ARCHIVED' && (
              <Button variant="ghost" size="icon-sm" onClick={() => onArchive(exam)} title={t('common.archive') || 'Lưu trữ'}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </Button>
            )}
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(exam)} title={t('common.edit') || 'Chỉnh sửa'}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Exams Page
 */
export default function ExamsPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<TeacherExamStatus | 'all'>('all')
  const [classFilter, setClassFilter] = React.useState<string | 'all'>('all')
  
  // User display object with fallback for null user
  const userDisplay = {
    name: user?.name || 'Teacher',
    email: user?.email || '',
    role: 'teacher' as UserRole,
  }

  // Local state for exams
  const [exams, setExams] = React.useState<TeacherExam[]>([])
  const [classes, setClasses] = React.useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    variant: 'danger' | 'warning' | 'default'
    isLoading: boolean
  }>({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: () => {}, 
    variant: 'default',
    isLoading: false,
  })

  // Load classes from real API
  React.useEffect(() => {
    async function loadClasses() {
      try {
        const result = await listClasses()
        setClasses(result.map((c) => ({ id: c.id, name: c.name })))
      } catch {
        // Ignore class loading errors - exams may still work
        setClasses([])
      }
    }
    loadClasses()
  }, [])

  // Load exams
  const loadExams = React.useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const result = await teacherExamService.getExams({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        classId: classFilter !== 'all' ? classFilter : undefined,
      })
      setExams(result.exams)
    } catch (err) {
      const message = err instanceof Error ? err.message : (t('exam.loadError') || 'Không thể tải danh sách bài kiểm tra')
      setLoadError(message)
      showError(t('common.error') || 'Lỗi', message)
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, classFilter, showError, t])

  React.useEffect(() => {
    loadExams()
  }, [loadExams])

  // Filter exams by search
  const filteredExams = React.useMemo(() => {
    if (!searchQuery) return exams
    const query = searchQuery.toLowerCase()
    return exams.filter((exam) =>
      exam.title.toLowerCase().includes(query) ||
      exam.titleVi?.toLowerCase().includes(query) ||
      exam.description?.toLowerCase().includes(query) ||
      exam.className?.toLowerCase().includes(query)
    )
  }, [exams, searchQuery])

  // Group by status
  const draftExams = filteredExams.filter(e => e.status === 'DRAFT')
  const publishedExams = filteredExams.filter(e => e.status === 'PUBLISHED')
  const archivedExams = filteredExams.filter(e => e.status === 'ARCHIVED')

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: t('exam.exams') || 'Bài kiểm tra', labelVi: t('exam.exams') || 'Bài kiểm tra' },
  ]

  const handleRoleChange = (newRole: UserRole) => {
    router.push('/')
  }

  const handleSignOut = () => {
    router.push('/')
  }

  const handleSettings = () => {
    router.push('/teacher/settings')
  }

  const handleViewExam = (exam: TeacherExam) => {
    router.push(`/teacher/exams/${exam.id}`)
  }

  const handleEditExam = (exam: TeacherExam) => {
    router.push(`/teacher/exams/${exam.id}?edit=true`)
  }

  const handleOpenCreateExam = () => {
    router.push('/teacher/exams/create')
  }

  const handleDuplicateExam = async (exam: TeacherExam) => {
    try {
      const result = await teacherExamService.createExam({
        classId: exam.classId,
        title: `${exam.titleVi || exam.title} (${t('common.copy') || 'Bản sao'})`,
        titleVi: `${exam.titleVi || exam.title} (${t('common.copy') || 'Bản sao'})`,
        description: exam.description,
        descriptionVi: exam.descriptionVi,
        timeLimitMinutes: exam.timeLimitMinutes ?? undefined,
        passingScore: exam.passingScore,
        maxScore: exam.maxScore,
        maxAttempts: exam.maxAttempts,
        shuffleQuestions: exam.shuffleQuestions,
        showResultsImmediately: exam.showResultsImmediately,
      })
      if (result.success) {
        success(t('common.success') || 'Thành công', t('exam.duplicated') || 'Đã sao chép bài kiểm tra')
        loadExams()
      } else {
        showError(t('common.error') || 'Lỗi', result.error || (t('exam.duplicateError') || 'Không thể sao chép bài kiểm tra'))
      }
    } catch (err) {
      showError(t('common.error') || 'Lỗi', t('exam.duplicateErrorGeneric') || 'Đã xảy ra lỗi khi sao chép bài kiểm tra')
    }
  }

  const handleArchiveExam = (exam: TeacherExam) => {
    setConfirmDialog({
      isOpen: true,
      title: t('exam.archive') || 'Lưu trữ bài kiểm tra',
      message: `${t('exam.archiveConfirm') || 'Bạn có chắc muốn lưu trữ bài kiểm tra'} "${exam.titleVi || exam.title}"?`,
      variant: 'warning',
      isLoading: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }))
        try {
          const result = await teacherExamService.archiveExam(exam.id)
          if (result.success) {
            success(t('common.success') || 'Thành công', t('exam.archived') || 'Bài kiểm tra đã được lưu trữ')
            loadExams()
          } else {
            showError(t('common.error') || 'Lỗi', result.error || (t('exam.archiveError') || 'Không thể lưu trữ bài kiểm tra'))
          }
        } catch (err) {
          showError(t('common.error') || 'Lỗi', t('exam.archiveErrorGeneric') || 'Đã xảy ra lỗi khi lưu trữ bài kiểm tra')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false, isLoading: false }))
      },
    })
  }

  const handleRestoreExam = (exam: TeacherExam) => {
    setConfirmDialog({
      isOpen: true,
      title: t('exam.restore') || 'Khôi phục bài kiểm tra',
      message: `${t('exam.restoreConfirm') || 'Bạn có chắc muốn khôi phục bài kiểm tra'} "${exam.titleVi || exam.title}"?`,
      variant: 'default',
      isLoading: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }))
        try {
          const result = await teacherExamService.restoreExam(exam.id)
          if (result.success) {
            success(t('common.success') || 'Thành công', t('exam.restored') || 'Bài kiểm tra đã được khôi phục')
            loadExams()
          } else {
            showError(t('common.error') || 'Lỗi', result.error || (t('exam.restoreError') || 'Không thể khôi phục bài kiểm tra'))
          }
        } catch (err) {
          showError(t('common.error') || 'Lỗi', t('exam.restoreErrorGeneric') || 'Đã xảy ra lỗi khi khôi phục bài kiểm tra')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false, isLoading: false }))
      },
    })
  }

  const handleDeleteExam = (exam: TeacherExam) => {
    setConfirmDialog({
      isOpen: true,
      title: t('exam.delete') || 'Xóa bài kiểm tra',
      message: `${t('exam.deleteConfirm') || 'Bạn có chắc muốn xóa bài kiểm tra'} "${exam.titleVi || exam.title}"? ${t('exam.deleteWarning') || 'Hành động này không thể hoàn tác.'}`,
      variant: 'danger',
      isLoading: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }))
        try {
          const result = await teacherExamService.deleteExam(exam.id)
          if (result.success) {
            success(t('common.success') || 'Thành công', t('exam.deleted') || 'Bài kiểm tra đã được xóa')
            loadExams()
          } else {
            showError(t('common.error') || 'Lỗi', result.error || (t('exam.deleteError') || 'Không thể xóa bài kiểm tra'))
          }
        } catch (err) {
          showError(t('common.error') || 'Lỗi', t('exam.deleteErrorGeneric') || 'Đã xảy ra lỗi khi xóa bài kiểm tra')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false, isLoading: false }))
      },
    })
  }

  const handleRetry = () => {
    loadExams()
  }

  // Stats
  const stats = React.useMemo(() => ({
    total: exams.length,
    draft: exams.filter(e => e.status === 'DRAFT').length,
    published: exams.filter(e => e.status === 'PUBLISHED').length,
    archived: exams.filter(e => e.status === 'ARCHIVED').length,
  }), [exams])

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
          title="Exams"
          titleVi={t('exam.exams') || 'Bài kiểm tra'}
          description="Manage assessments and exams for your classes"
          descriptionVi={t('exam.manageDescription') || 'Quản lý bài kiểm tra cho các lớp của bạn'}
          actions={
            <Button variant="primary" size="sm" onClick={handleOpenCreateExam}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('exam.createNew') || 'Tạo bài kiểm tra mới'}
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.total') || 'Tổng bài kiểm tra'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.total}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.draft') || 'Nháp'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-600 dark:text-slate-400">
              {stats.draft}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.published') || 'Đã xuất bản'}</p>
            <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
              {stats.published}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.archived') || 'Đã lưu trữ'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-400 dark:text-slate-500">
              {stats.archived}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="default" padding="md">
          <div className="flex flex-col gap-4 lg:items-center">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
              <Input
                placeholder={t('exam.searchPlaceholder') || 'Tìm kiếm bài kiểm tra...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('common.status') || 'Trạng thái'}:</span>
                <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                  {(['all', 'DRAFT', 'PUBLISHED', 'ARCHIVED'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStatusFilter(value)}
                      className={cn(
                        'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                        statusFilter === value
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      )}
                    >
                      {value === 'all' ? (t('common.all') || 'Tất cả') :
                       value === 'DRAFT' ? (t('common.draft') || 'Nháp') :
                       value === 'PUBLISHED' ? (t('common.published') || 'Đã xuất bản') : (t('common.archived') || 'Đã lưu trữ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Class Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('class.title') || 'Lớp'}:</span>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
                >
                  <option value="all">{t('common.allClasses') || 'Tất cả lớp'}</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-sm text-slate-500 dark:text-slate-400">
                {filteredExams.length} {t('exam.exams') || 'bài kiểm tra'}
              </span>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <LoadingState />
        )}

        {/* Error State */}
        {!isLoading && loadError && (
          <Card variant="default" padding="lg" className="text-center">
            <div className="flex flex-col items-center gap-4">
              <svg className="h-12 w-12 text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {t('common.error') || 'Lỗi'}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {loadError}
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={handleRetry}>
                {t('common.retry') || 'Thử lại'}
              </Button>
            </div>
          </Card>
        )}

        {/* Exams List */}
        {!isLoading && !loadError && filteredExams.length > 0 && (
          <div className="space-y-6">
            {/* Draft Exams */}
            {statusFilter === 'all' && draftExams.length > 0 && (
              <PageSection title={t('common.draft') || 'Nháp'} titleVi={t('common.draft') || 'Nháp'}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {draftExams.map((exam) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      onView={handleViewExam}
                      onEdit={handleEditExam}
                      onDuplicate={handleDuplicateExam}
                      onArchive={handleArchiveExam}
                      onRestore={handleRestoreExam}
                      onDelete={handleDeleteExam}
                    />
                  ))}
                </div>
              </PageSection>
            )}

            {/* Published Exams */}
            {(statusFilter === 'all' || statusFilter === 'PUBLISHED') && publishedExams.length > 0 && (
              <PageSection title={t('common.published') || 'Đã xuất bản'} titleVi={t('common.published') || 'Đã xuất bản'}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {publishedExams.map((exam) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      onView={handleViewExam}
                      onEdit={handleEditExam}
                      onDuplicate={handleDuplicateExam}
                      onArchive={handleArchiveExam}
                      onRestore={handleRestoreExam}
                      onDelete={handleDeleteExam}
                    />
                  ))}
                </div>
              </PageSection>
            )}

            {/* Archived Exams */}
            {(statusFilter === 'all' || statusFilter === 'ARCHIVED') && archivedExams.length > 0 && (
              <PageSection title={t('common.archived') || 'Đã lưu trữ'} titleVi={t('common.archived') || 'Đã lưu trữ'}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {archivedExams.map((exam) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      onView={handleViewExam}
                      onEdit={handleEditExam}
                      onDuplicate={handleDuplicateExam}
                      onArchive={handleArchiveExam}
                      onRestore={handleRestoreExam}
                      onDelete={handleDeleteExam}
                    />
                  ))}
                </div>
              </PageSection>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !loadError && filteredExams.length === 0 && (
          <EmptyState
            title="No exams found"
            titleVi={t('exam.noExams') || 'Không tìm thấy bài kiểm tra nào'}
            description="Try adjusting your filters or create a new exam"
            descriptionVi={t('exam.noExamsHint') || 'Thử điều chỉnh bộ lọc hoặc tạo bài kiểm tra mới'}
            action={
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setClassFilter('all')
                  }}
                >
                  {t('common.clearFilters') || 'Xóa bộ lọc'}
                </Button>
                <Button variant="primary" onClick={handleOpenCreateExam}>
                  {t('exam.createNew') || 'Tạo bài kiểm tra mới'}
                </Button>
              </div>
            }
          />
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        titleVi={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        isLoading={confirmDialog.isLoading}
      />
    </DashboardLayoutWrapper>
  )
}
