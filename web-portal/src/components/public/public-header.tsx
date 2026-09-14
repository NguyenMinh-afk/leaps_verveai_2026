// ============================================
// VERVE AI Design System - Public Header
// ============================================

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button, Avatar } from '@/components/ui'
import { ThemeToggle } from '@/components/providers/theme-provider'
import { LanguageSwitcher } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import {
  List,
  X,
  Brain,
  ChartLine,
  Users,
  BookOpen,
  Lightbulb,
  ShieldCheck,
  House,
  Gear,
  SignOut,
} from '@phosphor-icons/react'
import Image from 'next/image'

/**
 * Navigation items for public pages
 */
const navItems = [
  {
    label: 'Tính năng',
    labelVi: 'Tính năng',
    href: '#features',
    id: 'features',
  },
  {
    label: 'Cách hoạt động',
    labelVi: 'Cách hoạt động',
    href: '#how-it-works',
    id: 'how-it-works',
  },
  {
    label: 'Dành cho Giáo viên',
    labelVi: 'Dành cho Giáo viên',
    href: '#for-teachers',
    id: 'for-teachers',
  },
  {
    label: 'Dành cho Học sinh',
    labelVi: 'Dành cho Học sinh',
    href: '#for-students',
    id: 'for-students',
  },
]

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
function getRoleLabel(role?: string): string {
  switch (role) {
    case 'TEACHER':
      return 'Giáo viên'
    case 'STUDENT':
      return 'Học sinh'
    case 'ADMIN':
      return 'Quản trị'
    case 'SUPERVISOR':
      return 'Người giám sát'
    case 'PARENT':
      return 'Phụ huynh'
    case 'teacher':
      return 'Giáo viên'
    case 'student':
      return 'Học sinh'
    case 'admin':
      return 'Quản trị'
    case 'reviewer':
      return 'Người duyệt'
    default:
      return role || ''
  }
}

/**
 * Get dashboard path based on role
 */
function getDashboardPath(role?: string): string {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
    case 'SUPERVISOR':
      return '/admin'
    case 'TEACHER':
      return '/teacher'
    case 'STUDENT':
    case 'PARENT':
      return '/student'
    default:
      return '/'
  }
}

/**
 * User Menu Dropdown Component
 */
interface UserMenuProps {
  user: {
    name: string
    email?: string
    role?: string
  }
  onLogout: () => void
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const router = useRouter()
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

  const handleGoToDashboard = () => {
    setIsOpen(false)
    router.push(getDashboardPath(user.role))
  }

  const handleSettings = () => {
    setIsOpen(false)
    const settingsPath = getDashboardPath(user.role)
    router.push(`${settingsPath}/settings`)
  }

  const handleLogout = () => {
    setIsOpen(false)
    onLogout()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-verve-600 text-sm font-semibold text-white">
          {getInitials(user.name)}
        </div>
        <div className="hidden flex-col items-start text-left lg:flex">
          <span className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1 max-w-[120px]">
            {user.name}
          </span>
          <span className="text-xs capitalize text-slate-500 dark:text-slate-400">
            {getRoleLabel(user.role)}
          </span>
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
        <div className="absolute right-0 top-full z-50 mt-1 w-64 animate-in fade-in-0 zoom-in-95 duration-150">
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
              <span className="mt-1 inline-block rounded-full bg-verve-100 px-2 py-0.5 text-xs font-medium text-verve-700 dark:bg-verve-900/30 dark:text-verve-300">
                {getRoleLabel(user.role)}
              </span>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <House size={18} className="text-slate-500" />
                <span>Quay về trang chính</span>
              </button>

              <button
                type="button"
                onClick={handleSettings}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Gear size={18} className="text-slate-500" />
                <span>Cài đặt</span>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 dark:border-slate-700" />

            {/* Logout */}
            <div className="py-1">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-slate-100 dark:text-error-400 dark:hover:bg-slate-800"
              >
                <SignOut size={18} />
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
 * Public Header Component
 * Navigation header for public/marketing pages
 */
export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Handle smooth scroll for anchor links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.getElementById(href.slice(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setMobileMenuOpen(false)
      }
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      router.push('/')
    }
  }

  // Handle go to dashboard on mobile
  const handleGoToDashboard = () => {
    setMobileMenuOpen(false)
    router.push(getDashboardPath(user?.role))
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-250',
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="container-verve" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-500 focus-visible:ring-offset-2 rounded-md"
          >
            <Image
              src="/Logo.png"
              alt="VERVE AI Logo"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              VERVE <span className="text-verve-400">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                  'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
                  'hover:bg-slate-100 dark:hover:bg-slate-800',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-500'
                )}
              >
                {item.labelVi}
              </a>
            ))}
          </div>

          {/* Desktop Actions - Authenticated vs Unauthenticated */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            
            {isAuthenticated && user ? (
              // Show user menu when logged in
              <UserMenu
                user={{
                  name: user.name,
                  email: user.email,
                  role: user.role,
                }}
                onLogout={handleLogout}
              />
            ) : (
              // Show login buttons when not logged in
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Bắt đầu ngay
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={cn(
              'lg:hidden p-2 rounded-md transition-colors duration-150',
              'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
              'hover:bg-slate-100 dark:hover:bg-slate-800',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-500'
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {mobileMenuOpen ? (
              <X size={24} weight="bold" />
            ) : (
              <List size={24} weight="bold" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300',
            mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="space-y-1 pt-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  'block px-4 py-3 text-base font-medium rounded-md transition-colors duration-150',
                  'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
                  'hover:bg-slate-100 dark:hover:bg-slate-800',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-500'
                )}
              >
                {item.labelVi}
              </a>
            ))}
          </div>

          {/* Mobile Actions - Authenticated vs Unauthenticated */}
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
            {isAuthenticated && user ? (
              // Show user info and dashboard link when logged in
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-verve-600 text-sm font-semibold text-white">
                    {getInitials(user.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {getRoleLabel(user.role)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGoToDashboard}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md"
                >
                  <House size={18} />
                  <span>Quay về trang chính</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-error-600 hover:bg-slate-100 dark:text-error-400 dark:hover:bg-slate-800 rounded-md"
                >
                  <SignOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              // Show login buttons when not logged in
              <>
                <Link href="/login" className="w-full">
                  <Button variant="ghost" size="md" className="w-full justify-center">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button variant="primary" size="md" className="w-full justify-center">
                    Bắt đầu ngay
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

/**
 * Feature card data for landing page - Theo BA Document v1.4
 */
export const features = [
  {
    icon: Brain,
    title: 'Chẩn đoán nguyên nhân gốc',
    titleVi: 'Chẩn đoán nguyên nhân gốc',
    description: 'Xác định kỹ năng nền bị thiếu thay vì chỉ biết đúng hay sai một bài toán.',
    descriptionVi: 'Xác định kỹ năng nền bị thiếu thay vì chỉ biết đúng hay sai một bài toán.',
  },
  {
    icon: ChartLine,
    title: 'Theo dõi độ thành thạo',
    titleVi: 'Theo dõi độ thành thạo',
    description: 'Ước lượng mức thành thạo của từng học sinh trên từng kỹ năng bằng mô hình Bayesian.',
    descriptionVi: 'Ước lượng mức thành thạo của từng học sinh trên từng kỹ năng bằng mô hình Bayesian.',
  },
  {
    icon: Lightbulb,
    title: 'Phương án hỗ trợ tối giản',
    titleVi: 'Phương án hỗ trợ tối giản',
    description: 'Chỉ bù đúng phần còn thiếu, bỏ qua phần học sinh đã nắm vững.',
    descriptionVi: 'Chỉ bù đúng phần còn thiếu, bỏ qua phần học sinh đã nắm vững.',
  },
  {
    icon: Users,
    title: 'Gom nhóm theo nguyên nhân',
    titleVi: 'Gom nhóm theo nguyên nhân',
    description: 'Gom học sinh theo nguyên nhân gốc chung thay vì theo điểm số.',
    descriptionVi: 'Gom học sinh theo nguyên nhân gốc chung thay vì theo điểm số.',
  },
  {
    icon: BookOpen,
    title: 'Bằng chứng minh bạch',
    titleVi: 'Bằng chứng minh bạch',
    description: 'Mọi kết luận đều kèm chuỗi bằng chứng để giáo viên kiểm chứng.',
    descriptionVi: 'Mọi kết luận đều kèm chuỗi bằng chứng để giáo viên kiểm chứng.',
  },
  {
    icon: ShieldCheck,
    title: 'Giáo viên kiểm soát',
    titleVi: 'Giáo viên kiểm soát',
    description: 'Bác bỏ hoặc điều chỉnh kết luận của hệ thống khi cần thiết.',
    descriptionVi: 'Bác bỏ hoặc điều chỉnh kết luận của hệ thống khi cần thiết.',
  },
]

export default PublicHeader
