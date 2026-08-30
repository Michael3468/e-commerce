"""Serializers for orders and order items."""
from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product
from .tasks import process_order_creation


class OrderItemSerializer(serializers.ModelSerializer):
    """Сериализатор позиций заказа."""

    productId = serializers.IntegerField(source='product_id', required=False, allow_null=True)

    class Meta:
        model = OrderItem
        fields = ['productId', 'title', 'price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор заказа (для чтения и создания)."""

    items = OrderItemSerializer(many=True)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'status',
            'total',
            'customer_name',
            'customer_email',
            'customer_phone',
            'shipping_address',
            'items',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'total', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        
        # Подсчитываем общую сумму заказа
        total = sum(item['price'] * item['quantity'] for item in items_data)
        
        order = Order.objects.create(total=total, **validated_data)
        
        order_items = []
        for item_data in items_data:
            product_id = item_data.get('product_id')
            product = None
            if product_id:
                product = Product.objects.filter(id=product_id).first()
                
            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    title=item_data['title'],
                    price=item_data['price'],
                    quantity=item_data['quantity'],
                )
            )
            
        OrderItem.objects.bulk_create(order_items)

        # Запускаем фоновую задачу обработки заказа в Celery
        try:
            process_order_creation.delay(str(order.id))
        except Exception:
            # Если брокер Celery/Redis временно недоступен в dev, не блокируем ответ API
            pass

        return order
