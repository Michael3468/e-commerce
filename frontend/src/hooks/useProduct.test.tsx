import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';
import { useProduct } from '@/hooks/useProduct';
import { apiClient } from '@/lib/api';
import type { Product } from '@/types/product';

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

describe('useProduct hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProduct: Product = {
    id: 1,
    title: 'Пепперони',
    price: 590,
    description: 'Пикантная пепперони',
    category: 'Пиццы',
    imageUrl: 'http://example.com/pizza.jpg',
  };

  it('успешно загружает информацию о конкретном товаре по id', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockProduct,
    });

    const { result } = renderHook(() => useProduct(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.get).toHaveBeenCalledWith('/products/1/');
    expect(result.current.data).toEqual(mockProduct);
  });

  it('обрабатывает ошибку загрузки товара', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Not found'));

    const { result } = renderHook(() => useProduct(999), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
