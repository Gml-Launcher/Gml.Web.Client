'use client';

import { Package, PackageOpen } from 'lucide-react';
import { useState } from 'react';

import { Module } from '../data';

import { ModuleCard } from './ModuleCard';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { CategoryOption } from '@/views/marketplace/api/categories';

interface MarketplaceTabsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortedModules: Module[];
  categories: CategoryOption[];
  isLoadingCategories?: boolean;
  isLoadingProducts?: boolean;
}

export const MarketplaceTabs = ({
  selectedCategory,
  setSelectedCategory,
  sortedModules,
  categories,
  isLoadingCategories = false,
  isLoadingProducts = false,
}: MarketplaceTabsProps) => {
  // Get all unique categories from the modules
  const availableCategories = ['all', ...categories.map((c) => c.value).filter((c) => c !== 'all')];

  // State to track which main tab is active
  const [activeMainTab, setActiveMainTab] = useState<'store' | 'installed'>('store');

  return (
    <div className="w-full">
      {/* Main tabs for Store and Installed Extensions */}
      <Tabs
        defaultValue="store"
        value={activeMainTab}
        onValueChange={(value) => setActiveMainTab(value as 'store' | 'installed')}
        className="w-full mb-6"
      >
        <div className="border-b mb-6">
          <TabsList className="bg-transparent h-auto p-0 mb-0">
            <TabsTrigger
              value="store"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 h-auto"
            >
              Магазин расширений
            </TabsTrigger>
            <TabsTrigger
              value="installed"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 h-auto"
            >
              Установленные расширения
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Store Extensions Tab Content */}
        <TabsContent value="store" className="mt-0">
          {/* Category tabs - only shown in the Store tab */}
          <Tabs
            defaultValue="all"
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <div className="border-b mb-6">
              <TabsList className="bg-transparent h-auto p-0 mb-0">
                {isLoadingCategories ? (
                  <div className="text-sm text-muted-foreground p-2">Загрузка категорий...</div>
                ) : (
                  availableCategories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 h-auto"
                    >
                      {categories.find((c) => c.value === category)?.label || 'Все модули'}
                    </TabsTrigger>
                  ))
                )}
              </TabsList>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {sortedModules.length === 0
                    ? 'Нет доступных модулей'
                    : `Найдено ${sortedModules.length} ${
                        sortedModules.length === 1
                          ? 'модуль'
                          : sortedModules.length < 5
                            ? 'модуля'
                            : 'модулей'
                      }`}
                </p>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              {isLoadingProducts ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Загрузка модулей...</p>
                </div>
              ) : sortedModules.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
                  <PackageOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Модули не найдены</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Попробуйте изменить параметры поиска или выбрать другую категорию.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 3xl:grid-cols-4 gap-6">
                  {sortedModules.map((module) => (
                    <ModuleCard key={module.id} module={module} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Other category tab contents */}
            {isLoadingCategories ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Загрузка категорий...</p>
              </div>
            ) : isLoadingProducts ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Загрузка модулей...</p>
              </div>
            ) : (
              availableCategories
                .filter((c) => c !== 'all')
                .map((category) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {sortedModules
                        .filter((module) => module.category === category)
                        .map((module) => (
                          <ModuleCard key={module.id} module={module} />
                        ))}
                    </div>
                  </TabsContent>
                ))
            )}
          </Tabs>
        </TabsContent>

        {/* Installed Extensions Tab Content */}
        <TabsContent value="installed" className="mt-0">
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Установленные расширения</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Здесь будут отображаться ваши установленные расширения.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
