'use client';

import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { NAV_LINKS } from './model/constants';
import CartButton from './UI/CartButton';

/**
 * Хедер сайта со ссылками на главную страницу, категории товаров,
 * страницы оформления и личного кабинета, а также кнопкой корзины.
 *
 * @returns {JSX.Element} Разметка шапки сайта.
 */
export default function Header() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Pizza Store';
  const { data: categories } = useCategories();

  return (
    <header className="border-b border-orange-200/60 bg-white/75 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4">
        <Link
          href="/"
          aria-label="На главную"
          className="flex items-center gap-2 text-xl font-extrabold text-pizza-red hover:text-pizza-red-dark transition-colors"
        >
          <span className="text-2xl" role="img" aria-label="pizza">
            🍕
          </span>
          <span className="tracking-tight">{siteName}</span>
        </Link>

        <div className="ml-auto flex items-center gap-6">
          <nav
            aria-label="Основная навигация"
            className="flex items-center gap-4 flex-wrap"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-gray-700 transition-colors hover:text-pizza-red"
              >
                {link.label}
              </Link>
            ))}

            {categories && categories.length > 0 && (
              <div
                aria-label="Категории товаров"
                className="flex items-center gap-3 border-l border-orange-200/80 pl-3"
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/?category=${cat.id}`}
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-pizza-red"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </nav>

          <CartButton />
        </div>
      </div>
    </header>
  );
}

