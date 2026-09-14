'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  DashboardLayoutWrapper,
  PageHeader,
  EmptyState,
} from '@/components/layout'
import {
  Card,
  Button,
  Badge,
} from '@/components/ui'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import { api } from '@/lib/api/apiClient'

// Backend class response type
interface BackendClassResponse {
  id: string
  name: string
  subject: string
  teacher_id: string
  student_count: number
  question_count: number
  topic_count: number
  status: string
  created_at: string
  updated_at: string
}

/**
 * Course Detail Page
 */
export default function CourseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('admin')
  const [course, setCourse] = React.useState<BackendClassResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  // Fetch course from real API
  React.useEffect(() => {
    async function fetchCourse() {
      setIsLoading(true)
      setLoadError(null)
      try {
        const response = await api.get<BackendClassResponse>(`/api/class/classes/${courseId}`)
        setCourse(response)
      } catch {
        setLoadError('Không thể tải thông tin khóa học')
        setCourse(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const userDisplay = {
    name: user?.name || 'Admin',
    email: user?.email || '',
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'Courses', labelVi: 'Khóa học', href: '/admin/courses' },
    { label: course?.name || 'Course', labelVi: course?.name || 'Khóa học' },
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
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-verve-200 border-t-verve-600"></div>
            <p className="text-sm text-slate-500">Đang tải thông tin khóa học...</p>
          </div>
        </div>
      </DashboardLayoutWrapper>
    )
  }

  // Error state
  if (loadError || !course) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Course not found"
          titleVi="Không tìm thấy khóa học"
          description={loadError || "The course you're looking for doesn't exist"}
          descriptionVi={loadError || 'Khóa học bạn đang tìm kiếm không tồn tại'}
          action={
            <Button variant="primary" onClick={() => router.push('/admin/courses')}>
              Quay lại Khóa học
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  const statusConfig = {
    active: { label: 'Hoạt động', variant: 'success' as const },
    archived: { label: 'Đã lưu trữ', variant: 'default' as const },
    draft: { label: 'Bản nháp', variant: 'warning' as const },
  }

  const config = statusConfig[course.status as keyof typeof statusConfig] || statusConfig.active

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
          title={course.name}
          titleVi={course.name}
          description={course.subject}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/courses')}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </Button>
              <Button variant="primary" size="sm">
                Chỉnh sửa
              </Button>
            </div>
          }
        />

        {/* Course Info */}
        <Card variant="default" padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {course.name}
                </h2>
                <Badge variant={config.variant} size="sm">
                  {config.label}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{course.subject}</p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">Học sinh</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{course.student_count}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">Câu hỏi</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{course.question_count}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">Chủ đề</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{course.topic_count}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">Môn học</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{course.subject}</p>
          </Card>
        </div>

        {/* Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Thông tin
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Mã khóa học</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{course.id}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Trạng thái</p>
                <Badge variant={config.variant} size="sm">{config.label}</Badge>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Ngày tạo</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatDate(new Date(course.created_at))}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Cập nhật lần cuối</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatRelativeTime(new Date(course.updated_at))}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Môn học
            </h3>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              {course.subject}
            </p>
          </Card>
        </div>

        {/* Administrative Actions */}
        <Card variant="default" padding="lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Hành động quản trị
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              Chỉnh sửa khóa học
            </Button>
            {course.status === 'active' && (
              <Button variant="outline" size="sm">
                Lưu trữ
              </Button>
            )}
            {course.status === 'archived' && (
              <Button variant="primary" size="sm">
                Kích hoạt lại
              </Button>
            )}
            <Button variant="destructive" size="sm">
              Xóa khóa học
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayoutWrapper>
  )
}
