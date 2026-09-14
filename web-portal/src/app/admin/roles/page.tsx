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
} from '@/components/ui'
import {
  useLanguage,
} from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { Role, Permission } from '@/types'
import { api } from '@/lib/api/apiClient'

// Backend role/permission response types
interface BackendRoleResponse {
  id: string
  name: string
  description: string
  user_count: number
  created_at: string
}

interface BackendPermissionResponse {
  id: string
  name: string
  description: string
  group: string
}

/**
 * Role Card Component
 */
interface RoleCardProps {
  role: Role
  permissions: Permission[]
}

const RoleCard: React.FC<RoleCardProps> = ({ role, permissions }) => {
  const { t } = useLanguage()
  const roleColors = {
    'role-admin': 'bg-info-50 border-info-200 dark:bg-info-900/20 dark:border-info-800',
    'role-teacher': 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
    'role-student': 'bg-verve-50 border-verve-200 dark:bg-verve-900/20 dark:border-verve-800',
    'role-reviewer': 'bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800',
  }

  return (
    <Card
      variant="default"
      padding="lg"
      className={cn('border-l-4', roleColors[role.id as keyof typeof roleColors] || '')}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {role.nameVi}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {role.descriptionVi}
          </p>
        </div>
        <Badge variant="default" size="sm">
          {role.userCount} {t('nav.users').toLowerCase()}
        </Badge>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t('admin.permissions')} ({role.permissions.length || permissions.length})
        </h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {(role.permissions.length > 0 ? role.permissions : permissions).slice(0, 4).map((perm) => (
            <Badge key={perm.id} variant="outline" size="sm">
              {perm.nameVi}
            </Badge>
          ))}
          {(role.permissions.length > 0 ? role.permissions : permissions).length > 4 && (
            <Badge variant="outline" size="sm">
              +{(role.permissions.length > 0 ? role.permissions : permissions).length - 4} more
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="ghost" size="sm">
          {t('common.details')}
        </Button>
        <Button variant="ghost" size="sm">
          {t('common.edit')}
        </Button>
      </div>
    </Card>
  )
}

/**
 * Permission Group Component
 */
interface PermissionGroupProps {
  group: string
  groupVi: string
  permissions: Permission[]
}

const PermissionGroup: React.FC<PermissionGroupProps> = ({ group, groupVi, permissions }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {groupVi}
      </h4>
      <div className="space-y-2">
        {permissions.map((permission) => (
          <div
            key={permission.id}
            className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded border border-slate-300 dark:border-slate-600">
              {/* Checkbox placeholder */}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {permission.nameVi}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {permission.descriptionVi}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Roles Page
 */
export default function RolesPage() {
  const router = useRouter()
  const [currentRole] = React.useState<UserRole>('admin')
  const { t } = useLanguage()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = React.useState('roles')
  const [roles, setRoles] = React.useState<Role[]>([])
  const [permissions, setPermissions] = React.useState<Permission[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  // Fetch roles and permissions from real API
  const fetchRolesAndPermissions = React.useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      // Try to fetch from backend
      try {
        const rolesResponse = await api.get<BackendRoleResponse[]>('/api/auth/roles')
        const mappedRoles: Role[] = rolesResponse.map((r) => ({
          id: r.id,
          name: r.name,
          nameVi: r.name,
          description: r.description,
          descriptionVi: r.description,
          permissions: [],
          userCount: r.user_count,
        }))
        setRoles(mappedRoles)
      } catch {
        setRoles([])
      }
      
      try {
        const permsResponse = await api.get<BackendPermissionResponse[]>('/api/auth/permissions')
        const mappedPerms: Permission[] = permsResponse.map((p) => ({
          id: p.id,
          name: p.name,
          nameVi: p.name,
          description: p.description,
          descriptionVi: p.description,
          group: p.group,
          groupVi: p.group,
        }))
        setPermissions(mappedPerms)
      } catch {
        setPermissions([])
      }
    } catch (err) {
      setLoadError('Không thể tải vai trò và quyền hạn')
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchRolesAndPermissions()
  }, [fetchRolesAndPermissions])

  // Group permissions by group
  const groupedPermissions = React.useMemo(() => {
    const groups: { [key: string]: Permission[] } = {}
    permissions.forEach((perm) => {
      if (!groups[perm.group]) {
        groups[perm.group] = []
      }
      groups[perm.group].push(perm)
    })
    return groups
  }, [permissions])

  const userDisplay = {
    name: user?.name || 'Admin',
    email: user?.email || '',
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'Roles', labelVi: 'Vai trò' },
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
      user={userDisplay}
      breadcrumbs={breadcrumbs}
      onRoleChange={handleRoleChange}
      onSignOut={handleSignOut}
      onSettings={handleSettings}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Roles & Permissions"
          titleVi="Vai trò & Quyền hạn"
          description="Manage platform roles and their permissions"
          descriptionVi="Quản lý vai trò nền tảng và quyền hạn của họ"
        />

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('roles')}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'roles'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )}
          >
            {t('nav.roles')} ({roles.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('permissions')}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'permissions'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )}
          >
            {t('admin.permissions')} ({permissions.length})
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <Card variant="default" padding="lg">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-verve-200 border-t-verve-600"></div>
              <p className="mt-4 text-sm text-slate-500">Đang tải vai trò và quyền hạn...</p>
            </div>
          </Card>
        ) : loadError ? (
          <Card variant="default" padding="lg" className="border-error-200 dark:border-error-800">
            <div className="flex flex-col items-center justify-center py-8">
              <svg className="h-12 w-12 text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-4 text-sm text-error-600 dark:text-error-400">{loadError}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={fetchRolesAndPermissions}>
                Thử lại
              </Button>
            </div>
          </Card>
        ) : activeTab === 'roles' ? (
          roles.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {roles.map((role) => (
                <RoleCard key={role.id} role={role} permissions={permissions} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No roles found"
              titleVi="Không tìm thấy vai trò"
              description="No roles are configured in the system"
              descriptionVi="Không có vai trò nào được cấu hình trong hệ thống"
            />
          )
        ) : (
          <Card variant="default" padding="lg">
            {Object.keys(groupedPermissions).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedPermissions).map(([group, perms]) => (
                  <PermissionGroup
                    key={group}
                    group={group}
                    groupVi={perms[0]?.groupVi || group}
                    permissions={perms}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No permissions found"
                titleVi="Không tìm thấy quyền hạn"
                description="No permissions are configured in the system"
                descriptionVi="Không có quyền hạn nào được cấu hình trong hệ thống"
              />
            )}
          </Card>
        )}
      </div>
    </DashboardLayoutWrapper>
  )
}
