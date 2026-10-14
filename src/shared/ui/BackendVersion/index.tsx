'use client';

import { useBackendVersion } from '@/shared/hooks/useBackendVersion';
import { cn } from '@/shared/lib/utils';

export const BackendVersion = ({ className }: { className?: string }) => {
  const { data, isError } = useBackendVersion();

  if (!data || isError) return null;

  const description = `Бэкенд: ${data.version}. Коммит: ${data.commit}`;

  return (
    <sup
      className={cn('static flex min-w-0 items-center gap-1', className)}
      title={description}
      aria-label={description}
    >
      <span className="truncate">{data.version}</span>
      {data.commit !== 'unknown' && <span className="shrink-0">{data.commit.slice(0, 7)}</span>}
    </sup>
  );
};
