"""Tests for products API."""
import io
from decimal import Decimal

import pytest
from PIL import Image
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from rest_framework.test import APIClient
from products.models import Category, Product

User = get_user_model()


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
        assert Decimal(str(results[0]['price'])) == Decimal('500.00')
        assert results[0]['imageUrl'] == 'http://example.com/pizza.jpg'
        assert results[0]['category_name'] == 'Пиццы'
        assert results[0]['category'] == 'Пиццы'

    def test_get_product_detail(self):
        response = self.client.get(f'/api/products/{self.product.id}/')
        assert response.status_code == 200
        assert response.data['title'] == 'Пепперони'

    def _png_upload(self, name='test_pizza.png'):
        file_obj = io.BytesIO()
        image = Image.new('RGBA', size=(50, 50), color=(255, 0, 0, 0))
        image.save(file_obj, 'png')
        file_obj.seek(0)
        return SimpleUploadedFile(name, file_obj.read(), content_type='image/png')

    def test_anonymous_cannot_create_product(self):
        response = self.client.post(
            '/api/products/',
            {
                'title': 'Четыре сыра',
                'description': 'Очень сырная',
                'price': '600.00',
            },
            format='multipart',
        )
        assert response.status_code == 403
        assert not Product.objects.filter(title='Четыре сыра').exists()

    def test_anonymous_cannot_update_or_delete_product(self):
        patch_response = self.client.patch(
            f'/api/products/{self.product.id}/',
            {'price': '1.00'},
            format='json',
        )
        delete_response = self.client.delete(f'/api/products/{self.product.id}/')

        assert patch_response.status_code == 403
        assert delete_response.status_code == 403
        self.product.refresh_from_db()
        assert self.product.price == Decimal('500.00')
        assert Product.objects.filter(id=self.product.id).exists()

    def test_staff_can_upload_product_image(self):
        staff = User.objects.create_user(
            username='staff',
            password='pass',
            is_staff=True,
        )
        self.client.force_authenticate(user=staff)

        response = self.client.post(
            '/api/products/',
            {
                'title': 'Четыре сыра',
                'description': 'Очень сырная',
                'price': '600.00',
                'image': self._png_upload(),
            },
            format='multipart',
        )
        assert response.status_code == 201
        data = response.data
        assert data['title'] == 'Четыре сыра'
        assert 'test_pizza' in data['imageUrl']
        assert data['image'] is not None

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
