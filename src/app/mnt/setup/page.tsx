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
import logo from '@/assets/logos/logo.svg';

export default function MntSetupPage() {
  const router = useRouter();
  const [backendUrl, setBackendUrl] = useState(process.env.NEXT_PUBLIC_BACKEND_URL || '');
  const [projectName, setProjectName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSave() {
    if (!backendUrl) return;
    if (adminPassword !== confirmPassword) {
      const { toast } = await import('sonner');
      toast.error('Пароль и подтверждение не совпадают');
      return;
    }
    const base = backendUrl.replace(/\/$/, '');
    const url = `${base}/api/v1/settings/install`;
    const body = {
      ProjectName: projectName,
      BackendAddress: backendUrl,
      AdminUsername: adminUsername,
      AdminPassword: adminPassword,
      ConfirmPassword: confirmPassword,
    };
    try {
      setSubmitting(true);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }
      router.push('/dashboard');
    } catch (e: any) {
      // Fallback alert; project also has sonner Toaster globally mounted
      const msg = e?.message || 'Не удалось выполнить установку';
      // dynamic import to avoid adding dependency at module scope
      const { toast } = await import('sonner');
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

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

              <input
                id="backendAddress"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.example.com'}
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
              />
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
          <CardFooter className="justify-end">
            <div className="action-block flex gap-2">
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
