/**
 * VERVEAI — Client-side providers wrapper.
 *
 * The root `app/layout.tsx` is a server component, so we mount all
 * `'use client'` providers (Auth, future Theme, etc.) here. The whole
 * tree is rendered as a single client subtree.
 */

'use client';

import type { ReactNode } from 'react';

import { AuthProvider } from '@/lib/auth/AuthContext';

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
