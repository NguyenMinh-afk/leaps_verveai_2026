// ============================================
// VERVE AI - Client Providers
// ============================================

'use client'

import { ToastProvider } from '@/components/ui/toast'
import { ThemeProvider } from './providers/theme-provider'
import { LanguageProvider } from './providers/language-provider'

/**
 * Providers component
 * Wraps all client-side providers for the application
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="verveai-theme">
      <LanguageProvider defaultLanguage="vi" storageKey="verveai-language">
        <ToastProvider>
          {children}
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
