# E-Commerce

Монорепозиторий интернет-магазина: **фронтенд на Next.js** и **бэкенд на Django/DRF** (бэкенд появится на следующем этапе). Запуск — через Docker.

## Структура

```
e-commerce/
├── frontend/          # Next.js (App Router) + TypeScript + Tailwind + Zustand + TanStack Query
├── backend/           # Django/DRF (планируется, пока отсутствует)
└── README.md
```

## Git / коммиты

В корне проекта настроен [Commitizen](https://commitizen.github.io/cz-cli/) с
адаптером `cz-conventional-changelog` для создания коммитов по
[Conventional Commits](https://www.conventionalcommits.org/).

```bash
npm run commit   # интерактивный мастер создания коммита
```

## Стек

### Frontend (`frontend/`)

- [Next.js](https://nextjs.org/) 15 (App Router), React 19, TypeScript
- [Tailwind CSS](https://tailwindcss.com/) — стилизация
- SVG-фавикон сайта (пицца 🍕) — [`frontend/src/app/favicon.svg`](frontend/src/app/favicon.svg), подключён в metadata корневого layout
- [Zustand](https://zustand.docs.pmnd.rs/) — стейт (стор корзины с persist в localStorage)
- [TanStack Query](https://tanstack.com/query) — серверное состояние (каталог, товар, заказ)
- [axios](https://axios-http.com/) — HTTP-клиент к backend API
- `clsx` + `tailwind-merge` — утилита объединения классов
- [Vitest](https://vitest.dev/) + Testing Library — тесты
- ESLint — линтинг

## Frontend

### Запуск локально

```bash
cd frontend
npm install

# настроить переменные окружения (по желанию)
cp .env.example .env.local

npm run dev        # http://localhost:3000
```

### Переменные окружения

| Переменная              | Описание                                                                              | По умолчанию                |
| ----------------------- | ------------------------------------------------------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL`   | Публичный адрес backend API для запросов из браузера                                  | `http://localhost:8000/api` |
| `INTERNAL_API_URL`      | Адрес backend для серверных (SSR) вызовов; внутри docker-сети — имя сервиса `backend` | `NEXT_PUBLIC_API_URL`       |
| `NEXT_PUBLIC_SITE_NAME` | Название магазина в шапке                                                             | `E-Commerce`                |

> Внутри docker-сети и из браузера адреса backend разные: контейнер обращается
> к сервису по имени `backend`, а браузер — по публичному адресу. Поэтому
> используются две переменные: `NEXT_PUBLIC_API_URL` (клиент) и
> `INTERNAL_API_URL` (сервер). См. [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts).

### Docker

Dockerfile использует multi-stage сборку и standalone-вывод Next.js:

```bash
cd frontend
docker build -t e-commerce-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000/api \
  -e INTERNAL_API_URL=http://backend:8000/api \
  e-commerce-frontend
```

Полноценный `docker-compose.yml` с сервисами `frontend` и `backend` появится на следующем этапе.

### Полезные команды

```bash
npm run dev         # dev-сервер
npm run build       # production-сборка
npm run start       # запуск production-сборки
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test        # Vitest (разовый прогон)
npm run test:watch  # Vitest (watch)
```

### Основные роуты

| Роут            | Описание          |
| --------------- | ----------------- |
| `/`             | Каталог товаров   |
| `/product/[id]` | Страница товара   |
| `/cart`         | Корзина           |
| `/checkout`     | Оформление заказа |
| `/account`      | Личный кабинет    |

## Статус

Проект находится на этапе фронтенд-заготовки. Backend ещё не создан, поэтому
данные каталога и заказов — моковые заглушки
([`frontend/src/data/mockProducts.ts`](frontend/src/data/mockProducts.ts));
хуки заменят их вызовами реального API после подключения бэкенда.
