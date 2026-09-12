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
import { useToast, ConfirmationDialog } from '@/components/ui/toast'
import { courseService } from '@/services/course'
import { formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { AdminCourse } from '@/types'
import type { CreateCourseInput } from '@/services/course'

/**
 * Course Modal for Create/Edit
 */
interface CourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreateCourseInput) => Promise<void>
  course?: AdminCourse | null
  isLoading: boolean
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSave, course, isLoading }) => {
  const { t } = useLanguage()
  const [name, setName] = React.useState('')
  const [nameVi, setNameVi] = React.useState('')
  const [code, setCode] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [descriptionVi, setDescriptionVi] = React.useState('')
  const [subject, setSubject] = React.useState('math')
  const [errors, setErrors] = React.useState<{ name?: string; code?: string }>({})

  React.useEffect(() => {
    if (course) {
      setName(course.name)
      setNameVi(course.nameVi)
      setCode(course.code)
      setDescription(course.description)
      setDescriptionVi(course.descriptionVi)
      setSubject(course.subject || 'math')
    } else {
      setName('')
      setNameVi('')
      setCode('')
      setDescription('')
      setDescriptionVi('')
      setSubject('math')
    }
    setErrors({})
  }, [course, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}

    if (!name.trim() && !nameVi.trim()) {
      newErrors.name = t('course.nameRequired')
    }
    if (!code.trim()) {
      newErrors.code = t('course.codeRequired')
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    await onSave({
      name: name.trim() || nameVi.trim(),
      nameVi: nameVi.trim() || name.trim(),
      code: code.trim(),
      description: description.trim(),
      descriptionVi: descriptionVi.trim() || description.trim(),
      subject,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-slate-900">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {course ? t('course.editCourse') : t('course.createCourse')}
            </h3>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t('course.name')} ({t('settings.language')}) <span className="text-error-500">*</span>
                </label>
                <Input
                  value={nameVi}
                  onChange={(e) => setNameVi(e.target.value)}
                  placeholder="VD: Toán học cơ bản"
                  error={errors.name}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t('course.name')} (English)
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Basic Mathematics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t('course.code')} <span className="text-error-500">*</span>
                </label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="VD: MATH101"
                  error={errors.code}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t('subject.title')}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="math">{t('subject.math')}</option>
                  <option value="science">{t('subject.science')}</option>
                  <option value="language">{t('subject.language')}</option>
                  <option value="history">{t('subject.history')}</option>
                  <option value="other">{t('common.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t('common.description')} ({t('settings.language')})
                </label>
                <textarea
                  value={descriptionVi}
                  onChange={(e) => setDescriptionVi(e.target.value)}
                  placeholder={t('course.descriptionPlaceholder')}
                  rows={3}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {course ? t('common.save') : t('course.createCourse')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/**
 * Course Card Component
 */
interface CourseCardProps {
  course: AdminCourse
  onEdit: (course: AdminCourse) => void
  onDelete: (course: AdminCourse) => void
  onView: (course: AdminCourse) => void
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete, onView }) => {
  const { t } = useLanguage()
  const statusConfig = {
    active: { label: t('common.active'), variant: 'success' as const },
    archived: { label: t('common.archived'), variant: 'default' as const },
    draft: { label: t('common.draft'), variant: 'warning' as const },
  }

  const config = statusConfig[course.status]

  return (
    <Card variant="default" padding="lg" className="h-full">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {course.nameVi}
            </h4>
            <Badge variant={config.variant} size="sm">
              {config.label}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {course.code}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
        {course.descriptionVi}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {course.teacherCount}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('auth.teacher')}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {course.studentCount}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('auth.student')}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {course.questionCount}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('questions.title')}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {course.topicCount}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('mastery.topics')}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{t('common.updated')}: {formatRelativeTime(new Date(course.updatedAt))}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={`/admin/courses/${course.id}`} className="flex-1">
          <Button variant="ghost" size="sm" className="w-full">
            {t('common.details')}
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
          {t('common.edit')}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(course)} className="text-error-600 hover:text-error-700">
          {t('common.delete')}
        </Button>
      </div>
    </Card>
  )
}

/**
 * Courses Page
 */
export default function CoursesPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const { t } = useLanguage()
  const [currentRole] = React.useState<UserRole>('admin')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingCourse, setEditingCourse] = React.useState<AdminCourse | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    variant: 'danger' | 'warning' | 'default'
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'default' })

  // Course state
  const [courses, setCourses] = React.useState<AdminCourse[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const admin = {
    name: 'Admin Demo',
    email: 'admin@verveai.com',
    role: 'admin' as UserRole,
  }

  // Load courses
  React.useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setIsLoading(true)
    try {
      const data = await courseService.getCourses()
      setCourses(data)
    } catch (err) {
      showError('Lỗi', 'Không thể tải danh sách khóa học')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter courses
  const filteredCourses = React.useMemo(() => {
    let result = [...courses]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.nameVi.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter)
    }

    return result
  }, [courses, searchQuery, statusFilter])

  // Stats
  const stats = React.useMemo(() => ({
    total: courses.length,
    active: courses.filter(c => c.status === 'active').length,
    archived: courses.filter(c => c.status === 'archived').length,
    draft: courses.filter(c => c.status === 'draft').length,
  }), [courses])

  const user = {
    name: admin.name,
    email: admin.email,
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'Courses', labelVi: 'Khóa học' },
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

  const handleOpenCreateModal = () => {
    setEditingCourse(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCourse(null)
  }

  const handleEditCourse = (course: AdminCourse) => {
    setEditingCourse(course)
    setIsModalOpen(true)
  }

  const handleSaveCourse = async (data: CreateCourseInput) => {
    setIsSaving(true)
    try {
      if (editingCourse) {
        const result = await courseService.updateCourse(editingCourse.id, data as any)
        if (result.success) {
          success('Thành công', 'Khóa học đã được cập nhật')
          loadCourses()
          handleCloseModal()
        } else {
          showError('Lỗi', result.error || 'Không thể cập nhật khóa học')
        }
      } else {
        const result = await courseService.createCourse(data)
        if (result.success) {
          success('Thành công', 'Khóa học đã được tạo')
          loadCourses()
          handleCloseModal()
        } else {
          showError('Lỗi', result.error || 'Không thể tạo khóa học')
        }
      }
    } catch (err) {
      showError('Lỗi', 'Đã xảy ra lỗi khi lưu khóa học')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCourse = (course: AdminCourse) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Xóa khóa học',
      message: `Bạn có chắc muốn xóa khóa học "${course.nameVi}"? Hành động này không thể hoàn tác.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          const result = await courseService.deleteCourse(course.id)
          if (result.success) {
            success('Thành công', 'Khóa học đã được xóa')
            loadCourses()
          } else {
            showError('Lỗi', result.error || 'Không thể xóa khóa học')
          }
        } catch (err) {
          showError('Lỗi', 'Đã xảy ra lỗi khi xóa khóa học')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      },
    })
  }

  const handleViewCourse = (course: AdminCourse) => {
    router.push(`/admin/courses/${course.id}`)
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
          title="Course Management"
          titleVi="Quản lý Khóa học"
          description="Manage courses and subjects on the platform"
          descriptionVi="Quản lý khóa học và môn học trên nền tảng"
          actions={
            <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo khóa học
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.totalCourses')}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.active')}</p>
            <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{stats.active}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.draft')}</p>
            <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.draft}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.archived')}</p>
            <p className="mt-1 text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.archived}</p>
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
                <option value="active">{t('common.active')}</option>
                <option value="draft">{t('common.draft')}</option>
                <option value="archived">{t('common.archived')}</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <svg className="h-8 w-8 animate-spin text-verve-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onView={handleViewCourse}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No courses found"
            titleVi="Không tìm thấy khóa học"
            description="Try adjusting your search or filters"
            descriptionVi="Thử điều chỉnh tìm kiếm hoặc bộ lọc"
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
        course={editingCourse}
        isLoading={isSaving}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        variant={confirmDialog.variant}
        message={confirmDialog.message}
      />
    </DashboardLayoutWrapper>
  )
}
