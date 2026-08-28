import { useMutation } from '@tanstack/react-query';
import { simulateLatency } from '@/data/mockProducts';
import type { CreateOrderPayload, Order } from '@/types/product';

/**
 * Отправка заказа на оформление.
 * Заглушка: имитирует создание заказа. Заменить на
 * apiClient.post("/orders/", payload) после подключения backend.
 */
export function useCreateOrder() {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload): Promise<Order> => {
      await simulateLatency(600);
      const total = payload.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      return {
        id: crypto.randomUUID(),
        items: payload.items,
        total,
      };
    },
  });
}
