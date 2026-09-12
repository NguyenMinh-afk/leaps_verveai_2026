/**
 * VERVEAI — Auth API surface (wraps /api/auth/* through Gateway).
 */

import { api, clearStoredToken, setStoredToken } from './apiClient';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'TEACHER' | 'ADMIN' | 'SUPERVISOR' | 'STUDENT' | 'PARENT';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: AuthUser;
}

export interface SessionResponse {
  user: AuthUser;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const data = await api.post<LoginResponse>('/api/auth/login', payload, {
    skipAuth: true,
  });
  if (data.token) {
    setStoredToken(data.token);
  }
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post<void>('/api/auth/logout');
  } finally {
    clearStoredToken();
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await api.get<SessionResponse>('/api/auth/me');
    return session.user;
  } catch {
    clearStoredToken();
    return null;
  }
}
