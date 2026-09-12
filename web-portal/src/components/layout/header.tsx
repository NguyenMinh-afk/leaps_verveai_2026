'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar'
import { Avatar, type AvatarProps } from '@/components/ui'
import { ThemeToggle } from '@/components/providers/theme-provider'
import { LanguageSwitcher } from '@/components/providers/language-provider'

/**
 * Header component for dashboard
 */
export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  titleVi?: string
  description?: string
  descriptionVi?: string
}

const Header: React.FC<HeaderProps> = ({
  className,
  title,
  titleVi,
  description,
  descriptionVi,
  children,
  ...props
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 lg:px-6',
        className
      )}
      {...props}
    >
      <div className="flex flex-col">
        {title && (
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            {titleVi || title}
          </h1>
        )}
        {(description || descriptionVi) && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {descriptionVi || description}
          </p>
        )}
      </div>
      {children}
    </header>
  )
}

/**
 * Header Actions - Right side items
 */
export interface HeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeaderActions: React.FC<HeaderActionsProps> = ({ className, ...props }) => {
  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      {props.children}
    </div>
  )
}

/**
 * Header Button - Icon buttons in header
 */
export interface HeaderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  badge?: number
}

const HeaderButton = React.forwardRef<HTMLButtonElement, HeaderButtonProps>(
  ({ className, icon, badge, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
          className
        )}
        {...props}
      >
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-medium text-white">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </button>
    )
  }
)
HeaderButton.displayName = 'HeaderButton'

/**
 * Header User Menu
 */
export interface HeaderUserMenuProps {
  user: {
    name: string
    email?: string
    avatar?: string
    role?: string
  }
  onSignOut?: () => void
  onSettings?: () => void
}

const HeaderUserMenu: React.FC<HeaderUserMenuProps> = ({
  user,
  onSignOut,
  onSettings,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

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
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Avatar
          src={user.avatar}
          fallback={user.name}
          size="sm"
        />
        <div className="hidden flex-col items-start text-left lg:flex">
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {user.name}
          </span>
          {user.role && (
            <span className="text-xs capitalize text-slate-500 dark:text-slate-400">
              {user.role === 'teacher' && 'Giáo viên'}
              {user.role === 'student' && 'Học sinh'}
              {user.role === 'admin' && 'Quản trị'}
              {user.role === 'reviewer' && 'Người duyệt'}
            </span>
          )}
        </div>
        <svg
          className={cn(
            'hidden h-4 w-4 text-slate-400 transition-transform lg:block',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-56 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {/* User info */}
            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {user.name}
              </p>
              {user.email && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              )}
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onSettings?.()
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Cài đặt</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onSignOut?.()
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-slate-100 dark:text-error-400 dark:hover:bg-slate-800"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Header Breadcrumb
 */
export interface BreadcrumbItem {
  label: string
  labelVi?: string
  href?: string
}

export interface HeaderBreadcrumbProps {
  items: BreadcrumbItem[]
}

const HeaderBreadcrumb: React.FC<HeaderBreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.href ? (
            <a
              href={item.href}
              className="text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {item.labelVi || item.label}
            </a>
          ) : (
            <span className="font-medium text-slate-900 dark:text-white">
              {item.labelVi || item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export {
  Header,
  HeaderActions,
  HeaderButton,
  HeaderUserMenu,
  HeaderBreadcrumb,
  ThemeToggle,
  LanguageSwitcher,
}
