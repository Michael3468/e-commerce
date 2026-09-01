import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { Category } from '@/types/category';

/** Ключи запросов категорий для инвалидации и дедупликации. */
export const categoriesKeys = {
  all: ['categories'] as const,
};

/**
 * Получение списка категорий с бэкенда.
 * Делает GET-запрос к `/categories/` и возвращает массив категорий.
 *
 * @returns Результат запроса React Query со списком категорий.
 */
export function useCategories() {
  return useQuery<readonly Category[]>({
    queryKey: categoriesKeys.all,
    queryFn: async (): Promise<readonly Category[]> => {
      const response = await apiClient.get<
        { results?: readonly Category[] } | readonly Category[]
      >('/categories/');

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
