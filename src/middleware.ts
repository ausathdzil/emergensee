import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/sign-in', '/sign-up', '/'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && session && !path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
  runtime: 'nodejs',
};
