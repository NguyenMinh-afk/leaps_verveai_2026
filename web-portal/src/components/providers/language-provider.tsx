// ============================================
// VERVE AI - Language Provider
// i18n Support for Vietnamese and English
// ============================================

'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'

export type Language = 'vi' | 'en'

interface LanguageProviderProps {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

interface LanguageProviderState {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, options?: Record<string, unknown>) => string
}

const LanguageContext = React.createContext<LanguageProviderState | undefined>(undefined)

/**
 * Language Provider Component
 * Manages language state and localStorage persistence
 */
export function LanguageProvider({
  children,
  defaultLanguage = 'vi',
  storageKey = 'verveai-language',
}: LanguageProviderProps) {
  const { i18n, t } = useTranslation()
  const [language, setLanguageState] = React.useState<Language>(defaultLanguage)

  // Initialize language on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Language | null
    if (stored && (stored === 'vi' || stored === 'en')) {
      setLanguageState(stored)
      i18n.changeLanguage(stored)
    } else {
      // Default to Vietnamese
      setLanguageState('vi')
      i18n.changeLanguage('vi')
    }
  }, [storageKey, i18n])

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(storageKey, lang)
    i18n.changeLanguage(lang)
  }, [storageKey, i18n])

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook to access language context
 */
export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

/**
 * Language Switcher Component
 * Simple toggle button for VI/EN
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={className}>
        <div className="h-9 w-16" />
      </div>
    )
  }

  const isVietnamese = language === 'vi'

  return (
    <div className={className}>
      <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800">
        <button
          onClick={() => setLanguage('vi')}
          className={`
            flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-150
            ${isVietnamese 
              ? 'bg-verve-100 text-verve-700 dark:bg-verve-900/50 dark:text-verve-300' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }
          `}
          aria-label="Switch to Vietnamese"
          title="Tiếng Việt"
        >
          <span className="text-sm">🇻🇳</span>
          <span>VI</span>
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`
            flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-150
            ${!isVietnamese 
              ? 'bg-verve-100 text-verve-700 dark:bg-verve-900/50 dark:text-verve-300' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }
          `}
          aria-label="Switch to English"
          title="English"
        >
          <span className="text-sm">🇺🇸</span>
          <span>EN</span>
        </button>
      </div>
    </div>
  )
}

/**
 * Simple translation hook for non-component usage
 */
export function useTranslationHelper() {
  const { t } = useTranslation()
  return t
}
