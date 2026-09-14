// ============================================
// VERVE AI - Auth Service Types
// ============================================

import type { UserRole } from '@/types'

/**
 * Login input
 */
export interface LoginInput {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Register input
 */
export interface RegisterInput {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'student' | 'teacher'
  acceptTerms: boolean
}

/**
 * Auth session
 */
export interface AuthSession {
  user: AuthUser
  token?: string
  expiresAt?: Date
}

/**
 * Auth user
 */
export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

/**
 * Auth error
 */
export interface AuthError {
  code: string
  message: string
  field?: string
}

/**
 * Password requirements
 */
export interface PasswordRequirements {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
}

/**
 * Check password strength
 */
export function checkPasswordStrength(password: string): PasswordRequirements {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  }
}

/**
 * Check if password meets all requirements
 */
export function isPasswordStrong(password: string): boolean {
  const reqs = checkPasswordStrength(password)
  return reqs.minLength && reqs.hasUppercase && reqs.hasLowercase && reqs.hasNumber
}

/**
 * Validate login input
 */
export function validateLoginInput(input: LoginInput): AuthError[] {
  const errors: AuthError[] = []

  if (!input.email) {
    errors.push({ code: 'REQUIRED', message: 'Email là bắt buộc', field: 'email' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push({ code: 'INVALID', message: 'Email không hợp lệ', field: 'email' })
  }

  if (!input.password) {
    errors.push({ code: 'REQUIRED', message: 'Mật khẩu là bắt buộc', field: 'password' })
  }

  return errors
}

/**
 * Validate register input
 */
export function validateRegisterInput(input: RegisterInput): AuthError[] {
  const errors: AuthError[] = []

  if (!input.name.trim()) {
    errors.push({ code: 'REQUIRED', message: 'Họ tên là bắt buộc', field: 'name' })
  }

  if (!input.email) {
    errors.push({ code: 'REQUIRED', message: 'Email là bắt buộc', field: 'email' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push({ code: 'INVALID', message: 'Email không hợp lệ', field: 'email' })
  }

  if (!input.password) {
    errors.push({ code: 'REQUIRED', message: 'Mật khẩu là bắt buộc', field: 'password' })
  } else if (!isPasswordStrong(input.password)) {
    errors.push({ code: 'WEAK', message: 'Mật khẩu phải đủ mạnh', field: 'password' })
  }

  if (input.password !== input.confirmPassword) {
    errors.push({ code: 'MISMATCH', message: 'Mật khẩu xác nhận không khớp', field: 'confirmPassword' })
  }

  if (!input.role) {
    errors.push({ code: 'REQUIRED', message: 'Vai trò là bắt buộc', field: 'role' })
  }

  if (!input.acceptTerms) {
    errors.push({ code: 'REQUIRED', message: 'Bạn cần đồng ý với điều khoản', field: 'terms' })
  }

  return errors
}
