'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { LoadingState } from '@/components/layout/dashboard-layout'

/**
 * Student Layout - Protects all student routes
 * 
 * This layout wraps all student routes and ensures:
 * 1. User is authenticated
 * 2. User has STUDENT, PARENT, ADMIN, or SUPERVISOR role
 * 
 * If not authenticated, redirects to /login immediately
 */
export default function StudentLayout({
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

    // Check role - STUDENT, PARENT, ADMIN, and SUPERVISOR can access student routes
    if (user) {
      const userRole = user.role?.toUpperCase()
      const allowedRoles = ['STUDENT', 'PARENT', 'ADMIN', 'SUPERVISOR']
      
      if (!allowedRoles.includes(userRole)) {
        setIsRedirecting(true)
        // Redirect to appropriate dashboard based on role
        let redirectPath = '/'
        switch (userRole) {
          case 'TEACHER':
            redirectPath = '/teacher'
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
  if (isAuthenticated && user) {
    const userRole = user.role?.toUpperCase()
    const allowedRoles = ['STUDENT', 'PARENT', 'ADMIN', 'SUPERVISOR']
    
    if (allowedRoles.includes(userRole || '')) {
      return <>{children}</>
    }
  }

  // Fallback - should not reach here due to redirect
  return null
}
