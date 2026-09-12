'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
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
} from '@/components/ui'
import {
  mockAdminProfile,
  getUserById,
} from '@/data/admin-mock-data'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import type { UserRole, BreadcrumbItem } from '@/types'

/**
 * User Detail Page
 */
export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const [currentRole] = React.useState<UserRole>('admin')

  const admin = mockAdminProfile
  const userData = getUserById(userId)

  const user = {
    name: admin.name,
    email: admin.email,
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'Users', labelVi: 'Người dùng', href: '/admin/users' },
    { label: userData?.nameVi || 'User', labelVi: userData?.nameVi || 'Người dùng' },
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

  if (!userData) {
    return (
      <DashboardLayoutWrapper
        user={user}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="User not found"
          titleVi="Không tìm thấy người dùng"
          description="The user you're looking for doesn't exist"
          descriptionVi="Người dùng bạn đang tìm kiếm không tồn tại"
          action={
            <Button variant="primary" onClick={() => router.push('/admin/users')}>
              Quay lại Người dùng
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  const statusConfig = {
    active: { label: 'Hoạt động', variant: 'success' as const },
    inactive: { label: 'Không hoạt động', variant: 'default' as const },
    suspended: { label: 'Bị đình chỉ', variant: 'error' as const },
    pending: { label: 'Đang chờ', variant: 'warning' as const },
  }

  const roleConfig = {
    admin: { label: 'Quản trị viên', color: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300' },
    teacher: { label: 'Giáo viên', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    student: { label: 'Học sinh', color: 'bg-verve-100 text-verve-700 dark:bg-verve-900/30 dark:text-verve-300' },
    reviewer: { label: 'Người duyệt', color: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300' },
  }

  const config = statusConfig[userData.status]
  const role = roleConfig[userData.role]

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
          title={userData.nameVi}
          titleVi={userData.nameVi}
          description={userData.email}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/users')}>
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

        {/* Profile Card */}
        <Card variant="default" padding="lg">
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-3xl font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
              {userData.nameVi.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {userData.nameVi}
                </h2>
                <Badge variant={config.variant} size="sm">
                  {config.label}
                </Badge>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{userData.email}</p>
              <div className={cn('mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium', role.color)}>
                {role.label}
              </div>
            </div>
          </div>
        </Card>

        {/* Details Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Account Information */}
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Thông tin tài khoản
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">ID</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{userData.id}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{userData.email}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Vai trò</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{role.label}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Trạng thái</p>
                <Badge variant={config.variant} size="sm">{config.label}</Badge>
              </div>
            </div>
          </Card>

          {/* Activity Information */}
          <Card variant="default" padding="lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Hoạt động
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Ngày tạo</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatDate(new Date(userData.createdAt))}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Hoạt động cuối</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {userData.lastActiveAt
                    ? formatRelativeTime(new Date(userData.lastActiveAt))
                    : 'Never'}
                </p>
              </div>
              {userData.className && (
                <div className="flex justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Lớp</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{userData.className}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Administrative Actions */}
        <Card variant="default" padding="lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Hành động quản trị
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {userData.status === 'active' && (
              <Button variant="outline" size="sm">
                Vô hiệu hóa tài khoản
              </Button>
            )}
            {userData.status === 'inactive' && (
              <Button variant="primary" size="sm">
                Kích hoạt tài khoản
              </Button>
            )}
            {userData.status !== 'suspended' && (
              <Button variant="destructive" size="sm">
                Đình chỉ tài khoản
              </Button>
            )}
            {userData.status === 'suspended' && (
              <Button variant="primary" size="sm">
                Hủy đình chỉ
              </Button>
            )}
            <Button variant="outline" size="sm">
              Thay đổi vai trò
            </Button>
            <Button variant="destructive" size="sm">
              Xóa tài khoản
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayoutWrapper>
  )
}
