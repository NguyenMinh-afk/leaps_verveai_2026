'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

/**
 * Sidebar context for state management
 */
interface SidebarContextValue {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a Sidebar provider')
  }
  return context
}

/**
 * Sidebar Provider
 */
interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
  mobileBreakpoint?: number
}

const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultCollapsed = false,
  mobileBreakpoint = 1024,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < mobileBreakpoint
      setIsMobile(mobile)
      if (!mobile) {
        setIsMobileOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        isMobileOpen,
        setIsMobileOpen,
        isMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

/**
 * Sidebar Root
 */
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsedWidth?: number
  expandedWidth?: number
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsedWidth = 64, expandedWidth = 280, children, ...props }, ref) => {
    const { isCollapsed, isMobileOpen, setIsMobileOpen, isMobile } = useSidebar()

    return (
      <>
        {/* Mobile overlay */}
        {isMobile && isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          ref={ref}
          className={cn(
            'fixed left-0 top-0 z-50 flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900',
            // Width based on state
            isCollapsed ? 'w-16' : 'w-[280px]',
            // Mobile positioning
            isMobile && [
              isMobileOpen ? 'translate-x-0' : '-translate-x-full',
              'fixed h-full shadow-xl',
            ],
            !isMobile && [
              isCollapsed ? 'w-16' : 'w-[280px]',
            ],
            className
          )}
          style={{
            width: isCollapsed ? `${collapsedWidth}px` : `${expandedWidth}px`,
          }}
          {...props}
        >
          {children}
        </aside>
      </>
    )
  }
)
Sidebar.displayName = 'Sidebar'

/**
 * Sidebar Header
 */
export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-16 items-center border-b border-slate-200 px-4 dark:border-slate-800',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center">
            <Image
              src="/Logo.png"
              alt="VERVE AI Logo"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          {/* Title */}
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                VerveAI
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                LEAPS Platform
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
)
SidebarHeader.displayName = 'SidebarHeader'

/**
 * Sidebar Content
 */
export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          'flex-1 overflow-y-auto py-4 transition-all duration-300',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarContent.displayName = 'SidebarContent'

/**
 * Sidebar Footer
 */
export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          'border-t border-slate-200 p-4 dark:border-slate-800',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarFooter.displayName = 'SidebarFooter'

/**
 * Sidebar Toggle Button
 */
export interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SidebarToggle = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  ({ className, ...props }, ref) => {
    const { isCollapsed, setIsCollapsed, isMobile, setIsMobileOpen, isMobileOpen } = useSidebar()

    const handleToggle = () => {
      if (isMobile) {
        setIsMobileOpen(!isMobileOpen)
      } else {
        setIsCollapsed(!isCollapsed)
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
          className
        )}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        {...props}
      >
        <svg
          className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    )
  }
)
SidebarToggle.displayName = 'SidebarToggle'

/**
 * Sidebar Divider
 */
export interface SidebarDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarDivider = React.forwardRef<HTMLDivElement, SidebarDividerProps>(
  ({ className, ...props }, ref) => {
    const { isCollapsed } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          'my-2 h-px bg-slate-200 dark:bg-slate-800',
          isCollapsed && 'mx-2 w-auto',
          className
        )}
        {...props}
      />
    )
  }
)
SidebarDivider.displayName = 'SidebarDivider'

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarToggle,
  SidebarDivider,
  SidebarProvider,
}
export type { SidebarProviderProps }
