// Type definition for a marketplace module
export interface Module {
  id: number;
  originalId?: string; // Original UUID from the API
  title: string;
  description: string;
  price: number;
  isFree: boolean; // New field for free/paid status
  category: string; // Kept for backward compatibility
  projectLink: string;
  categories?: { id: string; name: string }[]; // New field for multiple categories
  tags: string[];
  image: string;
}

// Categories for filtering
export const categories = [
  { value: 'all', label: 'Все категории' },
  { value: 'security', label: 'Безопасность' },
  { value: 'payments', label: 'Платежи' },
  { value: 'analytics', label: 'Аналитика' },
  { value: 'gameplay', label: 'Геймплей' },
  { value: 'support', label: 'Поддержка' },
];

// Mock data for marketplace modules
export const modules: Module[] = [];
