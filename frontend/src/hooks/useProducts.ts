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
  // Явный generic-параметр гарантирует, что data (а значит и каждый элемент
  // массива в каталоге) имеет тип readonly Product[], а не any[].
  // Это исключает потерю типа даже при изменении/удалении аннотации queryFn.
  return useQuery<readonly Product[]>({
    queryKey: productsKeys.all,
    queryFn: async (): Promise<readonly Product[]> => {
      await simulateLatency();
      return getMockProducts();
    },
  });
}
