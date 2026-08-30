"""Celery tasks for order processing."""
import logging
from celery import shared_task
from .models import Order

logger = logging.getLogger(__name__)


@shared_task
def process_order_creation(order_id: str) -> str:
    """Асинхронная обработка нового заказа (отправка email, бронирование остатков)."""
    try:
        order = Order.objects.get(id=order_id)
        logger.info('Начата фоновая обработка заказа %s на сумму %s', order.id, order.total)
        # Здесь может быть отправка письма покупателю, уведомление в Telegram/CRM
        return f'Order {order_id} processed successfully'
    except Order.DoesNotExist:
        logger.error('Заказ с id=%s не найден', order_id)
        return f'Order {order_id} not found'
