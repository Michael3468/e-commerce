"""Models for products and categories."""
from django.db import models


class Category(models.Model):
    """Категория товаров."""

    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    slug = models.SlugField(max_length=120, unique=True, verbose_name='Слаг (URL)')

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    """Товар интернет-магазина."""

    title = models.CharField(max_length=255, verbose_name='Название товара')
    description = models.TextField(blank=True, default='', verbose_name='Описание')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        verbose_name='Категория',
    )
    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        verbose_name='Изображение товара',
    )
    image_url = models.URLField(
        max_length=500,
        blank=True,
        default='',
        verbose_name='Ссылка на изображение (внешняя)',
    )
    is_available = models.BooleanField(default=True, verbose_name='В наличии')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.title
