"""Views for products and categories."""
from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint для просмотра категорий."""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    """API endpoint для управления товарами."""

    queryset = Product.objects.select_related('category').filter(is_available=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'category__slug']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        # Если пользователь персонал / админ, показываем и недоступные товары
        if self.request.user and self.request.user.is_staff:
            return Product.objects.select_related('category').all()
        return super().get_queryset()
