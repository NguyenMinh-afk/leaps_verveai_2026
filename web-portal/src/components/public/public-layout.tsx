// ============================================
// VERVE AI Design System - Public Layout
// ============================================

'use client'

import * as React from 'react'
import { PublicHeader, PublicFooter } from '@/components/public'

/**
 * Public Layout Props
 */
export interface PublicLayoutProps {
  children: React.ReactNode
}

/**
 * Public Layout Component
 * Layout wrapper for all public/informational pages
 */
export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <PublicHeader />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
