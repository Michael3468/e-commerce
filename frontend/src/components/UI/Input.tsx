import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string;
}

export default function Input({ label, className, id, ...rest }: InputProps) {
  const inputId = id ?? label;
  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn(
          'rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pizza-red focus:outline-none focus:ring-2 focus:ring-pizza-red/20',
          className,
        )}
        {...rest}
      />
    </div>
  );
}
