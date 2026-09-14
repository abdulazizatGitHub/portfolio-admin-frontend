import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken');

  // Define protected and public routes
  const isProtectedRoute = pathname.startsWith('/admin');
  const isPublicAuthRoute = pathname === '/login';

  // 1. If trying to access a protected route without a token
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    // Optional: add a redirect parameter to return after login
    // loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If trying to access login page while already authenticated
  if (isPublicAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
