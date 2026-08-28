'use client';

import Link from 'next/link';
import { use, type ReactNode } from 'react';
import { Button } from '@/components/UI';
import { useProduct } from '@/hooks/useProduct';
import { useCartStore } from '@/store/cart';

interface ProductPageProps {
  readonly params: Promise<{ id: string }>;
}

/** Страница конкретного товара по id. */
export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const productId = Number(id);
  const { data: product, isLoading, isError } = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);

  let content: ReactNode;

  if (isLoading) {
    content = <p className="text-gray-500">Загрузка товара…</p>;
  } else if (isError || !product) {
    content = <p className="text-red-600">Товар не найден.</p>;
  } else {
    content = (
      <div className="max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold">{product.title}</h1>
        <p className="mb-4 text-sm text-gray-500">{product.category}</p>
        <p className="mb-6 text-gray-700">{product.description}</p>
        <p className="mb-6 text-2xl font-bold">{product.price} ₽</p>
        <Button
          onClick={() => addItem(product)}
          aria-label={`Добавить «${product.title}» в корзину`}
        >
          В корзину
        </Button>
      </div>
    );
  }

  return (
    <section aria-label="Информация о товаре">
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-brand-600 hover:underline"
      >
        ← Назад в каталог
      </Link>
      {content}
    </section>
  );
}
