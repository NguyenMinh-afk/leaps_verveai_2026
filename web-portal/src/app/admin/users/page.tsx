'use client'

import * as React from 'react'
import Link from 'next/link'
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
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import {
  mockAdminProfile,
  mockAdminUsers,
} from '@/data/admin-mock-data'
import { formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { AdminUser } from '@/types'

/**
 * User Row Component
 */
interface UserRowProps {
  user: AdminUser
}

const UserRow: React.FC<UserRowProps> = ({ user }) => {
  const { t } = useLanguage()
  const statusConfig = {
    active: { label: t('common.active'), variant: 'success' as const },
    inactive: { label: t('common.inactive'), variant: 'default' as const },
    suspended: { label: t('admin.suspended'), variant: 'error' as const },
    pending: { label: t('common.pending'), variant: 'warning' as const },
  }

  const roleConfig = {
    admin: { label: t('auth.admin'), color: 'text-info-600 dark:text-info-400' },
    teacher: { label: t('auth.teacher'), color: 'text-amber-600 dark:text-amber-400' },
    student: { label: t('auth.student'), color: 'text-verve-600 dark:text-verve-400' },
    reviewer: { label: t('admin.reviewer'), color: 'text-success-600 dark:text-success-400' },
  }

  const config = statusConfig[user.status]
  const role = roleConfig[user.role]

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">{user.nameVi}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={cn('text-sm font-medium', role.color)}>
          {role.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <Badge variant={config.variant} size="sm">
          {config.label}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {user.className || '-'}
        </p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {formatRelativeTime(new Date(user.createdAt))}
        </p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {user.lastActiveAt ? formatRelativeTime(new Date(user.lastActiveAt)) : 'Never'}
        </p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link href={`/admin/users/${user.id}`}>
            <Button variant="ghost" size="sm">
              {t('common.view')}
            </Button>
          </Link>
        </div>
      </td>
    </tr>
  )
}

/**
 * Users Page
 */
export default function UsersPage() {
  const router = useRouter()
  const [currentRole] = React.useState<UserRole>('admin')
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  const admin = mockAdminProfile
  const users = mockAdminUsers

  // Filter users
  const filteredUsers = React.useMemo(() => {
    let result = [...users]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.nameVi.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(u => u.status === statusFilter)
    }

    return result
  }, [users, searchQuery, roleFilter, statusFilter])

  // Stats
  const stats = React.useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    students: users.filter(u => u.role === 'student').length,
    active: users.filter(u => u.status === 'active').length,
  }), [users])

  const user = {
    name: admin.name,
    email: admin.email,
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'Users', labelVi: 'Người dùng' },
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
          title="User Management"
          titleVi="Quản lý Người dùng"
          description="Manage platform users and their roles"
          descriptionVi="Quản lý người dùng nền tảng và vai trò của họ"
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.totalUsers')}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('auth.admin')}</p>
            <p className="mt-1 text-2xl font-bold text-info-600 dark:text-info-400">{stats.admins}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('auth.teacher')}</p>
            <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.teachers}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('auth.student')}</p>
            <p className="mt-1 text-2xl font-bold text-verve-600 dark:text-verve-400">{stats.students}</p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.active')}</p>
            <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{stats.active}</p>
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
            <div className="flex flex-wrap gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="all">{t('common.all')} {t('common.role')}</option>
                <option value="admin">{t('auth.admin')}</option>
                <option value="teacher">{t('auth.teacher')}</option>
                <option value="student">{t('auth.student')}</option>
                <option value="reviewer">{t('admin.reviewer')}</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="all">{t('common.all')} {t('common.status')}</option>
                <option value="active">{t('common.active')}</option>
                <option value="inactive">{t('common.inactive')}</option>
                <option value="suspended">{t('admin.suspended')}</option>
                <option value="pending">{t('common.pending')}</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card variant="default" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('nav.users')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('common.role')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('common.status')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('class.class')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('admin.createdDate')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('admin.lastActive')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="p-8">
              <EmptyState
                title="No users found"
                titleVi="Không tìm thấy người dùng"
                description="Try adjusting your search or filters"
                descriptionVi="Thử điều chỉnh tìm kiếm hoặc bộ lọc"
              />
            </div>
          )}
        </Card>
      </div>
    </DashboardLayoutWrapper>
  )
}
