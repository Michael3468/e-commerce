'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button, Card, Input } from '@/components/UI';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { useCartStore } from '@/store/cart';

/** Страница оформления заказа. */
export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const createOrder = useCreateOrder();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const total = getTotal();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createOrder.mutate(
      {
        items: items.map((item) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: () => {
          clearCart();
        },
      },
    );
  };

  if (items.length === 0) {
    return (
      <section aria-label="Оформление заказа" className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Оформление заказа</h1>
        <p className="text-gray-500">
          Корзина пуста — добавьте товары перед оформлением.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Оформление заказа" className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Оформление заказа</h1>

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Ваш заказ</h2>
        <ul className="mb-4 flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex items-center justify-between text-sm"
            >
              <span>
                {item.title} × {item.quantity}
              </span>
              <span className="font-medium">
                {item.price * item.quantity} ₽
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 pt-3 text-right text-lg font-bold">
          Итого: {total} ₽
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" disabled={createOrder.isPending}>
          {createOrder.isPending ? 'Отправка…' : 'Подтвердить заказ'}
        </Button>

        {createOrder.isError ? (
          <p className="text-sm text-red-600">
            Не удалось оформить заказ. Попробуйте ещё раз.
          </p>
        ) : null}
        {createOrder.isSuccess ? (
          <p className="text-sm text-green-600">
            Заказ № {createOrder.data.id.slice(0, 8)} успешно оформлен.
          </p>
        ) : null}
      </form>
    </section>
  );
}
