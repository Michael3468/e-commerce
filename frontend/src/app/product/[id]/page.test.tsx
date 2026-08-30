import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProductPage from './page';
import { useProduct } from '@/hooks/useProduct';
import { useCartStore } from '@/store/cart';

vi.mock('@/hooks/useProduct');

const mockProduct = {
  id: 1,
  title: 'Пепперони',
  description: 'Острая пицца с колбасками',
  price: 590,
  category: 'Классические',
};

describe('ProductPage', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('рендерит изображение, название, описание, цену и кнопку добавления в корзину', async () => {
    vi.mocked(useProduct).mockReturnValue({
      data: mockProduct,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useProduct>);

    const paramsPromise = Promise.resolve({ id: '1' });
    await act(async () => {
      render(<ProductPage params={paramsPromise} />);
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Пепперони' })).toBeInTheDocument();
    });

    const heading = screen.getByRole('heading', { level: 1, name: 'Пепперони' });
    const image = screen.getByRole('img', { name: 'Пепперони' });
    const price = screen.getByText('590');
    const button = screen.getByRole('button', { name: 'Добавить «Пепперони» в корзину' });

    expect(heading).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('pizza2.png'));
    expect(price).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(button);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.productId).toBe(1);
  });
});

