import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Define public paths
  const isPublicPath = path === '/login';

  // 2. Get the token from the cookie
  const token = request.cookies.get('session')?.value;

  // 3. Verify the token
  const verifiedToken = token ? await verifyToken(token) : null;

  // 4. Redirect Logic
  
  // If user is on a protected path and not authenticated, redirect to login
  if (!isPublicPath && !verifiedToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is on login page and IS authenticated, redirect to home
  if (isPublicPath && verifiedToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Continue for other cases
  return NextResponse.next();
}

// Config: Match all paths except static files, images, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (if any needed, e.g. /images)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
