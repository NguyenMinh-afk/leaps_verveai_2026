// ============================================
// VERVE AI - Teacher Classes Page
// ============================================

'use client'

import * as React from 'react'
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
} from '@/components/ui'
import { useToast, ConfirmationDialog } from '@/components/ui/toast'
import {
  MasteryBar,
  MasteryBadge,
} from '@/components/ui'
import { classService } from '@/services/class'
import { formatRelativeTime } from '@/lib/utils'
import type { UserRole, BreadcrumbItem, TeacherClass } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'

/**
 * Class Card Component
 */
interface ClassCardProps {
  classData: TeacherClass
  onView: (classData: TeacherClass) => void
  onEdit: (classData: TeacherClass) => void
  onArchive: (classData: TeacherClass) => void
  onDelete: (classData: TeacherClass) => void
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, onView, onEdit, onArchive, onDelete }) => {
  const { t } = useLanguage()
  const masteryLevel = classData.averageMastery >= 0.8 ? 'mastered'
    : classData.averageMastery >= 0.5 ? 'learning'
    : 'needs-support'

  const statusConfig = {
    active: { label: t('common.active') || 'Hoạt động', variant: 'success' as const },
    inactive: { label: t('common.inactive') || 'Không hoạt động', variant: 'warning' as const },
    archived: { label: t('common.archived') || 'Đã lưu trữ', variant: 'default' as const },
  }

  const config = statusConfig[classData.status]

  return (
    <Card variant="default" padding="lg" className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {classData.name}
            </h4>
            <Badge variant={config.variant} size="sm">
              {config.label}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('class.grade') || 'Lớp'} {classData.grade} • {classData.subject === 'math' ? t('subject.math') || 'Toán' : classData.subject}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('class.students') || 'Học sinh'}</p>
          <p className="mt-0.5 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {classData.studentCount}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('mastery.title') || 'Mức độ thành thạo'}</p>
          <div className="mt-1">
            <MasteryBadge pKnown={classData.averageMastery} size="sm" />
          </div>
        </div>
      </div>

      {/* Mastery Bar */}
      <div className="mt-4">
        <MasteryBar pKnown={classData.averageMastery} size="sm" />
      </div>

      {/* Last Activity */}
      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        {t('common.activity') || 'Hoạt động'} {formatRelativeTime(classData.lastActivity)}
      </p>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => onView(classData)}>
          {t('common.view') || 'Xem chi tiết'}
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(classData)} title={t('common.delete') || 'Xóa'} className="text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
          {classData.status !== 'archived' && (
            <Button variant="ghost" size="icon-sm" onClick={() => onArchive(classData)} title={t('common.archive') || 'Lưu trữ'}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(classData)} title={t('common.edit') || 'Chỉnh sửa'}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
        </div>
      </div>
    </Card>
  )
}

/**
 * Create/Edit Class Modal
 */
interface ClassModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; subject: string; grade: number }) => void
  classData?: TeacherClass | null
  isLoading: boolean
}

const ClassModal: React.FC<ClassModalProps> = ({ isOpen, onClose, onSave, classData, isLoading }) => {
  const { t } = useLanguage()
  const [name, setName] = React.useState('')
  const [subject, setSubject] = React.useState('math')
  const [grade, setGrade] = React.useState(6)
  const [errors, setErrors] = React.useState<{ name?: string }>({})

  React.useEffect(() => {
    if (classData) {
      setName(classData.name)
      setSubject(classData.subject)
      setGrade(classData.grade)
    } else {
      setName('')
      setSubject('math')
      setGrade(6)
    }
    setErrors({})
  }, [classData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setErrors({ name: t('errors.classNameRequired') || 'Tên lớp là bắt buộc' })
      return
    }

    onSave({ name: name.trim(), subject, grade })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-slate-900">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {classData ? (t('class.editClass') || 'Chỉnh sửa lớp học') : (t('class.addClass') || 'Tạo lớp học mới')}
            </h3>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t('class.name') || 'Tên lớp'} <span className="text-error-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('class.namePlaceholder') || 'VD: Toán 6A'}
                  error={errors.name}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    {t('subject.title') || 'Môn học'}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="math">{t('subject.math') || 'Toán'}</option>
                    <option value="science">{t('subject.science') || 'Khoa học'}</option>
                    <option value="language">{t('subject.language') || 'Ngôn ngữ'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    {t('class.grade') || 'Khối lớp'}
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={g}>{t('class.grade') || 'Lớp'} {g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {t('common.cancel') || 'Hủy'}
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {classData ? (t('common.save') || 'Lưu thay đổi') : (t('class.addClass') || 'Tạo lớp học')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/**
 * Teacher Classes Page
 */
export default function TeacherClassesPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const { t } = useLanguage()
  const [currentRole] = React.useState<UserRole>('teacher')
  const [classes, setClasses] = React.useState<TeacherClass[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'archived'>('all')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingClass, setEditingClass] = React.useState<TeacherClass | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    variant: 'danger' | 'warning' | 'default'
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'default' })

  // Load classes
  React.useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    setIsLoading(true)
    try {
      const data = await classService.getClasses()
      setClasses(data)
    } catch (error) {
      console.error('Failed to load classes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter classes
  const filteredClasses = React.useMemo(() => {
    return classes.filter((cls) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!cls.name.toLowerCase().includes(query)) return false
      }
      if (statusFilter !== 'all' && cls.status !== statusFilter) return false
      return true
    })
  }, [classes, searchQuery, statusFilter])

  // Stats
  const stats = React.useMemo(() => ({
    total: classes.length,
    active: classes.filter((c) => c.status === 'active').length,
    totalStudents: classes.reduce((sum, c) => sum + c.studentCount, 0),
  }), [classes])

  const user = {
    name: 'Giáo viên Demo',
    email: 'teacher@example.com',
    role: 'teacher' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: t('class.classes') || 'Lớp học', labelVi: t('class.classes') || 'Lớp học' },
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

  const handleViewClass = (classData: TeacherClass) => {
    router.push(`/teacher/class/${classData.id}`)
  }

  const handleEditClass = (classData: TeacherClass) => {
    setEditingClass(classData)
    setIsModalOpen(true)
  }

  const handleArchiveClass = async (classData: TeacherClass) => {
    if (classData.status === 'archived') {
      const result = await classService.restoreClass(classData.id)
      if (result.success) {
        success(t('common.success') || 'Thành công', t('class.restored') || 'Lớp học đã được khôi phục')
        loadClasses()
      } else {
        showError(t('common.error') || 'Lỗi', result.error || (t('class.restoreError') || 'Không thể khôi phục lớp học'))
      }
    } else {
      const result = await classService.archiveClass(classData.id)
      if (result.success) {
        success(t('common.success') || 'Thành công', t('class.archived') || 'Lớp học đã được lưu trữ')
        loadClasses()
      } else {
        showError(t('common.error') || 'Lỗi', result.error || (t('class.archiveError') || 'Không thể lưu trữ lớp học'))
      }
    }
  }

  const handleDeleteClass = (classData: TeacherClass) => {
    setConfirmDialog({
      isOpen: true,
      title: t('class.deleteClass') || 'Xóa lớp học',
      message: `${t('class.deleteConfirm') || 'Bạn có chắc muốn xóa lớp học'} "${classData.name}"? ${t('class.deleteWarning') || 'Hành động này không thể hoàn tác.'}`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          const result = await classService.deleteClass(classData.id)
          if (result.success) {
            success(t('common.success') || 'Thành công', t('class.deleted') || 'Lớp học đã được xóa')
            loadClasses()
          } else {
            showError(t('common.error') || 'Lỗi', result.error || (t('class.deleteError') || 'Không thể xóa lớp học'))
          }
        } catch (error) {
          showError(t('common.error') || 'Lỗi', t('class.deleteGenericError') || 'Đã xảy ra lỗi khi xóa lớp học')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      },
    })
  }

  const handleOpenCreateModal = () => {
    setEditingClass(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingClass(null)
  }

  const handleSaveClass = async (data: { name: string; subject: string; grade: number }) => {
    setIsSaving(true)
    try {
      if (editingClass) {
        const result = await classService.updateClass(editingClass.id, data)
        if (result.success) {
          success(t('common.success') || 'Thành công', t('class.updated') || 'Lớp học đã được cập nhật')
          loadClasses()
          handleCloseModal()
        } else {
          showError(t('common.error') || 'Lỗi', result.error || (t('class.updateError') || 'Không thể cập nhật lớp học'))
        }
      } else {
        const result = await classService.createClass(data)
        if (result.success) {
          success(t('common.success') || 'Thành công', t('class.created') || 'Lớp học đã được tạo')
          loadClasses()
          handleCloseModal()
        } else {
          showError(t('common.error') || 'Lỗi', result.error || (t('class.createError') || 'Không thể tạo lớp học'))
        }
      }
    } catch (error) {
      showError(t('common.error') || 'Lỗi', t('class.saveError') || 'Đã xảy ra lỗi khi lưu lớp học')
    } finally {
      setIsSaving(false)
    }
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
          title="Classes"
          titleVi={t('class.classes') || 'Lớp học'}
          description="Manage your classes and track student progress"
          descriptionVi={t('class.manageDescription') || 'Quản lý lớp học và theo dõi tiến độ học sinh'}
          actions={
            <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('class.addClass') || 'Tạo lớp học mới'}
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('class.totalClasses') || 'Tổng lớp học'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.total}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('class.activeClasses') || 'Lớp đang hoạt động'}</p>
            <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
              {stats.active}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('class.totalStudents') || 'Tổng học sinh'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.totalStudents}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="default" padding="md">
          <div className="flex flex-col gap-4 lg:items-center lg:flex-row">
            <Input
              placeholder={t('common.searchClasses') || 'Tìm kiếm lớp học...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">{t('common.status') || 'Trạng thái'}:</span>
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                {([
                  { value: 'all', label: t('common.all') || 'Tất cả' },
                  { value: 'active', label: t('common.active') || 'Hoạt động' },
                  { value: 'archived', label: t('common.archived') || 'Đã lưu trữ' },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatusFilter(option.value)}
                    className={cn(
                      'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                      statusFilter === option.value
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-sm text-slate-500 dark:text-slate-400 lg:ml-auto">
              {filteredClasses.length} {t('class.classes') || 'lớp học'}
            </span>
          </div>
        </Card>

        {/* Classes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <svg className="h-8 w-8 animate-spin text-verve-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filteredClasses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                onView={handleViewClass}
                onEdit={handleEditClass}
                onArchive={handleArchiveClass}
                onDelete={handleDeleteClass}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No classes found"
            titleVi={t('class.noClassesFound') || 'Không tìm thấy lớp học nào'}
            description="Create your first class to get started"
            descriptionVi={t('class.createFirst') || 'Tạo lớp học đầu tiên để bắt đầu'}
            action={
              <div className="flex gap-3">
                {searchQuery || statusFilter !== 'all' ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setStatusFilter('all')
                    }}
                  >
                    {t('common.clearFilters') || 'Xóa bộ lọc'}
                  </Button>
                ) : null}
                <Button variant="primary" onClick={handleOpenCreateModal}>
                  {t('class.addClass') || 'Tạo lớp học mới'}
                </Button>
              </div>
            }
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <ClassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveClass}
        classData={editingClass}
        isLoading={isSaving}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        titleVi={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
      />

      {/* Development Mode Notice */}
      <div className="mt-6 rounded-lg border border-info-200 bg-info-50 p-4 dark:border-info-800 dark:bg-info-900/30">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 shrink-0 text-info-600 dark:text-info-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-info-700 dark:text-info-300">
              {t('common.devMode') || 'Chế độ phát triển'}
            </p>
            <p className="mt-1 text-sm text-info-600 dark:text-info-400">
              {t('class.devModeNotice') || 'Dữ liệu lớp học được lưu trong bộ nhớ cục bộ. Kết nối với backend thực tế để lưu trữ vĩnh viễn.'}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayoutWrapper>
  )
}
