"""Serializers for products and categories."""
from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор категорий."""

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductSerializer(serializers.ModelSerializer):
    """Сериализатор товаров."""

    # Для удобства фронтенда передаем название категории строкой
    category_name = serializers.CharField(source='category.name', read_only=True, default='')
    imageUrl = serializers.CharField(source='image_url', required=False, allow_blank=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'description',
            'price',
            'category',
            'category_name',
            'imageUrl',
            'is_available',
            'created_at',
        ]
