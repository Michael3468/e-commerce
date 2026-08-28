'use client';

import Link from 'next/link';
import { Button, Card } from '@/components/UI';
import { useCartStore } from '@/store/cart';

/** Страница корзины. */
export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const total = getTotal();

  if (items.length === 0) {
    return (
      <section aria-label="Корзина" className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Корзина пуста</h1>
        <Link
          href="/"
          className="inline-block text-sm font-medium text-brand-600 hover:underline"
        >
          Перейти в каталог
        </Link>
      </section>
    );
  }

  return (
    <section aria-label="Корзина">
      <h1 className="mb-6 text-2xl font-bold">Корзина</h1>

      <ul className="mb-6 flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.productId}>
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-500">{item.price} ₽ / шт.</p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="sr-only" htmlFor={`qty-${item.productId}`}>
                    Количество
                  </label>
                  <input
                    id={`qty-${item.productId}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, Number(e.target.value))
                    }
                    className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                  <span className="w-24 text-right font-medium">
                    {item.price * item.quantity} ₽
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Удалить «${item.title}» из корзины`}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mb-6 flex items-center justify-between">
        <span className="text-lg font-bold">Итого: {total} ₽</span>
        <Button
          variant="secondary"
          onClick={clearCart}
          aria-label="Очистить корзину"
        >
          Очистить корзину
        </Button>
      </div>

      <Link
        href="/checkout"
        className="inline-flex w-full items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      >
        Оформить заказ
      </Link>
    </section>
  );
}
