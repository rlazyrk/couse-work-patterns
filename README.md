# couse-work-patterns

Повний стек: фронтенд — Vite + React (клієнтська SPA), бекенд — Express + Prisma (PostgreSQL). Нижче інструкція для запуску проєкту після клонування з GitHub.

## 1. Передумови

- [Node.js](https://nodejs.org/) 18+ (підтримує `npm` і `npx`)
- Docker / Docker Compose (для PostgreSQL)
- Git

## 2. Клонування

```bash
git clone https://github.com/<your-org>/couse-work-patterns.git
cd couse-work-patterns
```

## 3. Налаштування середовища

### 3.1. Запустіть базу даних (PostgreSQL) через Docker

```bash
cd server
docker compose up -d
```

Сервіс піднімає контейнер `flower_shop_postgres` з параметрами з `server/docker-compose.yml`.

### 3.2. Створіть `.env` для бекенда

У папці `server/` створіть файл `.env` зі змінними:

```
DATABASE_URL="postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:<POSTGRES_PORT>/<POSTGRES_DB>?schema=public"
JWT_SECRET=ваш_секрет
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

Підставте значення, які використовуєте в Docker Compose (або свій локальний ПЗ). Якщо запускаєте PostgreSQL поза Docker, налаштуйте там же.

### 3.3. Створіть `.env` для фронтенда

В папці `client/`:

```
VITE_API_BASE=http://localhost:3000
```

Ця змінна вказує, куди скрипти API посилають запити.

## 4. Налаштування і запуск бекенда

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

- `prisma generate` — підготовка Prisma Client
- `prisma migrate dev` — застосовує міграції до локальної БД
- `npm run dev` запускає сервер із `nodemon` на порту з `.env` (за замовчуванням 3000)

У браузері `/api/health` поверне `{ status: "OK" }`.

## 5. Налаштування і запуск фронтенда

У новій вкладці терміналу:

```bash
cd client
npm install
npm run dev 
```

- `npm run dev` стартує Vite. Вміст буде доступний за адресою `http://localhost:5173`.
- Всі API-виклики перенаправляються до бекенда через `VITE_API_BASE`.
