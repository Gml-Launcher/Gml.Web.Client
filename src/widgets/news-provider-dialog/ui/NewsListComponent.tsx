'use client';

import React from 'react';
import Image from 'next/image';

import { socialNetworkLogos } from './NewsProviderDialog';

import { useNews } from '@/shared/hooks'; // Assuming ShadCN UI components are imported from this path
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export function NewsListComponent() {
  const { data: news, isLoading: isLoadingNews } = useNews();

  if (isLoadingNews) {
    return (
      <div className="flex h-full gap-x-2 py-12 px-2 items-center justify-center">
        <p className="text-sm text-muted-foreground">Загрузка</p>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="flex h-full gap-x-2 py-12 px-2 items-center justify-center">
        <p className="text-sm text-muted-foreground">Новостей нет</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 h-[400px] overflow-y-auto">
      {news.map((item) => (
        <Card key={item.title}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3">
              <Image
                src={socialNetworkLogos[item.type]}
                className="w-8"
                alt={`${item.type} logo`}
              />
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p dangerouslySetInnerHTML={{ __html: item.content }} />
            <CardDescription>{new Date(item.date).toLocaleDateString()}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
