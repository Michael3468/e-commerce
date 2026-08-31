import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { apiClient } from '@/lib/api';
import type { Product } from '@/types/product';

/**
 * Мокирует модуль `@/lib/api`, подменяя `apiClient.get` на мок-функцию,
 * чтобы тесты не выполняли реальные сетевые запросы.
 */
vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

/**
 * Создаёт обёртку для рендера хука с свежим экземпляром QueryClient.
 * Отключает автоматические повторы запросов, чтобы ошибки всплывали сразу.
 */
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  /**
   * Обёртка-провайдер, дающая доступ к QueryClient внутри компонента.
   * @param children - дочерние элементы, оборачиваемые провайдером.
   */
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

/**
 * Группа тестов для хука `useProducts`.
 */
describe('useProducts hook', () => {
  /** Сбрасывает все моки перед каждым тестом. */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /** Моковые данные товаров, используемые в тестах. */
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Пепперони',
      price: 590,
      description: 'Пикантная пепперони',
      category: 'Пиццы',
    },
    {
      id: 2,
      title: 'Маргарита',
      price: 490,
      description: 'Моцарелла, томаты',
      category: 'Пиццы',
    },
  ];

  /**
   * Проверяет успешную загрузку товаров из paginated DRF ответа
   * (ответ вида `{ count, next, previous, results }`).
   */
  it('успешно загружает список товаров из paginated DRF ответа', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: {
        count: 2,
        next: null,
        previous: null,
        results: mockProducts,
      },
    });

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.get).toHaveBeenCalledWith('/products/');
    expect(result.current.data).toEqual(mockProducts);
  });

  /**
   * Проверяет успешную загрузку товаров из обычного массива
   * (без обёртки pagination).
   */
  it('успешно загружает список товаров из обычного массива', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockProducts,
    });

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.get).toHaveBeenCalledWith('/products/');
    expect(result.current.data).toEqual(mockProducts);
  });

  /**
   * Проверяет, что при ошибке запроса хук переходит в состояние ошибки
   * и содержит объект ошибки в `error`.
   */
  it('обрабатывает ошибку запроса', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
