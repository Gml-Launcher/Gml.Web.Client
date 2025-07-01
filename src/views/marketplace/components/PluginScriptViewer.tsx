'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AlertCircle, Package } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

import { Plugin } from '../api/plugins';
import { PluginRegistry } from '../api/pluginRegistry';

import { AuthenticationRecloudID } from '@/features/authentication-recloud-id';

// Dynamic import for React components that might be in the script
const DynamicComponent = dynamic(
  () =>
    Promise.resolve(
      ({
        component: Component,
        ...props
      }: {
        component: React.ComponentType;
        [key: string]: any;
      }) => {
        return <Component {...props} />;
      },
    ),
  {
    ssr: false,
  },
);

interface PluginScriptViewerProps {
  plugin: Plugin;
}

export const PluginScriptViewer = ({ plugin }: PluginScriptViewerProps) => {
  const [scriptContent, setScriptContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthRequired, setIsAuthRequired] = useState(false);
  const [renderedComponent, setRenderedComponent] = useState<ReactNode | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Handler for successful authentication
  const handleAuthenticated = () => {
    console.log('User authenticated successfully');
    setIsAuthRequired(false);
    setIsLoading(true); // Show loading state while refetching
    // Trigger a refetch by incrementing the refetchTrigger
    setRefetchTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchPluginScript = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await PluginRegistry.getPluginScript(plugin.id);
        setScriptContent(response.data);

        // Try to evaluate and render the script content if it contains React components
        try {
          // This is a simplified approach - in a real implementation, you would need
          // a more robust way to safely evaluate and render external JS code
          const evalScript = new Function('React', 'return ' + response.data);
          const Component = evalScript(require('react'));

          if (typeof Component === 'function') {
            // If the script returns a React component
            setRenderedComponent(<DynamicComponent component={Component} />);
          } else {
            // If it's not a component, just display the script
            setRenderedComponent(null);
          }
        } catch (evalError) {
          console.warn('Could not evaluate script as React component:', evalError);
          // If evaluation fails, we'll just display the raw script
          setRenderedComponent(null);
        }
      } catch (error) {
        console.error('Error fetching plugin script:', error);

        // Check if this is an authentication error
        if (error instanceof Error && error.message.startsWith('UNAUTHORIZED:')) {
          console.log('Authentication required for plugin script');
          setIsAuthRequired(true);
          setError(null); // Clear any previous error
        } else {
          setIsAuthRequired(false);
          setError(error instanceof Error ? error.message : 'Failed to load plugin script');
          toast('Ошибка загрузки', {
            description:
              error instanceof Error ? error.message : 'Не удалось загрузить скрипт плагина',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (plugin.id) {
      fetchPluginScript();
    }
  }, [plugin.id, refetchTrigger]); // Include refetchTrigger to re-run effect when authentication succeeds

  if (isLoading) {
    return (
      <div className="w-full py-12 text-center bg-muted/30 rounded-lg border border-border">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-medium mb-2">Загрузка скрипта плагина...</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Пожалуйста, подождите, идет загрузка данных.
        </p>
      </div>
    );
  }

  if (isAuthRequired) {
    return (
      <div className="w-full py-12 text-center bg-muted/30 rounded-lg border border-border">
        <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Требуется авторизация</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Для доступа к скрипту плагина необходимо авторизоваться через RecloudID.
        </p>
        <div className="mt-4">
          <AuthenticationRecloudID onAuthenticated={handleAuthenticated} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center bg-muted/30 rounded-lg border border-border">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Ошибка загрузки скрипта</h3>
        <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
        <button
          onClick={() => setIsLoading(true)}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">{plugin.name}</h3>
          <p className="text-sm text-muted-foreground">{plugin.description}</p>
        </div>

        {/* Render the React component if available */}
        {renderedComponent && <div className="p-4 border-b">{renderedComponent}</div>}

        {/* Always show the script content */}
        {/*<div className="p-4">*/}
        {/*  <h4 className="text-md font-medium mb-2">Код скрипта:</h4>*/}
        {/*  <pre className="bg-muted p-4 rounded-md overflow-x-auto">*/}
        {/*    <code>{scriptContent}</code>*/}
        {/*  </pre>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};
