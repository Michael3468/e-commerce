'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button, Card } from '@/components/UI';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cart';

/**
 * Главная страница — меню пиццерии.
 *
 * Загружает список продуктов через хук {@link useProducts} и выводит
 * их в виде сетки карточек. Управляет добавлением товара в корзину
 * через {@link useCartStore}.
 *
 * Состояния загрузки и ошибки обрабатываются отдельно: при загрузке
 * показывается сообщение, при ошибке — кнопка повторного запроса.
 *
 * @returns {JSX.Element} Разметка страницы меню либо индикатор состояния.
 */
export default function HomePage() {
  const { data: products, isLoading, isError, refetch } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  if (isLoading) {
    return <p className="text-gray-500">Загрузка меню…</p>;
  }

  if (isError || !products) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-red-600">Не удалось загрузить меню пиццерии.</p>
        <Button onClick={() => void refetch()} variant="secondary">
          Повторить
        </Button>
      </div>
    );
  }

  return (
    <section aria-label="Меню пиццы">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-orange-200/60 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            🍕 Свежее меню пиццы
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Горячая аппетитная пицца с натуральными ингредиентами и хрустящей
            корочкой
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18.75rem),18.75rem))] justify-between gap-y-6">
        {products.map((product) => (
          <li key={product.id}>
            <Card className="flex h-full max-w-[18.75rem] flex-col border border-orange-100/80 hover:border-amber-300">
              <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-orange-50/50">
                <Image
                  src={product.imageUrl || '/pizza2.png'}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-contain p-2 transition-transform duration-300 hover:scale-105"
                  unoptimized={Boolean(product.imageUrl)}
                />
              </div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <Link
                  href={`/product/${product.id}`}
                  className="text-lg font-bold text-gray-900 transition-colors hover:text-pizza-red"
                >
                  {product.title}
                </Link>
              </div>
              <span className="mb-2 inline-flex w-fit items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
                🌱 {product.category}
              </span>
              <p className="mb-4 flex-1 text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
              <div className="mt-auto flex items-center justify-between gap-4 pt-2 border-t border-orange-50">
                <span className="text-xl font-extrabold text-gray-900">
                  {product.price} ₽
                </span>
                <Button
                  onClick={() => addItem(product)}
                  aria-label={`Добавить «${product.title}» в корзину`}
                >
                  В корзину
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
