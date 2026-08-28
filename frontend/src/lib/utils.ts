import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединяет классы: clsx собирает условные классы,
 * tailwind-merge разрешает конфликты Tailwind-утилит.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
