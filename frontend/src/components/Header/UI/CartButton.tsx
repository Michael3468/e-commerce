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
      className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
    >
      <span aria-hidden="true">🛒</span>
      {count > 0 ? (
        <span
          data-testid="cart-count"
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white"
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
