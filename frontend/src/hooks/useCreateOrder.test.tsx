import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { apiClient } from '@/lib/api';
import type { CreateOrderPayload, Order } from '@/types/product';

vi.mock('@/lib/api', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
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

describe('useCreateOrder hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const payload: CreateOrderPayload = {
    items: [
      {
        productId: 1,
        title: 'Пепперони',
        price: 590,
        quantity: 2,
      },
    ],
  };

  const expectedOrder: Order = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    items: payload.items,
    total: 1180,
  };

  it('успешно отправляет заказ на бэкенд через POST /orders/', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: expectedOrder,
    });

    const { result } = renderHook(() => useCreateOrder(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.post).toHaveBeenCalledWith('/orders/', payload);
    expect(result.current.data).toEqual(expectedOrder);
  });

  it('обрабатывает ошибку создания заказа', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Server error'));

    const { result } = renderHook(() => useCreateOrder(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
