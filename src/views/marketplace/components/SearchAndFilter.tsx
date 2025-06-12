"use client";

import { SearchIcon, FilterIcon } from 'lucide-react';

import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { categories } from '../data';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

export const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
}: SearchAndFilterProps) => {
  return (
    <div className="w-full mb-6 flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск модулей..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <FilterIcon className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
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
    </div>
  );
};