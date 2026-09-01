"""Tests for products API."""
import pytest
from django.core.management import call_command
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


@pytest.mark.django_db
class TestSeedProductsCommand:
    """Тесты management command seed_products."""

    def test_seed_does_not_create_pizzas_category(self):
        """Сид не должен создавать категорию «Пиццы», чтобы удалённая в админке
        категория не возвращалась после перезапуска."""
        call_command('seed_products')

        # Категория «Пиццы» не должна существовать ни по названию, ни по слагу.
        assert not Category.objects.filter(name='Пиццы', slug='pizzas').exists()
        # Остальные категории создаются.
        assert Category.objects.filter(name='Напитки', slug='drinks').exists()
        assert Category.objects.filter(name='Закуски', slug='snacks').exists()

    def test_seed_is_idempotent(self):
        """Повторный запуск сида не должен создавать дубликаты категорий/товаров."""
        call_command('seed_products')
        categories_before = Category.objects.count()
        products_before = Product.objects.count()

        call_command('seed_products')

        assert Category.objects.count() == categories_before
        assert Product.objects.count() == products_before
        # assert not Product.objects.filter(title='Пепперони').exists()
