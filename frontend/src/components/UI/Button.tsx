import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-pizza-red focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-pizza-red text-white bg-orange-500 shadow-sm hover:bg-pizza-red-dark hover:shadow active:bg-red-800',
  secondary:
    'bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200 active:bg-amber-300',
  ghost:
    'bg-transparent text-gray-700 hover:bg-amber-50 hover:text-pizza-red active:bg-amber-100',
};

export default function Button({
  type = 'button',
  children,
  variant = 'primary',
  className,
  ...rest
}: Readonly<ButtonProps>) {
  return (
    <button
      type={type}
      className={cn(baseClasses, variantClasses[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
