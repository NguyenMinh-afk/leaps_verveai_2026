/**
 * VERVEAI — Auth context provider.
 *
 * Wraps the app, exposes `{ user, status, login, logout, refresh }` to
 * descendants via `useAuth()`. Persists token via apiClient.setStoredToken.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { ApiError } from '@/lib/api/apiClient';
import {
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  type AuthUser,
  type LoginRequest,
} from '@/lib/api/auth';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [status, setStatus] = useState<AuthStatus>(initialUser ? 'authenticated' : 'loading');
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      setUser(current);
      setStatus(current ? 'authenticated' : 'unauthenticated');
    } catch (err) {
      setUser(null);
      setStatus('unauthenticated');
      setError(err instanceof ApiError ? err.message : 'Session expired');
    }
  }, []);

  useEffect(() => {
    if (!initialUser) {
      void refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    setError(null);
    setStatus('loading');
    try {
      const result = await apiLogin(payload);
      setUser(result.user);
      setStatus('authenticated');
    } catch (err) {
      setUser(null);
      setStatus('unauthenticated');
      const message = err instanceof ApiError ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
      error,
      login,
      logout,
      refresh,
    }),
    [user, status, error, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
