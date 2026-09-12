// ============================================
// VERVE AI - Client Providers
// ============================================

'use client'

import { AuthProvider } from '@/lib/auth/AuthContext'
import { ToastProvider } from '@/components/ui/toast'
import { ThemeProvider } from './providers/theme-provider'
import { LanguageProvider } from './providers/language-provider'


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="verveai-theme">
        <LanguageProvider defaultLanguage="vi" storageKey="verveai-language">
          <ToastProvider>
            {children}
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
