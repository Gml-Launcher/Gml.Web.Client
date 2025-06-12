import { ResponseBaseEntity } from '@/shared/api/schemas';
import { getStorageRecloudIDAccessToken } from '@/shared/services/AuthTokenService';

// Category entity type
export type MarketplaceCategoryEntity = {
  id: string;
  name: string;
};

// Response type for getting marketplace categories
export type TGetMarketplaceCategoriesResponse = ResponseBaseEntity & {
  data: MarketplaceCategoryEntity[];
};

// Product entity type
export type MarketplaceProductEntity = {
  id: string;
  name: string;
  description: string;
  projectLink: string;
  imageUrl: string;
  categories: MarketplaceCategoryEntity[];
  isFree: boolean;
  price: number;
};

// Response type for getting marketplace products
export type TGetMarketplaceProductsResponse = ResponseBaseEntity & {
  data: MarketplaceProductEntity[];
};

// Function to fetch marketplace categories
export const getMarketplaceCategories = async (): Promise<TGetMarketplaceCategoriesResponse> => {
  try {
    // Create an AbortController to timeout the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    // Get the marketplace URL from environment variables
    const marketplaceUrl = process.env.NEXT_PUBLIC_MARKETPLACE_URL;
    if (!marketplaceUrl) {
      throw new Error('Marketplace URL is not defined');
    }

    // Make the API request
    const response = await fetch(`${marketplaceUrl}/api/v1/marketplace/categories`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getStorageRecloudIDAccessToken()}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
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
    // Re-throw the error to be handled by the caller
    throw error;
  }
};

// Function to fetch marketplace products
export const getMarketplaceProducts = async (): Promise<TGetMarketplaceProductsResponse> => {
  try {
    // Create an AbortController to timeout the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    // Get the marketplace URL from environment variables
    const marketplaceUrl = process.env.NEXT_PUBLIC_MARKETPLACE_URL;
    if (!marketplaceUrl) {
      throw new Error('Marketplace URL is not defined');
    }

    // Make the API request
    const response = await fetch(`${marketplaceUrl}/api/v1/marketplace/products`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getStorageRecloudIDAccessToken()}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
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
    // Re-throw the error to be handled by the caller
    throw error;
  }
};
