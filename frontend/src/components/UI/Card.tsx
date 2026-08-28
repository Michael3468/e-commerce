import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Пропсы для компонента карточки `Card`.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Дочерние элементы карточки. */
  readonly children: ReactNode;
}

/**
 * Базовый компонент карточки с плавной анимацией и тенью при наведении.
 *
 * @param props - Свойства компонента карточки {@link CardProps}.
 * @returns JSX элемент карточки.
 */
export default function Card({ children, className, ...rest }: Readonly<CardProps>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-orange-100 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

