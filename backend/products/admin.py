"""Admin configuration for products app."""
from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'price', 'category', 'image', 'is_available', 'created_at']
    list_filter = ['is_available', 'category', 'created_at']
    search_fields = ['title', 'description']
    list_editable = ['price', 'is_available']

