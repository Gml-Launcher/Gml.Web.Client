"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/shared/services";
import { DASHBOARD_PAGES } from "@/shared/routes";

/**
 * On the auth page, if a refresh token (HttpOnly cookie) exists and the access token is
 * missing/expired, try to refresh immediately so the user is auto-signed in.
 * If refresh fails, we silently keep the user on the sign-in page.
 */
export function AutoRefreshOnAuthPage() {
  const router = useRouter();
  const tried = useRef(false);

  useEffect(() => {
    if (tried.current) return;
    tried.current = true;

    // Fire-and-forget; errors are ignored to avoid disrupting manual sign-in
    authService
      .refresh()
      .then(() => {
        router.replace(DASHBOARD_PAGES.HOME);
      })
      .catch(() => {
        // stay on sign-in
      });
  }, [router]);

  return null;
}
