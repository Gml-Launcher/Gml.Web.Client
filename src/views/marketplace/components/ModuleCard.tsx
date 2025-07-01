'use client';

import { useState } from 'react';
import { Download, ExternalLink, FolderIcon, ShoppingCart, TagIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Module } from '../data';
import { installPlugin } from '../api/plugins';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

interface ModuleCardProps {
  module: Module;
}

export const ModuleCard = ({ module }: ModuleCardProps) => {
  // State for tracking installation status
  const [isInstalling, setIsInstalling] = useState(false);
  const [isAuthRequired, setIsAuthRequired] = useState(false);

  // Function to handle plugin installation
  const handleInstall = async () => {
    // Check if original Id is available
    if (!module.originalId) {
      toast('Ошибка установки', {
        description: 'Идентификатор модуля не найден',
      });
      return;
    }

    try {
      setIsInstalling(true);
      const response = await installPlugin(module.originalId);

      // Check if the response was successful based on the status code
      if (response.ok && (response.statusCode === 200 || response.statusCode === 201)) {
        toast('Успешно', {
          description: `Модуль "${module.title}" успешно установлен`,
        });
      } else {
        // Handle error response
        const errorMessage = response.message || `Ошибка установки (${response.statusCode})`;
        toast('Ошибка установки', {
          description: errorMessage,
        });
        console.error('Installation error:', response);
      }
    } catch (error) {
      console.error('Error installing plugin:', error);

      // Check if this is an authentication error
      if (error instanceof Error && error.message.startsWith('UNAUTHORIZED:')) {
        console.log('Authentication required for plugin installation');
        setIsAuthRequired(true);
        toast('Требуется авторизация', {
          description: 'Для установки расширения необходимо авторизоваться через RecloudID',
        });
      } else {
        toast('Ошибка установки', {
          description: error instanceof Error ? error.message : 'Произошла неизвестная ошибка',
        });
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <TooltipProvider>
      <Card
        key={module.id}
        className="overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:translate-y-[-2px]"
      >
        <div className="h-[200px] bg-muted relative overflow-hidden">
          <Image
            src={module.image}
            alt={module.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            width={400}
            height={200}
            priority
            unoptimized
          />
          <div className="absolute top-3 right-3">
            <Badge
              variant={module.isFree ? 'default' : 'secondary'}
              className={`font-medium backdrop-blur-sm border shadow-sm ${
                module.isFree
                  ? 'bg-green-100/80 text-green-800 border-green-200'
                  : 'bg-background/80'
              }`}
            >
              {module.isFree ? 'Бесплатно' : `${module.price.toLocaleString('ru-RU')} ₽`}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
          </div>
          {/*<div className="flex items-center gap-1 mt-1 mb-2">*/}
          {/*  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />*/}
          {/*  <span className="text-sm font-medium">{rating}</span>*/}
          {/*  <span className="text-xs text-muted-foreground ml-1">(24 отзыва)</span>*/}
          {/*</div>*/}
          <CardDescription className="line-clamp-2">{module.description}</CardDescription>
        </CardHeader>

        <CardContent className="pb-2">
          {/* Display categories if available */}
          {module.categories && module.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {module.categories.map((category) => (
                <Tooltip key={category.id}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <FolderIcon className="h-3 w-3" />
                      {category.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Категория: {category.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          {/* Display tags */}
          <div className="flex flex-wrap gap-1.5">
            {module.tags.map((tag) => (
              <Tooltip key={tag}>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 text-xs bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Поиск по тегу: {tag}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>

        <CardFooter className="mt-auto pt-4">
          <div className="flex gap-2 w-full">
            <a href={module.projectLink} target="_blank">
              <Button variant="outline" className="flex-1 gap-1.5 hover:bg-background">
                <ExternalLink className="h-4 w-4" />
                Подробнее
              </Button>
            </a>
            <Button
              className={`flex-1 gap-1.5 ${
                module.isFree
                  ? isAuthRequired
                    ? 'bg-primary hover:bg-primary/80 text-white'
                    : 'bg-blue-500 hover:bg-blue-500/80 text-white'
                  : ''
              }`}
              onClick={
                module.isFree
                  ? isAuthRequired
                    ? () => window.location.reload()
                    : handleInstall
                  : undefined
              }
              disabled={isInstalling}
            >
              {isInstalling ? (
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              ) : isAuthRequired ? (
                <ExternalLink className="h-4 w-4" />
              ) : module.isFree ? (
                <Download className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
              {isInstalling
                ? 'Установка...'
                : isAuthRequired
                  ? 'Авторизоваться'
                  : module.isFree
                    ? 'Установить'
                    : 'Купить'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};
