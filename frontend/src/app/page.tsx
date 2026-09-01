'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button, Card } from '@/components/UI';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cart';

/**
 * Внутренний компонент каталога с чтением query параметров searchParams.
 *
 * @returns {JSX.Element} Разметка каталога товаров.
 */
function ProductsCatalog() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const selectedCategoryId = categoryParam ? Number(categoryParam) : undefined;

  const { data: products, isLoading, isError, refetch } = useProducts(
    selectedCategoryId !== undefined && !Number.isNaN(selectedCategoryId)
      ? { category: selectedCategoryId }
      : undefined,
  );
  const { data: categories } = useCategories();
  const addItem = useCartStore((state) => state.addItem);

  const selectedCategory =
    selectedCategoryId !== undefined
      ? categories?.find((c) => c.id === selectedCategoryId)
      : undefined;

  if (isLoading) {
    return <p className="text-gray-500">Загрузка меню…</p>;
  }

  if (isError || !products) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-red-600">Не удалось загрузить меню товаров.</p>
        <Button onClick={() => void refetch()} variant="secondary">
          Повторить
        </Button>
      </div>
    );
  }

  const title = selectedCategory
    ? `Категория: ${selectedCategory.name}`
    : '🍕 Все товары';

  return (
    <section aria-label="Меню товаров">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-orange-200/60 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {selectedCategory
              ? `Товары из категории «${selectedCategory.name}»`
              : 'Горячая аппетитная пицца, напитки и закуски с быстрой доставкой'}
          </p>
        </div>
        {selectedCategory && (
          <Link
            href="/"
            className="text-sm font-semibold text-pizza-red hover:text-pizza-red-dark transition-colors"
          >
            ← Показать все товары
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p className="text-lg">В этой категории пока нет товаров.</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-semibold text-pizza-red hover:text-pizza-red-dark"
          >
            Вернуться ко всем товарам
          </Link>
        </div>
      ) : (
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
      )}
    </section>
  );
}

/**
 * Главная страница — каталог товаров.
 *
 * Отображает все доступные товары либо фильтрует по выбранной категории из URL-параметра `?category=id`.
 *
 * @returns {JSX.Element} Разметка страницы каталога.
 */
export default function HomePage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Загрузка каталога…</p>}>
      <ProductsCatalog />
    </Suspense>
  );
}

