// ============================================
// VERVE AI Design System - Public Header
// ============================================

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { ThemeToggle } from '@/components/providers/theme-provider'
import { LanguageSwitcher } from '@/components/providers/language-provider'
import {
  List,
  X,
  Brain,
  ChartLine,
  Users,
  BookOpen,
  Lightbulb,
  ShieldCheck,
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
 * Public Header Component
 * Navigation header for public/marketing pages
 */
export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()

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

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
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

          {/* Mobile Actions */}
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
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
