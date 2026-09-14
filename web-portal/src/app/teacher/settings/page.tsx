// ============================================
// VERVE AI - Teacher Settings Page
// ============================================

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
  Input,
  Badge,
} from '@/components/ui'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import {
  User,
  Envelope,
  Lock,
  Bell,
  Globe,
  Shield,
  Eye,
  EyeSlash,
  Check,
  Image,
} from '@phosphor-icons/react'
import type { UserRole, BreadcrumbItem } from '@/types'

/**
 * Tab configuration
 */
const tabs = [
  { id: 'profile', label: 'Profile', labelVi: 'Hồ sơ' },
  { id: 'notifications', label: 'Notifications', labelVi: 'Thông báo' },
  { id: 'preferences', label: 'Preferences', labelVi: 'Tùy chọn' },
  { id: 'security', label: 'Security', labelVi: 'Bảo mật' },
]

/**
 * Profile Section
 */
const ProfileSection: React.FC<{ onSave: () => void; isSaving: boolean }> = ({ onSave, isSaving }) => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [name, setName] = React.useState(user?.name || '')
  const [email, setEmail] = React.useState(user?.email || '')
  const [phone, setPhone] = React.useState('+84 123 456 789')
  const [bio, setBio] = React.useState('Giáo viên Toán - 10 năm kinh nghiệm giảng dạy')
  const [avatar, setAvatar] = React.useState<string | undefined>(undefined)
  const [isEditing, setIsEditing] = React.useState(false)

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-verve-100 text-verve-600">
              <User size={40} weight="regular" />
            </div>
          )}
          <button
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-800"
            title="Change avatar"
          >
            <Image size={16} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            {name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{email}</p>
          <Badge variant="success" size="sm" className="mt-2">{t('auth.teacher')}</Badge>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            {t('auth.fullName')}
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.enterFullName') || 'Nhập họ và tên'}
            leftIcon={<User size={18} />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            {t('auth.email')}
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.enterEmail') || 'Nhập email'}
            type="email"
            leftIcon={<Envelope size={18} />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            {t('common.phone')}
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('auth.enterPhone') || 'Nhập số điện thoại'}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            {t('settings.bio')}
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t('settings.bioPlaceholder') || 'Giới thiệu về bạn...'}
            rows={3}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" onClick={onSave} isLoading={isSaving}>
          {t('settings.saveChanges')}
        </Button>
      </div>
    </div>
  )
}

/**
 * Notifications Section
 */
const NotificationsSection: React.FC<{ onSave: () => void; isSaving: boolean }> = ({ onSave, isSaving }) => {
  const { t } = useLanguage()
  const [notifications, setNotifications] = React.useState({
    emailNewAssignment: true,
    emailStudentSubmission: true,
    emailNewIntervention: true,
    emailWeeklyReport: false,
    pushNewAssignment: true,
    pushStudentSubmission: true,
    pushNewIntervention: true,
    pushWeeklyReport: true,
  })

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const notificationItems = [
    {
      key: 'emailNewAssignment' as const,
      title: t('settings.newAssignmentEmail') || 'Bài tập mới được giao',
      description: t('settings.newAssignmentEmailDesc') || 'Nhận email khi có bài tập mới được tạo',
    },
    {
      key: 'emailStudentSubmission' as const,
      title: t('settings.studentSubmissionEmail') || 'Học sinh nộp bài',
      description: t('settings.studentSubmissionEmailDesc') || 'Nhận email khi học sinh nộp bài',
    },
    {
      key: 'emailNewIntervention' as const,
      title: t('interventions.newInterventionEmail') || 'Can thiệp mới',
      description: t('interventions.newInterventionEmailDesc') || 'Nhận email khi có học sinh cần can thiệp',
    },
    {
      key: 'emailWeeklyReport' as const,
      title: t('settings.weeklyReportEmail') || 'Báo cáo tuần',
      description: t('settings.weeklyReportEmailDesc') || 'Nhận email với báo cáo tiến độ học tập hàng tuần',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
          Email
        </h3>
        <div className="space-y-4">
          {notificationItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  notifications[item.key]
                    ? 'bg-verve-600'
                    : 'bg-slate-300 dark:bg-slate-700'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" onClick={onSave} isLoading={isSaving}>
          {t('settings.saveChanges')}
        </Button>
      </div>
    </div>
  )
}

/**
 * Preferences Section
 */
const PreferencesSection: React.FC<{ onSave: () => void; isSaving: boolean }> = ({ onSave, isSaving }) => {
  const { t } = useLanguage()
  const [preferences, setPreferences] = React.useState({
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
    aiSuggestions: true,
    autoSave: true,
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            {t('settings.language')}
          </label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences((p) => ({ ...p, language: e.target.value }))}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="vi">{t('settings.vietnamese') || 'Tiếng Việt'}</option>
            <option value="en">{t('settings.english') || 'English'}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            {t('settings.timezone') || 'Múi giờ'}
          </label>
          <select
            value={preferences.timezone}
            onChange={(e) => setPreferences((p) => ({ ...p, timezone: e.target.value }))}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
            <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            {t('settings.dateFormat') || 'Định dạng ngày'}
          </label>
          <select
            value={preferences.dateFormat}
            onChange={(e) => setPreferences((p) => ({ ...p, dateFormat: e.target.value }))}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            {t('settings.theme')}
          </label>
          <select
            value={preferences.theme}
            onChange={(e) => setPreferences((p) => ({ ...p, theme: e.target.value }))}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="light">{t('settings.light') || 'Sáng'}</option>
            <option value="dark">{t('settings.dark') || 'Tối'}</option>
            <option value="system">{t('settings.system') || 'Theo hệ thống'}</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('settings.aiSuggestions') || 'Đề xuất từ AI'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings.aiSuggestionsDesc') || 'Hiển thị các đề xuất được tạo bởi AI cho học sinh'}
            </p>
          </div>
          <button
            onClick={() => setPreferences((p) => ({ ...p, aiSuggestions: !p.aiSuggestions }))}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              preferences.aiSuggestions
                ? 'bg-verve-600'
                : 'bg-slate-300 dark:bg-slate-700'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                preferences.aiSuggestions ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('settings.autoSave') || 'Tự động lưu'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings.autoSaveDesc') || 'Tự động lưu các thay đổi khi nhập liệu'}
            </p>
          </div>
          <button
            onClick={() => setPreferences((p) => ({ ...p, autoSave: !p.autoSave }))}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              preferences.autoSave
                ? 'bg-verve-600'
                : 'bg-slate-300 dark:bg-slate-700'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" onClick={onSave} isLoading={isSaving}>
          {t('settings.saveChanges')}
        </Button>
      </div>
    </div>
  )
}

/**
 * Security Section
 */
const SecuritySection: React.FC<{ onSave: () => void; isSaving: boolean }> = ({ onSave, isSaving }) => {
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [twoFactor, setTwoFactor] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState<string | null>(null)

  const handleChangePassword = () => {
    setPasswordError(null)
    if (newPassword !== confirmPassword) {
      setPasswordError(t('auth.passwordMismatch') || 'Mật khẩu xác nhận không khớp')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError(t('auth.passwordTooShort') || 'Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }
    onSave()
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
          {t('settings.changePassword')}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              {t('settings.currentPassword')}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t('settings.enterCurrentPassword') || 'Nhập mật khẩu hiện tại'}
                leftIcon={<Lock size={18} />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              {t('settings.newPassword')}
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('settings.enterNewPassword') || 'Nhập mật khẩu mới'}
                leftIcon={<Lock size={18} />}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showNewPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              {t('settings.confirmNewPassword') || 'Xác nhận mật khẩu mới'}
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('settings.confirmNewPassword') || 'Nhập lại mật khẩu mới'}
                leftIcon={<Lock size={18} />}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
        {passwordError && (
          <div className="mt-3 rounded-lg border border-error-200 bg-error-50 p-3 dark:border-error-800 dark:bg-error-900/20">
            <p className="text-sm text-error-600 dark:text-error-400">{passwordError}</p>
          </div>
        )}
        <div className="mt-4">
          <Button variant="primary" onClick={handleChangePassword} isLoading={isSaving}>
            {t('settings.changePassword')}
          </Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
          {t('settings.twoFactor')}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('settings.enable2FA')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings.enable2FADesc') || 'Thêm một lớp bảo mật cho tài khoản của bạn'}
            </p>
          </div>
          <button
            onClick={() => setTwoFactor(!twoFactor)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              twoFactor
                ? 'bg-verve-600'
                : 'bg-slate-300 dark:bg-slate-700'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                twoFactor ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
          {t('settings.activeSessions') || 'Phiên đăng nhập'}
        </h3>
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-verve-100 text-verve-600">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t('settings.currentDevice') || 'Thiết bị hiện tại'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Windows • Chrome • Ho Chi Minh City, Vietnam
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm">{t('common.active')}</Badge>
          </div>
        </Card>
      </div>
    </div>
  )
}

/**
 * Teacher Settings Page
 */
export default function TeacherSettingsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('teacher')

  // User display object with fallback for null user
  const userDisplay = {
    name: user?.name || 'Teacher',
    email: user?.email || '',
    role: 'teacher' as UserRole,
  }
  const [activeTab, setActiveTab] = React.useState('profile')
  const [isSaving, setIsSaving] = React.useState(false)
  const [savedMessage, setSavedMessage] = React.useState(false)

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: 'Trang chủ', href: '/' },
    { label: t('teacher.title') || 'Giáo viên', labelVi: 'Giáo viên', href: '/teacher' },
    { label: t('settings.title'), labelVi: 'Cài đặt' },
  ]

  const handleRoleChange = (newRole: UserRole) => {
    router.push('/')
  }

  const handleSignOut = () => {
    router.push('/')
  }

  const handleSettings = () => {
    // Already on settings
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 3000)
  }

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
          title="Settings"
          titleVi="Cài đặt"
          description="Manage your account settings and preferences"
          descriptionVi="Quản lý cài đặt tài khoản và tùy chọn của bạn"
        />

        {/* Success Message */}
        {savedMessage && (
          <div className="rounded-lg border border-success-200 bg-success-50 p-4 dark:border-success-800 dark:bg-success-900/30">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium text-success-700 dark:text-success-300">
                {t('settings.settingsSaved') || 'Đã lưu cài đặt thành công!'}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex gap-6" aria-label="Settings tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative pb-4 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'text-verve-600 dark:text-verve-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                )}
              >
                {tab.labelVi || tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-verve-600 dark:bg-verve-400" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <Card variant="default" padding="lg">
          {activeTab === 'profile' && <ProfileSection onSave={handleSave} isSaving={isSaving} />}
          {activeTab === 'notifications' && <NotificationsSection onSave={handleSave} isSaving={isSaving} />}
          {activeTab === 'preferences' && <PreferencesSection onSave={handleSave} isSaving={isSaving} />}
          {activeTab === 'security' && <SecuritySection onSave={handleSave} isSaving={isSaving} />}
        </Card>

        {/* Development Mode Notice */}
        <div className="rounded-lg border border-info-200 bg-info-50 p-4 dark:border-info-800 dark:bg-info-900/30">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 shrink-0 text-info-600 dark:text-info-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-info-700 dark:text-info-300">
                {t('settings.devMode') || 'Chế độ phát triển'}
              </p>
              <p className="mt-1 text-sm text-info-600 dark:text-info-400">
                {t('settings.devModeDesc') || 'Cài đặt được lưu cục bộ trong trình duyệt. Kết nối với backend thực tế để lưu trữ vĩnh viễn.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayoutWrapper>
  )
}
