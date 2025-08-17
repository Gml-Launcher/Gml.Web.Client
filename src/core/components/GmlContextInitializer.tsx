'use client';

import { useEffect } from 'react';

import { getStorageAccessToken } from '@/shared/services/AuthTokenService';
import { getApiBaseUrl } from '@/views/marketplace/api/plugins';

export function GmlContextInitializer() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Initialize GmlContext if it doesn't exist
      window.GmlContext = window.GmlContext || {};

      // Add getApiBaseUrl function to GmlContext
      window.GmlContext.getApiBaseUrl = getApiBaseUrl;

      // Add getAccessToken function to GmlContext
      window.GmlContext.getAccessToken = getStorageAccessToken;
    }
  }, []);

  // This component doesn't render anything
  return null;
}

// Add TypeScript declaration for window.GmlContext
declare global {
  interface Window {
    GmlContext?: {
      getApiBaseUrl?: () => string;
      getAccessToken?: () => string | null;
      [key: string]: any;
    };
  }
}
