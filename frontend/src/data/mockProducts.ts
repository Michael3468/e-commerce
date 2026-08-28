import type { Product } from '@/types/product';

/**
 * Мок-каталог товаров. Используется как заглушка до появления реального
 * backend API (Django/DRF). После подключения бэкенда хуки должны
 * обращаться к API через apiClient из lib/api.
 */
const MOCK_PRODUCTS: readonly Product[] = [
  {
    id: 1,
    title: 'Беспроводные наушники',
    price: 4990,
    description:
      'Лёгкие наушники с активным шумоподавлением и ёмким аккумулятором.',
    category: 'Электроника',
  },
  {
    id: 2,
    title: 'Механическая клавиатура',
    price: 7990,
    description:
      'Компактная клавиатура с горячей заменой переключателей и подсветкой.',
    category: 'Электроника',
  },
  {
    id: 3,
    title: 'Кофемашина',
    price: 24990,
    description:
      'Капсульная кофемашина для приготовления эспрессо и капучино дома.',
    category: 'Техника для кухни',
  },
  {
    id: 4,
    title: 'Настольная лампа',
    price: 2190,
    description:
      'Светодиодная лампа с регулировкой яркости и цветовой температуры.',
    category: 'Дом',
  },
];

export function getMockProducts(): readonly Product[] {
  return MOCK_PRODUCTS;
}

/** Имитация сетевой задержки при обращении к API. */
export function simulateLatency(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
