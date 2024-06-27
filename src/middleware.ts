import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt, encrypt } from './session'

// Specify protected and public routes
const sessionProtectedRoutes = ['/password-reset', '/sell', '/my-products']
const noSessionProtectedRoutes = ['/login', '/register', '/forgot-password']
const nonVerifiedSessionProtectedRoutes = ['/verified']

// Function that checks if route ends with any sessionProtectedRoute
function endsWithAny(str: string, endings: string[]): string | null {
  for (const ending of endings) {
    if (str.endsWith(ending)) {
      return ending;
    }
  }
  return null;
}

// Updates user's session on next request
export async function updateSession(session: any) {
  // Refresh the session so it doesn't expire
  session.expires = new Date(Date.now() + 60 * 5 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(session),
    httpOnly: true,
    expires: session.expires,
  });
  return res;
}

export default async function middleware(req: NextRequest) {
  // Check if the current route is protected or public
  const path = req.nextUrl.pathname
  let isSessionProtectedRoute = endsWithAny(path, sessionProtectedRoutes);
  let isnonVerifiedSessionProtectedRoute = endsWithAny(path, noSessionProtectedRoutes);
  let isNoSessionProtectedRoute = endsWithAny(path, nonVerifiedSessionProtectedRoutes);
 
  // Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value
  if (cookie){
    // Gets rid of the double quotes of the cookie.value and decrypts the session payload
    const session = await decrypt(cookie);
    let isVerifiedUser = (session?.role === 'subscriber') || (session?.role === 'author')
    // Redirect to /login if the user is not authenticated/verified and tries to access a session protected route
    if (isSessionProtectedRoute && !(isVerifiedUser)) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
    // Redirect to index route if the user is authenticated and tries to access a no-session - non-verified protected route
    if ((isNoSessionProtectedRoute && session.username) || (isnonVerifiedSessionProtectedRoute && isVerifiedUser)) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    // Redirect to your account's endpath if you try to access another account's endpath
    if(isSessionProtectedRoute && (path !== `/${session.username}${isSessionProtectedRoute}`)){
      return NextResponse.redirect(new URL(`/${session.username}${isSessionProtectedRoute}`, req.nextUrl));
    }
    const updatedSession = await updateSession(session)
    
    return updatedSession
  }
  else {
    if (isSessionProtectedRoute){
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
} 