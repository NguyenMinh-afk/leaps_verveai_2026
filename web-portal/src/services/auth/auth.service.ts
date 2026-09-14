// ============================================
// VERVE AI - Auth Service - Real API Implementation
// ============================================
//
// Connects to the real backend auth service through the Gateway.
// All authentication flows use real JWT tokens and database.
//
// Backend: service-auth -> Gateway /api/auth/*
//

import { api, setStoredToken, clearStoredToken, ApiError } from '@/lib/api/apiClient'
import type { LoginInput, RegisterInput, AuthSession, AuthUser } from './auth.types'
import type { UserRole } from '@/types'

const SESSION_KEY = 'verveai_session'

/**
 * Backend API response types
 */
interface BackendLoginResponse {
  token: string
  refreshToken: string
  expiresAt: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

interface BackendCurrentUserResponse {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface BackendRegisterResponse {
  id: string
  email: string
  name: string
  role: string
}

/**
 * Map backend role to frontend UserRole
 */
function mapBackendRole(role: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    'ADMIN': 'admin',
    'TEACHER': 'teacher',
    'SUPERVISOR': 'reviewer',
    'STUDENT': 'student',
    'PARENT': 'student',
    'admin': 'admin',
    'teacher': 'teacher',
    'reviewer': 'reviewer',
    'student': 'student',
  }
  return roleMap[role.toUpperCase()] || 'student' as UserRole
}

/**
 * Auth service using real backend API
 */
export const authService = {
  /**
   * Login with email and password
   * Calls: POST /api/auth/login
   */
  async login(input: LoginInput): Promise<{ data?: AuthSession; error?: string }> {
    try {
      const result = await api.post<BackendLoginResponse>('/api/auth/login', {
        email: input.email,
        password: input.password,
      }, { skipAuth: true })

      const session: AuthSession = {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: mapBackendRole(result.user.role),
        },
        token: result.token,
        expiresAt: new Date(result.expiresAt),
      }

      // Store token for API calls
      if (result.token) {
        setStoredToken(result.token)
      }

      // Store session for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      }

      return { data: session }
    } catch (err) {
      if (err instanceof ApiError) {
        return { error: err.message || 'Email hoặc mật khẩu không đúng' }
      }
      return { error: 'Đăng nhập thất bại. Vui lòng thử lại.' }
    }
  },

  /**
   * Register new user
   * Calls: POST /api/auth/register
   */
  async register(input: RegisterInput): Promise<{ data?: AuthSession; error?: string }> {
    try {
      const result = await api.post<BackendRegisterResponse>('/api/auth/register', {
        email: input.email,
        password: input.password,
        name: input.name,
        role: input.role,
      }, { skipAuth: true })

      // Auto-login after registration
      const loginResult = await this.login({
        email: input.email,
        password: input.password,
      })

      return loginResult
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.message?.includes('EMAIL_EXISTS') || err.message?.includes('already')) {
          return { error: 'Email đã được đăng ký' }
        }
        return { error: err.message || 'Đăng ký thất bại' }
      }
      return { error: 'Đăng ký thất bại. Vui lòng thử lại.' }
    }
  },

  /**
   * Logout
   * Calls: POST /api/auth/logout
   */
  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout')
    } catch {
      // Ignore logout errors - clear local state regardless
    } finally {
      clearStoredToken()
      if (typeof window !== 'undefined') {
        localStorage.removeItem(SESSION_KEY)
      }
    }
  },

  /**
   * Get current session from storage
   */
  async getSession(): Promise<AuthSession | null> {
    if (typeof window === 'undefined') return null

    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) return null

    try {
      const session = JSON.parse(stored) as AuthSession

      // Check if token is expired
      if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
        localStorage.removeItem(SESSION_KEY)
        clearStoredToken()
        return null
      }

      return session
    } catch {
      return null
    }
  },

  /**
   * Validate current session with backend
   * Calls: GET /api/auth/me
   */
  async validateToken(): Promise<{ valid: boolean; user?: AuthUser }> {
    try {
      const user = await api.get<BackendCurrentUserResponse>('/api/auth/me')
      return {
        valid: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: mapBackendRole(user.role),
        },
      }
    } catch {
      return { valid: false }
    }
  },

  /**
   * Get current user
   * Calls: GET /api/auth/me
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await api.get<BackendCurrentUserResponse>('/api/auth/me')
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: mapBackendRole(user.role),
      }
    } catch {
      return null
    }
  },

  /**
   * Request password reset
   * Calls: POST /api/auth/forgot-password (if exists)
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // If the backend has a forgot-password endpoint, call it
      await api.post('/api/auth/forgot-password', { email }, { skipAuth: true })
      return { success: true }
    } catch {
      // Don't expose whether email exists or not for security
      return { success: true }
    }
  },

  /**
   * Refresh authentication token
   * Calls: POST /api/auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<{ token?: string; error?: string }> {
    try {
      const result = await api.post<{ token: string }>('/api/auth/refresh', {
        refreshToken,
      })
      if (result.token) {
        setStoredToken(result.token)
      }
      return { token: result.token }
    } catch {
      return { error: 'Token refresh failed' }
    }
  },
}

export default authService
