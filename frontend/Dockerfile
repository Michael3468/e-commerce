# --- Этап 1: установка зависимостей ---
FROM node:20-alpine AS deps
WORKDIR /app

# Копируем только манифесты, чтобы использовать кеш Docker слоёв
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# --- Этап 2: сборка приложения ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Внутри контейнера backend доступен по имени сервиса (docker-compose сеть),
# а не через NEXT_PUBLIC_*. Значения по умолчанию задаются как fallback.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# --- Этап 3: production-образ (standalone) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Не запускаем под root
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Копируем standalone-сборку (сгенерирована благодаря output: "standalone")
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]