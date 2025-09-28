'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { config } from '@/core/configs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import logo from '@/assets/logos/logo.svg';

export default function MntSetupPage() {
  const router = useRouter();
  const [backendUrl, setBackendUrl] = useState(
    typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : '',
  );
  const [projectName, setProjectName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);

  async function onSave() {
    if (!backendUrl) return;
    if (adminPassword !== confirmPassword) {
      const { toast } = await import('sonner');
      toast.error('Пароль и подтверждение не совпадают');
      return;
    }
    const base = backendUrl.replace(/\/$/, '');
    const url = `${base}/settings/install`;
    const body = {
      ProjectName: projectName,
      BackendAddress: backendUrl,
      AdminUsername: adminUsername,
      AdminEmail: adminEmail,
      AdminPassword: adminPassword,
      ConfirmPassword: confirmPassword,
    };
    try {
      setSubmitting(true);
      setFetchFailed(false);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      if (!res.ok) {
        // Try to parse JSON error and build a readable message
        let readable = `Request failed with status ${res.status}`;
        const contentType = res.headers.get('content-type') || '';
        try {
          if (contentType.includes('application/json')) {
            const data: any = await res.json();
            const base = (typeof data?.message === 'string' && data.message) || '';
            const details = Array.isArray(data?.errors)
              ? data.errors.filter((x: any) => typeof x === 'string')
              : [];
            if (base || details.length) {
              readable = [base, details.join('\n')].filter(Boolean).join('\n');
            }
          } else {
            const text = await res.text();
            // Some backends return JSON string as text; try to parse
            try {
              const data: any = JSON.parse(text);
              const base = (typeof data?.message === 'string' && data.message) || '';
              const details = Array.isArray(data?.errors)
                ? data.errors.filter((x: any) => typeof x === 'string')
                : [];
              readable = [base, details.join('\n')].filter(Boolean).join('\n') || text || readable;
            } catch {
              readable = text || readable;
            }
          }
        } catch {
          // ignore parsing errors and use default readable
        }
        throw new Error(readable);
      }
      // Success: backend returns accessToken similar to signup. Save user like signup flow
      try {
        const json = await res.json();
        const accessToken: string | undefined = json?.data?.accessToken;
        if (accessToken) {
          // Dynamically import to avoid SSR issues
          const { setStorageAccessToken, setStorageProfile } = await import('@/shared/services');
          setStorageAccessToken(accessToken);
          const payloadRaw = accessToken.split('.')[1];
          const payload = atob(payloadRaw);
          const profile = JSON.parse(payload);
          setStorageProfile(profile);
        }
      } catch {
        // ignore if response body is empty or malformed; navigation will still proceed
      }
      router.push('/dashboard');
    } catch (e: any) {
      const message: string = e?.message || '';
      if (message.toLowerCase().includes('failed to fetch')) {
        setFetchFailed(true);
      }
      // Fallback alert; project also has sonner Toaster globally mounted
      const msg = message || 'Не удалось выполнить установку';
      const { toast } = await import('sonner');
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // Compute protocols and mismatch for tooltip/visual warning
  const pageProto = typeof window !== 'undefined' ? window.location.protocol.replace(':', '') : '';
  let backendProto = '';
  try {
    if (backendUrl) {
      const u = new URL(backendUrl.startsWith('http') ? backendUrl : `https://${backendUrl}`);
      backendProto = u.protocol.replace(':', '');
    }
  } catch {
    backendProto = '';
  }
  const mismatch = Boolean(pageProto && backendProto && pageProto !== backendProto);

  return (
    <div className="min-h-screen p-4 sm:p-10 flex flex-col items-center justify-center gap-6">
      <Image src={logo} alt="Gml Frontend" className="w-12 sm:w-16" />
      <h1 className="text-3xl font-bold tracking-tight">{config.name} Установка</h1>

      <div className="grid gap-6 w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Настройки проекта</CardTitle>
            <CardDescription>Укажите основные параметры проекта.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="grid gap-2 text-sm">
              <span>Наименование проекта</span>
              <input
                id="projectName"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Мой проект"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Адрес бекенда</span>
              <div className="relative">
                <input
                  id="backendAddress"
                  className={`w-full rounded-md border bg-background pr-8 pl-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${mismatch ? 'border-[#E3DEAA]' : ''}`}
                  placeholder={process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.example.com'}
                  value={backendUrl}
                  onChange={(e) => {
                    setBackendUrl(e.target.value);
                    if (fetchFailed) setFetchFailed(false);
                  }}
                />
                {mismatch && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 my-auto inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-semibold cursor-help select-none"
                        aria-label="Предупреждение о смешанном контенте"
                        title="Предупреждение"
                        tabIndex={-1}
                        style={{
                          color: '#E3DEAA',
                          borderColor: '#E3DEAA',
                          backgroundColor: 'color-mix(in oklab, #E3DEAA 10%, transparent)',
                        }}
                      >
                        ?
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="p-0 border-0 bg-transparent shadow-none">
                      <Alert variant="warning" className="max-w-sm">
                        <AlertTitle>
                          Возможная ошибка смешанного контента (mixed content)
                        </AlertTitle>
                        <AlertDescription>
                          Страница открыта по протоколу <b>{pageProto.toUpperCase()}</b>, а адрес
                          бекенда указан с протоколом <b>{backendProto.toUpperCase()}</b>. Браузер
                          может заблокировать запросы из-за несовпадения протоколов. Рекомендуется
                          использовать одинаковый протокол (например, HTTPS для обоих адресов).
                        </AlertDescription>
                      </Alert>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </label>

            <label className="grid gap-2 text-sm">
              <span>Имя пользователя администратора</span>
              <input
                id="adminUsername"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="admin"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Email администратора</span>
              <input
                id="adminEmail"
                type="email"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="admin@example.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Пароль администратора</span>
              <input
                id="adminPassword"
                type="password"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Введите пароль"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Подтверждение пароля</span>
              <input
                id="confirmPassword"
                type="password"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          </CardContent>
          <CardFooter className="justify-between flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-2">
            {fetchFailed && (
              <Alert variant="warning" className="w-full">
                <AlertTitle>Не удалось выполнить запрос (Failed to fetch)</AlertTitle>
                <AlertDescription>
                  Убедитесь, что ваш бекенд работает и сертификат валиден. Для проверки откройте
                  адрес здоровья бекенда — вы должны увидеть &quot;Healthy&quot;. Если вы видите
                  Healthy, вернитесь на эту страницу и продолжите установку.
                  <div className="mt-2">
                    <a
                      href={`${backendUrl.replace(/\/$/, '')}/health`.replace('/api/v1', '')}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button size="sm" variant="outline">
                        Проверить
                      </Button>
                    </a>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            <div className="action-block flex gap-2 self-end">
              <Button variant="secondary" onClick={() => router.back()}>
                Назад
              </Button>
              <Button disabled={!backendUrl || submitting} onClick={onSave}>
                {submitting ? 'Сохранение…' : 'Сохранить'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
