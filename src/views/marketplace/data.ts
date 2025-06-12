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
export const modules: Module[] = [
  {
    id: 1,
    title: 'Система авторизации',
    description:
      'Расширенная система авторизации с поддержкой OAuth и двухфакторной аутентификации.',
    price: 2500,
    isFree: false,
    category: 'security',
    tags: ['авторизация', 'безопасность', 'oauth'],
    image: 'https://via.placeholder.com/300x200',
    projectLink: '',
  },
  {
    id: 2,
    title: 'Система платежей',
    description: 'Интеграция с популярными платежными системами для приема платежей от игроков.',
    price: 3000,
    isFree: false,
    category: 'payments',
    tags: ['платежи', 'интеграция', 'финансы'],
    image: 'https://via.placeholder.com/300x200',
    projectLink: '',
  },
  {
    id: 3,
    title: 'Аналитика игроков',
    description: 'Расширенная аналитика поведения игроков с визуализацией данных и отчетами.',
    price: 1800,
    isFree: false,
    category: 'analytics',
    tags: ['аналитика', 'статистика', 'отчеты'],
    image: 'https://via.placeholder.com/300x200',
    projectLink: '',
  },
  {
    id: 4,
    title: 'Система достижений',
    description: 'Создавайте и управляйте достижениями для игроков с настраиваемыми наградами.',
    price: 1500,
    isFree: false,
    category: 'gameplay',
    tags: ['достижения', 'награды', 'геймплей'],
    image: 'https://via.placeholder.com/300x200',
    projectLink: '',
  },
  {
    id: 5,
    title: 'Чат-бот поддержки',
    description: 'Автоматизированный чат-бот для ответов на часто задаваемые вопросы игроков.',
    price: 2200,
    isFree: false,
    category: 'support',
    tags: ['поддержка', 'чат', 'автоматизация'],
    image: 'https://via.placeholder.com/300x200',
    projectLink: '',
  },
  {
    id: 6,
    title: 'Система рейтингов',
    description: 'Создавайте рейтинговые таблицы для игроков на основе различных показателей.',
    price: 1700,
    isFree: false,
    category: 'gameplay',
    tags: ['рейтинги', 'соревнования', 'геймплей'],
    image: 'https://via.placeholder.com/300x200',
    projectLink: '',
  },
];
