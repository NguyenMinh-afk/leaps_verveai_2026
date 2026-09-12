/**
 * Tests for the typed auth API surface.
 *
 * Mocks `apiRequest` via module mock so we can drive the success and
 * failure paths without touching the network.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api/apiClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/apiClient')>();
  return {
    ...actual,
    api: {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
    setStoredToken: vi.fn(),
    clearStoredToken: vi.fn(),
  };
});

import { api, clearStoredToken, setStoredToken } from '@/lib/api/apiClient';
import {
  getCurrentUser,
  login,
  logout,
  type AuthUser,
  type LoginResponse,
} from '@/lib/api/auth';

const USER: AuthUser = {
  id: 'u1',
  email: 'teacher@school.vn',
  name: 'Teacher',
  role: 'TEACHER',
};

const LOGIN_RESPONSE: LoginResponse = {
  token: 'jwt-token-xyz',
  user: USER,
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('auth API', () => {
  it('login posts credentials and stores token', async () => {
    vi.mocked(api.post).mockResolvedValue(LOGIN_RESPONSE);

    const result = await login({ email: USER.email, password: 'pwd' });

    expect(api.post).toHaveBeenCalledWith(
      '/api/auth/login',
      { email: USER.email, password: 'pwd' },
      expect.objectContaining({ skipAuth: true }),
    );
    expect(setStoredToken).toHaveBeenCalledWith('jwt-token-xyz');
    expect(result.token).toBe('jwt-token-xyz');
    expect(result.user.id).toBe('u1');
  });

  it('logout calls api and clears token even on success', async () => {
    vi.mocked(api.post).mockResolvedValue(undefined);

    await logout();

    expect(api.post).toHaveBeenCalledWith('/api/auth/logout');
    expect(clearStoredToken).toHaveBeenCalledOnce();
  });

  it('logout clears token even if api.post throws', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('boom'));

    await expect(logout()).rejects.toThrow('boom');
    expect(clearStoredToken).toHaveBeenCalledOnce();
  });

  it('getCurrentUser returns user from envelope', async () => {
    vi.mocked(api.get).mockResolvedValue({ user: USER });

    const result = await getCurrentUser();
    expect(result).toEqual(USER);
  });

  it('getCurrentUser clears token and returns null on failure', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('expired'));

    const result = await getCurrentUser();
    expect(result).toBeNull();
    expect(clearStoredToken).toHaveBeenCalledOnce();
  });
});
