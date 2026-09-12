'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui'
import type { UserRole } from '@/types'

/**
 * Role configuration
 */
interface RoleConfig {
  id: UserRole
  label: string
  labelVi: string
  description: string
  descriptionVi: string
  icon: React.ReactNode
  color: string
}

const roleConfigs: Record<UserRole, RoleConfig> = {
  teacher: {
    id: 'teacher',
    label: 'Teacher',
    labelVi: 'Giáo viên',
    description: 'Access diagnostic dashboard and intervention tools',
    descriptionVi: 'Truy cập bảng chẩn đoán và công cụ can thiệp',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: 'bg-verve-100 text-verve-700 dark:bg-verve-900/30 dark:text-verve-300',
  },
  student: {
    id: 'student',
    label: 'Student',
    labelVi: 'Học sinh',
    description: 'Access learning content and track progress',
    descriptionVi: 'Truy cập nội dung học tập và theo dõi tiến độ',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.896 1.464 16 5.568 16 12s-5.104 10.536-12 10.536S4 18.432 4 12 9.104 1.464 12 1.464z" />
      </svg>
    ),
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    labelVi: 'Quản trị',
    description: 'Manage users, classes, and system settings',
    descriptionVi: 'Quản lý người dùng, lớp học và cài đặt hệ thống',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
  },
  reviewer: {
    id: 'reviewer',
    label: 'Reviewer',
    labelVi: 'Người duyệt',
    description: 'Review and approve educational content',
    descriptionVi: 'Xem xét và phê duyệt nội dung giáo dục',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  },
}

/**
 * Role Switcher Props
 */
export interface RoleSwitcherProps {
  currentRole: UserRole
  availableRoles?: UserRole[]
  onRoleChange: (role: UserRole) => void
  className?: string
}

/**
 * Role Switcher - Dropdown to switch between user roles
 */
export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  availableRoles = ['teacher', 'student', 'admin', 'reviewer'],
  onRoleChange,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const currentConfig = roleConfigs[currentRole]

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      {/* Current role button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          currentConfig.color,
          'hover:opacity-90'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {currentConfig.icon}
        <span className="hidden sm:inline">{currentConfig.labelVi}</span>
        <svg
          className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="px-3 py-2">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Chuyển vai trò
              </p>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700" />
            {availableRoles.map((roleId) => {
              const config = roleConfigs[roleId]
              const isActive = roleId === currentRole

              return (
                <button
                  key={roleId}
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    onRoleChange(roleId)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                    isActive
                      ? 'bg-verve-50 dark:bg-verve-900/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg',
                      config.color
                    )}
                  >
                    {config.icon}
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isActive
                          ? 'text-verve-700 dark:text-verve-300'
                          : 'text-slate-900 dark:text-white'
                      )}
                    >
                      {config.labelVi}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {config.descriptionVi}
                    </p>
                  </div>
                  {isActive && (
                    <svg
                      className="h-5 w-5 text-verve-600 dark:text-verve-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Role Badge - Display role with colored indicator
 */
export interface RoleBadgeProps {
  role: UserRole
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'md',
  showLabel = true,
  className,
}) => {
  const config = roleConfigs[role]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        config.color,
        className
      )}
    >
      {config.icon}
      {showLabel && <span>{config.labelVi}</span>}
    </span>
  )
}

export { roleConfigs }
