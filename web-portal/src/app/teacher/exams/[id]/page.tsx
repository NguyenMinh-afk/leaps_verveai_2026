'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
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
import { classService } from '@/services/class'
import { formatDate } from '@/lib/utils'
import type { UserRole, BreadcrumbItem, TeacherExam, TeacherExamStatus, UpdateExamInput } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'

/**
 * Exam Detail/Edit Page
 */
export default function ExamDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('edit') === 'true'
  
  const { success, error: showError } = useToast()
  const { t } = useLanguage()
  const { user } = useAuth()
  
  // User display object with fallback for null user
  const userDisplay = {
    name: user?.name || 'Teacher',
    email: user?.email || '',
    role: 'teacher' as UserRole,
  }

  // Exam ID from route
  const examId = typeof window !== 'undefined' 
    ? window.location.pathname.split('/').pop() || ''
    : ''
  
  // Exam state
  const [exam, setExam] = React.useState<TeacherExam | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  
  // Class list state
  const [classes, setClasses] = React.useState<Array<{ id: string; name: string }>>([])
  const [isLoadingClasses, setIsLoadingClasses] = React.useState(true)
  
  // Edit mode state
  const [isEditing, setIsEditing] = React.useState(isEditMode)
  
  // Form state
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [classId, setClassId] = React.useState('')
  const [timeLimitMinutes, setTimeLimitMinutes] = React.useState<string>('')
  const [passingScore, setPassingScore] = React.useState<string>('60')
  const [maxScore, setMaxScore] = React.useState<string>('100')
  const [maxAttempts, setMaxAttempts] = React.useState<string>('1')
  const [shuffleQuestions, setShuffleQuestions] = React.useState(false)
  const [showResultsImmediately, setShowResultsImmediately] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  // Validation errors
  const [errors, setErrors] = React.useState<{
    title?: string
    timeLimitMinutes?: string
    passingScore?: string
    maxScore?: string
    maxAttempts?: string
  }>({})
  
  // Status change dialog
  const [statusDialog, setStatusDialog] = React.useState<{
    isOpen: boolean
    title: string
    message: string
    newStatus: TeacherExamStatus | null
    isLoading: boolean
  }>({ isOpen: false, title: '', message: '', newStatus: null, isLoading: false })

  // Load exam and classes
  React.useEffect(() => {
    if (!examId) return
    loadExam()
    loadClasses()
  }, [examId])

  const loadClasses = async () => {
    setIsLoadingClasses(true)
    try {
      const data = await classService.getClasses()
      setClasses(data.map(c => ({ id: c.id, name: c.name })))
    } catch (err) {
      console.error('Failed to load classes:', err)
    } finally {
      setIsLoadingClasses(false)
    }
  }

  // Load exam
  React.useEffect(() => {
    if (!examId) return
    loadExam()
  }, [examId])

  const loadExam = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await teacherExamService.getExamById(examId)
      setExam(data)
      // Populate form
      setTitle(data.title)
      setDescription(data.description)
      setClassId(data.classId)
      setTimeLimitMinutes(data.timeLimitMinutes?.toString() || '')
      setPassingScore(data.passingScore.toString())
      setMaxScore(data.maxScore.toString())
      setMaxAttempts(data.maxAttempts.toString())
      setShuffleQuestions(data.shuffleQuestions)
      setShowResultsImmediately(data.showResultsImmediately)
    } catch (err) {
      const message = err instanceof Error ? err.message : (t('exam.loadError') || 'Không thể tải thông tin bài kiểm tra')
      setLoadError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!title.trim()) {
      newErrors.title = t('errors.titleRequired') || 'Tiêu đề là bắt buộc'
    }

    if (timeLimitMinutes) {
      const minutes = parseInt(timeLimitMinutes, 10)
      if (isNaN(minutes) || minutes < 1) {
        newErrors.timeLimitMinutes = t('errors.invalidTimeLimit') || 'Thời gian phải lớn hơn 0'
      }
    }

    const score = parseFloat(passingScore)
    if (isNaN(score) || score < 0 || score > 100) {
      newErrors.passingScore = t('errors.invalidPassingScore') || 'Điểm đạt phải từ 0 đến 100'
    }

    const max = parseFloat(maxScore)
    if (isNaN(max) || max <= 0) {
      newErrors.maxScore = t('errors.invalidMaxScore') || 'Điểm tối đa phải lớn hơn 0'
    }

    const attempts = parseInt(maxAttempts, 10)
    if (isNaN(attempts) || attempts < 1) {
      newErrors.maxAttempts = t('errors.invalidMaxAttempts') || 'Số lần thi phải lớn hơn 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const input: UpdateExamInput = {
        title: title.trim(),
        description: description.trim(),
        timeLimitMinutes: timeLimitMinutes ? parseInt(timeLimitMinutes, 10) : undefined,
        passingScore: parseFloat(passingScore),
        maxAttempts: parseInt(maxAttempts, 10),
        shuffleQuestions,
        showResultsImmediately,
      }

      const result = await teacherExamService.updateExam(examId, input)

      if (result.success) {
        success(
          t('common.success') || 'Thành công',
          t('exam.updated') || 'Bài kiểm tra đã được cập nhật'
        )
        setIsEditing(false)
        loadExam()
      } else {
        showError(
          t('common.error') || 'Lỗi',
          result.error || (t('exam.updateError') || 'Không thể cập nhật bài kiểm tra')
        )
      }
    } catch (err) {
      showError(
        t('common.error') || 'Lỗi',
        t('exam.updateErrorGeneric') || 'Đã xảy ra lỗi khi cập nhật bài kiểm tra'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle status change
  const handleStatusChange = async (newStatus: TeacherExamStatus) => {
    setStatusDialog({
      isOpen: true,
      title: newStatus === 'PUBLISHED' 
        ? (t('exam.publish') || 'Xuất bản bài kiểm tra')
        : newStatus === 'ARCHIVED'
        ? (t('exam.archive') || 'Lưu trữ bài kiểm tra')
        : (t('exam.restore') || 'Khôi phục bài kiểm tra'),
      message: newStatus === 'PUBLISHED'
        ? `${t('exam.publishConfirm') || 'Bạn có chắc muốn xuất bản bài kiểm tra'} "${exam?.titleVi || exam?.title}"?`
        : newStatus === 'ARCHIVED'
        ? `${t('exam.archiveConfirm') || 'Bạn có chắc muốn lưu trữ bài kiểm tra'} "${exam?.titleVi || exam?.title}"?`
        : `${t('exam.restoreConfirm') || 'Bạn có chắc muốn khôi phục bài kiểm tra'} "${exam?.titleVi || exam?.title}"?`,
      newStatus,
      isLoading: false,
    })
  }

  const confirmStatusChange = async () => {
    if (!statusDialog.newStatus) return

    setStatusDialog(prev => ({ ...prev, isLoading: true }))

    try {
      const result = statusDialog.newStatus === 'PUBLISHED'
        ? await teacherExamService.publishExam(examId)
        : statusDialog.newStatus === 'ARCHIVED'
        ? await teacherExamService.archiveExam(examId)
        : await teacherExamService.restoreExam(examId)

      if (result.success) {
        success(
          t('common.success') || 'Thành công',
          statusDialog.newStatus === 'PUBLISHED'
            ? (t('exam.published') || 'Bài kiểm tra đã được xuất bản')
            : statusDialog.newStatus === 'ARCHIVED'
            ? (t('exam.archived') || 'Bài kiểm tra đã được lưu trữ')
            : (t('exam.restored') || 'Bài kiểm tra đã được khôi phục')
        )
        loadExam()
      } else {
        showError(
          t('common.error') || 'Lỗi',
          result.error || (t('exam.statusChangeError') || 'Không thể thay đổi trạng thái')
        )
      }
    } catch (err) {
      showError(
        t('common.error') || 'Lỗi',
        t('exam.statusChangeErrorGeneric') || 'Đã xảy ra lỗi khi thay đổi trạng thái'
      )
    }

    setStatusDialog(prev => ({ ...prev, isOpen: false, isLoading: false }))
  }

  // Handle back
  const handleBack = () => {
    router.push('/teacher/exams')
  }

  // Handle edit toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  // Cancel edit
  const handleCancelEdit = () => {
    if (exam) {
      setTitle(exam.title)
      setDescription(exam.description)
      setTimeLimitMinutes(exam.timeLimitMinutes?.toString() || '')
      setPassingScore(exam.passingScore.toString())
      setMaxScore(exam.maxScore.toString())
      setMaxAttempts(exam.maxAttempts.toString())
      setShuffleQuestions(exam.shuffleQuestions)
      setShowResultsImmediately(exam.showResultsImmediately)
    }
    setErrors({})
    setIsEditing(false)
  }

  // Status badge
  const getStatusBadge = (status: TeacherExamStatus) => {
    const config: Record<TeacherExamStatus, { labelVi: string; variant: 'default' | 'success' | 'warning' }> = {
      DRAFT: { labelVi: 'Nháp', variant: 'default' },
      PUBLISHED: { labelVi: 'Đã xuất bản', variant: 'success' },
      ARCHIVED: { labelVi: 'Đã lưu trữ', variant: 'warning' },
    }
    return <Badge variant={config[status].variant} size="sm">{config[status].labelVi}</Badge>
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: t('exam.exams') || 'Bài kiểm tra', labelVi: t('exam.exams') || 'Bài kiểm tra', href: '/teacher/exams' },
    { label: exam?.titleVi || exam?.title || t('exam.exam') || 'Bài kiểm tra', labelVi: exam?.titleVi || exam?.title || t('exam.exam') || 'Bài kiểm tra' },
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

  // Loading state
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

  // Error state
  if (loadError) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
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
            <Button variant="primary" size="sm" onClick={handleBack}>
              {t('common.back') || 'Quay lại'}
            </Button>
          </div>
        </Card>
      </DashboardLayoutWrapper>
    )
  }

  // No exam found
  if (!exam) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <Card variant="default" padding="lg" className="text-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {t('exam.notFound') || 'Không tìm thấy bài kiểm tra'}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('exam.notFoundDescription') || 'Bài kiểm tra bạn đang tìm kiếm không tồn tại'}
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={handleBack}>
              {t('common.back') || 'Quay lại'}
            </Button>
          </div>
        </Card>
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
          title={exam.title}
          titleVi={exam.titleVi || exam.title}
          description={exam.description || undefined}
          descriptionVi={exam.descriptionVi || undefined}
          actions={
            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  {exam.status === 'DRAFT' && (
                    <Button variant="primary" size="sm" onClick={() => handleStatusChange('PUBLISHED')}>
                      {t('exam.publish') || 'Xuất bản'}
                    </Button>
                  )}
                  {exam.status === 'PUBLISHED' && (
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange('ARCHIVED')}>
                      {t('common.archive') || 'Lưu trữ'}
                    </Button>
                  )}
                  {exam.status === 'ARCHIVED' && (
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange('DRAFT')}>
                      {t('exam.restore') || 'Khôi phục'}
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleEditToggle}>
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {t('common.edit') || 'Chỉnh sửa'}
                  </Button>
                </>
              )}
              {isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSubmitting}>
                    {t('common.cancel') || 'Hủy'}
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSubmitting}>
                    {t('common.save') || 'Lưu thay đổi'}
                  </Button>
                </>
              )}
            </div>
          }
        />

        {/* Status Banner */}
        {getStatusBadge(exam.status)}

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('exam.basicInfo') || 'Thông tin cơ bản'}
            </h3>

            <div className="mt-6 space-y-4">
              {isEditing ? (
                <>
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      {t('exam.title') || 'Tiêu đề'} <span className="text-error-500">*</span>
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      error={errors.title}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      {t('common.description') || 'Mô tả'}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </div>

                  {/* Class */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      {t('class.title') || 'Lớp học'}
                    </label>
                    <select
                      value={classId}
                      onChange={(e) => setClassId(e.target.value)}
                      disabled
                      className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    >
                      {isLoadingClasses ? (
                        <option value="">{t('common.loading') || 'Đang tải...'}</option>
                      ) : (
                        classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))
                      )}
                    </select>
                    <p className="mt-1 text-xs text-slate-500">
                      {t('exam.classNotEditable') || 'Không thể thay đổi lớp học sau khi tạo'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.title') || 'Tiêu đề'}</p>
                    <p className="mt-1 text-slate-900 dark:text-slate-100">{exam.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.description') || 'Mô tả'}</p>
                    <p className="mt-1 text-slate-900 dark:text-slate-100">
                      {exam.description || (t('exam.noDescription') || 'Không có mô tả')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('class.title') || 'Lớp học'}</p>
                    <p className="mt-1 text-slate-900 dark:text-slate-100">{exam.className}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.created') || 'Ngày tạo'}</p>
                    <p className="mt-1 text-slate-900 dark:text-slate-100">{formatDate(exam.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.updated') || 'Cập nhật'}</p>
                    <p className="mt-1 text-slate-900 dark:text-slate-100">{formatDate(exam.updatedAt)}</p>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Scoring Settings */}
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('exam.scoring') || 'Cài đặt chấm điểm'}
            </h3>

            <div className="mt-6 space-y-4">
              {isEditing ? (
                <>
                  {/* Max Score */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      {t('exam.maxScore') || 'Điểm tối đa'}
                    </label>
                    <Input
                      type="number"
                      value={maxScore}
                      onChange={(e) => setMaxScore(e.target.value)}
                      min="1"
                      error={errors.maxScore}
                    />
                  </div>

                  {/* Passing Score */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      {t('exam.passingScore') || 'Điểm đạt'} (%)
                    </label>
                    <Input
                      type="number"
                      value={passingScore}
                      onChange={(e) => setPassingScore(e.target.value)}
                      min="0"
                      max="100"
                      error={errors.passingScore}
                    />
                  </div>

                  {/* Max Attempts */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      {t('exam.maxAttempts') || 'Số lần thi tối đa'}
                    </label>
                    <Input
                      type="number"
                      value={maxAttempts}
                      onChange={(e) => setMaxAttempts(e.target.value)}
                      min="1"
                      error={errors.maxAttempts}
                    />
                  </div>

                  {/* Time Limit */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      {t('exam.timeLimit') || 'Thời gian làm bài'} ({t('exam.minutes') || 'phút'})
                    </label>
                    <Input
                      type="number"
                      value={timeLimitMinutes}
                      onChange={(e) => setTimeLimitMinutes(e.target.value)}
                      placeholder={t('exam.timeLimitPlaceholder') || 'Để trống nếu không giới hạn'}
                      min="1"
                      error={errors.timeLimitMinutes}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.maxScore') || 'Điểm tối đa'}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{exam.maxScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.passingScore') || 'Điểm đạt'}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{exam.passingScore}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.maxAttempts') || 'Số lần thi'}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{exam.maxAttempts}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.timeLimit') || 'Thời gian'}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {exam.timeLimitMinutes ? `${exam.timeLimitMinutes} ${t('exam.minutes') || 'phút'}` : (t('exam.unlimited') || 'Không giới hạn')}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Quiz Options */}
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('exam.options') || 'Tùy chọn'}
            </h3>

            <div className="mt-6 space-y-4">
              {isEditing ? (
                <>
                  {/* Shuffle Questions */}
                  <div className="flex items-start gap-3">
                    <input
                      id="shuffleQuestions"
                      type="checkbox"
                      checked={shuffleQuestions}
                      onChange={(e) => setShuffleQuestions(e.target.checked)}
                      className="h-4 w-4 shrink-0 rounded border-slate-300 text-verve-600 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-800"
                    />
                    <div className="flex-1">
                      <label htmlFor="shuffleQuestions" className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                        {t('exam.shuffleQuestions') || 'Xáo trộn câu hỏi'}
                      </label>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {t('exam.shuffleQuestionsDescription') || 'Câu hỏi sẽ được hiển thị theo thứ tự ngẫu nhiên'}
                      </p>
                    </div>
                  </div>

                  {/* Show Results Immediately */}
                  <div className="flex items-start gap-3">
                    <input
                      id="showResultsImmediately"
                      type="checkbox"
                      checked={showResultsImmediately}
                      onChange={(e) => setShowResultsImmediately(e.target.checked)}
                      className="h-4 w-4 shrink-0 rounded border-slate-300 text-verve-600 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-800"
                    />
                    <div className="flex-1">
                      <label htmlFor="showResultsImmediately" className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                        {t('exam.showResultsImmediately') || 'Hiển thị kết quả ngay'}
                      </label>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {t('exam.showResultsImmediatelyDescription') || 'Học sinh sẽ thấy kết quả ngay sau khi nộp bài'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full',
                      exam.shuffleQuestions 
                        ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400'
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                    )}>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {t('exam.shuffleQuestions') || 'Xáo trộn câu hỏi'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {exam.shuffleQuestions 
                          ? (t('common.enabled') || 'Bật')
                          : (t('common.disabled') || 'Tắt')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full',
                      exam.showResultsImmediately 
                        ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400'
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                    )}>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {t('exam.showResultsImmediately') || 'Hiển thị kết quả ngay'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {exam.showResultsImmediately 
                          ? (t('common.enabled') || 'Bật')
                          : (t('common.disabled') || 'Tắt')}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Questions */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {t('exam.questions') || 'Câu hỏi'}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {exam.questionCount} {t('exam.questions') || 'câu hỏi'}
                </p>
              </div>
              {exam.status !== 'ARCHIVED' && (
                <Button variant="outline" size="sm">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t('exam.addQuestions') || 'Thêm câu hỏi'}
                </Button>
              )}
            </div>

            {exam.questionCount === 0 && (
              <div className="mt-6 rounded-lg border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {t('exam.noQuestions') || 'Chưa có câu hỏi nào'}
                </p>
                {exam.status !== 'ARCHIVED' && (
                  <Button variant="outline" size="sm" className="mt-4">
                    {t('exam.addFirstQuestion') || 'Thêm câu hỏi đầu tiên'}
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Status Change Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmStatusChange}
        title={statusDialog.title}
        titleVi={statusDialog.title}
        message={statusDialog.message}
        variant={statusDialog.newStatus === 'ARCHIVED' ? 'warning' : 'default'}
        isLoading={statusDialog.isLoading}
      />
    </DashboardLayoutWrapper>
  )
}
