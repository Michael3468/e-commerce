"""Tests for orders API."""
import pytest
from rest_framework.test import APIClient
from products.models import Category, Product
from orders.models import Order


@pytest.mark.django_db
class TestOrdersAPI:
    def setup_method(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Пиццы', slug='pizzas')
        self.product = Product.objects.create(
            title='Маргарита',
            description='Сырная пицца',
            price=450.00,
            category=self.category,
            is_available=True,
        )

    def test_create_order(self):
        payload = {
            'customer_name': 'Иван Иванов',
            'customer_email': 'ivan@example.com',
            'customer_phone': '+79991234567',
            'shipping_address': 'ул. Ленина, д. 10, кв. 5',
            'items': [
                {
                    'productId': self.product.id,
                    'title': self.product.title,
                    'price': float(self.product.price),
                    'quantity': 2,
                }
            ],
        }

        response = self.client.post('/api/orders/', payload, format='json')
        assert response.status_code == 201
        data = response.data
        assert 'id' in data
        assert float(data['total']) == 900.00
        assert len(data['items']) == 1
        assert data['items'][0]['quantity'] == 2

        # Проверяем сохранение в базе
        order_in_db = Order.objects.get(id=data['id'])
        assert order_in_db.total == 900.00
        assert order_in_db.items.count() == 1
        assert order_in_db.items.first().product == self.product

    def test_get_order_detail(self):
        order = Order.objects.create(
            total=1000.00,
            customer_name='Петр',
        )
        response = self.client.get(f'/api/orders/{order.id}/')
        assert response.status_code == 200
        assert response.data['id'] == str(order.id)
        assert float(response.data['total']) == 1000.00
