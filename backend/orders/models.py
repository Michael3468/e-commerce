"""Models for orders and order items."""
import uuid
from django.db import models
from products.models import Product


class Order(models.Model):
    """Заказ покупателя."""

    STATUS_PENDING = 'pending'
    STATUS_PAID = 'paid'
    STATUS_PROCESSING = 'processing'
    STATUS_SHIPPED = 'shipped'
    STATUS_DELIVERED = 'delivered'
    STATUS_CANCELLED = 'cancelled'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Ожидает оплаты'),
        (STATUS_PAID, 'Оплачен'),
        (STATUS_PROCESSING, 'В обработке'),
        (STATUS_SHIPPED, 'Отправлен'),
        (STATUS_DELIVERED, 'Доставлен'),
        (STATUS_CANCELLED, 'Отменен'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        verbose_name='Статус',
    )
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='Итоговая сумма')
    customer_name = models.CharField(max_length=150, blank=True, default='', verbose_name='Имя покупателя')
    customer_email = models.EmailField(blank=True, default='', verbose_name='Email')
    customer_phone = models.CharField(max_length=30, blank=True, default='', verbose_name='Телефон')
    shipping_address = models.TextField(blank=True, default='', verbose_name='Адрес доставки')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлен')

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'Заказ #{str(self.id)[:8]} ({self.get_status_display()})'


class OrderItem(models.Model):
    """Позиция в заказе."""

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Заказ',
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='order_items',
        verbose_name='Товар',
    )
    title = models.CharField(max_length=255, verbose_name='Название товара на момент заказа')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена за единицу')
    quantity = models.PositiveIntegerField(default=1, verbose_name='Количество')

    class Meta:
        verbose_name = 'Позиция заказа'
        verbose_name_plural = 'Позиции заказов'

    def __str__(self) -> str:
        return f'{self.title} x {self.quantity}'
