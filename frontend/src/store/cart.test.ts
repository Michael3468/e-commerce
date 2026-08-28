import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from './cart';
import type { Product } from '@/types/product';

const productA: Product = {
  id: 1,
  title: 'Товар A',
  price: 100,
  description: 'Описание A',
  category: 'Категория',
};

const productB: Product = {
  id: 2,
  title: 'Товар B',
  price: 250,
  description: 'Описание B',
  category: 'Категория',
};

describe('useCartStore', () => {
  // Сбрасываем состояние между тестами.
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('добавляет товар в корзину', () => {
    useCartStore.getState().addItem(productA);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      productId: 1,
      title: 'Товар A',
      price: 100,
      quantity: 1,
    });
  });

  it('увеличивает количество при добавлении одного и того же товара', () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().addItem(productA, 2);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it('удаляет товар из корзины', () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().addItem(productB);

    useCartStore.getState().removeItem(productA.id);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe(productB.id);
  });

  it('изменяет количество товара', () => {
    useCartStore.getState().addItem(productA);

    useCartStore.getState().updateQuantity(productA.id, 5);

    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('удаляет позицию при установке количества 0', () => {
    useCartStore.getState().addItem(productA);

    useCartStore.getState().updateQuantity(productA.id, 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('очищает корзину', () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().addItem(productB);

    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('считает итоговую сумму корзины', () => {
    useCartStore.getState().addItem(productA, 2); // 200
    useCartStore.getState().addItem(productB, 1); // 250

    expect(useCartStore.getState().getTotal()).toBe(450);
  });

  it('считает общее количество позиций', () => {
    useCartStore.getState().addItem(productA, 2);
    useCartStore.getState().addItem(productB, 3);

    expect(useCartStore.getState().getItemsCount()).toBe(5);
  });
});
