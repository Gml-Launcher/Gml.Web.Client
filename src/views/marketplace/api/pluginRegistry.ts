import { getApiBaseUrl } from './plugins';

import { ResponseBaseEntity } from '@/shared/api/schemas';
import {
  getStorageAccessToken,
  getStorageRecloudIDAccessToken,
} from '@/shared/services/AuthTokenService';

// Response type for plugin script
export type PluginScriptResponse = ResponseBaseEntity & {
  data: string; // The JS script content
  statusCode?: number; // HTTP status code
  ok?: boolean; // Whether the request was successful
};

// Enum for plugin places
export enum PluginPlace {
  AfterLoginForm = 0,
}

/**
 * PluginRegistry class for fetching and managing plugin scripts
 */
export class PluginRegistry {
  /**
   * Fetches the JS script for a plugin by place
   * @param place - The place where the plugin script will be rendered
   * @returns Promise with the plugin script response
   */
  static async getPluginScriptByPlace(place: PluginPlace): Promise<PluginScriptResponse> {
    try {
      // Create an AbortController to timeout the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Get the GmlBackend URL
      const gmlBackendUrl = getApiBaseUrl();
      if (!gmlBackendUrl) {
        throw new Error('GML Backend URL is not defined');
      }

      // Get the access token
      const accessToken = getStorageAccessToken();
      // if (!accessToken) {
      //   throw new Error('Access token is not available');
      // }

      // Get the RecloudID token
      const recloudIdToken = getStorageRecloudIDAccessToken();

      // Make the API request to the specified endpoint
      const response = await fetch(`${gmlBackendUrl}/api/v1/plugins/script/${place}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
          ...(recloudIdToken && { recloud_id_token: recloudIdToken }), // Include if available
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear the timeout if the request completes

      // Check if the response is successful
      if (!response.ok) {
        // Handle 401 Unauthorized specifically
        if (response.status === 401) {
          throw new Error('UNAUTHORIZED: Authentication required');
        }
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Parse and return the response
      const data = await response.text(); // Get the raw text content of the script

      return {
        data,
        statusCode: response.status,
        ok: response.ok,
        message: '',
        status: response.ok ? 'success' : 'error',
        errors: [],
      };
    } catch (error) {
      console.error('Error fetching plugin script by place:', error);
      // Re-throw the error to be handled by the caller
      throw error;
    }
  }

  /**
   * Fetches the JS script for a plugin
   * @param pluginId - The ID of the plugin
   * @returns Promise with the plugin script response
   */
  static async getPluginScript(pluginId: string): Promise<PluginScriptResponse> {
    try {
      // Create an AbortController to timeout the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Get the GmlBackend URL
      const gmlBackendUrl = getApiBaseUrl();
      if (!gmlBackendUrl) {
        throw new Error('GML Backend URL is not defined');
      }

      // Get the access token
      const accessToken = getStorageAccessToken();
      if (!accessToken) {
        throw new Error('Access token is not available');
      }

      // Get the RecloudID token
      const recloudIdToken = getStorageRecloudIDAccessToken();

      // Make the API request to the specified endpoint
      const response = await fetch(`${gmlBackendUrl}/api/v1/plugins/${pluginId}/script`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
          ...(recloudIdToken && { recloud_id_token: recloudIdToken }), // Include if available
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear the timeout if the request completes

      // Check if the response is successful
      if (!response.ok) {
        // Handle 401 Unauthorized specifically
        if (response.status === 401) {
          throw new Error('UNAUTHORIZED: Authentication required');
        }
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Parse and return the response
      const data = await response.text(); // Get the raw text content of the script

      return {
        data,
        statusCode: response.status,
        ok: response.ok,
        message: '',
        status: response.ok ? 'success' : 'error',
        errors: [],
      };
    } catch (error) {
      console.error('Error fetching plugin script:', error);
      // Re-throw the error to be handled by the caller
      throw error;
    }
  }
}
