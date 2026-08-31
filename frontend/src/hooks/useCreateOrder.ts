import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { CreateOrderPayload, Order } from '@/types/product';

/**
 * Отправка заказа на оформление на бэкенд.
 * Выполняет POST-запрос к `/orders/`.
 *
 * @returns Мутация React Query для создания заказа.
 */
export function useCreateOrder() {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload): Promise<Order> => {
      const response = await apiClient.post<Order>('/orders/', payload);
      return response.data;
    },
  });
}
