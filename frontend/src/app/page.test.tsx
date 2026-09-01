import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSearchParams } from 'next/navigation';
import HomePage from '@/app/page';
import type { Product } from '@/types/product';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useCartStore } from '@/store/cart';

vi.mock('@/hooks/useProducts');
vi.mock('@/hooks/useCategories');
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Пепперони',
    description: 'Острая пицца',
    price: 590,
    category: 'Классические',
  },
];

/**
 * Тестовый набор для главной страницы HomePage.
 * Проверяет отображение карточек товаров, фильтрацию по категории
 * из query-параметра и обработку пустого состояния.
 */
describe('HomePage', () => {
  /**
   * Подготавливает окружение перед каждым тестом:
   * очищает корзину, сбрасывает query-параметры и мокает данные категорий.
   */
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>,
    );
    vi.mocked(useCategories).mockReturnValue({
      data: [{ id: 1, name: 'Классические', slug: 'classic' }],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useCategories>);
  });

  /**
   * Проверяет, что карточка товара отображает цену и кнопку добавления
   * в корзину в одной строке, а клик по кнопке добавляет товар в корзину.
   */
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

  /**
   * Проверяет, что товары фильтруются по выбранной категории из
   * query-параметра, отображается заголовок категории и ссылка назад ко всем товарам.
   */
  it('фильтрует товары по категории из query-параметра и показывает заголовок категории', async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('category=1') as unknown as ReturnType<
        typeof useSearchParams
      >,
    );
    vi.mocked(useProducts).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useProducts>);

    render(<HomePage />);

    expect(useProducts).toHaveBeenCalledWith({ category: 1 });
    expect(
      screen.getByRole('heading', { name: 'Категория: Классические' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Товары из категории «Классические»'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '← Показать все товары' }),
    ).toHaveAttribute('href', '/');
    expect(screen.getByRole('img', { name: 'Пепперони' })).toBeInTheDocument();
  });

  /**
   * Проверяет, что при отсутствии товаров в выбранной категории
   * показывается сообщение о пустом состоянии и ссылка возврата ко всем товарам.
   */
  it('показывает пустое состояние, когда в выбранной категории нет товаров', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('category=999') as unknown as ReturnType<
        typeof useSearchParams
      >,
    );
    vi.mocked(useProducts).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useProducts>);

    render(<HomePage />);

    expect(useProducts).toHaveBeenCalledWith({ category: 999 });
    expect(
      screen.getByText('В этой категории пока нет товаров.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Вернуться ко всем товарам' }),
    ).toHaveAttribute('href', '/');
  });
});
