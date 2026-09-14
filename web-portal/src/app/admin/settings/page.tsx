'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
  PageSection,
} from '@/components/layout'
import {
  Card,
  Button,
  Badge,
  Input,
} from '@/components/ui'
import { useToast, ConfirmationDialog } from '@/components/ui/toast'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { SettingsGroup, Setting } from '@/types'
import { api } from '@/lib/api/apiClient'

// Client-side settings type (stored in localStorage)
interface ClientSettings {
  [key: string]: unknown
  language: string
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  emailNotifications: boolean
  dashboardLayout: 'grid' | 'list'
}

const DEFAULT_SETTINGS: ClientSettings = {
  language: 'vi',
  theme: 'system',
  notifications: true,
  emailNotifications: true,
  dashboardLayout: 'grid',
}

/**
 * Setting Row Component
 */
interface SettingRowProps {
  setting: Setting
  onSaveSuccess?: (name: string) => void
  onValueChange?: (key: string, value: unknown) => void
  currentValue?: unknown
}

const SettingRow: React.FC<SettingRowProps> = ({ setting, onSaveSuccess, onValueChange, currentValue }) => {
  const { t } = useLanguage()
  const [localValue, setLocalValue] = React.useState(currentValue ?? setting.value)
  const [hasChanges, setHasChanges] = React.useState(false)

  const handleChange = (newValue: unknown) => {
    setLocalValue(newValue)
    setHasChanges(true)
    onValueChange?.(setting.key, newValue)
  }

  const handleSave = () => {
    // Settings are saved to localStorage for client preferences
    onSaveSuccess?.(`${t('common.save')} "${setting.nameVi}" ${t('common.with')}: ${String(localValue)}`)
    setHasChanges(false)
  }

  const renderInput = () => {
    switch (setting.type) {
      case 'text':
        return (
          <Input
            value={String(localValue ?? '')}
            onChange={(e) => handleChange(e.target.value)}
            className="max-w-sm"
          />
        )
      case 'number':
        return (
          <Input
            type="number"
            value={String(localValue ?? '')}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="max-w-[120px]"
          />
        )
      case 'boolean':
        return (
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={Boolean(localValue)}
              onChange={(e) => handleChange(e.target.checked)}
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-verve-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-verve-300 dark:bg-slate-700" />
          </label>
        )
      case 'select':
        return (
          <select
            value={String(localValue ?? '')}
            onChange={(e) => handleChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 max-w-[200px]"
          >
            {setting.options?.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.labelVi}
              </option>
            ))}
          </select>
        )
      default:
        return <span className="text-sm text-slate-600 dark:text-slate-400">{String(localValue ?? '')}</span>
    }
  }

  if (setting.sensitive) {
    return (
      <div className="flex items-start justify-between py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {setting.nameVi}
            </p>
            <Badge variant="error" size="sm">{t('common.security')}</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {setting.descriptionVi}
          </p>
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 italic">
            {t('settings.securityValueHidden')}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onSaveSuccess?.(t('settings.securityFeatureInDevelopment'))}>
          {t('common.update')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-start justify-between py-4 border-b border-slate-200 dark:border-slate-700">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {setting.nameVi}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {setting.descriptionVi}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {renderInput()}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges}
          className={hasChanges ? 'border-verve-500 text-verve-600' : ''}
        >
          {t('common.save')}
        </Button>
      </div>
    </div>
  )
}

/**
 * Settings Group Component
 */
interface SettingsGroupCardProps {
  group: SettingsGroup
  onSaveSuccess?: (message: string) => void
  onValueChange?: (key: string, value: unknown) => void
  currentValues?: Record<string, unknown>
}

const SettingsGroupCard: React.FC<SettingsGroupCardProps> = ({ group, onSaveSuccess, onValueChange, currentValues }) => {
  const [isExpanded, setIsExpanded] = React.useState(true)

  return (
    <Card variant="default" padding="none">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {group.nameVi}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {group.descriptionVi}
          </p>
        </div>
        <svg
          className={cn('h-5 w-5 text-slate-400 transition-transform', isExpanded && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-200 px-4 dark:border-slate-700">
          {group.settings.map((setting) => (
            <SettingRow 
              key={setting.id} 
              setting={setting} 
              onSaveSuccess={onSaveSuccess}
              onValueChange={onValueChange}
              currentValue={currentValues?.[setting.key]}
            />
          ))}
        </div>
      )}
    </Card>
  )
}

/**
 * Settings Page
 */
export default function SettingsPage() {
  const router = useRouter()
  const { t, language, setLanguage } = useLanguage()
  const { success } = useToast()
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('admin')
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    variant: 'danger' | 'warning' | 'default'
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'default' })
  
  // Client-side settings (stored in localStorage)
  const [clientSettings, setClientSettings] = React.useState<ClientSettings>(DEFAULT_SETTINGS)
  
  // Load settings from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('client_settings')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setClientSettings({ ...DEFAULT_SETTINGS, ...parsed })
      } catch {
        // Use defaults
      }
    }
  }, [])
  
  // Handle setting value changes
  const handleValueChange = (key: string, value: unknown) => {
    const newSettings = { ...clientSettings, [key]: value }
    setClientSettings(newSettings)
    localStorage.setItem('client_settings', JSON.stringify(newSettings))
    
    // Apply theme changes immediately
    if (key === 'theme') {
      applyTheme(value as ClientSettings['theme'])
    } else if (key === 'language' && typeof value === 'string') {
      setLanguage(value as 'vi' | 'en')
    }
  }
  
  // Apply theme to document
  const applyTheme = (theme: ClientSettings['theme']) => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  const userDisplay = {
    name: user?.name || 'Admin',
    email: user?.email || '',
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'Settings', labelVi: 'Cài đặt' },
  ]

  const handleRoleChange = (newRole: UserRole) => {
    router.push('/')
  }

  const handleSignOut = () => {
    router.push('/')
  }

  const handleSettings = () => {
    // Already on settings page
  }

  const handleSaveSuccess = (message: string) => {
    success(t('common.success'), message)
  }

  const handleSaveAll = () => {
    success(t('common.success'), t('settings.allSettingsSaved'))
  }

  // Build settings groups from client settings
  const settingsGroups: SettingsGroup[] = [
    {
      id: 'appearance',
      name: 'Appearance',
      nameVi: 'Giao diện',
      description: 'Customize the appearance',
      descriptionVi: 'Tùy chỉnh giao diện ứng dụng',
      settings: [
        {
          id: 'language',
          key: 'language',
          name: 'Language',
          nameVi: 'Ngôn ngữ',
          description: 'Select your preferred language',
          descriptionVi: 'Chọn ngôn ngữ ưa thích của bạn',
          type: 'select',
          value: clientSettings.language,
          defaultValue: 'vi',
          options: [
            { label: 'Tiếng Việt', labelVi: 'Tiếng Việt', value: 'vi' },
            { label: 'English', labelVi: 'English', value: 'en' },
          ],
        },
        {
          id: 'theme',
          key: 'theme',
          name: 'Theme',
          nameVi: 'Giao diện',
          description: 'Choose light, dark, or system theme',
          descriptionVi: 'Chọn giao diện sáng, tối hoặc theo hệ thống',
          type: 'select',
          value: clientSettings.theme,
          defaultValue: 'system',
          options: [
            { label: 'Light', labelVi: 'Sáng', value: 'light' },
            { label: 'Dark', labelVi: 'Tối', value: 'dark' },
            { label: 'System', labelVi: 'Hệ thống', value: 'system' },
          ],
        },
      ],
    },
    {
      id: 'notifications',
      name: 'Thông báo',
      nameVi: 'Thông báo',
      description: 'Notification preferences',
      descriptionVi: 'Tùy chọn thông báo',
      settings: [
        {
          id: 'notifications',
          key: 'notifications',
          name: 'Push notifications',
          nameVi: 'Thông báo đẩy',
          description: 'Receive push notifications',
          descriptionVi: 'Nhận thông báo đẩy từ trình duyệt',
          type: 'boolean',
          value: clientSettings.notifications,
          defaultValue: true,
        },
        {
          id: 'emailNotifications',
          key: 'emailNotifications',
          name: 'Email notifications',
          nameVi: 'Thông báo qua email',
          description: 'Receive email notifications',
          descriptionVi: 'Nhận thông báo qua email',
          type: 'boolean',
          value: clientSettings.emailNotifications,
          defaultValue: true,
        },
      ],
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      nameVi: 'Bảng điều khiển',
      description: 'Dashboard preferences',
      descriptionVi: 'Tùy chọn bảng điều khiển',
      settings: [
        {
          id: 'dashboardLayout',
          key: 'dashboardLayout',
          name: 'Layout',
          nameVi: 'Bố cục',
          description: 'Choose dashboard layout',
          descriptionVi: 'Chọn bố cục bảng điều khiển',
          type: 'select',
          value: clientSettings.dashboardLayout,
          defaultValue: 'grid',
          options: [
            { label: 'Grid', labelVi: 'Lưới', value: 'grid' },
            { label: 'List', labelVi: 'Danh sách', value: 'list' },
          ],
        },
      ],
    },
  ]

  return (
    <DashboardLayoutWrapper
      user={userDisplay}
      breadcrumbs={breadcrumbs}
      onRoleChange={handleRoleChange}
      onSignOut={handleSignOut}
      onSettings={handleSettings}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="System Settings"
          titleVi="Cài đặt Hệ thống"
          description="Configure platform settings"
          descriptionVi="Cấu hình cài đặt nền tảng"
          actions={
            <Button variant="primary" size="sm" onClick={handleSaveAll}>
              {t('settings.saveAllChanges')}
            </Button>
          }
        />

        {/* Info Banner */}
        <Card variant="default" padding="md" className="border-l-4 border-info-500">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-info-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                {t('settings.securityNote')}
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {t('settings.securityNoteDesc')}
              </p>
            </div>
          </div>
        </Card>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group) => (
            <SettingsGroupCard 
              key={group.id} 
              group={group} 
              onSaveSuccess={handleSaveSuccess}
              onValueChange={handleValueChange}
              currentValues={clientSettings}
            />
          ))}
        </div>

        {/* Danger Zone */}
        <Card variant="default" padding="lg" className="border-l-4 border-error-500">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t('settings.dangerZone')}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t('settings.dangerZoneDesc')}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="destructive" size="sm" onClick={() => {
              setConfirmDialog({
                isOpen: true,
                title: t('settings.resetToDefault'),
                message: t('settings.resetConfirmMessage'),
                variant: 'danger',
                onConfirm: () => {
                  success(t('common.success'), t('settings.resetSuccess'))
                  setConfirmDialog(prev => ({ ...prev, isOpen: false }))
                },
              })
            }}>
              {t('settings.resetToDefault')}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => {
              setConfirmDialog({
                isOpen: true,
                title: t('settings.clearCache'),
                message: t('settings.clearCacheConfirm'),
                variant: 'danger',
                onConfirm: () => {
                  success(t('common.success'), t('settings.clearCacheSuccess'))
                  setConfirmDialog(prev => ({ ...prev, isOpen: false }))
                },
              })
            }}>
              {t('settings.clearCache')}
            </Button>
          </div>
        </Card>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          variant={confirmDialog.variant}
          message={confirmDialog.message}
        />
      </div>
    </DashboardLayoutWrapper>
  )
}
