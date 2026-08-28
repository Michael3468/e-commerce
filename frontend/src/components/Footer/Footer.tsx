export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-orange-200/60 bg-amber-50/50">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-4 py-6 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 font-medium">
          <span>🍕</span> © {year} Pizza Store. Доставка горячей пиццы.
        </p>
        <nav aria-label="Правовая информация">
          <ul className="flex gap-4">
            <li>
              <a href="#" className="hover:text-pizza-red transition-colors">
                Политика конфиденциальности
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pizza-red transition-colors">
                Условия продажи
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
