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
const publicRoutes = ['/', AUTH_PAGES.HOME, AUTH_PAGES.SIGN_IN];

async function attemptRefresh(request: NextRequest): Promise<string | null> {
  try {
    // Call backend refresh using existing HttpOnly cookies
    const refreshUrl = new URL('/api/v1/users/refresh', request.url);
    const res = await fetch(refreshUrl, {
      method: 'GET',
      headers: { cookie: request.headers.get('cookie') ?? '' },
    });
    if (!res.ok) return null;
    const json: any = await res.json();
    const token = json?.data?.accessToken ?? json?.accessToken;
    return typeof token === 'string' && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}

function safeIsExpired(token?: string | null): boolean {
  try {
    return isTokenExpired(token || undefined);
  } catch {
    // If token is malformed treat as expired
    return true;
  }
}

export async function middleware(request: NextRequest) {
  const {
    cookies,
    nextUrl: { pathname },
  } = request;

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  const accessToken = cookies.get('accessToken')?.value;
  const hasRefresh = Boolean(cookies.get('refreshToken'));

  // 1) Protected routes: try server-side refresh before redirecting to sign-in
  if (isProtectedRoute && safeIsExpired(accessToken)) {
    const newToken = hasRefresh ? await attemptRefresh(request) : null;
    if (newToken) {
      const response = NextResponse.next();
      response.cookies.set('accessToken', newToken, { path: '/', sameSite: 'lax' });
      return response;
    }

    // No refresh possible → clean and redirect to sign-in
    const redirect = NextResponse.redirect(new URL(AUTH_PAGES.SIGN_IN, request.nextUrl));
    redirect.cookies.delete('accessToken');
    return redirect;
  }

  // 2) Public routes (auth pages): if we can refresh, redirect into app
  if (isPublicRoute && safeIsExpired(accessToken)) {
    const newToken = hasRefresh ? await attemptRefresh(request) : null;
    if (newToken) {
      const redirect = NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, request.nextUrl));
      redirect.cookies.set('accessToken', newToken, { path: '/', sameSite: 'lax' });
      return redirect;
    }
  }

  // 3) If already authenticated, keep users away from auth pages
  if (isPublicRoute && !safeIsExpired(accessToken) && !pathname.startsWith(DASHBOARD_PAGES.HOME)) {
    return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
