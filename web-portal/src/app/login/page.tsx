// ============================================
// VERVE AI - Login Page
// ============================================

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button, Input, Card } from '@/components/ui'
import { useToast } from '@/components/ui/toast'
import { PublicHeader, PublicFooter } from '@/components/public'
import { useLanguage } from '@/components/providers/language-provider'
import {
  Envelope,
  Lock,
  Eye,
  EyeSlash,
} from '@phosphor-icons/react'
import { GoogleIcon, FacebookIcon, GitHubIcon, QRIcon } from '@/components/social-icons'
import Image from 'next/image'
import { authService } from '@/services/auth'
import { validateLoginInput } from '@/services/auth'

/**
 * Login Page
 * Authentication page for VERVE AI platform
 */
export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { info } = useToast()
  const { t } = useLanguage()
  const redirect = searchParams.get('redirect') || '/'

  // Form state
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(false)

  // UI state
  const [isLoading, setIsLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{ email?: string; password?: string; general?: string }>({})

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setErrors({})

    // Validate using auth service
    const validationErrors = validateLoginInput({ email, password })
    if (validationErrors.length > 0) {
      const newErrors: typeof errors = {}
      validationErrors.forEach((err) => {
        if (err.field === 'email') newErrors.email = err.message
        if (err.field === 'password') newErrors.password = err.message
      })
      setErrors(newErrors)
      return
    }

    // Submit form
    setIsLoading(true)

    try {
      const result = await authService.login({
        email,
        password,
        rememberMe,
      })

      if (result.data) {
        // Development mode: successful login
        // In production, this would store the token and redirect
        const role = result.data.user.role
        const dashboardPath = role === 'student' ? '/student' : role === 'admin' ? '/admin' : '/teacher'
        router.push(redirect || dashboardPath)
      } else {
        setErrors({ general: t('auth.invalidCredentials') })
      }
    } catch {
      setErrors({ general: t('errors.generic') })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google OAuth (placeholder)
  const handleGoogleLogin = async () => {
    // Google OAuth will be available after backend OAuth provider configuration
    // This is a backend-dependent feature
    info(t('common.info'), t('auth.login') + ' Google OAuth ' + t('settings.pending'))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PublicHeader />

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <Card variant="default" padding="lg" className="shadow-lg">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-600 rounded-md"
              >
                <Image
                  src="/Logo.png"
                  alt="VERVE AI Logo"
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain"
                />
              </Link>
              <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                {t('auth.login')} VERVE AI
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {t('auth.welcomeBack')}
              </p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div
                className="mb-6 rounded-lg border border-error-200 bg-error-50 p-4 text-sm text-error-700 dark:border-error-900/50 dark:bg-error-900/20 dark:text-error-300"
                role="alert"
              >
                {errors.general}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {t('auth.email')}
                </label>
                <div className="mt-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    errorVi={errors.email}
                    autoComplete="email"
                    disabled={isLoading}
                    leftIcon={<Envelope size={18} />}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    {t('auth.password')}
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-verve-600 hover:text-verve-700 dark:text-verve-400 dark:hover:text-verve-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-600 rounded"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <div className="mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    errorVi={errors.password}
                    autoComplete="current-password"
                    disabled={isLoading}
                    leftIcon={<Lock size={18} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="focus-visible:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeSlash size={18} className="text-slate-400" />
                        ) : (
                          <Eye size={18} className="text-slate-400" />
                        )}
                      </button>
                    }
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 shrink-0 rounded border-slate-300 text-verve-600 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-800"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
                >
                  {t('auth.rememberMe')}
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? t('common.loading') : t('auth.login')}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  {t('auth.orContinueWith')}
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                leftIcon={<GoogleIcon size={20} />}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => info(t('common.info'), 'Facebook OAuth ' + t('settings.pending'))}
                disabled={isLoading}
                leftIcon={<FacebookIcon size={20} />}
              >
                Facebook
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => info(t('common.info'), 'GitHub OAuth ' + t('settings.pending'))}
                disabled={isLoading}
                leftIcon={<GitHubIcon size={20} />}
              >
                GitHub
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => info(t('common.info'), t('common.info') + ' QR ' + t('settings.pending'))}
                disabled={isLoading}
                leftIcon={<QRIcon size={20} />}
              >
                QR Code
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              {t('auth.noAccount')}{' '}
              <Link
                href="/register"
                className="font-medium text-verve-600 hover:text-verve-700 dark:text-verve-400 dark:hover:text-verve-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-600 rounded"
              >
                {t('auth.signUp')}
              </Link>
            </p>
          </Card>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-600 rounded"
            >
              ← {t('common.back')} {t('common.dashboard')}
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
