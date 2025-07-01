'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { setStorageRecloudIDAccessToken } from '@/shared/services';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Icons } from '@/shared/ui/icons';

export const MarketplaceCallbackPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Extract code and state from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (!code) {
      setStatus('error');
      setErrorMessage('Код авторизации отсутствует в URL');
      return;
    }

    // Exchange the code for a token
    fetch(`${process.env.NEXT_PUBLIC_MARKETPLACE_URL}/api/v1/marketplace/code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        state,
        redirect_uri: `${window.location.origin}/dashboard/marketplace/callback`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка получения токена: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Token received:', data);

        // Store the access token
        setStorageRecloudIDAccessToken(data.access_token);

        setStatus('success');

        // Redirect back to marketplace page after a short delay
        setTimeout(() => {
          // Add a query parameter to indicate successful authentication
          // This will be used by the marketplace page to trigger the onAuthenticated callback
          router.push(`${DASHBOARD_PAGES.MARKETPLACE}?auth=success`);
        }, 1500);
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Произошла ошибка при получении токена');
      });
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      {status === 'loading' && (
        <Card className="w-full max-w-md mx-auto animate-fadeIn py-10 rounded-3xl">
          <CardHeader className="text-center pb-0">
            <div className="flex justify-center mb-6">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20">
                <Icons.spinner className="h-10 w-10 text-primary animate-spin" />
              </div>
            </div>
            <CardTitle className="text-2xl animate-slideUp">Авторизация</CardTitle>
            <div className="h-1 w-16 bg-primary/50 mx-auto my-4 rounded-full"></div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground animate-slideUp">Получение токена авторизации...</p>
          </CardContent>
          <CardFooter className="flex justify-center pt-2">
            <div className="w-16 h-1">
              <div className="h-full bg-primary animate-pulse"></div>
            </div>
          </CardFooter>
        </Card>
      )}

      {status === 'success' && (
        <Card className="w-full max-w-md mx-auto animate-fadeIn py-10 rounded-3xl">
          <CardHeader className="text-center pb-0">
            <div className="flex justify-center mb-6">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 dark:bg-green-500/20 animate-scaleIn">
                <svg
                  className="w-10 h-10 text-green-500 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl animate-slideUp">Авторизация успешна</CardTitle>
            <div className="h-1 w-16 bg-green-500/50 dark:bg-green-400/50 mx-auto my-4 rounded-full"></div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground animate-slideUp">
              Перенаправление на страницу маркетплейса...
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-2">
            <div className="w-16 h-1 overflow-hidden">
              <div className="h-full bg-green-500 dark:bg-green-400 animate-loading-bar"></div>
            </div>
          </CardFooter>
        </Card>
      )}

      {status === 'error' && (
        <Card className="w-full max-w-md mx-auto animate-fadeIn">
          <CardHeader className="text-center pb-0">
            <div className="flex justify-center mb-6">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 dark:bg-destructive/20 animate-scaleIn">
                <svg
                  className="w-10 h-10 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl animate-slideUp">Ошибка авторизации</CardTitle>
            <div className="h-1 w-16 bg-destructive/50 mx-auto my-4 rounded-full"></div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-destructive animate-slideUp">
              {errorMessage || 'Произошла неизвестная ошибка'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <button
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors animate-slideUp"
              onClick={() => router.push(DASHBOARD_PAGES.MARKETPLACE)}
            >
              Вернуться на страницу маркетплейса
            </button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
