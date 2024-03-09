import { NextRequest, NextResponse } from 'next/server';

import { AUTH_PAGES, DASHBOARD_PAGES } from '@/shared/routes';

export async function middleware(request: NextRequest, response: NextResponse) {
  const { url, cookies } = request;

  const accessToken = cookies.get('accessToken');

  const isAuthPage = url.includes(AUTH_PAGES.HOME);

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, url));
  }

  if (isAuthPage) {
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL(AUTH_PAGES.SIGN_IN, url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
