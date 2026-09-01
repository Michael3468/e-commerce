import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './index';
import { useCategories } from '@/hooks/useCategories';

vi.mock('@/hooks/useCategories');

// next/link в среде jsdom рендерится как <a> без навигации — достаточно
// смоук-теста, что компонент отрисовался со всеми ключевыми элементами.
describe('Header', () => {
  it('рендерит навигацию, категории и корзину', () => {
    vi.mocked(useCategories).mockReturnValue({
      data: [
        { id: 1, name: 'Пиццы', slug: 'pizzas' },
        { id: 2, name: 'Напитки', slug: 'drinks' },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useCategories>);

    render(<Header />);

    expect(
      screen.getByRole('navigation', { name: 'Основная навигация' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Главная' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Пиццы' })).toHaveAttribute(
      'href',
      '/?category=1',
    );
    expect(screen.getByRole('link', { name: 'Напитки' })).toHaveAttribute(
      'href',
      '/?category=2',
    );
    expect(
      screen.queryByRole('link', { name: 'Оформление' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Личный кабинет' }),
    ).toBeInTheDocument();

    // Кнопка корзины имеет aria-label.
    expect(screen.getByRole('link', { name: /Корзина/ })).toBeInTheDocument();
  });
});

