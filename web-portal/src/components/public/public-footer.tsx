// ============================================
// VERVE AI Design System - Public Footer
// ============================================

'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Envelope, Phone, MapPin } from '@phosphor-icons/react'

/**
 * Footer navigation links
 */
const footerLinks = {
  product: {
    title: 'Sản phẩm',
    titleVi: 'Sản phẩm',
    links: [
      { label: 'Tính năng', href: '#features' },
      { label: 'Cách hoạt động', href: '#how-it-works' },
      { label: 'Dành cho Giáo viên', href: '#for-teachers' },
      { label: 'Dành cho Học sinh', href: '#for-students' },
    ],
  },
  resources: {
    title: 'Tài nguyên',
    titleVi: 'Tài nguyên',
    links: [
      { label: 'Hướng dẫn sử dụng', href: '/user-guide' },
      { label: 'Câu hỏi thường gặp', href: '/faq' },
      { label: 'Hỗ trợ', href: '/support' },
    ],
  },
  company: {
    title: 'Công ty',
    titleVi: 'Công ty',
    links: [
      { label: 'Giới thiệu', href: '/about' },
      { label: 'Liên hệ', href: '/contact' },
      { label: 'Tuyển dụng', href: '/careers' },
    ],
  },
  legal: {
    title: 'Pháp lý',
    titleVi: 'Pháp lý',
    links: [
      { label: 'Điều khoản sử dụng', href: '/terms' },
      { label: 'Chính sách bảo mật', href: '/privacy' },
    ],
  },
}

/**
 * Public Footer Component
 * Footer for public/marketing pages
 */
export const PublicFooter: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300" role="contentinfo">
      <div className="container-verve py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-400 rounded-md w-fit"
            >
              <Image
                src="/Logo.png"
                alt="VERVE AI Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="text-xl font-bold text-white">
                VERVE<span className="text-verve-300">AI</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm text-slate-400 leading-relaxed">
              Nền tảng giáo dục thông minh kết hợp AI tạo câu hỏi với phân tích dữ liệu học tập,
              theo dõi độ thành thạo cá nhân cho từng học sinh.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Envelope size={16} className="text-slate-500" />
                <span>contact@verveai.example.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-slate-500" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-slate-500" />
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-3">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(footerLinks).map(([key, section]) => (
                <div key={key}>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    {section.titleVi}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        {link.href.startsWith('#') ? (
                          <a
                            href={link.href}
                            className="text-sm text-slate-400 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-400 rounded"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-sm text-slate-400 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-400 rounded"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} VERVE AI. Bảo lưu mọi quyền.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-400 rounded"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-400 rounded"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-400 rounded"
                aria-label="YouTube"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.254-.588 5.814c-.22.861-.907 1.538-1.768 1.768a8.25 8.25 0 01-4.773-1.493l-.003-.001c-.274.038-.546.06-.825.06-3.725 0-6.75-3.025-6.75-6.75S6.5 3.025 9.75 3.025c3.726 0 6.75 3.025 6.75 6.75 0 1.821-.72 3.495-1.938 4.82l-.003.002a8.25 8.25 0 01-4.773 1.492H3a.75.75 0 01-.75-.75v-3.5a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v3.5a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5h2.016c.567-.324 1.05-.792 1.425-1.352l-.003-.001a8.25 8.25 0 011.425-1.352A6.75 6.75 0 019.75 6c0-3.725 3.025-6.75 6.75-6.75s6.75 3.025 6.75 6.75c0 3.725-3.025 6.75-6.75 6.75-.276 0-.546-.02-.825-.06l-.003.001a8.25 8.25 0 01-4.773-1.492h-.003a.75.75 0 01-.75-.75v-3.5a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v3.5a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5h2.016a6.75 6.75 0 011.938 4.82l.003.002a8.25 8.25 0 01-1.425 1.352A8.25 8.25 0 013.5 12h3.75a.75.75 0 01.75.75v3.5c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 010-1.5h2.016a8.25 8.25 0 004.773 1.492V17.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v3.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-3.5a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v1.502c.568.332 1.05.803 1.425 1.352l.003.001a8.25 8.25 0 01-1.425 1.352H19.812z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-400 rounded"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
