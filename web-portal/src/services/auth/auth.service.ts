// ============================================
// VERVE AI - Auth Service Mock Implementation
// ============================================

import type { LoginInput, RegisterInput, AuthSession, AuthUser } from './auth.types'

/**
 * Development auth service
 * This is a mock implementation for development only
 * Replace with real auth API in production
 */

const MOCK_DELAY = 800

// Development session storage key
const SESSION_KEY = 'verveai_dev_session'

/**
 * Simulate API delay
 */
async function simulateDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
}

/**
 * Get mock user by role
 */
function getMockUser(role: 'student' | 'teacher', email: string, name: string): AuthUser {
  return {
    id: `${role}-${Date.now()}`,
    name,
    email,
    role,
    avatar: undefined,
  }
}

/**
 * Save session to localStorage (development mode)
 */
function saveSession(session: AuthSession): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
}

/**
 * Clear session from localStorage
 */
function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

/**
 * Get session from localStorage
 */
function getStoredSession(): AuthSession | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
  }
  return null
}

/**
 * Auth service for development
 */
export const authService = {
  /**
   * Login with email and password
   */
  async login(input: LoginInput): Promise<{ data?: AuthSession; error?: string }> {
    await simulateDelay()

    // Development mock - accept any valid-looking credentials
    if (input.email && input.password && input.password.length >= 6) {
      const role = input.email.includes('teacher') ? 'teacher' : 'student'
      const name = input.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())

      const session: AuthSession = {
        user: getMockUser(role, input.email, name),
        token: `dev-token-${Date.now()}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
      
      // Save to localStorage for development persistence
      saveSession(session)

      return { data: session }
    }

    return { error: 'Email hoặc mật khẩu không đúng' }
  },

  /**
   * Register new user
   */
  async register(input: RegisterInput): Promise<{ data?: AuthSession; error?: string }> {
    await simulateDelay()

    // Development mock - accept any valid registration
    if (input.email && input.password && input.role) {
      const session: AuthSession = {
        user: getMockUser(input.role, input.email, input.name),
        token: `dev-token-${Date.now()}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
      
      // Save to localStorage for development persistence
      saveSession(session)

      return { data: session }
    }

    return { error: 'Đăng ký thất bại. Vui lòng thử lại.' }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await simulateDelay()
    // Clear localStorage session
    clearSession()
  },

  /**
   * Get current session
   */
  async getSession(): Promise<AuthSession | null> {
    // Return stored session or null
    return getStoredSession()
  },

  /**
   * Validate session token
   */
  async validateToken(token: string): Promise<boolean> {
    await simulateDelay()
    return token.startsWith('dev-token-')
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    await simulateDelay()
    // Development mock - always succeed
    return { success: true }
  },
}

export default authService
