'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui/button';

interface AuthenticationRecloudIDProps {
  onAuthenticated?: () => void;
}

export function AuthenticationRecloudID({ onAuthenticated }: AuthenticationRecloudIDProps) {
  const router = useRouter();

  // We no longer handle the callback here as it's now handled by the MarketplaceCallbackPage component
  useEffect(() => {
    // This component now only handles the initial authentication redirect
    // The callback is processed by the dedicated callback page
  }, []);

  const handleLogin = () => {
    // Redirect to RecloudID OAuth authorization endpoint
    const redirectUri = `${window.location.origin}/dashboard/marketplace/callback`;
    const authUrl = `https://oauth.recloud.tech/connect/authorize?response_type=code&client_id=GmlMarket&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email profile roles phone offline_access&state=42e4885a3fff07222f79e85d40a65293d9390a6c1bf078b4`;
    window.location.href = authUrl;
  };

  return (
    <div className="border bg-card text-card-foreground shadow flex justify-center bg-linear-to-b from-secondary-500 to-white text-center items-center flex-col gap-10 mx-3 p-5 md:p-20 rounded-3xl">
      <img
        src="data:image/svg+xml,%3csvg%20width='64'%20height='65'%20viewBox='0%200%2064%2065'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M36.5278%204.14974C33.726%202.53212%2030.274%202.53212%2027.4722%204.14974L9.66769%2014.4292C6.86588%2016.0468%205.13989%2019.0363%205.13989%2022.2716V29.5843C8.72325%2026.9869%2013.1421%2025.4674%2017.8806%2025.4674C26.9721%2025.4674%2034.9223%2031.0828%2038.0016%2039.1746C44.0542%2041.4255%2048.632%2046.8103%2049.5049%2053.46L54.3323%2050.6728C57.1341%2049.0552%2058.8601%2046.0657%2058.8601%2042.8304V22.2716C58.8601%2019.0363%2057.1341%2016.0468%2054.3323%2014.4292L36.5278%204.14974ZM41.715%2057.9574C41.8744%2057.2558%2041.9584%2056.5266%2041.9584%2055.7784C41.9583%2050.2375%2037.3558%2045.7343%2031.6647%2045.7343H31.6351C31.1796%2038.7172%2025.1928%2033.1646%2017.8806%2033.1646C12.1338%2033.1646%207.21019%2036.5918%205.13989%2041.4606V42.8305C5.13989%2046.0657%206.86588%2049.0552%209.66769%2050.6728L27.4722%2060.9523C30.274%2062.5699%2033.726%2062.5699%2036.5278%2060.9523L41.715%2057.9574Z'%20fill='%233079FF'/%3e%3c/svg%3e"
        alt="logo"
        className="w-16"
      />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-headline-500 text-headline-500">
          Добро пожаловать!
        </h1>
        <p className="text-sm text-muted-foreground">Войдите в свой аккаунт, чтобы продолжить</p>
      </div>
      <Button
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        onClick={handleLogin}
      >
        <img
          src="data:image/svg+xml,%3csvg%20width='64'%20height='64'%20viewBox='0%200%2064%2064'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='38.9032'%20cy='36.6216'%20r='19.7152'%20transform='rotate(-10.7156%2038.9032%2036.6216)'%20fill='%232F50C5'/%3e%3ccircle%20cx='23.5956'%20cy='22.5956'%20r='17.6257'%20transform='rotate(-10.7156%2023.5956%2022.5956)'%20fill='%235177FF'/%3e%3c/svg%3e"
          alt="recloud-tech-logo"
          className="w-6 h-6"
        />
        Войти через Recloud ID
      </Button>
    </div>
  );
}
