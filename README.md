# E-Commerce

Монорепозиторий интернет-магазина: **фронтенд на Next.js** и **бэкенд на Django / Django REST Framework / PostgreSQL / Celery / Redis**. Запуск — через Docker Compose.

## Структура

```
e-commerce/
├── frontend/          # Next.js 15 (App Router) + TypeScript + Tailwind + Zustand + TanStack Query
├── backend/           # Django 5 + DRF + PostgreSQL + Celery + Redis
├── docker-compose.yml # Сервисы: frontend, backend, db, redis, celery_worker
└── README.md
```

## Git / коммиты

В корне проекта настроен [Commitizen](https://commitizen.github.io/cz-cli/) с
адаптером `cz-conventional-changelog` для создания коммитов по
[Conventional Commits](https://www.conventionalcommits.org/).

Также настроены Git-хуки с помощью [Husky](https://typicode.github.io/husky/) и [lint-staged](https://github.com/lint-staged/lint-staged). При коммите изменений во фронтенде (`frontend/**/*.{js,jsx,ts,tsx}`) автоматически запускаются проверки ESLint, TypeScript и тесты Vitest.

```bash
npm run commit   # интерактивный мастер создания коммита
```

## Стек

### Frontend (`frontend/`)

- [Next.js](https://nextjs.org/) 15 (App Router), React 19, TypeScript
- [Tailwind CSS](https://tailwindcss.com/) — стилизация
- [Zustand](https://zustand.docs.pmnd.rs/) — стейт (стор корзины с persist в localStorage)
- [TanStack Query](https://tanstack.com/query) — серверное состояние (каталог, товар, заказ)
- [axios](https://axios-http.com/) — HTTP-клиент к backend API
- `clsx` + `tailwind-merge` — утилита объединения классов
- [Vitest](https://vitest.dev/) + Testing Library — тесты
- ESLint — линтинг

### Backend (`backend/`)

- [Django](https://www.djangoproject.com/) 5 + [Django REST Framework](https://www.django-rest-framework.org/) (DRF)
- [PostgreSQL](https://www.postgresql.org/) (драйвер `psycopg 3`)
- [Celery](https://docs.celeryq.dev/) + [Redis](https://redis.io/) — фоновые задачи (обработка заказов)
- [drf-spectacular](https://drf-spectacular.readthedocs.io/) — OpenAPI 3 / Swagger документация
- [django-cors-headers](https://github.com/adamchainz/django-cors-headers) — CORS-заголовки для интеграции с Next.js
- [django-filter](https://django-filter.readthedocs.io/) — фильтрация товаров по категориям и полям
- `Pillow` — обработка и загрузка изображений товаров
- [pytest-django](https://pytest-django.readthedocs.io/) — тестирование API

---

## Запуск всего проекта через Docker Compose

```bash
# Сборка и запуск всех сервисов (frontend, backend, db, redis, celery_worker)
docker compose up --build
```

После старта будут доступны:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Swagger UI (документация API)**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## Backend (`backend/`)

### Локальный запуск без Docker

```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate на Windows
pip install -r requirements.txt

# Применение миграций и загрузка тестовых товаров
python manage.py migrate
python manage.py seed_products

# Запуск сервера
python manage.py runserver 0.0.0.0:8000
```

> **Про `seed_products`:** команда выполняется при каждом старте бэкенда
> ([`docker-compose.yml`](docker-compose.yml)) и создаёт только начальные
> категории **«Напитки»** и **«Закуски»** и пару демо-товаров. Категория
> **«Пиццы»** намеренно **не** создаётся сидом — это сделано для того, чтобы
> удалённая в админке категория не возвращалась после перезапуска контейнера.
> Если она нужна, создайте её вручную через Django Admin
> ([http://localhost:8000/admin/](http://localhost:8000/admin/)).
>
> Команда идемпотентна: повторный запуск не создаёт дубликатов
> (`get_or_create` / `update_or_create`).

### Фоновые задачи Celery (при наличии Redis)

```bash
celery -A config worker --loglevel=info
```

### Запуск тестов бэкенда

**Через Docker Compose (рекомендуется):**

```bash
docker compose exec backend pytest
```

**Локально в виртуальном окружении:**

```bash
cd backend
# убедитесь, что виртуальное окружение активировано и установлены зависимости:
# source venv/bin/activate
pytest
```

### Основные эндпоинты API

| Метод  | URL                   | Описание                                                                        |
| ------ | --------------------- | ------------------------------------------------------------------------------- |
| `GET`  | `/api/products/`      | Список товаров (фильтры: `?category=1`, `?search=пепперони`, `?ordering=price`) |
| `POST` | `/api/products/`      | Создание товара (поддерживает `multipart/form-data` для загрузки файла `image`) |
| `GET`  | `/api/products/{id}/` | Детали товара                                                                   |
| `GET`  | `/api/categories/`    | Список категорий                                                                |
| `POST` | `/api/orders/`        | Оформление заказа (запускает задачу Celery)                                     |
| `GET`  | `/api/orders/{id}/`   | Получение информации о заказе по UUID                                           |
| `GET`  | `/api/docs/`          | Интерактивная Swagger UI документация                                           |

---

## Frontend (`frontend/`)

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
