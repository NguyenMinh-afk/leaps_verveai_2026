'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
} from '@/components/layout'
import {
  Card,
  Button,
  Input,
} from '@/components/ui'
import { useToast } from '@/components/ui/toast'
import { teacherExamService } from '@/services/exam'
import { classService } from '@/services/class'
import type { UserRole, BreadcrumbItem, CreateExamInput, TeacherClass } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'

/**
 * Create Exam Page
 */
export default function CreateExamPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const { t } = useLanguage()
  const { user } = useAuth()

  // User display object with fallback for null user
  const userDisplay = {
    name: user?.name || 'Teacher',
    email: user?.email || '',
    role: 'teacher' as UserRole,
  }

  // Class list state
  const [classes, setClasses] = React.useState<TeacherClass[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = React.useState(true)
  const [loadClassesError, setLoadClassesError] = React.useState<string | null>(null)

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

  // Load classes on mount
  React.useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    setIsLoadingClasses(true)
    setLoadClassesError(null)
    try {
      const data = await classService.getClasses()
      setClasses(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load classes'
      setLoadClassesError(message)
      console.error('Failed to load classes:', err)
    } finally {
      setIsLoadingClasses(false)
    }
  }
  
  // Validation errors
  const [errors, setErrors] = React.useState<{
    title?: string
    classId?: string
    timeLimitMinutes?: string
    passingScore?: string
    maxScore?: string
    maxAttempts?: string
  }>({})

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!title.trim()) {
      newErrors.title = t('errors.titleRequired') || 'Tiêu đề là bắt buộc'
    }

    if (!classId) {
      newErrors.classId = t('errors.classRequired') || 'Lớp học là bắt buộc'
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const input: CreateExamInput = {
        classId,
        title: title.trim(),
        titleVi: title.trim(),
        description: description.trim(),
        descriptionVi: description.trim(),
        timeLimitMinutes: timeLimitMinutes ? parseInt(timeLimitMinutes, 10) : undefined,
        passingScore: parseFloat(passingScore),
        maxScore: parseFloat(maxScore),
        maxAttempts: parseInt(maxAttempts, 10),
        shuffleQuestions,
        showResultsImmediately,
      }

      const result = await teacherExamService.createExam(input)

      if (result.success) {
        success(
          t('common.success') || 'Thành công',
          t('exam.created') || 'Bài kiểm tra đã được tạo'
        )
        router.push('/teacher/exams')
      } else {
        showError(
          t('common.error') || 'Lỗi',
          result.error || (t('exam.createError') || 'Không thể tạo bài kiểm tra')
        )
      }
    } catch (err) {
      showError(
        t('common.error') || 'Lỗi',
        t('exam.createErrorGeneric') || 'Đã xảy ra lỗi khi tạo bài kiểm tra'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    router.push('/teacher/exams')
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: t('exam.exams') || 'Bài kiểm tra', labelVi: t('exam.exams') || 'Bài kiểm tra', href: '/teacher/exams' },
    { label: t('exam.create') || 'Tạo mới', labelVi: t('exam.create') || 'Tạo mới' },
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
          title="Create Exam"
          titleVi={t('exam.create') || 'Tạo bài kiểm tra mới'}
          description="Create a new assessment for your students"
          descriptionVi={t('exam.createDescription') || 'Tạo bài kiểm tra mới cho học sinh'}
        />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Basic Information */}
            <Card variant="default" padding="lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t('exam.basicInfo') || 'Thông tin cơ bản'}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('exam.basicInfoDescription') || 'Nhập thông tin cơ bản cho bài kiểm tra'}
              </p>

              <div className="mt-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    {t('exam.title') || 'Tiêu đề'} <span className="text-error-500">*</span>
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('exam.titlePlaceholder') || 'VD: Bài kiểm tra chương 1'}
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
                    placeholder={t('exam.descPlaceholder') || 'Mô tả bài kiểm tra...'}
                    rows={3}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Class */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    {t('class.title') || 'Lớp học'} <span className="text-error-500">*</span>
                  </label>
                  {isLoadingClasses ? (
                    <div className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400">
                      {t('common.loading') || 'Đang tải...'}
                    </div>
                  ) : loadClassesError ? (
                    <div className="w-full rounded-md border border-error-300 bg-error-50 px-3 py-2 text-sm text-error-600 dark:bg-error-900/20 dark:text-error-400">
                      {loadClassesError}
                    </div>
                  ) : (
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
                      <option value="">{t('exam.selectClass') || 'Chọn lớp học'}</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.classId && (
                    <p className="mt-1 text-sm text-error-600">{errors.classId}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Scoring Settings */}
            <Card variant="default" padding="lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t('exam.scoring') || 'Cài đặt chấm điểm'}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('exam.scoringDescription') || 'Cấu hình điểm số và số lần thi'}
              </p>

              <div className="mt-6 space-y-4">
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
              </div>
            </Card>

            {/* Quiz Options */}
            <Card variant="default" padding="lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t('exam.options') || 'Tùy chọn'}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('exam.optionsDescription') || 'Cấu hình các tùy chọn hiển thị'}
              </p>

              <div className="mt-6 space-y-4">
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
                      {t('exam.shuffleQuestionsDescription') || 'Câu hỏi sẽ được hiển thị theo thứ tự ngẫu nhiên cho mỗi học sinh'}
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
              </div>
            </Card>

            {/* Info Card */}
            <Card variant="default" padding="lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t('exam.notes') || 'Lưu ý'}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('exam.noteAfterCreate') || 'Sau khi tạo, bạn có thể thêm câu hỏi vào bài kiểm tra'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('exam.notePublish') || 'Bài kiểm tra sẽ ở trạng thái nháp cho đến khi bạn xuất bản'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('exam.noteArchive') || 'Bạn có thể lưu trữ bài kiểm tra cũ để giữ hệ thống gọn gàng'}</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              {t('common.cancel') || 'Hủy'}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {t('exam.create') || 'Tạo bài kiểm tra'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayoutWrapper>
  )
}
