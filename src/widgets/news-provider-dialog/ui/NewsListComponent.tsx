'use client';

import React from 'react';
import Image from 'next/image';
import { CalendarIcon, Loader2Icon, NewspaperIcon } from 'lucide-react';

import { socialNetworkLogos } from './NewsProviderDialog';

import { useNews } from '@/shared/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

export function NewsListComponent() {
  const { data: news, isLoading: isLoadingNews } = useNews();

  if (isLoadingNews) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Загрузка новостей...</span>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="flex flex-col h-[400px] gap-4 py-12 px-4 items-center justify-center bg-muted/50 rounded-lg border border-dashed">
        <div className="rounded-full bg-muted p-3">
          <NewspaperIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Новостей нет</p>
          <p className="text-xs text-muted-foreground mt-1">
            Добавьте провайдер новостей на вкладке &quot;Подключение&quot;
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 h-[400px] overflow-y-auto pr-2">
      {news.map((item, index) => (
        <Card
          key={index}
          className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow transition-all h-max"
        >
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className="px-2 py-0 h-5 text-xs font-normal">
                <div className="flex items-center gap-1.5">
                  <Image
                    src={socialNetworkLogos[item.type]}
                    className="w-3 h-3"
                    alt={`${item.type} logo`}
                  />
                  <span>{item.type}</span>
                </div>
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
            <CardTitle className="text-base">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: item.content }} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
