import axios from 'axios';

/**
 * Адреса backend API. Различаются адрес для клиентских (браузер) и
 * серверных (SSR) запросов, потому что внутри docker-сети backend доступен
 * по имени сервиса "backend", а из браузера — по публичному адресу.
 */

// Публичный адрес для запросов из браузера (встраивается в клиентский бандл).
const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

// Внутренний адрес для серверных вызовов (доступен только на сервере).
const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? PUBLIC_API_URL;

/** true, если код выполняется на сервере (SSR). */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/** Возвращает подходящий базовый URL в зависимости от окружения выполнения. */
export function getApiBaseUrl(): string {
  return isServer() ? INTERNAL_API_URL : PUBLIC_API_URL;
}

/**
 * Обёртка над axios. Базовый URL выбирается один раз на момент импорта:
 * на сервере будет внутренний адрес, в браузере — публичный.
 */
export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default apiClient;
