'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

import { PluginPlace, PluginRegistry } from '@/views/marketplace/api/pluginRegistry';

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

export const LoginPluginScriptViewer = () => {
  const [scriptContent, setScriptContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderedComponent, setRenderedComponent] = useState<ReactNode | null>(null);

  useEffect(() => {
    const fetchPluginScript = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await PluginRegistry.getPluginScriptByPlace(PluginPlace.AfterLoginForm);
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
        setError(error instanceof Error ? error.message : 'Failed to load plugin script');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPluginScript();
  }, []);

  if (isLoading || !scriptContent) {
    return null; // Don't show anything while loading
  }

  if (error) {
    return (
      <div className="mt-4 text-center text-sm text-red-500">
        <AlertCircle className="h-4 w-4 inline-block mr-1" />
        {error}
      </div>
    );
  }

  // Only render if we have a component to render
  return renderedComponent ? <>{renderedComponent}</> : null;
};
