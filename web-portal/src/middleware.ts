import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/admin', '/teacher', '/student'];

// Public routes that should redirect to dashboard if authenticated
const AUTH_ROUTES = ['/login', '/register'];

// Route to redirect to after logout
const LOGIN_ROUTE = '/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Clone the response
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Add CORS headers for API routes
  const allowedOrigins = ['http://localhost:3000', 'https://verveai.io'];
  const origin = request.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
  }

  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  // Get auth token from cookie
  const authToken = request.cookies.get('verveai-auth-token')?.value;
  
  if (isProtectedRoute && !authToken) {
    // Not authenticated - redirect to login immediately
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and trying to access login/register, redirect to dashboard
  if (authToken && AUTH_ROUTES.some(route => pathname === route)) {
    // Get user role from cookie to determine redirect destination
    const userRole = request.cookies.get('verveai-user-role')?.value;
    let redirectPath = '/';
    
    switch (userRole) {
      case 'ADMIN':
        redirectPath = '/admin';
        break;
      case 'TEACHER':
        redirectPath = '/teacher';
        break;
      case 'STUDENT':
        redirectPath = '/student';
        break;
      case 'SUPERVISOR':
        redirectPath = '/admin';
        break;
      case 'PARENT':
        redirectPath = '/student';
        break;
      default:
        redirectPath = '/';
    }
    
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login page (don't redirect if on login)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
