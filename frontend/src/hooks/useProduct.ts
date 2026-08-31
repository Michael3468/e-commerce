import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { Product } from '@/types/product';
import { productsKeys } from './useProducts';

/**
 * Получение одного товара по id с бэкенда.
 * Выполняет запрос к `/products/${id}/`.
 *
 * @param id Идентификатор товара.
 * @returns Результат запроса React Query с данными товара.
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: async (): Promise<Product> => {
      const response = await apiClient.get<Product>(`/products/${id}/`);
      return response.data;
    },
    enabled: Number.isFinite(id) && id > 0,
  });
}
