'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar'
import { iconMap } from '@/components/ui/icon'
import { House } from '@phosphor-icons/react'
import { useLanguage } from '@/components/providers/language-provider'
import type { NavItem, UserRole } from '@/types'
import type { IconName } from '@/components/ui/icon'

/**
 * Sidebar Navigation Item
 */
export interface SidebarNavItemProps {
  item: NavItem
  isActive?: boolean
  variant?: 'default' | 'admin'
  onClick?: () => void
  translationKey?: string
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, isActive, variant = 'default', onClick, translationKey }) => {
  const { isCollapsed, isMobile, setIsMobileOpen } = useSidebar()
  const { t, language } = useLanguage()

  const handleClick = () => {
    if (isMobile) {
      setIsMobileOpen(false)
    }
    onClick?.()
  }

  // Get icon component from iconMap
  const IconComponent = item.icon ? iconMap[item.icon as IconName] : iconMap['house']
  const IconElement = IconComponent ? <IconComponent size={20} weight={isActive ? 'bold' : 'regular'} className="shrink-0" /> : null

  // Get translated label
  const label = translationKey ? t(translationKey) : (language === 'vi' ? (item.labelVi || item.label) : item.label)

  // Default variant styling (verve green)
  const defaultStyles = {
    active: 'bg-verve-50 text-verve-700 dark:bg-verve-900/30 dark:text-verve-300',
    activeIcon: 'text-verve-600 dark:text-verve-400',
    badge: 'bg-verve-100 text-verve-700 dark:bg-verve-900/50 dark:text-verve-300',
  }

  // Admin variant styling (red)
  const adminStyles = {
    active: 'bg-red-50 text-red-700 border-l-2 border-red-500 dark:bg-red-900/20 dark:text-red-300 dark:border-red-400',
    activeIcon: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  }

  const styles = variant === 'admin' ? adminStyles : defaultStyles

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={cn(
        'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200',
        isActive
          ? styles.active
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
        isCollapsed && 'justify-center px-2'
      )}
      title={isCollapsed ? label : undefined}
    >
      <span className={cn(isActive && styles.activeIcon)}>
        {IconElement}
      </span>
      {!isCollapsed && (
        <>
          <span className="flex-1">{label}</span>
          {item.badge !== undefined && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                isActive
                  ? styles.badge
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  )
}

/**
 * Sidebar Navigation Section
 */
export interface SidebarNavSectionProps {
  title?: string
  titleVi?: string
  items: NavItem[]
  variant?: 'default' | 'admin'
}

const SidebarNavSection: React.FC<SidebarNavSectionProps> = ({ title, titleVi, items, variant = 'default' }) => {
  const { isCollapsed } = useSidebar()
  const pathname = usePathname()
  const { t, language } = useLanguage()

  // Get translated section title
  const sectionTitle = titleVi ? (language === 'vi' ? titleVi : title) : title

  return (
    <div className="px-3">
      {title && !isCollapsed && (
        <h4 className={cn(
          'mb-2 px-3 text-xs font-semibold uppercase tracking-wider',
          variant === 'admin' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-400 dark:text-slate-500'
        )}>
          {sectionTitle}
        </h4>
      )}
      {isCollapsed && (
        <div className="mb-2 flex justify-center">
          <div className="h-px w-8 bg-slate-200 dark:bg-slate-700" />
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarNavItem 
            key={item.id} 
            item={item} 
            isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
            variant={variant}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Admin navigation configuration with sections
 */
interface AdminNavSection {
  title: string
  titleVi: string
  items: NavItem[]
}

/**
 * Teacher navigation configuration with sections
 */
interface TeacherNavSection {
  title: string
  titleVi: string
  items: NavItem[]
}

/**
 * Student navigation configuration with sections
 */
interface StudentNavSection {
  title: string
  titleVi: string
  items: NavItem[]
}

/**
 * Get admin navigation grouped by sections
 */
const getAdminNavigation = (): AdminNavSection[] => [
  {
    title: 'QUẢN TRỊ',
    titleVi: 'QUẢN TRỊ',
    items: [
      {
        id: 'users',
        label: 'Users',
        labelVi: 'Người dùng',
        href: '/admin/users',
        icon: 'users',
      },
      {
        id: 'roles',
        label: 'Roles',
        labelVi: 'Vai trò',
        href: '/admin/roles',
        icon: 'shield',
      },
      {
        id: 'courses',
        label: 'Courses',
        labelVi: 'Khóa học',
        href: '/admin/courses',
        icon: 'book-open',
      },
      {
        id: 'questions',
        label: 'Questions',
        labelVi: 'Câu hỏi',
        href: '/admin/questions',
        icon: 'question',
      },
      {
        id: 'moderation',
        label: 'Moderation',
        labelVi: 'Kiểm duyệt',
        href: '/admin/moderation',
        icon: 'check-circle',
        badge: 5,
      },
      {
        id: 'ai-generation',
        label: 'AI Generation',
        labelVi: 'Tạo AI',
        href: '/admin/ai-generation',
        icon: 'lightning',
      },
    ],
  },
  {
    title: 'HỆ THỐNG',
    titleVi: 'HỆ THỐNG',
    items: [
      {
        id: 'audit',
        label: 'Audit Log',
        labelVi: 'Nhật ký',
        href: '/admin/audit',
        icon: 'clipboard-text',
      },
      {
        id: 'settings',
        label: 'Settings',
        labelVi: 'Cài đặt',
        href: '/admin/settings',
        icon: 'gear',
      },
      {
        id: 'system',
        label: 'System',
        labelVi: 'Hệ thống',
        href: '/admin/system',
        icon: 'cpu',
      },
    ],
  },
]

/**
 * Dashboard item for admin (shown at top, outside sections)
 */
const adminDashboardItem: NavItem = {
  id: 'admin-dashboard',
  label: 'Dashboard',
  labelVi: 'Bảng điều khiển',
  href: '/admin',
  icon: 'house',
}

/**
 * Sidebar Navigation
 */
export interface SidebarNavProps {
  items?: NavItem[]
  role: UserRole
  variant?: 'default' | 'admin'
}

const SidebarNav: React.FC<SidebarNavProps> = ({ items, role, variant = 'default' }) => {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()
  const { t, language } = useLanguage()

  const dashboardLabel = t('nav.adminDashboard')
  const adminTitle = t('nav.administration')
  const managementTitle = t('nav.management')
  const learningTitle = t('nav.learning')
  const systemTitle = t('nav.systemSection')

  // For admin role, use sectioned navigation with Dashboard at top
  if (role === 'admin' && !items) {
    const sections = getAdminNavigation()
    const isDashboardActive = pathname === '/admin' || pathname === '/admin/'

    return (
      <nav className="space-y-1 px-2" role="navigation" aria-label="Sidebar navigation">
        {/* Dashboard - outside sections */}
        <Link
          href="/admin"
          className={cn(
            'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200',
            isDashboardActive
              ? 'bg-red-50 text-red-700 border-l-2 border-red-500 dark:bg-red-900/20 dark:text-red-300 dark:border-red-400'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? dashboardLabel : undefined}
        >
          <House size={20} weight={isDashboardActive ? 'bold' : 'regular'} className={cn('shrink-0', isDashboardActive && 'text-red-600 dark:text-red-400')} />
          {!isCollapsed && <span className="flex-1">{dashboardLabel}</span>}
        </Link>

        {/* Sections */}
        <div className="pt-4 space-y-6">
          {sections.map((section) => (
            <SidebarNavSection
              key={section.title}
              title={section.title === 'QUẢN TRỊ' ? adminTitle : section.title === 'HỆ THỐNG' ? systemTitle : section.title}
              titleVi={section.titleVi}
              items={section.items}
              variant="admin"
            />
          ))}
        </div>
      </nav>
    )
  }

  // For teacher role, use sectioned navigation with Dashboard at top
  if (role === 'teacher' && !items) {
    const sections = getTeacherNavigation()
    const isDashboardActive = pathname === '/teacher' || pathname === '/teacher/'

    return (
      <nav className="space-y-1 px-2" role="navigation" aria-label="Sidebar navigation">
        {/* Dashboard - outside sections */}
        <Link
          href="/teacher"
          className={cn(
            'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200',
            isDashboardActive
              ? 'bg-red-50 text-red-700 border-l-2 border-red-500 dark:bg-red-900/20 dark:text-red-300 dark:border-red-400'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? dashboardLabel : undefined}
        >
          <House size={20} weight={isDashboardActive ? 'bold' : 'regular'} className={cn('shrink-0', isDashboardActive && 'text-red-600 dark:text-red-400')} />
          {!isCollapsed && <span className="flex-1">{dashboardLabel}</span>}
        </Link>

        {/* Sections */}
        <div className="pt-4 space-y-6">
          {sections.map((section) => (
            <SidebarNavSection
              key={section.title}
              title={section.title === 'QUẢN LÝ' ? managementTitle : section.title === 'HỌC TẬP' ? learningTitle : section.title}
              titleVi={section.titleVi}
              items={section.items}
              variant="admin"
            />
          ))}
        </div>
      </nav>
    )
  }

  // For student role, use sectioned navigation with Dashboard at top
  if (role === 'student' && !items) {
    const sections = getStudentNavigation()
    const isDashboardActive = pathname === '/student' || pathname === '/student/'

    return (
      <nav className="space-y-1 px-2" role="navigation" aria-label="Sidebar navigation">
        {/* Dashboard - outside sections */}
        <Link
          href="/student"
          className={cn(
            'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200',
            isDashboardActive
              ? 'bg-red-50 text-red-700 border-l-2 border-red-500 dark:bg-red-900/20 dark:text-red-300 dark:border-red-400'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? dashboardLabel : undefined}
        >
          <House size={20} weight={isDashboardActive ? 'bold' : 'regular'} className={cn('shrink-0', isDashboardActive && 'text-red-600 dark:text-red-400')} />
          {!isCollapsed && <span className="flex-1">{dashboardLabel}</span>}
        </Link>

        {/* Sections */}
        <div className="pt-4 space-y-6">
          {sections.map((section) => (
            <SidebarNavSection
              key={section.title}
              title={section.title === 'QUẢN LÝ' ? managementTitle : section.title === 'HỌC TẬP' ? learningTitle : section.title}
              titleVi={section.titleVi}
              items={section.items}
              variant="admin"
            />
          ))}
        </div>
      </nav>
    )
  }

  // For other roles, use flat navigation from items prop
  const navigation = items || []

  return (
    <nav className="space-y-4 px-2" role="navigation" aria-label="Sidebar navigation">
      <SidebarNavSection items={navigation} variant={variant} />
    </nav>
  )
}

/**
 * Teacher navigation grouped by sections
 */
const getTeacherNavigation = (): TeacherNavSection[] => [
  {
    title: 'QUẢN LÝ',
    titleVi: 'QUẢN LÝ',
    items: [
      {
        id: 'class',
        label: 'Class',
        labelVi: 'Lớp học',
        href: '/teacher/class',
        icon: 'chalkboard',
      },
      {
        id: 'assignments',
        label: 'Assignments',
        labelVi: 'Bài tập',
        href: '/teacher/assignments',
        icon: 'clipboard',
      },
      {
        id: 'questions',
        label: 'Question Bank',
        labelVi: 'Ngân hàng câu hỏi',
        href: '/teacher/questions',
        icon: 'question',
      },
      {
        id: 'interventions',
        label: 'Interventions',
        labelVi: 'Can thiệp',
        href: '/teacher/interventions',
        icon: 'first-aid',
      },
    ],
  },
  {
    title: 'CÀI ĐẶT',
    titleVi: 'CÀI ĐẶT',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        labelVi: 'Cài đặt',
        href: '/teacher/settings',
        icon: 'gear',
      },
    ],
  },
]

/**
 * Student navigation grouped by sections
 */
const getStudentNavigation = (): StudentNavSection[] => [
  {
    title: 'HỌC TẬP',
    titleVi: 'HỌC TẬP',
    items: [
      {
        id: 'assignments',
        label: 'Assignments',
        labelVi: 'Bài tập',
        href: '/student/assignments',
        icon: 'clipboard',
      },
      {
        id: 'exams',
        label: 'Exams',
        labelVi: 'Bài kiểm tra',
        href: '/student/exams',
        icon: 'file-text',
      },
      {
        id: 'results',
        label: 'Results',
        labelVi: 'Kết quả',
        href: '/student/results',
        icon: 'chart-line',
      },
      {
        id: 'mastery',
        label: 'Mastery',
        labelVi: 'Mức độ thành thạo',
        href: '/student/mastery',
        icon: 'trophy',
      },
      {
        id: 'evidence',
        label: 'Evidence',
        labelVi: 'Bằng chứng',
        href: '/student/evidence',
        icon: 'file-text',
      },
      {
        id: 'recommendations',
        label: 'Recommendations',
        labelVi: 'Đề xuất',
        href: '/student/recommendations',
        icon: 'lightning',
      },
    ],
  },
]

/**
 * Role-based navigation configuration
 */
const getNavigationForRole = (role: UserRole): NavItem[] => {
  const baseItems: NavItem[] = []

  switch (role) {
    case 'teacher':
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          labelVi: 'Bảng điều khiển',
          href: '/teacher',
          icon: 'house',
        },
        {
          id: 'questions',
          label: 'Question Bank',
          labelVi: 'Ngân hàng câu hỏi',
          href: '/teacher/questions',
          icon: 'question',
        },
        {
          id: 'assignments',
          label: 'Assignments',
          labelVi: 'Bài tập',
          href: '/teacher/assignments',
          icon: 'clipboard',
        },
        {
          id: 'interventions',
          label: 'Interventions',
          labelVi: 'Can thiệp',
          href: '/teacher/interventions',
          icon: 'first-aid',
        },
        {
          id: 'settings',
          label: 'Settings',
          labelVi: 'Cài đặt',
          href: '/teacher/settings',
          icon: 'gear',
        },
      ]

    case 'student':
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          labelVi: 'Bảng điều khiển',
          href: '/student',
          icon: 'house',
        },
        {
          id: 'assignments',
          label: 'Assignments',
          labelVi: 'Bài tập',
          href: '/student/assignments',
          icon: 'clipboard',
        },
        {
          id: 'exams',
          label: 'Exams',
          labelVi: 'Bài kiểm tra',
          href: '/student/exams',
          icon: 'file-text',
        },
        {
          id: 'mastery',
          label: 'Mastery',
          labelVi: 'Mức độ thành thạo',
          href: '/student/mastery',
          icon: 'trophy',
        },
        {
          id: 'evidence',
          label: 'Evidence',
          labelVi: 'Bằng chứng',
          href: '/student/evidence',
          icon: 'file-text',
        },
        {
          id: 'recommendations',
          label: 'Recommendations',
          labelVi: 'Đề xuất',
          href: '/student/recommendations',
          icon: 'lightning',
        },
      ]

    case 'admin':
      return [
        {
          id: 'admin-dashboard',
          label: 'Dashboard',
          labelVi: 'Bảng điều khiển',
          href: '/admin',
          icon: 'house',
        },
        {
          id: 'users',
          label: 'Users',
          labelVi: 'Người dùng',
          href: '/admin/users',
          icon: 'users',
        },
        {
          id: 'roles',
          label: 'Roles',
          labelVi: 'Vai trò',
          href: '/admin/roles',
          icon: 'shield',
        },
        {
          id: 'courses',
          label: 'Courses',
          labelVi: 'Khóa học',
          href: '/admin/courses',
          icon: 'book-open',
        },
        {
          id: 'questions',
          label: 'Questions',
          labelVi: 'Câu hỏi',
          href: '/admin/questions',
          icon: 'question',
        },
        {
          id: 'moderation',
          label: 'Moderation',
          labelVi: 'Kiểm duyệt',
          href: '/admin/moderation',
          icon: 'check-circle',
          badge: 5,
        },
        {
          id: 'ai-generation',
          label: 'AI Generation',
          labelVi: 'Tạo AI',
          href: '/admin/ai-generation',
          icon: 'lightning',
        },
        {
          id: 'audit',
          label: 'Audit Log',
          labelVi: 'Nhật ký',
          href: '/admin/audit',
          icon: 'clipboard-text',
        },
        {
          id: 'settings',
          label: 'Settings',
          labelVi: 'Cài đặt',
          href: '/admin/settings',
          icon: 'gear',
        },
        {
          id: 'system',
          label: 'System',
          labelVi: 'Hệ thống',
          href: '/admin/system',
          icon: 'cpu',
        },
      ]

    case 'reviewer':
      // Reviewer uses teacher question review flow
      return [
        {
          id: 'review-questions',
          label: 'Review Questions',
          labelVi: 'Duyệt câu hỏi',
          href: '/teacher/questions',
          icon: 'check-circle',
        },
      ]

    default:
      return baseItems
  }
}

export { SidebarNav, SidebarNavItem, SidebarNavSection, getNavigationForRole }
