import { NextRequest, NextResponse } from 'next/server';

import { AUTH_PAGES, DASHBOARD_PAGES } from '@/shared/routes';
import { isTokenExpired } from '@/shared/lib/utils';

const protectedRoutes = [
  DASHBOARD_PAGES.HOME,
  DASHBOARD_PAGES.ACCOUNT,
  DASHBOARD_PAGES.SETTINGS,
  DASHBOARD_PAGES.SERVERS,
  DASHBOARD_PAGES.INTEGRATIONS,
  DASHBOARD_PAGES.PROFILES,
  DASHBOARD_PAGES.PROFILE,
];
const publicRoutes = ['/', AUTH_PAGES.HOME, AUTH_PAGES.SIGN_IN, AUTH_PAGES.SIGN_UP];

export async function middleware(request: NextRequest) {
  const {
    cookies,
    nextUrl: { pathname },
  } = request;

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  const accessToken = cookies.get('accessToken');

  if (isProtectedRoute && isTokenExpired(accessToken?.value)) {
    cookies.delete('accessToken');
    return NextResponse.redirect(new URL(AUTH_PAGES.SIGN_IN, request.nextUrl));
  }

  if (
    isPublicRoute &&
    !isTokenExpired(accessToken?.value) &&
    !pathname.startsWith(DASHBOARD_PAGES.HOME)
  ) {
    return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
