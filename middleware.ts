import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl;

  const authPages = ['/onboarding', '/sign-up', '/sign-in'];
  const verificationPages = ['/verify-email', '/onboarding/verify-email'];
  const protectedPages = ['/dashboard', '/add-website', '/incidents', '/settings', '/monitor'];

  // Check if we need to pass email to verification page
  const redirectToVerification = (email: string) => {
    return NextResponse.redirect(
      new URL(`/onboarding/verify-email?email=${encodeURIComponent(email)}`, request.url)
    );
  };

  // If token exists and is valid
  if (token) {
    // For verified users
    if (token.isVerified === true) {
      if ([...authPages, ...verificationPages].some(path => url.pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    else {
      const email = token.email as string;
      if (verificationPages.some(path => url.pathname.startsWith(path))) {
        return NextResponse.next();
      }
      if (protectedPages.some(path => url.pathname.startsWith(path))) {
        return redirectToVerification(email);
      }

      if (url.pathname === '/onboarding/sign-in') {
        return NextResponse.next();
      }

      if (authPages.some(path => url.pathname.startsWith(path))) {
        return redirectToVerification(email);
      }
    }
  }

  // No token, so protect private routes
  if (!token && protectedPages.some(path => url.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/onboarding/sign-in', request.url));
  }

  return NextResponse.next();
}

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