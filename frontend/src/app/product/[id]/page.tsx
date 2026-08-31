'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, type ReactNode } from 'react';
import { Button, Card } from '@/components/UI';
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
      <Card className="max-w-2xl border border-orange-100">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-orange-50/50 sm:aspect-[2/1]">
            <Image
              src={product.imageUrl || '/pizza2.png'}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-contain p-4"
              priority
              unoptimized={Boolean(product.imageUrl)}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              {product.title}
            </h1>
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
              🌱 {product.category}
            </span>
          </div>
          <p className="text-base text-gray-600 leading-relaxed">
            {product.description}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-orange-50 pt-4">
            <span className="text-2xl font-extrabold text-gray-900">
              {product.price} <span className="text-pizza-red">₽</span>
            </span>
            <Button
              onClick={() => addItem(product)}
              aria-label={`Добавить «${product.title}» в корзину`}
            >
              В корзину
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section aria-label="Информация о товаре">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pizza-red hover:text-pizza-red-dark hover:underline"
      >
        ← Назад в меню
      </Link>
      {content}
    </section>
  );
}
