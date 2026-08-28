'use client';

import Link from 'next/link';
import { Button, Card } from '@/components/UI';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cart';

/** Главная страница — каталог товаров. */
export default function HomePage() {
  const { data: products, isLoading, isError, refetch } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  if (isLoading) {
    return <p className="text-gray-500">Загрузка каталога…</p>;
  }

  if (isError || !products) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-red-600">Не удалось загрузить каталог.</p>
        <Button onClick={() => void refetch()} variant="secondary">
          Повторить
        </Button>
      </div>
    );
  }

  return (
    <section aria-label="Каталог товаров">
      <h1 className="mb-6 text-2xl font-bold">Каталог</h1>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.id}>
            <Card className="flex h-full flex-col">
              <Link
                href={`/product/${product.id}`}
                className="mb-2 text-lg font-semibold text-gray-900 hover:text-brand-600"
              >
                {product.title}
              </Link>
              <p className="mb-2 flex-1 text-sm text-gray-500">
                {product.category}
              </p>
              <p className="mb-4 text-lg font-bold">{product.price} ₽</p>
              <Button
                onClick={() => addItem(product)}
                aria-label={`Добавить «${product.title}» в корзину`}
              >
                В корзину
              </Button>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
