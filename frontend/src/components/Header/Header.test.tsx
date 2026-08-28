import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './index';

// next/link в среде jsdom рендерится как <a> без навигации — достаточно
// смоук-теста, что компонент отрисовался со всеми ключевыми элементами.
describe('Header', () => {
  it('рендерит навигацию и корзину', () => {
    render(<Header />);

    expect(
      screen.getByRole('navigation', { name: 'Основная навигация' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Пиццы' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Оформление' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Личный кабинет' }),
    ).toBeInTheDocument();

    // Кнопка корзины имеет aria-label.
    expect(screen.getByRole('link', { name: /Корзина/ })).toBeInTheDocument();
  });
});
