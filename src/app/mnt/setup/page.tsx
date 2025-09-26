'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
import Image from 'next/image';
import logo from '@/assets/logos/logo.svg';

export default function MntSetupPage() {
  const router = useRouter();
  const [backendUrl, setBackendUrl] = useState('');

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
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Адрес бекенда</span>
              <input
                id="backendAddress"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="https://api.example.com"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
              />
            </label>
          </CardContent>
          <CardFooter className="justify-end">
            <div className="action-block flex gap-2">
              <Button variant="secondary" onClick={() => router.back()}>
                Назад
              </Button>
              <Button disabled={!backendUrl}>Сохранить</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
