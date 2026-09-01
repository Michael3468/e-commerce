/** Типы доменной модели интернет-магазина. */

export interface Product {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
  readonly category_name?: string;
  readonly image?: string | null;
  readonly imageUrl?: string;
}

/** Ответ API со списком товаров (поддержка пагинации DRF и плоского массива). */
export interface PaginatedProductsResponse {
  readonly count: number;
  readonly next: string | null;
  readonly previous: string | null;
  readonly results: readonly Product[];
}

export interface OrderItem {
  readonly productId: number;
  readonly title: string;
  readonly price: number;
  readonly quantity: number;
}

export interface CreateOrderPayload {
  readonly items: OrderItem[];
}

export interface Order {
  readonly id: string;
  readonly items: OrderItem[];
  readonly total: number;
}
