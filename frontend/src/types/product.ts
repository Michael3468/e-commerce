/** Типы доменной модели интернет-магазина. */

export interface Product {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
  readonly imageUrl?: string;
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
