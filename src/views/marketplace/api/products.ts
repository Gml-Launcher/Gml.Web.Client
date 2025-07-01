import { Module } from '../data';

import {
  getMarketplaceProducts,
  MarketplaceProductEntity,
} from '@/shared/api/contracts/marketplace/requests';

// Map API product to UI module format
const mapProductToModule = (product: MarketplaceProductEntity): Module => {
  // If there's at least one category, use its id for the category field
  // Otherwise, use 'all' as the default category
  const primaryCategory =
    product.categories && product.categories.length > 0 ? product.categories[0].id : 'all';

  return {
    id: parseInt(product.id.split('-')[0], 16) || 0, // Convert part of UUID to number or use 0
    originalId: product.id, // Preserve the original UUID for API calls
    title: product.name,
    projectLink: product.projectLink,
    description: product.description,
    price: product.price, // Use the price from the API response
    isFree: product.isFree, // Use the isFree flag from the API response
    category: primaryCategory, // Use the first category's id or 'all' if no categories
    categories: product.categories, // Include all categories
    tags: [], // Default empty tags as they're not in the API response
    image: product.imageUrl || 'https://via.placeholder.com/300x200', // Use imageUrl from API or fallback to placeholder
  };
};

// Function to fetch products and convert them to the format expected by the UI
export const fetchProducts = async (): Promise<Module[]> => {
  try {
    const response = await getMarketplaceProducts();

    if (response.status === 'OK' && response.data) {
      // Map API products to UI format
      return response.data.map(mapProductToModule);
    }

    // Return empty array if there's an issue with the response
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array in case of error
    return [];
  }
};
