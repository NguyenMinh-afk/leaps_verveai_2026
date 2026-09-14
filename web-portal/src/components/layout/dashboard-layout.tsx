'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarToggle,
  SidebarDivider,
  useSidebar,
  SidebarProvider,
} from './sidebar'
import { Header, HeaderActions, HeaderUserMenu, HeaderBreadcrumb, ThemeToggle, LanguageSwitcher } from './header'
import { SidebarNav } from './sidebar-nav'
import { RoleSwitcher, RoleBadge } from './role-switcher'
import type { UserRole, BreadcrumbItem, NavItem } from '@/types'
import { getNavigationForRole } from './sidebar-nav'

/**
 * Get initials from name
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Get role label in Vietnamese
 */
function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Quản trị viên'
    case 'teacher':
      return 'Giáo viên'
    case 'student':
      return 'Học sinh'
    case 'reviewer':
      return 'Người duyệt'
    default:
      return role
  }
}

/**
 * Dashboard Layout Props
 */
export interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    name: string
    email?: string
    avatar?: string
    role: UserRole
  }
  breadcrumbs?: BreadcrumbItem[]
  onSignOut?: () => void
  onSettings?: () => void
  onRoleChange?: (role: UserRole) => void
  className?: string
}

/**
 * Dashboard Layout - Main application layout with sidebar and header
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  breadcrumbs,
  onSignOut,
  onSettings,
  onRoleChange,
  className,
}) => {
  const { isCollapsed, isMobile, isMobileOpen, setIsMobileOpen } = useSidebar()
  const navigation = getNavigationForRole(user.role)

  return (
    <div className={cn('min-h-screen bg-slate-50 dark:bg-slate-950', className)}>
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="flex h-10 w-10 items-center justify-center">
                <Image
                  src="/Logo.png"
                  alt="VERVE AI Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    VerveAI
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    LEAPS Platform
                  </span>
                </div>
              )}
            </div>
            {!isMobile && <SidebarToggle />}
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Navigation */}
          <SidebarNav role={user.role} />
        </SidebarContent>

        <SidebarFooter>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              {/* User Avatar with initials */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {getInitials(user.name)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user.name}
                </span>
                <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* Main content area */}
      <div
        className={cn(
          'flex flex-col transition-all duration-300',
          isCollapsed ? 'lg:pl-16' : 'lg:pl-[280px]',
          isMobile && 'pl-0'
        )}
      >
        {/* Header */}
        <Header className="sticky top-0 z-30">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <HeaderBreadcrumb items={breadcrumbs} />
          )}
          <HeaderActions>
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
              aria-label="Open menu"
              onClick={() => setIsMobileOpen(true)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <HeaderUserMenu
              user={user}
              onSignOut={onSignOut}
              onSettings={onSettings}
            />
          </HeaderActions>
        </Header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

/**
 * Dashboard Layout Wrapper - Includes SidebarProvider
 */
export interface DashboardLayoutWrapperProps extends DashboardLayoutProps {
  defaultCollapsed?: boolean
  mobileBreakpoint?: number
}

export const DashboardLayoutWrapper: React.FC<DashboardLayoutWrapperProps> = ({
  defaultCollapsed = false,
  mobileBreakpoint = 1024,
  children,
  ...props
}) => {
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed} mobileBreakpoint={mobileBreakpoint}>
      <DashboardLayout {...props}>
        {children}
      </DashboardLayout>
    </SidebarProvider>
  )
}

/**
 * Page Header - Title and description for pages
 */
export interface PageHeaderProps {
  title: string
  titleVi?: string
  description?: string
  descriptionVi?: string
  actions?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  titleVi,
  description,
  descriptionVi,
  actions,
  className,
}) => {
  return (
    <div className={cn('mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          {titleVi || title}
        </h1>
        {(description || descriptionVi) && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            {descriptionVi || description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}

/**
 * Page Section - Grouped content sections
 */
export interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  titleVi?: string
  description?: string
  descriptionVi?: string
}

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  titleVi,
  description,
  descriptionVi,
  className,
  children,
  ...props
}) => {
  return (
    <section className={cn('mb-8', className)} {...props}>
      {(title || titleVi) && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {titleVi || title}
          </h2>
          {(description || descriptionVi) && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {descriptionVi || description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/**
 * Page Grid - Responsive grid for dashboard cards
 */
export interface PageGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
}

export const PageGrid: React.FC<PageGridProps> = ({
  columns = 3,
  gap = 'md',
  className,
  children,
  ...props
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  const gridGap = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  }

  return (
    <div
      className={cn('grid', gridCols[columns], gridGap[gap], className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Empty State - Shown when no data is available
 */
export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  titleVi?: string
  description?: string
  descriptionVi?: string
  action?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  titleVi,
  description,
  descriptionVi,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50',
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
        {titleVi || title}
      </h3>
      {(description || descriptionVi) && (
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {descriptionVi || description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/**
 * Loading State - Shown during data loading
 */
export interface LoadingStateProps {
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <svg
          className="h-8 w-8 animate-spin text-verve-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-sm text-slate-500 dark:text-slate-400">Đang tải...</p>
      </div>
    </div>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarToggle,
  SidebarNav,
  SidebarDivider,
  SidebarProvider,
  useSidebar,
  Header,
  HeaderActions,
  HeaderUserMenu,
  HeaderBreadcrumb,
  RoleSwitcher,
  RoleBadge,
  ThemeToggle,
  LanguageSwitcher,
}
