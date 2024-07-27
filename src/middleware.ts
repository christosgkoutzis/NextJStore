import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt, encrypt } from './session'
import { endsWithAny } from './lib/utils'

// Specify protected and public routes
const sellerProtectedRoutes = ['/sell', '/my-products']
// The spread operator includes sellerProtectedRoutes array values to sessionProtectedRoutes
const sessionProtectedRoutes = ['/password-reset', '/thank-you', ...sellerProtectedRoutes]
const noSessionProtectedRoutes = ['/login', '/register', '/forgot-password']
const nonVerifiedSessionProtectedRoutes = ['/verified']
const sellerCandidateProtectedRoutes = ['/become-a-seller']

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
  let isnonVerifiedSessionProtectedRoute = endsWithAny(path, nonVerifiedSessionProtectedRoutes);
  let isNoSessionProtectedRoute = endsWithAny(path, noSessionProtectedRoutes);
  let isSellerProtectedRoute = endsWithAny(path, sellerProtectedRoutes);
  let isSellerCandidateProtectedRoute = endsWithAny(path, sellerCandidateProtectedRoutes);


 
  // Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value
  if (cookie){
    // Gets rid of the double quotes of the cookie.value and decrypts the session payload
    const session = await decrypt(cookie);
    let isNonVerifiedUser = (session?.role === 'unauthorized_user');
    let isSeller = (session?.role === 'author');
    let isSellerCandidate = (session?.role === 'subscriber');
    let isVerifiedUser = (session?.role === 'subscriber') || (isSeller);
    let isUser = (isVerifiedUser) || (isNonVerifiedUser);
    // Redirect to /login if the user is not registered and tries to access a session protected route
    if (isSessionProtectedRoute && !(isUser)) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
    // Redirect to index route if the user is authenticated and tries to access a no-session / non-verified protected route or a non seller(/candidate) tries to access seller(/candidate) routes
    if ((isNoSessionProtectedRoute && isUser) || (isnonVerifiedSessionProtectedRoute && isVerifiedUser) || (isSellerProtectedRoute && !isSeller) || (isSellerCandidateProtectedRoute && !isSellerCandidate)) {
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