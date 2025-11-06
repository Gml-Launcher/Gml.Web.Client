'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { config } from '@/core/configs';
import { settingsService } from '@/shared/services/SettingsService';
import { isAxiosError } from '@/shared/lib/isAxiosError/isAxiosError';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Progress } from '@/shared/ui/progress';
import logo from '@/assets/logos/logo.svg';

export default function MntRestorePage() {
  const router = useRouter();
  const [keys, setKeys] = useState<string[]>([]);
  const [loadingKeys, setLoadingKeys] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [restoring, setRestoring] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchKeys() {
      setLoadingKeys(true);
      try {
        const { data } = await settingsService.getRestoreKeys();
        const list: string[] = Array.isArray(data?.data) ? data.data : [];
        if (!ignore) {
          setKeys(list);
          setSelectedKey((prev) => prev || list[0] || '');
        }
      } catch (error: any) {
        isAxiosError({
          toast,
          error,
          customDescription: 'Не удалось получить список резервных копий',
        });
      } finally {
        if (!ignore) setLoadingKeys(false);
      }
    }
    fetchKeys();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!restoring) {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current as any);
        progressTimerRef.current = null;
      }
      setProgress(0);
      return;
    }
    // Artificial slow progress that caps at 95% until the request finishes
    setProgress(1);
    progressTimerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.max(0.4, (100 - p) * 0.015);
        return Math.min(next, 95);
      });
    }, 300);
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current as any);
      progressTimerRef.current = null;
    };
  }, [restoring]);

  async function onRestore() {
    if (!selectedKey) return;
    try {
      setRestoring(true);
      await settingsService.restoreByKey(selectedKey);
      // Finish progress and show success
      setProgress(100);
      toast.success('Процесс восстановления запущен, завершите установку');
      // Redirect to setup page after success
      setTimeout(() => router.push('/mnt/setup'), 500);
    } catch (error: any) {
      isAxiosError({ toast, error, customDescription: 'Не удалось запустить восстановление' });
    } finally {
      // keep the progress at its current value for a short moment for better UX
      setTimeout(() => {
        setRestoring(false);
        setProgress(0);
      }, 700);
    }
  }

  const hasBackups = keys.length > 0;

  return (
    <div className="min-h-screen p-4 sm:p-10 flex flex-col items-center justify-center gap-6">
      <Image src={logo} alt="Gml Frontend" className="w-12 sm:w-16" />
      <h1 className="text-3xl font-bold tracking-tight">{config.name} Восстановление</h1>

      <div className="grid gap-6 w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Восстановление из резервной копии</CardTitle>
            <CardDescription>
              Выберите резервную копию и запустите восстановление системы.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingKeys ? (
              <div className="text-sm text-muted-foreground">Загрузка списка бекапов…</div>
            ) : hasBackups ? (
              <>
                <label className="grid gap-2 text-sm">
                  <span>Выберите бекап</span>
                  <Select value={selectedKey} onValueChange={setSelectedKey} disabled={restoring}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите резервную копию" />
                    </SelectTrigger>
                    <SelectContent>
                      {keys.map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                {restoring && (
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Восстановление…</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                Что нет ни единого бекапа в системе. Загрузите бекап .gbak в папку
                <br />
                <span className="font-mono bg-white/10 p-1 rounded-md">/srv/gml/data/backups</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="secondary" onClick={() => router.push('/mnt')} disabled={restoring}>
              Назад
            </Button>
            <div className="flex gap-2">
              <Button
                id="restoreStartButton"
                onClick={onRestore}
                disabled={!hasBackups || !selectedKey || restoring}
              >
                {restoring ? 'Восстановление…' : 'Восстановить'}
              </Button>
            </div>
          </CardFooter>
        </Card>
        <div className=" text-center text-xs text-muted-foreground">
          {config.name} {config.version}
        </div>
      </div>
    </div>
  );
}
