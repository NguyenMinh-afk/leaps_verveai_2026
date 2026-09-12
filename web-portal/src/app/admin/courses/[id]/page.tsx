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
import {
  mockAdminProfile,
  getCourseById,
} from '@/data/admin-mock-data'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import type { UserRole, BreadcrumbItem } from '@/types'

/**
 * Course Detail Page
 */
export default function CourseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  const [currentRole] = React.useState<UserRole>('admin')

  const admin = mockAdminProfile
  const course = getCourseById(courseId)

  const user = {
    name: admin.name,
    email: admin.email,
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'Courses', labelVi: 'Khóa học', href: '/admin/courses' },
    { label: course?.nameVi || 'Course', labelVi: course?.nameVi || 'Khóa học' },
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

  if (!course) {
    return (
      <DashboardLayoutWrapper
        user={user}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Course not found"
          titleVi="Không tìm thấy khóa học"
          description="The course you're looking for doesn't exist"
          descriptionVi="Khóa học bạn đang tìm kiếm không tồn tại"
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

  const config = statusConfig[course.status]

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
          title={course.nameVi}
          titleVi={course.nameVi}
          description={course.code}
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
                  {course.nameVi}
                </h2>
                <Badge variant={config.variant} size="sm">
                  {config.label}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{course.code}</p>
            </div>
          </div>

          <p className="mt-4 text-slate-600 dark:text-slate-400">
            {course.descriptionVi}
          </p>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">Giáo viên</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{course.teacherCount}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">Học sinh</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{course.studentCount}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">Câu hỏi</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{course.questionCount}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">Chủ đề</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{course.topicCount}</p>
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
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{course.code}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Trạng thái</p>
                <Badge variant={config.variant} size="sm">{config.label}</Badge>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Ngày tạo</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatDate(new Date(course.createdAt))}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Cập nhật lần cuối</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatRelativeTime(new Date(course.updatedAt))}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Mô tả
            </h3>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              {course.descriptionVi}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
              {course.description}
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
