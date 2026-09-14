'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
  PageSection,
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
import { adminService } from '@/services/admin'
import { authService } from '@/services/auth'
import { formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'

/**
 * User Row Component
 */
interface UserRowProps {
  user: {
    id: string;
    name: string;
    nameVi?: string;
    email: string;
    role: string;
    status?: string;
    is_active?: boolean;
    created_at?: Date | string;
    createdAt?: Date | string;
  };
}

const UserRow: React.FC<UserRowProps> = ({ user }) => {
  const { t } = useLanguage()
  const statusConfig = {
    true: { label: t('common.active'), variant: 'success' as const },
    false: { label: t('common.inactive'), variant: 'default' as const },
  }

  const roleConfig = {
    ADMIN: { label: t('auth.admin'), color: 'text-info-600 dark:text-info-400' },
    TEACHER: { label: t('auth.teacher'), color: 'text-amber-600 dark:text-amber-400' },
    SUPERVISOR: { label: t('admin.reviewer'), color: 'text-success-600 dark:text-success-400' },
  }

  const config = statusConfig[(user.is_active ?? user.status === 'active') ? 'true' : 'false']
  const role = roleConfig[user.role as keyof typeof roleConfig] || { label: user.role, color: 'text-slate-600' }

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={cn('text-sm font-medium', role.color)}>
          {role.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <Badge variant={config?.variant || 'default'} size="sm">
          {config?.label || 'Unknown'}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {formatRelativeTime(new Date(user.created_at || user.createdAt || Date.now()))}
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
  const [users, setUsers] = React.useState<Array<{
    id: string;
    name: string;
    nameVi?: string;
    email: string;
    role: string;
    status?: string;
    is_active?: boolean;
    created_at?: Date;
    createdAt?: Date | string;
  }>>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch real users
  React.useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await adminService.listUsers({ take: 100 })
        setUsers(result.items)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // Filter users
  const filteredUsers = React.useMemo(() => {
    let result = [...users]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(u => (statusFilter === 'active') === u.is_active)
    }

    return result
  }, [users, searchQuery, roleFilter, statusFilter])

  // Stats
  const stats = React.useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    teachers: users.filter(u => u.role === 'TEACHER').length,
    students: users.filter(u => u.role === 'STUDENT').length,
    active: users.filter(u => u.is_active).length,
  }), [users])

  // Get current user from auth
  const [session, setSession] = React.useState<{ user: { name: string; email: string; role: UserRole } } | null>(null)

  React.useEffect(() => {
    authService.getSession().then(setSession).catch(() => null)
  }, [])

  const user = session?.user ?? {
    name: 'Admin',
    email: 'admin@verveai.local',
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

  const handleSignOut = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Ignore
    }
    router.push('/login')
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
        {/* Loading/Error States */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <p className="text-slate-500">Loading users...</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg bg-error-50 p-4 text-error-700 dark:bg-error-900/30 dark:text-error-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
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
                    <option value="ADMIN">{t('auth.admin')}</option>
                    <option value="TEACHER">{t('auth.teacher')}</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                  >
                    <option value="all">{t('common.all')} {t('common.status')}</option>
                    <option value="active">{t('common.active')}</option>
                    <option value="inactive">{t('common.inactive')}</option>
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
                        {t('admin.createdDate')}
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
                <div className="p-8 text-center text-slate-500">
                  {t('admin.noUsersFound') || 'No users found'}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </DashboardLayoutWrapper>
  )
}
