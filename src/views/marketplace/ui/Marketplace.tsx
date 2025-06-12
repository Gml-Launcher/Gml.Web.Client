"use client";

import { useState, useEffect } from 'react';
import { SearchIcon, TagIcon, FilterIcon } from 'lucide-react';

import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { getStorageRecloudIDAccessToken } from '@/shared/services';
import { AuthenticationRecloudID } from '@/features/authentication-recloud-id';

// Mock data for marketplace modules
const modules = [
  {
    id: 1,
    title: 'Система авторизации',
    description: 'Расширенная система авторизации с поддержкой OAuth и двухфакторной аутентификации.',
    price: 2500,
    category: 'security',
    tags: ['авторизация', 'безопасность', 'oauth'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'Система платежей',
    description: 'Интеграция с популярными платежными системами для приема платежей от игроков.',
    price: 3000,
    category: 'payments',
    tags: ['платежи', 'интеграция', 'финансы'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    title: 'Аналитика игроков',
    description: 'Расширенная аналитика поведения игроков с визуализацией данных и отчетами.',
    price: 1800,
    category: 'analytics',
    tags: ['аналитика', 'статистика', 'отчеты'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 4,
    title: 'Система достижений',
    description: 'Создавайте и управляйте достижениями для игроков с настраиваемыми наградами.',
    price: 1500,
    category: 'gameplay',
    tags: ['достижения', 'награды', 'геймплей'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 5,
    title: 'Чат-бот поддержки',
    description: 'Автоматизированный чат-бот для ответов на часто задаваемые вопросы игроков.',
    price: 2200,
    category: 'support',
    tags: ['поддержка', 'чат', 'автоматизация'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 6,
    title: 'Система рейтингов',
    description: 'Создавайте рейтинговые таблицы для игроков на основе различных показателей.',
    price: 1700,
    category: 'gameplay',
    tags: ['рейтинги', 'соревнования', 'геймплей'],
    image: 'https://via.placeholder.com/300x200',
  },
];

// Categories for filtering
const categories = [
  { value: 'all', label: 'Все категории' },
  { value: 'security', label: 'Безопасность' },
  { value: 'payments', label: 'Платежи' },
  { value: 'analytics', label: 'Аналитика' },
  { value: 'gameplay', label: 'Геймплей' },
  { value: 'support', label: 'Поддержка' },
];

export const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const accessToken = getStorageRecloudIDAccessToken();
    setIsAuthenticated(!!accessToken);
  }, []);

  // Handle successful authentication
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

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
    <>
      <Breadcrumbs
        current={'Маркетплейс'}
        breadcrumbs={[{ value: 'Главная', path: DASHBOARD_PAGES.HOME }]}
      />

      {!isAuthenticated ? (
        <div className="flex justify-center items-center py-10">
          <AuthenticationRecloudID onAuthenticated={handleAuthenticated} />
        </div>
      ) : (
        <div className="flex flex-col items-start py-4">
          <div className="flex justify-between w-full">
            <h1 className="text-xl font-bold mb-8">Маркетплейс модулей</h1>
          </div>

          {/* Filters and search */}
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

          {/* Tabs for different module categories */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>Все модули</TabsTrigger>
              <TabsTrigger value="security" onClick={() => setSelectedCategory('security')}>Безопасность</TabsTrigger>
              <TabsTrigger value="payments" onClick={() => setSelectedCategory('payments')}>Платежи</TabsTrigger>
              <TabsTrigger value="gameplay" onClick={() => setSelectedCategory('gameplay')}>Геймплей</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {sortedModules.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Модули не найдены. Попробуйте изменить параметры поиска.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedModules.map((module) => (
                    <Card key={module.id} className="overflow-hidden flex flex-col">
                      <div className="h-[200px] bg-muted relative">
                        <img 
                          src={module.image} 
                          alt={module.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{module.title}</CardTitle>
                          <Badge variant="secondary">{module.price} ₽</Badge>
                        </div>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {module.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="flex items-center gap-1">
                              <TagIcon className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="mt-auto">
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" className="flex-1">Подробнее</Button>
                          <Button className="flex-1">Купить</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Other tab contents will be filtered by the category selector */}
            {['security', 'payments', 'gameplay'].map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedModules.map((module) => (
                    <Card key={module.id} className="overflow-hidden flex flex-col">
                      <div className="h-[200px] bg-muted relative">
                        <img 
                          src={module.image} 
                          alt={module.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{module.title}</CardTitle>
                          <Badge variant="secondary">{module.price} ₽</Badge>
                        </div>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {module.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="flex items-center gap-1">
                              <TagIcon className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="mt-auto">
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" className="flex-1">Подробнее</Button>
                          <Button className="flex-1">Купить</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </>
  );
};
