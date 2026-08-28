'use client';

import Link from 'next/link';
import { NAV_LINKS } from './model/constants';
import CartButton from './UI/CartButton';

export default function Header() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Pizza Store';

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
            className="flex items-center gap-4"
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
          </nav>

          <CartButton />
        </div>
      </div>
    </header>
  );
}
