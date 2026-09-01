import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { apiClient } from '@/lib/api';
import type { Category } from '@/types/category';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useCategories hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCategories: Category[] = [
    { id: 1, name: 'Пиццы', slug: 'pizzas' },
    { id: 2, name: 'Напитки', slug: 'drinks' },
  ];

  it('успешно загружает список категорий из paginated ответа', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: {
        count: 2,
        results: mockCategories,
      },
    });

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.get).toHaveBeenCalledWith('/categories/');
    expect(result.current.data).toEqual(mockCategories);
  });

  it('успешно загружает список категорий из обычного массива', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockCategories,
    });

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.get).toHaveBeenCalledWith('/categories/');
    expect(result.current.data).toEqual(mockCategories);
  });

  it('обрабатывает ошибку запроса', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
