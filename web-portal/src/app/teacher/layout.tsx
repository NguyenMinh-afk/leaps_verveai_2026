'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { LoadingState } from '@/components/layout/dashboard-layout'

/**
 * Teacher Layout - Protects all teacher routes
 * 
 * This layout wraps all teacher routes and ensures:
 * 1. User is authenticated
 * 2. User has TEACHER, ADMIN, or SUPERVISOR role
 * 
 * If not authenticated, redirects to /login immediately
 */
export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { status, isAuthenticated, user } = useAuth()
  const [isRedirecting, setIsRedirecting] = React.useState(false)

  React.useEffect(() => {
    // Still loading auth state - wait
    if (status === 'loading') {
      return
    }

    // Not authenticated - redirect to login immediately
    if (!isAuthenticated) {
      setIsRedirecting(true)
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`
      router.replace(loginUrl)
      return
    }

    // Check role - TEACHER, ADMIN, and SUPERVISOR can access teacher routes
    if (user) {
      const userRole = user.role?.toUpperCase()
      if (userRole !== 'TEACHER' && userRole !== 'ADMIN' && userRole !== 'SUPERVISOR') {
        setIsRedirecting(true)
        // Redirect to appropriate dashboard based on role
        let redirectPath = '/'
        switch (userRole) {
          case 'STUDENT':
            redirectPath = '/student'
            break
          case 'PARENT':
            redirectPath = '/student'
            break
          default:
            redirectPath = '/'
        }
        router.replace(redirectPath)
      }
    }
  }, [status, isAuthenticated, user, router, pathname])

  // Show loading while redirecting or checking auth
  if (isRedirecting || status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <LoadingState />
      </div>
    )
  }

  // Authenticated and authorized - render children
  if (isAuthenticated && (user?.role === 'TEACHER' || user?.role === 'ADMIN' || user?.role === 'SUPERVISOR')) {
    return <>{children}</>
  }

  // Fallback - should not reach here due to redirect
  return null
}
