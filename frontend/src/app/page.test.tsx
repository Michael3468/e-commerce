import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from '@/app/page';
import type { Product } from '@/types/product';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cart';

vi.mock('@/hooks/useProducts');

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Пепперони',
    description: 'Острая пицца',
    price: 590,
    category: 'Классические',
  },
];

describe('HomePage', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('рендерит карточки товаров с ценой и кнопкой в одной строке', async () => {
    vi.mocked(useProducts).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useProducts>);

    render(<HomePage />);

    const price = screen.getByText('590 ₽');
    const button = screen.getByRole('button', {
      name: 'Добавить «Пепперони» в корзину',
    });
    const image = screen.getByRole('img', { name: 'Пепперони' });

    expect(price).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('pizza2.png'));

    const card = price.closest('[class*="max-w-"]');
    expect(card).toHaveClass('max-w-[18.75rem]');

    const rowContainer = price.parentElement;
    expect(rowContainer).toContainElement(button);
    expect(rowContainer).toHaveClass('flex', 'items-center', 'justify-between');

    const user = userEvent.setup();
    await user.click(button);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.productId).toBe(1);

    const list = screen.getByRole('list');
    expect(list).toHaveClass(
      'grid',
      'grid-cols-[repeat(auto-fill,minmax(min(100%,18.75rem),18.75rem))]',
      'justify-between',
      'gap-y-6',
    );
  });
});
