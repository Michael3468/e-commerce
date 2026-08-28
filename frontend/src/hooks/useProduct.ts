import { useQuery } from '@tanstack/react-query';
import { getMockProducts, simulateLatency } from '@/data/mockProducts';
import type { Product } from '@/types/product';
import { productsKeys } from './useProducts';

/**
 * Получение одного товара по id.
 * Заглушка поверх мок-данных; заменить queryFn на apiClient.get(`/products/${id}/`)
 * после подключения backend.
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: async (): Promise<Product> => {
      await simulateLatency();
      const product = getMockProducts().find((item) => item.id === id);
      if (!product) {
        throw new Error(`Товар с id=${id} не найден`);
      }
      return product;
    },
  });
}
