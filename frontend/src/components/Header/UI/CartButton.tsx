'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';

export default function CartButton() {
  const itemsCount = useCartStore((state) => state.items);

  const count = itemsCount.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/cart"
      aria-label={`Корзина, товаров: ${count}`}
      className="relative inline-flex items-center gap-1.5 rounded-full bg-pizza-yellow-light border border-amber-200 px-3.5 py-1.5 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-100 hover:border-amber-300"
    >
      <span aria-hidden="true" className="text-base">🛒</span>
      <span className="text-xs font-bold text-amber-900">Корзина</span>
      {count > 0 ? (
        <span
          data-testid="cart-count"
          className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pizza-red px-1.5 text-xs font-bold text-white shadow-sm"
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
