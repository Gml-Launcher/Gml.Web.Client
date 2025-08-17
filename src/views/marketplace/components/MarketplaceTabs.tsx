'use client';

import { AlertCircle, Package, PackageOpen, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Module } from '../data';
import { deletePlugin, fetchInstalledPlugins, Plugin } from '../api/plugins';

import { ModuleCard } from './ModuleCard';
import { PluginScriptViewer } from './PluginScriptViewer';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { CategoryOption } from '@/views/marketplace/api/categories';
import { AuthenticationRecloudID } from '@/features/authentication-recloud-id';

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

  // State for installed plugins
  const [installedPlugins, setInstalledPlugins] = useState<Plugin[]>([]);
  const [isLoadingInstalledPlugins, setIsLoadingInstalledPlugins] = useState(false);
  const [installedPluginsError, setInstalledPluginsError] = useState<string | null>(null);
  const [isAuthRequired, setIsAuthRequired] = useState(false);

  // State to track which plugin is being deleted
  const [deletingPluginId, setDeletingPluginId] = useState<string | null>(null);

  // Function to fetch installed plugins
  const fetchPlugins = useCallback(async () => {
    try {
      // Only show loading indicator when the installed tab is active
      if (activeMainTab === 'installed') {
        setIsLoadingInstalledPlugins(true);
      }
      setInstalledPluginsError(null);

      const response = await fetchInstalledPlugins();
      setInstalledPlugins(response.data || []);
    } catch (error) {
      console.error('Failed to fetch installed plugins:', error);

      // Check if this is an authentication error
      if (error instanceof Error && error.message.startsWith('UNAUTHORIZED:')) {
        console.log('Authentication required for marketplace');
        setIsAuthRequired(true);
        setInstalledPluginsError(null); // Clear any previous error
      } else {
        setIsAuthRequired(false);
        setInstalledPluginsError(
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить установленные расширения',
        );
      }
    } finally {
      if (activeMainTab === 'installed') {
        setIsLoadingInstalledPlugins(false);
      }
    }
  }, [activeMainTab]);

  // Function to handle successful authentication
  const handleAuthenticated = () => {
    console.log('User authenticated successfully');
    setIsAuthRequired(false);
    // Refetch installed plugins after successful authentication
    fetchPlugins();
  };

  // Function to handle plugin deletion
  const handleDeletePlugin = async (pluginId: string, pluginName: string) => {
    try {
      setDeletingPluginId(pluginId);

      const response = await deletePlugin(pluginId);

      // Check if the response was successful
      if (response.ok && (response.statusCode === 200 || response.statusCode === 204)) {
        // Remove the deleted plugin from the list
        setInstalledPlugins((prevPlugins) =>
          prevPlugins.filter((plugin) => plugin.id !== pluginId),
        );

        // Show success message
        toast('Успешно', {
          description: `Расширение "${pluginName}" успешно удалено`,
        });
      } else {
        // Handle error response
        const errorMessage = response.message || `Ошибка удаления (${response.statusCode})`;
        toast('Ошибка удаления', {
          description: errorMessage,
        });
        console.error('Deletion error:', response);
      }
    } catch (error) {
      console.error('Error deleting plugin:', error);

      // Check if this is an authentication error
      if (error instanceof Error && error.message.startsWith('UNAUTHORIZED:')) {
        console.log('Authentication required for plugin deletion');
        setIsAuthRequired(true);
      } else {
        toast('Ошибка удаления', {
          description: error instanceof Error ? error.message : 'Произошла неизвестная ошибка',
        });
      }
    } finally {
      setDeletingPluginId(null);
    }
  };

  // Fetch installed plugins when the component mounts and when the installed tab is selected
  useEffect(() => {
    fetchPlugins();
  }, [activeMainTab, fetchPlugins]); // Re-fetch when tab changes or when fetchPlugins changes

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
              <div className="flex items-center gap-2">
                Магазин расширений
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {sortedModules.length}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="installed"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 h-auto"
            >
              <div className="flex items-center gap-2">
                Установленные расширения
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {installedPlugins.length}
                </span>
              </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          {isLoadingInstalledPlugins ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium mb-2">Загрузка установленных расширений...</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Пожалуйста, подождите, идет загрузка данных.
              </p>
            </div>
          ) : isAuthRequired ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
              <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Требуется авторизация</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Для доступа к установленным расширениям необходимо авторизоваться через RecloudID.
              </p>
              <div className="mt-4">
                <AuthenticationRecloudID onAuthenticated={handleAuthenticated} />
              </div>
            </div>
          ) : installedPluginsError ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Ошибка загрузки</h3>
              <p className="text-muted-foreground max-w-md mx-auto">{installedPluginsError}</p>
              <button
                onClick={() => setActiveMainTab('installed')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Попробовать снова
              </button>
            </div>
          ) : installedPlugins.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Нет установленных расширений</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                У вас пока нет установленных расширений. Перейдите на вкладку &quot;Магазин
                расширений&quot;, чтобы найти и установить расширения.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {`Установлено ${installedPlugins.length} ${
                      installedPlugins.length === 1
                        ? 'расширение'
                        : installedPlugins.length < 5
                          ? 'расширения'
                          : 'расширений'
                    }`}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {installedPlugins.map((plugin) => (
                  <div key={plugin.id} className="w-full">
                    {/* Plugin Script Viewer */}
                    <PluginScriptViewer plugin={plugin} />

                    {/* Delete button */}
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleDeletePlugin(plugin.id, plugin.name)}
                        disabled={deletingPluginId === plugin.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        {deletingPluginId === plugin.id ? (
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        {deletingPluginId === plugin.id ? 'Удаление...' : 'Удалить'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
