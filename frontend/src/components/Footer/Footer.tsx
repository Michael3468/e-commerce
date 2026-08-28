export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-4 py-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} E-Commerce. Демо-заготовка интернет-магазина.</p>
        <nav aria-label="Правовая информация">
          <ul className="flex gap-4">
            <li>
              <a href="#" className="hover:text-gray-700">
                Политика конфиденциальности
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-700">
                Условия продажи
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
