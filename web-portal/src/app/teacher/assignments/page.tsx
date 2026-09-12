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
import { assignmentService } from '@/services/assignment'
import { mockClasses } from '@/data/teacher-mock-data'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import type { UserRole, BreadcrumbItem, Assignment } from '@/types'
import type { CreateAssignmentInput } from '@/services/assignment'
import { useLanguage } from '@/components/providers/language-provider'

/**
 * Assignment Status Badge
 */
const AssignmentStatusBadge: React.FC<{ status: Assignment['status'] }> = ({ status }) => {
  const { t } = useLanguage()
  const config: Record<Assignment['status'], { label: string; variant: 'default' | 'success' | 'warning' }> = {
    draft: { label: t('common.draft') || 'Nháp', variant: 'default' },
    published: { label: t('common.published') || 'Đã xuất bản', variant: 'success' },
    archived: { label: t('common.archived') || 'Đã lưu trữ', variant: 'warning' },
  }

  const { label, variant } = config[status]

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  )
}

/**
 * Assignment Card Component
 */
interface AssignmentCardProps {
  assignment: Assignment
  onView: (assignment: Assignment) => void
  onEdit: (assignment: Assignment) => void
  onDuplicate: (assignment: Assignment) => void
  onArchive: (assignment: Assignment) => void
  onDelete: (assignment: Assignment) => void
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
}) => {
  const { t } = useLanguage()
  const completionRate = assignment.studentCount > 0
    ? Math.round((assignment.completionCount / assignment.studentCount) * 100)
    : 0

  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date()
  const isDueSoon = assignment.dueDate &&
    !isOverdue &&
    new Date(assignment.dueDate).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 3 // 3 days

  return (
    <Card variant="default" padding="lg" className="hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {assignment.titleVi || assignment.title}
            </h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {assignment.className}
            </p>
          </div>
          <AssignmentStatusBadge status={assignment.status} />
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {assignment.descriptionVi || assignment.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('questions.questions') || 'Câu hỏi'}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
              {assignment.questionCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('class.students') || 'Học sinh'}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
              {assignment.studentCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('mastery.completed') || 'Hoàn thành'}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
              {assignment.completionCount} ({completionRate}%)
            </p>
          </div>
          {assignment.averageScore !== undefined && (
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('assignment.avgScore') || 'Điểm TB'}</p>
              <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                {assignment.averageScore}%
              </p>
            </div>
          )}
        </div>

        {/* Progress */}
        {assignment.status === 'published' && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400">{t('mastery.progress') || 'Tiến độ'}</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{completionRate}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  completionRate === 100 ? 'bg-success-500' : 'bg-verve-600'
                )}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{t('assignment.created') || 'Tạo'}: {formatDate(assignment.createdAt)}</span>
          </div>
          {assignment.dueDate && (
            <div className={cn(
              'flex items-center gap-1',
              isOverdue && 'text-error-600 dark:text-error-400',
              isDueSoon && 'text-warning-600 dark:text-warning-400'
            )}>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {t('assignment.dueDate') || 'Hạn'}: {formatDate(assignment.dueDate)}
                {isOverdue && ` (${t('assignment.overdue') || 'Quá hạn'})`}
                {isDueSoon && ` (${t('assignment.dueSoon') || 'Sắp đến hạn'})`}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
          <Button variant="ghost" size="sm" onClick={() => onView(assignment)}>
            {t('common.view') || 'Xem chi tiết'}
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => onDuplicate(assignment)} title={t('common.duplicate') || 'Sao chép'}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onDelete(assignment)} title={t('common.delete') || 'Xóa'} className="text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
            {assignment.status !== 'archived' && (
              <Button variant="ghost" size="icon-sm" onClick={() => onArchive(assignment)} title={t('common.archive') || 'Lưu trữ'}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </Button>
            )}
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(assignment)} title={t('common.edit') || 'Chỉnh sửa'}>
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
 * Assignment Modal for Create/Edit
 */
interface AssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreateAssignmentInput) => Promise<void>
  assignment?: Assignment | null
  isLoading: boolean
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, onSave, assignment, isLoading }) => {
  const { t } = useLanguage()
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [classId, setClassId] = React.useState('')
  const [dueDate, setDueDate] = React.useState('')
  const [errors, setErrors] = React.useState<{ title?: string; classId?: string }>({})

  React.useEffect(() => {
    if (assignment) {
      setTitle(assignment.titleVi || assignment.title)
      setDescription(assignment.descriptionVi || assignment.description)
      setClassId(assignment.classId)
      setDueDate(assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '')
    } else {
      setTitle('')
      setDescription('')
      setClassId('')
      setDueDate('')
    }
    setErrors({})
  }, [assignment, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}

    if (!title.trim()) {
      newErrors.title = t('errors.titleRequired') || 'Tiêu đề là bắt buộc'
    }
    if (!classId) {
      newErrors.classId = t('errors.classRequired') || 'Lớp học là bắt buộc'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const selectedClass = mockClasses.find(c => c.id === classId)
    await onSave({
      title: title.trim(),
      titleVi: title.trim(),
      description: description.trim(),
      descriptionVi: description.trim(),
      classId,
      className: selectedClass?.name || '',
      questionIds: [],
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: 'draft',
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
              {assignment ? (t('assignment.edit') || 'Chỉnh sửa bài tập') : (t('assignment.create') || 'Tạo bài tập mới')}
            </h3>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t('assignment.name') || 'Tiêu đề'} <span className="text-error-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('assignment.titlePlaceholder') || 'VD: Bài tập về phân số'}
                  error={errors.title}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t('common.description') || 'Mô tả'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('assignment.descPlaceholder') || 'Mô tả bài tập...'}
                  rows={3}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t('class.title') || 'Lớp học'} <span className="text-error-500">*</span>
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className={cn(
                    'w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-slate-900',
                    errors.classId
                      ? 'border-error-500 text-error-600'
                      : 'border-slate-300 text-slate-900 dark:border-slate-600 dark:text-slate-100'
                  )}
                >
                  <option value="">{t('assignment.selectClass') || 'Chọn lớp học'}</option>
                  {mockClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {errors.classId && (
                  <p className="mt-1 text-sm text-error-600">{errors.classId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t('assignment.dueDate') || 'Hạn nộp'}
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {t('common.cancel') || 'Hủy'}
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {assignment ? (t('common.save') || 'Lưu thay đổi') : (t('assignment.create') || 'Tạo bài tập')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/**
 * Assignments Page
 */
export default function AssignmentsPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<Assignment['status'] | 'all'>('all')
  const [classFilter, setClassFilter] = React.useState<string | 'all'>('all')
  const [currentRole] = React.useState<UserRole>('teacher')
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingAssignment, setEditingAssignment] = React.useState<Assignment | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    variant: 'danger' | 'warning' | 'default'
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'default' })

  // Local state for assignments
  const [assignments, setAssignments] = React.useState<Assignment[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Load assignments
  React.useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    setIsLoading(true)
    try {
      const data = await assignmentService.getAssignments()
      setAssignments(data.assignments)
    } catch (err) {
      showError(t('common.error') || 'Lỗi', t('assignment.loadError') || 'Không thể tải danh sách bài tập')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter assignments
  const filteredAssignments = React.useMemo(() => {
    return assignments.filter((assignment) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          assignment.title.toLowerCase().includes(query) ||
          assignment.titleVi?.toLowerCase().includes(query) ||
          assignment.className?.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      if (statusFilter !== 'all' && assignment.status !== statusFilter) {
        return false
      }

      if (classFilter !== 'all' && assignment.classId !== classFilter) {
        return false
      }

      return true
    })
  }, [assignments, searchQuery, statusFilter, classFilter])

  // Group by status
  const draftAssignments = filteredAssignments.filter(a => a.status === 'draft')
  const publishedAssignments = filteredAssignments.filter(a => a.status === 'published')
  const archivedAssignments = filteredAssignments.filter(a => a.status === 'archived')

  const user = {
    name: 'Giáo viên Demo',
    email: 'teacher@example.com',
    role: 'teacher' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: t('assignment.assignments') || 'Bài tập', labelVi: t('assignment.assignments') || 'Bài tập' },
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

  const handleViewAssignment = (assignment: Assignment) => {
    // Navigate to assignment details
    router.push(`/teacher/assignments/${assignment.id}`)
  }

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setIsModalOpen(true)
  }

  const handleOpenCreateModal = () => {
    setEditingAssignment(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAssignment(null)
  }

  const handleSaveAssignment = async (data: CreateAssignmentInput) => {
    setIsSaving(true)
    try {
      if (editingAssignment) {
        const result = await assignmentService.updateAssignment({
          id: editingAssignment.id,
          ...data,
        })
        if (result.success) {
          success(t('common.success') || 'Thành công', t('assignment.updated') || 'Bài tập đã được cập nhật')
          loadAssignments()
          handleCloseModal()
        } else {
          showError(t('common.error') || 'Lỗi', result.error || (t('assignment.updateError') || 'Không thể cập nhật bài tập'))
        }
      } else {
        const result = await assignmentService.createAssignment(data)
        if (result.success) {
          success(t('common.success') || 'Thành công', t('assignment.created') || 'Bài tập đã được tạo')
          loadAssignments()
          handleCloseModal()
        } else {
          showError(t('common.error') || 'Lỗi', result.error || (t('assignment.createError') || 'Không thể tạo bài tập'))
        }
      }
    } catch (err) {
      showError(t('common.error') || 'Lỗi', t('assignment.saveError') || 'Đã xảy ra lỗi khi lưu bài tập')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDuplicateAssignment = async (assignment: Assignment) => {
    try {
      const result = await assignmentService.duplicateAssignment(assignment.id)
      if (result.success) {
        success(t('common.success') || 'Thành công', t('assignment.duplicated') || 'Đã sao chép bài tập')
        loadAssignments()
      } else {
        showError(t('common.error') || 'Lỗi', result.error || (t('assignment.duplicateError') || 'Không thể sao chép bài tập'))
      }
    } catch (err) {
      showError(t('common.error') || 'Lỗi', t('assignment.duplicateErrorGeneric') || 'Đã xảy ra lỗi khi sao chép bài tập')
    }
  }

  const handleArchiveAssignment = async (assignment: Assignment) => {
    if (assignment.status === 'archived') {
      // Restore
      setConfirmDialog({
        isOpen: true,
        title: t('assignment.restore') || 'Khôi phục bài tập',
        message: `${t('assignment.restoreConfirm') || 'Bạn có chắc muốn khôi phục bài tập'} "${assignment.titleVi || assignment.title}"?`,
        variant: 'default',
        onConfirm: async () => {
          try {
            const result = await assignmentService.updateAssignment({
              id: assignment.id,
              status: 'active',
            } as any)
            if (result.success) {
              success(t('common.success') || 'Thành công', t('assignment.restored') || 'Bài tập đã được khôi phục')
              loadAssignments()
            } else {
              showError(t('common.error') || 'Lỗi', result.error || (t('assignment.restoreError') || 'Không thể khôi phục bài tập'))
            }
          } catch (err) {
            showError(t('common.error') || 'Lỗi', t('assignment.restoreErrorGeneric') || 'Đã xảy ra lỗi khi khôi phục bài tập')
          }
          setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        },
      })
    } else {
      // Archive
      setConfirmDialog({
        isOpen: true,
        title: t('assignment.archive') || 'Lưu trữ bài tập',
        message: `${t('assignment.archiveConfirm') || 'Bạn có chắc muốn lưu trữ bài tập'} "${assignment.titleVi || assignment.title}"?`,
        variant: 'warning',
        onConfirm: async () => {
          try {
            const result = await assignmentService.archiveAssignment(assignment.id)
            if (result.success) {
              success(t('common.success') || 'Thành công', t('assignment.archived') || 'Bài tập đã được lưu trữ')
              loadAssignments()
            } else {
              showError(t('common.error') || 'Lỗi', result.error || (t('assignment.archiveError') || 'Không thể lưu trữ bài tập'))
            }
          } catch (err) {
            showError(t('common.error') || 'Lỗi', t('assignment.archiveErrorGeneric') || 'Đã xảy ra lỗi khi lưu trữ bài tập')
          }
          setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        },
      })
    }
  }

  const handleDeleteAssignment = (assignment: Assignment) => {
    setConfirmDialog({
      isOpen: true,
      title: t('assignment.delete') || 'Xóa bài tập',
      message: `${t('assignment.deleteConfirm') || 'Bạn có chắc muốn xóa bài tập'} "${assignment.titleVi || assignment.title}"? ${t('assignment.deleteWarning') || 'Hành động này không thể hoàn tác.'}`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          const result = await assignmentService.deleteAssignment(assignment.id)
          if (result.success) {
            success(t('common.success') || 'Thành công', t('assignment.deleted') || 'Bài tập đã được xóa')
            loadAssignments()
          } else {
            showError(t('common.error') || 'Lỗi', result.error || (t('assignment.deleteError') || 'Không thể xóa bài tập'))
          }
        } catch (err) {
          showError(t('common.error') || 'Lỗi', t('assignment.deleteErrorGeneric') || 'Đã xảy ra lỗi khi xóa bài tập')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      },
    })
  }

  // Stats
  const stats = React.useMemo(() => ({
    total: assignments.length,
    draft: assignments.filter(a => a.status === 'draft').length,
    published: assignments.filter(a => a.status === 'published').length,
    archived: assignments.filter(a => a.status === 'archived').length,
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
          title="Assignments"
          titleVi={t('assignment.assignments') || 'Bài tập'}
          description="Manage assessments and assignments for your classes"
          descriptionVi={t('assignment.manageDescription') || 'Quản lý bài kiểm tra và bài tập cho các lớp của bạn'}
          actions={
            <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('assignment.createNew') || 'Tạo bài tập mới'}
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('assignment.total') || 'Tổng bài tập'}</p>
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
                placeholder={t('assignment.searchPlaceholder') || 'Tìm kiếm bài tập...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('common.status') || 'Trạng thái'}:</span>
                <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                  {(['all', 'draft', 'published', 'archived'] as const).map((value) => (
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
                       value === 'draft' ? (t('common.draft') || 'Nháp') :
                       value === 'published' ? (t('common.published') || 'Đã xuất bản') : (t('common.archived') || 'Đã lưu trữ')}
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
                  {mockClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-sm text-slate-500 dark:text-slate-400">
                {filteredAssignments.length} {t('assignment.assignments') || 'bài tập'}
              </span>
            </div>
          </div>
        </Card>

        {/* Assignments List */}
        {filteredAssignments.length > 0 ? (
          <div className="space-y-6">
            {/* Draft Assignments */}
            {statusFilter === 'all' && draftAssignments.length > 0 && (
              <PageSection title={t('common.draft') || 'Nháp'} titleVi={t('common.draft') || 'Nháp'}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {draftAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      onView={handleViewAssignment}
                      onEdit={handleEditAssignment}
                      onDuplicate={handleDuplicateAssignment}
                      onArchive={handleArchiveAssignment}
                      onDelete={handleDeleteAssignment}
                    />
                  ))}
                </div>
              </PageSection>
            )}

            {/* Published Assignments */}
            {(statusFilter === 'all' || statusFilter === 'published') && publishedAssignments.length > 0 && (
              <PageSection title={t('common.published') || 'Đã xuất bản'} titleVi={t('common.published') || 'Đã xuất bản'}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {publishedAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      onView={handleViewAssignment}
                      onEdit={handleEditAssignment}
                      onDuplicate={handleDuplicateAssignment}
                      onArchive={handleArchiveAssignment}
                      onDelete={handleDeleteAssignment}
                    />
                  ))}
                </div>
              </PageSection>
            )}

            {/* Archived Assignments */}
            {(statusFilter === 'all' || statusFilter === 'archived') && archivedAssignments.length > 0 && (
              <PageSection title={t('common.archived') || 'Đã lưu trữ'} titleVi={t('common.archived') || 'Đã lưu trữ'}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {archivedAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      onView={handleViewAssignment}
                      onEdit={handleEditAssignment}
                      onDuplicate={handleDuplicateAssignment}
                      onArchive={handleArchiveAssignment}
                      onDelete={handleDeleteAssignment}
                    />
                  ))}
                </div>
              </PageSection>
            )}
          </div>
        ) : (
          <EmptyState
            title="No assignments found"
            titleVi={t('assignment.noAssignments') || 'Không tìm thấy bài tập nào'}
            description="Try adjusting your filters or create a new assignment"
            descriptionVi={t('assignment.noAssignmentsHint') || 'Thử điều chỉnh bộ lọc hoặc tạo bài tập mới'}
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
                <Button variant="primary" onClick={handleOpenCreateModal}>
                  {t('assignment.createNew') || 'Tạo bài tập mới'}
                </Button>
              </div>
            }
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAssignment}
        assignment={editingAssignment}
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
    </DashboardLayoutWrapper>
  )
}
