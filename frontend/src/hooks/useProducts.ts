import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { PaginatedProductsResponse, Product } from '@/types/product';

/** Параметры фильтрации товаров. */
export interface UseProductsParams {
  readonly category?: string | number;
}

/** Ключи запросов каталога для инвалидации и дедупликации. */
export const productsKeys = {
  all: ['products'] as const,
  list: (params?: UseProductsParams) => ['products', 'list', params] as const,
  detail: (id: number) => ['products', id] as const,
};

/**
 * Получение списка товаров каталога с бэкенда.
 * Делает GET-запрос к `/products/` (с опциональным параметром фильтрации `category`)
 * и возвращает массив товаров с поддержкой пагинированного ответа DRF и обычного массива.
 *
 * @param params - Параметры запроса (например, фильтр по категории).
 * @returns Результат запроса React Query со списком продуктов.
 */
export function useProducts(params?: UseProductsParams) {
  // Явный generic-параметр гарантирует, что data (а значит и каждый элемент
  // массива в каталоге) имеет тип readonly Product[], а не any[].
  // Это исключает потерю типа даже при изменении/удалении аннотации queryFn.
  return useQuery<readonly Product[]>({
    queryKey: productsKeys.list(params),
    queryFn: async (): Promise<readonly Product[]> => {
      const response = await apiClient.get<
        PaginatedProductsResponse | readonly Product[]
      >('/products/', {
        params: params?.category !== undefined ? { category: params.category } : undefined,
      });

      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }

      if (data && 'results' in data && Array.isArray(data.results)) {
        return data.results;
      }

      return [];
    },
  });
}

