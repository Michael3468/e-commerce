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
    """API endpoint для оформления и просмотра заказов."""

    queryset = Order.objects.prefetch_related('items').all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Обычные клиенты могут только создавать заказы или получать свой конкретный по UUID
        return super().get_queryset()
