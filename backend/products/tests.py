"""Tests for products API."""
import pytest
from rest_framework.test import APIClient
from products.models import Category, Product


@pytest.mark.django_db
class TestProductsAPI:
    def setup_method(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Пиццы', slug='pizzas')
        self.product = Product.objects.create(
            title='Пепперони',
            description='Вкусная пицца',
            price=500.00,
            category=self.category,
            image_url='http://example.com/pizza.jpg',
            is_available=True,
        )

    def test_get_products_list(self):
        response = self.client.get('/api/products/')
        assert response.status_code == 200
        # Check pagination or direct results
        results = response.data.get('results', response.data)
        assert len(results) == 1
        assert results[0]['title'] == 'Пепперони'
        assert float(results[0]['price']) == 500.00
        assert results[0]['imageUrl'] == 'http://example.com/pizza.jpg'
        assert results[0]['category_name'] == 'Пиццы'
        assert results[0]['category'] == 'Пиццы'

    def test_get_product_detail(self):
        response = self.client.get(f'/api/products/{self.product.id}/')
        assert response.status_code == 200
        assert response.data['title'] == 'Пепперони'

    def test_get_categories_list(self):
        response = self.client.get('/api/categories/')
        assert response.status_code == 200
        results = response.data.get('results', response.data)
        assert len(results) == 1
        assert results[0]['name'] == 'Пиццы'
        assert results[0]['slug'] == 'pizzas'
