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
    category = serializers.CharField(source='category.name', read_only=True, default='')
    image = serializers.ImageField(required=False, allow_null=True)
    imageUrl = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'description',
            'price',
            'category',
            'category_name',
            'image',
            'imageUrl',
            'image_url',
            'is_available',
            'created_at',
        ]

    def get_imageUrl(self, obj: Product) -> str:
        """Возвращает URL загруженного изображения либо внешнюю ссылку image_url."""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or ''

