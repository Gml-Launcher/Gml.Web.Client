'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { setStorageRecloudIDAccessToken } from '@/shared/services';
import { DASHBOARD_PAGES } from '@/shared/routes';

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
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-4 text-lg">Получение токена авторизации...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              className="w-8 h-8 text-green-500"
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
          <h2 className="text-2xl font-bold mb-2">Авторизация успешна</h2>
          <p className="text-gray-600">Перенаправление на страницу маркетплейса...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg
              className="w-8 h-8 text-red-500"
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
          <h2 className="text-2xl font-bold mb-2">Ошибка авторизации</h2>
          <p className="text-red-600">{errorMessage || 'Произошла неизвестная ошибка'}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => router.push(DASHBOARD_PAGES.MARKETPLACE)}
          >
            Вернуться на страницу маркетплейса
          </button>
        </div>
      )}
    </div>
  );
};
