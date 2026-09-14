'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
  /** Expected roles. If empty, any authenticated user is allowed */
  allowedRoles?: string[]
  /** Optional fallback component while checking auth */
  fallback?: React.ReactNode
}

/**
 * AuthGuard - Protects routes by checking authentication
 * 
 * Redirects to /login immediately when:
 * - User is not authenticated
 * - User's role doesn't match allowedRoles
 */
export function AuthGuard({ children, allowedRoles, fallback }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { status, isAuthenticated, user } = useAuth()
  const [isRedirecting, setIsRedirecting] = React.useState(false)

  React.useEffect(() => {
    // If still loading, wait
    if (status === 'loading') {
      return
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      setIsRedirecting(true)
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`
      router.replace(loginUrl)
      return
    }

    // Check role-based access if roles are specified
    if (allowedRoles && allowedRoles.length > 0 && user) {
      const userRole = user.role?.toUpperCase()
      const normalizedRoles = allowedRoles.map(r => r.toUpperCase())
      
      // Admin role can access everything
      if (!normalizedRoles.includes('ADMIN') && !normalizedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        setIsRedirecting(true)
        let redirectPath = '/'
        
        switch (userRole) {
          case 'ADMIN':
            redirectPath = '/admin'
            break
          case 'TEACHER':
            redirectPath = '/teacher'
            break
          case 'STUDENT':
            redirectPath = '/student'
            break
          case 'SUPERVISOR':
            redirectPath = '/admin'
            break
          case 'PARENT':
            redirectPath = '/student'
            break
          default:
            redirectPath = '/'
        }
        
        router.replace(redirectPath)
        return
      }
    }
  }, [status, isAuthenticated, user, allowedRoles, router, pathname])

  // Show loading while redirecting
  if (isRedirecting || status === 'loading') {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="h-10 w-10 animate-spin text-verve-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm text-slate-500 dark:text-slate-400">Đang chuyển hướng...</p>
          </div>
        </div>
      )
    )
  }

  // Authenticated and authorized - render children
  if (isAuthenticated) {
    // Check role access one more time
    if (allowedRoles && allowedRoles.length > 0 && user) {
      const userRole = user.role?.toUpperCase()
      const normalizedRoles = allowedRoles.map(r => r.toUpperCase())
      
      if (!normalizedRoles.includes('ADMIN') && !normalizedRoles.includes(userRole)) {
        return null
      }
    }
    
    return <>{children}</>
  }

  return null
}

/**
 * Role-based guard for specific routes
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['ADMIN', 'SUPERVISOR']}>
      {children}
    </AuthGuard>
  )
}

export function TeacherGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['TEACHER', 'ADMIN', 'SUPERVISOR']}>
      {children}
    </AuthGuard>
  )
}

export function StudentGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['STUDENT', 'PARENT', 'ADMIN', 'SUPERVISOR']}>
      {children}
    </AuthGuard>
  )
}
