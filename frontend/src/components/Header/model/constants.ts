export interface NavLink {
  readonly label: string;
  readonly href: string;
}

/** Ссылки основной навигации в шапке. */
export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Каталог', href: '/' },
  { label: 'Оформление', href: '/checkout' },
  { label: 'Личный кабинет', href: '/account' },
];
