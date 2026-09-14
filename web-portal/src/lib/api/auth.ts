/**
 * VERVEAI — Auth API surface (wraps /api/auth/* through Gateway).
 */

import { 
  api, 
  clearStoredToken, 
  setStoredToken,
  setTokenCookie,
  clearTokenCookie,
  getTokenFromCookie
} from './apiClient';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'TEACHER' | 'ADMIN' | 'SUPERVISOR' | 'STUDENT' | 'PARENT';
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresAt?: string;
  user: AuthUser;
}

export interface SessionResponse {
  user: AuthUser;
}

// Cookie names for role
const USER_ROLE_COOKIE = 'verveai-user-role';

/**
 * Set user role cookie for middleware to read
 */
function setRoleCookie(role: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${USER_ROLE_COOKIE}=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

/**
 * Clear role cookie on logout
 */
function clearRoleCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${USER_ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Get user role from cookie
 */
export function getRoleFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + USER_ROLE_COOKIE + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const data = await api.post<LoginResponse>('/api/auth/login', payload, {
    skipAuth: true,
  });
  if (data.token) {
    // Set token in both localStorage and cookie (localStorage for API calls, cookie for middleware)
    setStoredToken(data.token);
    // Set role cookie for role-based redirect in middleware
    setRoleCookie(data.user.role);
  }
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post<void>('/api/auth/logout');
  } finally {
    clearStoredToken();
    clearRoleCookie();
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await api.get<SessionResponse>('/api/auth/me');
    return session.user;
  } catch {
    clearStoredToken();
    clearRoleCookie();
    return null;
  }
}
