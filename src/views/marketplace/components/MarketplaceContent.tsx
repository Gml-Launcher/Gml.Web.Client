"use client";

import { useState } from 'react';

import { SearchAndFilter } from './SearchAndFilter';
import { MarketplaceTabs } from './MarketplaceTabs';
import { Module } from '../data';

interface MarketplaceContentProps {
  modules: Module[];
}

export const MarketplaceContent = ({ modules }: MarketplaceContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  // Filter modules based on search query and category
  const filteredModules = modules.filter((module) => {
    const matchesSearch = 
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort modules based on selected sort order
  const sortedModules = [...filteredModules].sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    if (sortOrder === 'name-asc') return a.title.localeCompare(b.title);
    if (sortOrder === 'name-desc') return b.title.localeCompare(a.title);
    return 0; // default order (as in the original array)
  });

  return (
    <div className="flex flex-col items-start py-4">
      <div className="flex justify-between w-full">
        <h1 className="text-xl font-bold mb-8">Маркетплейс модулей</h1>
      </div>

      <SearchAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <MarketplaceTabs
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortedModules={sortedModules}
      />
    </div>
  );
};