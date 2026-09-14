// ============================================
// VERVE AI - Register Page
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
  User,
  Envelope,
  Lock,
  Eye,
  EyeSlash,
  Check,
} from '@phosphor-icons/react'
import { GoogleIcon, FacebookIcon, GitHubIcon, QRIcon } from '@/components/social-icons'
import Image from 'next/image'
import { authService } from '@/services/auth'
import { validateRegisterInput, isPasswordStrong } from '@/services/auth'

/**
 * Password requirements
 */
const passwordRequirements = [
  { id: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { id: 'uppercase', label: 'At least 1 uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'At least 1 lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { id: 'number', label: 'At least 1 number', test: (p: string) => /\d/.test(p) },
]

/**
 * Role options for registration
 */
const roleOptions = [
  { value: 'student', label: 'Student', desc: 'Learning and tracking progress' },
  { value: 'teacher', label: 'Teacher', desc: 'Manage and support students' },
]

/**
 * Register Page
 * Registration page for VERVE AI platform
 */
export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { info } = useToast()
  const { t } = useLanguage()
  const defaultRole = searchParams.get('role') || ''

  // Form state
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [role, setRole] = React.useState(defaultRole)
  const [showPassword, setShowPassword] = React.useState(false)
  const [acceptTerms, setAcceptTerms] = React.useState(false)

  // UI state
  const [isLoading, setIsLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    role?: string
    terms?: string
    general?: string
  }>({})

  // Check password requirements using auth service
  const passwordStrength = passwordRequirements.filter((req) => req.test(password)).length

  // Additional strength check
  const isStrong = isPasswordStrong(password)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setErrors({})

    // Validate using auth service
    const validationErrors = validateRegisterInput({
      name,
      email,
      password,
      confirmPassword,
      role: role as 'student' | 'teacher',
      acceptTerms,
    })

    if (validationErrors.length > 0) {
      const newErrors: typeof errors = {}
      validationErrors.forEach((err) => {
        if (err.field === 'name') newErrors.name = err.message
        if (err.field === 'email') newErrors.email = err.message
        if (err.field === 'password') newErrors.password = err.message
        if (err.field === 'confirmPassword') newErrors.confirmPassword = err.message
        if (err.field === 'role') newErrors.role = err.message
        if (err.field === 'terms') newErrors.terms = err.message
      })
      setErrors(newErrors)
      return
    }

    // Submit form
    setIsLoading(true)

    try {
      const result = await authService.register({
        name,
        email,
        password,
        confirmPassword,
        role: role as 'student' | 'teacher',
        acceptTerms,
      })

      if (result.data) {
        // Development mode: successful registration
        router.push('/login?registered=true')
      } else {
        setErrors({ general: result.error || t('errors.generic') })
      }
    } catch {
      setErrors({ general: t('errors.generic') })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google OAuth (placeholder)
  const handleGoogleRegister = async () => {
    // Google OAuth will be available after backend OAuth provider configuration
    // This is a backend-dependent feature
    info(t('common.info'), 'Google OAuth ' + t('settings.pending'))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PublicHeader />

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Register Card */}
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
                {t('auth.createAccount')}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {t('common.start')} {t('student.title')} {t('settings.title').toLowerCase()}
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

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  {t('auth.selectRole')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={cn(
                        'flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all duration-150',
                        role === option.value
                          ? 'border-verve-600 bg-verve-50 text-verve-700 dark:border-verve-500 dark:bg-verve-900/30 dark:text-verve-300'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600',
                        errors.role && 'border-error-500'
                      )}
                    >
                      <span className="text-sm font-medium">
                        {option.value === 'student' ? t('auth.student') : t('auth.teacher')}
                      </span>
                      <span className="mt-1 text-xs text-slate-500">{option.desc}</span>
                    </button>
                  ))}
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.role}</p>
                )}
              </div>

              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {t('auth.fullName')}
                </label>
                <div className="mt-1">
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('auth.fullName')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    errorVi={errors.name}
                    autoComplete="name"
                    disabled={isLoading}
                    leftIcon={<User size={18} />}
                  />
                </div>
              </div>

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
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {t('auth.password')}
                </label>
                <div className="mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    errorVi={errors.password}
                    autoComplete="new-password"
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
                  />
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            'h-1 flex-1 rounded-full transition-colors',
                            passwordStrength >= level
                              ? passwordStrength <= 2
                                ? 'bg-error-500'
                                : passwordStrength === 3
                                  ? 'bg-amber-500'
                                  : 'bg-success-500'
                              : 'bg-slate-200 dark:bg-slate-700'
                          )}
                        />
                      ))}
                    </div>
                    <div className="mt-2 space-y-1">
                      {passwordRequirements.map((req) => (
                        <div
                          key={req.id}
                          className={cn(
                            'flex items-center gap-2 text-xs',
                            req.test(password)
                              ? 'text-success-600 dark:text-success-400'
                              : 'text-slate-500'
                          )}
                        >
                          <Check size={14} weight={req.test(password) ? 'bold' : 'regular'} />
                          <span>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {t('auth.confirmPassword')}
                </label>
                <div className="mt-1">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.confirmPassword')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    errorVi={errors.confirmPassword}
                    autoComplete="new-password"
                    disabled={isLoading}
                    leftIcon={<Lock size={18} />}
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-verve-600 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-800"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap"
                >
                  {t('auth.agreeTerms')}{' '}
                  <Link
                    href="/terms"
                    className="font-medium text-verve-600 hover:text-verve-700 dark:text-verve-400 dark:hover:text-verve-300"
                  >
                    {t('auth.termsOfService')}
                  </Link>{' '}
                  {t('common.and')}{' '}
                  <Link
                    href="/privacy"
                    className="font-medium text-verve-600 hover:text-verve-700 dark:text-verve-400 dark:hover:text-verve-300"
                  >
                    {t('auth.privacyPolicy')}
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="-mt-3 text-sm text-error-600 dark:text-error-400">{errors.terms}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? t('common.loading') : t('auth.register')}
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

            {/* Social Register */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGoogleRegister}
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

            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              {t('auth.haveAccount')}{' '}
              <Link
                href="/login"
                className="font-medium text-verve-600 hover:text-verve-700 dark:text-verve-400 dark:hover:text-verve-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-600 rounded"
              >
                {t('auth.signIn')}
              </Link>
            </p>
          </Card>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-600 rounded"
            >
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
