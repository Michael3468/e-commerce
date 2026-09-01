export interface NavLink {
  readonly label: string;
  readonly href: string;
}

/** Ссылки основной навигации в шапке (статические страницы). */
export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Главная', href: '/' },
  { label: 'Личный кабинет', href: '/account' },
];

