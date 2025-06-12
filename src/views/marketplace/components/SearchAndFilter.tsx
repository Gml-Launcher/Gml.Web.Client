'use client';

import { FilterIcon, SearchIcon, SlidersHorizontal } from 'lucide-react';

import { CategoryOption } from '../api/categories';

import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  isVertical?: boolean;
  categories: CategoryOption[];
  isLoadingCategories?: boolean;
}

export const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
  isVertical = false,
  categories,
  isLoadingCategories = false,
}: SearchAndFilterProps) => {
  return (
    <div className={`w-full ${isVertical ? 'space-y-5' : 'mb-6 flex flex-col md:flex-row gap-4'}`}>
      {/* Search input */}
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск модулей..."
          className="pl-9 bg-background/50 backdrop-blur-sm border-input/50 focus:border-primary transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isVertical && (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Категории</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {isLoadingCategories ? (
                <div className="text-sm text-muted-foreground py-2">Загрузка категорий...</div>
              ) : (
                categories.map((category) => (
                  <button
                    key={category.value}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </button>
                ))
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Сортировка</h3>
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">По умолчанию</SelectItem>
                <SelectItem value="price-asc">Цена (по возрастанию)</SelectItem>
                <SelectItem value="price-desc">Цена (по убыванию)</SelectItem>
                <SelectItem value="name-asc">Название (А-Я)</SelectItem>
                <SelectItem value="name-desc">Название (Я-А)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {!isVertical && (
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <FilterIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCategories ? (
                <div className="text-sm text-muted-foreground p-2">Загрузка категорий...</div>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">По умолчанию</SelectItem>
              <SelectItem value="price-asc">Цена (по возрастанию)</SelectItem>
              <SelectItem value="price-desc">Цена (по убыванию)</SelectItem>
              <SelectItem value="name-asc">Название (А-Я)</SelectItem>
              <SelectItem value="name-desc">Название (Я-А)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
