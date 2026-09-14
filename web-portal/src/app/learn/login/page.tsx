'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Card, Button, Input } from '@/components/ui'
import { authService } from '@/services/auth'
import type { UserRole } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'

// Helper to check if current language is Vietnamese
function useIsVietnamese() {
  const { language } = useLanguage()
  return language === 'vi'
}

// Profile data for shared device
interface StudentProfile {
  id: string
  name: string
  email: string
  avatar?: string
}

/**
 * Learn Login Page
 * Student profile gate for shared devices
 */
export default function LearnLoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const isVietnamese = useIsVietnamese()
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSelectingProfile, setIsSelectingProfile] = React.useState(false)
  const [profiles, setProfiles] = React.useState<StudentProfile[]>([])
  const [selectedProfile, setSelectedProfile] = React.useState<StudentProfile | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isVerifying, setIsVerifying] = React.useState(false)

  // Check session and load profiles
  React.useEffect(() => {
    async function loadData() {
      try {
        const session = await authService.getSession()
        
        if (session?.user) {
          // User is already logged in
          if (session.user.role === 'student') {
            router.push('/student')
            return
          }
        }
        
        // For shared devices, we need to show profile selection
        // For now, just show the login UI
        setIsLoading(false)
        setIsSelectingProfile(false)
      } catch (err) {
        console.error('Failed to check session:', err)
        setError(err instanceof Error ? err.message : 'Failed to check session')
        setIsLoading(false)
      }
    }
    loadData()
  }, [router])

  // Handle profile selection and verification
  const handleProfileSelect = async (profile: StudentProfile) => {
    setSelectedProfile(profile)
    setIsVerifying(true)
    
    try {
      // Store selected profile for this session
      sessionStorage.setItem('selectedProfile', JSON.stringify(profile))
      
      // Navigate to student dashboard
      router.push('/student')
    } catch (err) {
      console.error('Failed to select profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to select profile')
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle logout from shared device
  const handleLogout = async () => {
    try {
      await authService.logout()
      sessionStorage.removeItem('selectedProfile')
      router.push('/login')
    } catch (err) {
      console.error('Failed to logout:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-verve-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500">{isVietnamese ? 'Đang tải...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-verve-100 dark:bg-verve-900/30">
            <svg className="h-8 w-8 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isVietnamese ? 'Đăng nhập học sinh' : 'Student Login'}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isVietnamese 
              ? 'Chọn hồ sơ của bạn hoặc đăng nhập để tiếp tục' 
              : 'Select your profile or login to continue'}
          </p>
        </div>

        {/* Profile Selection or Login */}
        <Card variant="default" padding="lg" className="mt-8">
          {isSelectingProfile ? (
            // Profile Selection
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900 dark:text-slate-100">
                {isVietnamese ? 'Chọn hồ sơ của bạn' : 'Select your profile'}
              </h3>
              
              {profiles.length > 0 ? (
                <div className="space-y-2">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => handleProfileSelect(profile)}
                      disabled={isVerifying}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                        selectedProfile?.id === profile.id
                          ? 'border-verve-500 bg-verve-50 dark:bg-verve-900/20'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600',
                        isVerifying && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                        <span className="text-lg font-medium text-slate-600 dark:text-slate-300">
                          {profile.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {profile.name}
                        </p>
                        {profile.email && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {profile.email}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-slate-500 py-4">
                  {isVietnamese 
                    ? 'Chưa có hồ sơ nào trên thiết bị này' 
                    : 'No profiles on this device yet'}
                </p>
              )}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsSelectingProfile(false)}
              >
                {isVietnamese ? 'Đăng nhập bằng email' : 'Login with email'}
              </Button>
            </div>
          ) : (
            // Email Login
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isVietnamese ? 'Email' : 'Email'}
                </label>
                <Input
                  type="email"
                  placeholder={isVietnamese ? 'email@hocsinh.edu.vn' : 'email@student.edu.vn'}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isVietnamese ? 'Mật khẩu' : 'Password'}
                </label>
                <Input
                  type="password"
                  placeholder={isVietnamese ? 'Nhập mật khẩu' : 'Enter password'}
                  className="mt-1"
                />
              </div>
              
              {error && (
                <p className="text-sm text-error-600 dark:text-error-400">
                  {error}
                </p>
              )}
              
              <Button variant="primary" className="w-full">
                {isVietnamese ? 'Đăng nhập' : 'Login'}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    {isVietnamese ? 'hoặc' : 'or'}
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsSelectingProfile(true)}
              >
                {isVietnamese ? 'Chọn từ hồ sơ đã lưu' : 'Select from saved profiles'}
              </Button>
            </form>
          )}
        </Card>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            {isVietnamese ? '← Quay lại trang chủ' : '← Back to home'}
          </button>
        </div>
      </div>
    </div>
  )
}
