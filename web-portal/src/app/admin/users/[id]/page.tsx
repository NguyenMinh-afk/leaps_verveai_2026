'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
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
} from '@/components/ui'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import { api } from '@/lib/api/apiClient'

// Backend user response type
interface BackendUserResponse {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string
  class_id?: string
  class_name?: string
}

/**
 * User Detail Page
 */
export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('admin')
  const [userData, setUserData] = React.useState<BackendUserResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  // Fetch user from real API
  React.useEffect(() => {
    async function fetchUser() {
      setIsLoading(true)
      setLoadError(null)
      try {
        const response = await api.get<BackendUserResponse>(`/api/auth/users/${userId}`)
        setUserData(response)
      } catch {
        setLoadError('Không thể tải thông tin người dùng')
        setUserData(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (userId) {
      fetchUser()
    }
  }, [userId])

  const userDisplay = {
    name: user?.name || 'Admin',
    email: user?.email || '',
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'Users', labelVi: 'Người dùng', href: '/admin/users' },
    { label: userData?.name || 'User', labelVi: userData?.name || 'Người dùng' },
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
            <p className="text-sm text-slate-500">Đang tải thông tin người dùng...</p>
          </div>
        </div>
      </DashboardLayoutWrapper>
    )
  }

  // Error state
  if (loadError || !userData) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="User not found"
          titleVi="Không tìm thấy người dùng"
          description={loadError || "The user you're looking for doesn't exist"}
          descriptionVi={loadError || 'Người dùng bạn đang tìm kiếm không tồn tại'}
          action={
            <Button variant="primary" onClick={() => router.push('/admin/users')}>
              Quay lại Người dùng
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  const statusConfig: Record<string, { label: string; variant: 'success' | 'default' | 'warning' | 'error' }> = {
    true: { label: 'Hoạt động', variant: 'success' },
    false: { label: 'Không hoạt động', variant: 'default' },
  }

  const roleConfig: Record<string, { label: string; color: string }> = {
    admin: { label: 'Quản trị viên', color: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300' },
    teacher: { label: 'Giáo viên', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    student: { label: 'Học sinh', color: 'bg-verve-100 text-verve-700 dark:bg-verve-900/30 dark:text-verve-300' },
    reviewer: { label: 'Người duyệt', color: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300' },
  }

  const config = statusConfig[userData.is_active ? 'true' : 'false']
  const role = roleConfig[userData.role.toLowerCase()] || roleConfig.student

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
          title={userData.name}
          titleVi={userData.name}
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
              {userData.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {userData.name}
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
                  {formatDate(new Date(userData.created_at))}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Hoạt động cuối</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {userData.last_login
                    ? formatRelativeTime(new Date(userData.last_login))
                    : 'Never'}
                </p>
              </div>
              {userData.class_name && (
                <div className="flex justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Lớp</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{userData.class_name}</p>
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
            {userData.is_active ? (
              <Button variant="outline" size="sm">
                Vô hiệu hóa tài khoản
              </Button>
            ) : (
              <Button variant="primary" size="sm">
                Kích hoạt tài khoản
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
