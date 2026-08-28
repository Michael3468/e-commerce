'use client';

import Link from 'next/link';
import { NAV_LINKS } from './model/constants';
import CartButton from './UI/CartButton';

export default function Header() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'E-Commerce';

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4">
        <Link
          href="/"
          aria-label="На главную"
          className="text-xl font-bold text-brand-700"
        >
          {siteName}
        </Link>

        <nav
          aria-label="Основная навигация"
          className="flex items-center gap-4"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <CartButton />
      </div>
    </header>
  );
}
