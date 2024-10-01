import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export { default } from "next-auth/middleware"

import { getToken } from 'next-auth/jwt'


export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl;
    
    if( token && 
      (
        
        url.pathname.startsWith('sign-in') || 
        url.pathname.startsWith('sign-up') || 
        url.pathname.startsWith('verify-email') 
        
    )
     ){
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if(!token && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/add-website') )){
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/onboarding/sign-in',
    '/onboarding/sign-up',
    '/onboarding/verify-email',
    '/',
    
  ]
}