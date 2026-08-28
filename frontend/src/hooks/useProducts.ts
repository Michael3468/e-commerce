import { useQuery } from '@tanstack/react-query';
import { getMockProducts, simulateLatency } from '@/data/mockProducts';
import type { Product } from '@/types/product';

/** Ключи запросов каталога для инвалидации и дедупликации. */
export const productsKeys = {
  all: ['products'] as const,
  detail: (id: number) => ['products', id] as const,
};

/**
 * Получение списка товаров каталога.
 * Сейчас возвращает мок-данные; после появления backend заменить queryFn
 * на вызов apiClient.get("/products/").
 */
export function useProducts() {
  return useQuery({
    queryKey: productsKeys.all,
    queryFn: async (): Promise<readonly Product[]> => {
      await simulateLatency();
      return getMockProducts();
    },
  });
}
