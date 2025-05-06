import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export { default } from "next-auth/middleware"

import { getToken } from 'next-auth/jwt'


export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl;

  const alreadyLoggedIn = ['/onboarding', '/sign-up', '/verify-email', '/sign-in'];

  const notLoggedIn = ['/dashboard', '/add-website', '/incidents', '/settings', '/monitor'];

  if (token && alreadyLoggedIn.some(path => url.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!token && notLoggedIn.some(path => url.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/onboarding/sign-in', request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/onboarding/sign-in',
    '/onboarding/sign-up',
    '/onboarding/verify-email',
    '/dashboard',
    '/monitor/:path*',
    '/onboarding',
    '/verify-email',
    '/incidents',
    '/settings',
  ]
}