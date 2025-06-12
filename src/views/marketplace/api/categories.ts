import { getMarketplaceCategories, MarketplaceCategoryEntity } from '@/shared/api/contracts/marketplace/requests';

// Define the category format used in the UI
export type CategoryOption = {
  value: string;
  label: string;
};

// Map API category to UI category format
const mapCategoryToOption = (category: MarketplaceCategoryEntity): CategoryOption => ({
  value: category.id,
  label: category.name,
});

// Function to fetch categories and convert them to the format expected by the UI
export const fetchCategories = async (): Promise<CategoryOption[]> => {
  try {
    const response = await getMarketplaceCategories();
    
    if (response.status === 'OK' && response.data) {
      // Map API categories to UI format and add the "All categories" option
      const mappedCategories = response.data.map(mapCategoryToOption);
      return [{ value: 'all', label: 'Все категории' }, ...mappedCategories];
    }
    
    // Return default "All categories" option if there's an issue with the response
    return [{ value: 'all', label: 'Все категории' }];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return default "All categories" option in case of error
    return [{ value: 'all', label: 'Все категории' }];
  }
};