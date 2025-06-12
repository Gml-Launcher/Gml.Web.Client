"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ModuleCard } from './ModuleCard';
import { Module } from '../data';

interface MarketplaceTabsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortedModules: Module[];
}

export const MarketplaceTabs = ({
  selectedCategory,
  setSelectedCategory,
  sortedModules,
}: MarketplaceTabsProps) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>
          Все модули
        </TabsTrigger>
        <TabsTrigger value="security" onClick={() => setSelectedCategory('security')}>
          Безопасность
        </TabsTrigger>
        <TabsTrigger value="payments" onClick={() => setSelectedCategory('payments')}>
          Платежи
        </TabsTrigger>
        <TabsTrigger value="gameplay" onClick={() => setSelectedCategory('gameplay')}>
          Геймплей
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0">
        {sortedModules.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Модули не найдены. Попробуйте изменить параметры поиска.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        )}
      </TabsContent>

      {/* Other tab contents will be filtered by the category selector */}
      {['security', 'payments', 'gameplay'].map((category) => (
        <TabsContent key={category} value={category} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedModules
              .filter((module) => module.category === category)
              .map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};