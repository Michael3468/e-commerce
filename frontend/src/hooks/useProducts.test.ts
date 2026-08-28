import { describe, expectTypeOf, it } from 'vitest';
import type { Product } from '@/types/product';
import { useProducts } from '@/hooks/useProducts';

/**
 * Compile-time проверки типов данных, которые возвращает хук {@link useProducts}.
 *
 * `expectTypeOf` выполняет проверку на уровне типов: если тип `data` перестанет
 * выводиться как `readonly Product[]` (например, превратится в `any[]`),
 * сборка упадёт на этапе компиляции — что и было корнем ошибки ts(7006).
 */
describe('useProducts — типизация данных', () => {
  it('data имеет тип readonly Product[] | undefined', () => {
    type Data = ReturnType<typeof useProducts>['data'];
    expectTypeOf<Data>().toEqualTypeOf<readonly Product[] | undefined>();
  });

  it('элемент массива каталога соответствует интерфейсу Product', () => {
    type Item = NonNullable<ReturnType<typeof useProducts>['data']>[number];
    expectTypeOf<Item>().toEqualTypeOf<Product>();
  });
});
