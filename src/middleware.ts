import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from './session'

// Specify protected and public routes
const sessionProtectedRoutes = ['/password-reset']
const noSessionProtectedRoutes = ['/login', '/register', '/forgot-password']
const nonVerifiedSessionProtectedRoutes = ['/verified']

// Function that checks if route ends with any sessionProtectedRoute
function endsWithAny(str: string, endings: string[]): boolean {
  return endings.some((ending) => str.endsWith(ending));
}
 
export default async function middleware(req: NextRequest) {
  // Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isSessionProtectedRoute = endsWithAny(path, sessionProtectedRoutes);
  const isnonVerifiedSessionProtectedRoute = endsWithAny(path, noSessionProtectedRoutes);
  const isNoSessionProtectedRoute = endsWithAny(path, nonVerifiedSessionProtectedRoutes);
 
  // Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value
  console.log('cookie value:', cookie)
  if (cookie){
    const parsed = JSON.parse(cookie);
    const session = await decrypt(parsed);
    // Redirect to /login if the user is not authenticated/verified and tries to access a session protected route
    if (isSessionProtectedRoute && session?.role !== 'subscriber') {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
    // Redirect to index route if the user is authenticated and tries to access a no-session - non-verified protected route
    if ((isNoSessionProtectedRoute && session.username) || (isnonVerifiedSessionProtectedRoute && session.role === 'subscriber')) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }
  else {
    if (isSessionProtectedRoute){
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
} 