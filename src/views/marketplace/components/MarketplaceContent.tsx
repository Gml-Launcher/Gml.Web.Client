'use client';

import { useEffect, useState } from 'react';

import { Module } from '../data';
import { CategoryOption, fetchCategories } from '../api/categories';
import { fetchProducts } from '../api/products';

import { SearchAndFilter } from './SearchAndFilter';
import { MarketplaceTabs } from './MarketplaceTabs';

interface MarketplaceContentProps {
  modules: Module[]; // Keep for backward compatibility
  onLogout?: () => void; // Function to handle logout
}

export const MarketplaceContent = ({ modules: initialModules, onLogout }: MarketplaceContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([
    { value: 'all', label: 'Все категории' }, // Default category while loading
  ]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Fetch products when component mounts
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const fetchedProducts = await fetchProducts();
        // If we have fetched products, use them; otherwise, fall back to initial modules
        if (fetchedProducts.length > 0) {
          setModules(fetchedProducts);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // Filter modules based on search query and category
  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Check if the module matches the selected category
    // Either the selected category is 'all', or the module's primary category matches,
    // or any of the module's categories match the selected category
    const matchesCategory =
      selectedCategory === 'all' ||
      module.category === selectedCategory ||
      (module.categories && module.categories.some((cat) => cat.id === selectedCategory));

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
    <div className="">
      {/* Header with title, logout button, and mobile filter toggle */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Маркетплейс модулей</h1>
        <div className="flex items-center gap-2">
          {onLogout && (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              onClick={onLogout}
              title="Выйти из сессии Маркетплейса"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Выйти
            </button>
          )}
          <button
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Фильтры
          </button>
        </div>
      </div>

      {/* Main content with sidebar and modules grid */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with filters - hidden on mobile unless toggled */}
        <div
          className={`${isMobileFilterOpen ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/4 2xl:w-1/6 shrink-0`}
        >
          <div className="sticky top-4 bg-card rounded-xl border border-border p-4 shadow-sm">
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              isVertical={true}
              categories={categories}
              isLoadingCategories={isLoadingCategories}
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          <MarketplaceTabs
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortedModules={sortedModules}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            isLoadingProducts={isLoadingProducts}
          />
        </div>
      </div>
    </div>
  );
};
