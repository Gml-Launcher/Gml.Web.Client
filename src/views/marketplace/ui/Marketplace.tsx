'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { modules } from '../data';
import {
  AuthenticationState,
  LoadingState,
  MarketplaceContent,
  UnauthorizedState,
  UnavailableState,
} from '../components';

import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { getStorageRecloudIDAccessToken, removeStorageRecloudIDAccessToken } from '@/shared/services';

export const MarketplacePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [marketplaceStatus, setMarketplaceStatus] = useState<
    'loading' | 'available' | 'unauthorized' | 'unavailable'
  >('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const statusCheckedRef = useRef(false);

  // Function to check marketplace status with retry capability
  const checkMarketplaceStatus = useCallback(
    async (retryCount = 0, maxRetries = 2, forceCheck = false) => {
      console.log('Starting marketplace status check...');
      if (!isAuthenticated) {
        console.log('User is not authenticated');
        return;
      }

      // Skip if we've already checked the status and not forcing a check
      if (statusCheckedRef.current && !forceCheck) {
        console.log('Status already checked, skipping');
        return;
      }

      setMarketplaceStatus('loading');
      setErrorMessage(null);
      console.log('Set marketplace status to loading');

      try {
        // Create an AbortController to timeout the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        console.log('Created AbortController with 5s timeout');

        console.log(
          `Using token: ${getStorageRecloudIDAccessToken() ? 'Token exists' : 'No token'}`,
        );

        // Add a fallback mechanism - if the HTTPS request fails, try HTTP
        let response;
        try {
          console.log('Attempting primary fetch request');
          response = await fetch(
            `${process.env.NEXT_PUBLIC_MARKETPLACE_URL}/api/v1/marketplace/status`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${getStorageRecloudIDAccessToken()}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              credentials: 'same-origin',
              signal: controller.signal,
            },
          );
          console.log('Primary fetch request completed');
        } catch (fetchError: unknown) {
          console.log(
            `Primary fetch failed: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}, trying fallback`,
          );

          // Try fallback to HTTP if HTTPS fails (only if using localhost)
          if (process.env.NEXT_PUBLIC_MARKETPLACE_URL?.includes('localhost')) {
            try {
              console.log('Attempting fallback HTTP request');
              const fallbackUrl = process.env.NEXT_PUBLIC_MARKETPLACE_URL.replace(
                'https://',
                'http://',
              );
              console.log(`Fallback URL: ${fallbackUrl}/api/v1/marketplace/status`);

              response = await fetch(`${fallbackUrl}/api/v1/marketplace/status`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${getStorageRecloudIDAccessToken()}`,
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
                credentials: 'same-origin',
                signal: controller.signal,
              });
              console.log('Fallback fetch request completed');
            } catch (fallbackError: unknown) {
              console.log(
                `Fallback fetch also failed: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`,
              );
              throw fallbackError; // Re-throw to be caught by the outer catch
            }
          } else {
            // If not using localhost or fallback fails, throw the original error
            throw fetchError;
          }
        }

        clearTimeout(timeoutId); // Clear the timeout if the request completes

        // Check if the response is successful
        if (!response.ok) {
          console.log(`Response not OK: ${response.status} ${response.statusText}`);

          // Handle 401 Unauthorized specifically
          if (response.status === 401) {
            console.log('Received 401 Unauthorized, setting status to unauthorized');
            setMarketplaceStatus('unauthorized');
            statusCheckedRef.current = true;
            return;
          }

          throw new Error(`Server responded with status: ${response.status}`);
        }

        console.log('Received successful response with status:', response.status);
        console.log('Setting marketplaceStatus to available');
        setMarketplaceStatus('available');
        statusCheckedRef.current = true;
        console.log('Current marketplaceStatus after update:', 'available');
      } catch (error: unknown) {
        console.log(
          `Caught error during fetch: ${error instanceof Error ? `${error.name} - ${error.message}` : String(error)}`,
        );

        // If we haven't reached max retries, try again after a delay
        if (retryCount < maxRetries) {
          console.log(
            `Marketplace status check failed with error: ${error instanceof Error ? error.message : String(error)}. Retrying (${retryCount + 1}/${maxRetries})...`,
          );
          setTimeout(() => checkMarketplaceStatus(retryCount + 1, maxRetries), 1000); // Retry after 1 second
          return;
        }

        console.log('All retries exhausted after error, setting status to unavailable');
        setMarketplaceStatus('unavailable');

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.log('Request timed out (AbortError)');
            setErrorMessage('Запрос превысил время ожидания. Сервер маркетплейса не отвечает.');
          } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            console.log('Network error (Failed to fetch)');
            setErrorMessage(
              'Не удалось подключиться к серверу маркетплейса. Возможно, проблема с сетевым подключением или сертификатом HTTPS.',
            );
          } else if (error.name === 'SyntaxError') {
            console.log('Invalid response format (SyntaxError)');
            setErrorMessage('Получен некорректный ответ от сервера маркетплейса.');
          } else {
            console.error('Marketplace status check error:', error);
            setErrorMessage(error.message);
          }
        } else {
          console.error('Marketplace status check error:', error);
          setErrorMessage('Неизвестная ошибка');
        }
      }
    },
    [isAuthenticated, setMarketplaceStatus, setErrorMessage],
  );

  // Handle successful authentication
  const handleAuthenticated = useCallback(() => {
    console.log('handleAuthenticated called - user successfully authenticated');
    setIsAuthenticated(true);
    console.log('isAuthenticated set to true, calling checkMarketplaceStatus');
    // Reset the status check flag when authenticating
    statusCheckedRef.current = false;
    checkMarketplaceStatus(0, 2, true);

    // Safety timeout for authentication flow as well
    setTimeout(() => {
      console.log('Authentication safety timeout triggered');
      setMarketplaceStatus((currentStatus) => {
        if (currentStatus === 'loading') {
          console.log('Still in loading state after authentication, setting to unavailable');
          setErrorMessage(
            'Превышено время ожидания ответа от сервера маркетплейса после авторизации.',
          );
          return 'unavailable';
        }
        return currentStatus;
      });
    }, 10000);
  }, [checkMarketplaceStatus, setErrorMessage, setMarketplaceStatus]);

  // Check for auth=success in URL (runs only once on mount)
  useEffect(() => {
    console.log('Checking for auth=success in URL');
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const authSuccess = urlParams.get('auth') === 'success';

      if (authSuccess) {
        // Clear the auth parameter from the URL
        window.history.replaceState({}, document.title, window.location.pathname);

        const accessToken = getStorageRecloudIDAccessToken();
        if (accessToken) {
          console.log('Returning from successful authentication with valid token');
          // Reset the status check flag for fresh authentication
          statusCheckedRef.current = false;
          handleAuthenticated();
        }
      }
    }
  }, []); // Empty dependency array to run only once on mount

  // Check if user is authenticated (runs on mount and when handleAuthenticated changes)
  useEffect(() => {
    console.log('Authentication check useEffect running');
    const accessToken = getStorageRecloudIDAccessToken();
    console.log(`RecloudID token exists: ${!!accessToken}`);
    const isAuth = !!accessToken;
    setIsAuthenticated(isAuth);

    if (isAuth && !statusCheckedRef.current) {
      console.log(
        'User is authenticated and status not checked yet, calling checkMarketplaceStatus',
      );
      checkMarketplaceStatus();

      // Safety timeout - if we're still in loading state after 10 seconds, show unavailable
      const safetyTimeoutId = setTimeout(() => {
        console.log('Safety timeout triggered');
        setMarketplaceStatus((currentStatus) => {
          if (currentStatus === 'loading') {
            console.log('Still in loading state after timeout, setting to unavailable');
            setErrorMessage('Превышено время ожидания ответа от сервера маркетплейса.');
            return 'unavailable';
          }
          return currentStatus;
        });
      }, 10000);

      // Clean up the safety timeout if component unmounts
      return () => clearTimeout(safetyTimeoutId);
    } else {
      console.log('User is not authenticated or status already checked');
    }
  }, [handleAuthenticated, checkMarketplaceStatus, setMarketplaceStatus, setErrorMessage]); // Include all necessary dependencies

  const handleLogout = useCallback(() => {
    console.log('Logging out from marketplace');
    removeStorageRecloudIDAccessToken();
    setIsAuthenticated(false);
    statusCheckedRef.current = false;
    // Refresh the page to reset the state
    window.location.reload();
  }, []);

  return (
    <>
      <Breadcrumbs
        current={'Маркетплейс'}
        breadcrumbs={[{ value: 'Главная', path: DASHBOARD_PAGES.HOME }]}
      />

      {!isAuthenticated ? (
        <AuthenticationState onAuthenticated={handleAuthenticated} />
      ) : marketplaceStatus === 'loading' ? (
        <LoadingState />
      ) : marketplaceStatus === 'unauthorized' ? (
        <UnauthorizedState onAuthenticated={handleAuthenticated} />
      ) : marketplaceStatus === 'unavailable' ? (
        <UnavailableState errorMessage={errorMessage} onRetry={checkMarketplaceStatus} />
      ) : (
        <MarketplaceContent modules={modules} onLogout={handleLogout} />
      )}
    </>
  );
};
