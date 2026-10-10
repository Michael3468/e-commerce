"""Views for order creation and management."""
from rest_framework import viewsets, mixins, permissions
from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """Оформление заказа публичное; список заказов — только персонал."""

    queryset = Order.objects.prefetch_related('items').all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action in ('create', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
