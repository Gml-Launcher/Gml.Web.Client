// Type definition for a marketplace module
export interface Module {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
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
    description: 'Расширенная система авторизации с поддержкой OAuth и двухфакторной аутентификации.',
    price: 2500,
    category: 'security',
    tags: ['авторизация', 'безопасность', 'oauth'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'Система платежей',
    description: 'Интеграция с популярными платежными системами для приема платежей от игроков.',
    price: 3000,
    category: 'payments',
    tags: ['платежи', 'интеграция', 'финансы'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    title: 'Аналитика игроков',
    description: 'Расширенная аналитика поведения игроков с визуализацией данных и отчетами.',
    price: 1800,
    category: 'analytics',
    tags: ['аналитика', 'статистика', 'отчеты'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 4,
    title: 'Система достижений',
    description: 'Создавайте и управляйте достижениями для игроков с настраиваемыми наградами.',
    price: 1500,
    category: 'gameplay',
    tags: ['достижения', 'награды', 'геймплей'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 5,
    title: 'Чат-бот поддержки',
    description: 'Автоматизированный чат-бот для ответов на часто задаваемые вопросы игроков.',
    price: 2200,
    category: 'support',
    tags: ['поддержка', 'чат', 'автоматизация'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 6,
    title: 'Система рейтингов',
    description: 'Создавайте рейтинговые таблицы для игроков на основе различных показателей.',
    price: 1700,
    category: 'gameplay',
    tags: ['рейтинги', 'соревнования', 'геймплей'],
    image: 'https://via.placeholder.com/300x200',
  },
];