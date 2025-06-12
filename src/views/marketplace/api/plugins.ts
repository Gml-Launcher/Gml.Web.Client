import { ResponseBaseEntity } from '@/shared/api/schemas';
import { getStorageAccessToken, getStorageRecloudIDAccessToken } from '@/shared/services/AuthTokenService';

// Helper function to get the API base URL
export const getApiBaseUrl = () => (process.env.NEXT_PUBLIC_BACKEND_URL as string)?.slice(0, -7);

// Request type for installing a plugin
export type PluginInstallRequest = {
  Id: string; // GUID of the plugin to install
};

// Response type for plugin installation
export type PluginInstallResponse = ResponseBaseEntity & {
  data: any; // Adjust this based on the actual response structure
};

// Type for a plugin category
export type PluginCategory = {
  id: string;
  name: string;
};

// Type for a plugin
export type Plugin = {
  id: string;
  name: string;
  description: string;
  projectLink: string;
  imageUrl: string;
  isFree: boolean;
  price: number;
  categories: PluginCategory[];
};

// Response type for fetching installed plugins
export type PluginsResponse = ResponseBaseEntity & {
  data: Plugin[];
};

// Function to install a plugin
export const installPlugin = async (pluginId: string): Promise<PluginInstallResponse> => {
  try {
    // Create an AbortController to timeout the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Get the GmlBackend URL using the helper function
    const gmlBackendUrl = getApiBaseUrl();
    if (!gmlBackendUrl) {
      throw new Error('GML Backend URL is not defined');
    }

    // Get the RecloudID token
    const recloudIdToken = getStorageRecloudIDAccessToken();
    if (!recloudIdToken) {
      throw new Error('RecloudID token is not available');
    }

    // Get the access token
    const accessToken = getStorageAccessToken();
    if (!accessToken) {
      throw new Error('Access token is not available');
    }

    // Prepare the request payload
    // The backend expects a RecloudPluginCreateDto with a GUID Id
    const payload: PluginInstallRequest = {
      Id: pluginId
    };

    // Make the API request
    const response = await fetch(`${gmlBackendUrl}/api/v1/plugins/install`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'recloud_id_token': recloudIdToken // Pass token in header as specified
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId); // Clear the timeout if the request completes

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    // Parse and return the response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error installing plugin:', error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
};

// Function to fetch installed plugins
export const fetchInstalledPlugins = async (): Promise<PluginsResponse> => {
  try {
    // Create an AbortController to timeout the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Get the GmlBackend URL using the helper function
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

    // Make the API request
    const response = await fetch(`${gmlBackendUrl}/api/v1/plugins`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...(recloudIdToken && { 'recloud_id_token': recloudIdToken }) // Include if available
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId); // Clear the timeout if the request completes

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    // Parse and return the response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching installed plugins:', error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
};
